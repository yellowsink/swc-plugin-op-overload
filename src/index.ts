import {
  AuxVisitor,
  emitAssignmentExpression,
  emitCallExpression,
  emitComputedPropName,
  emitConditionalExpression,
  emitIdentifier,
  emitMemberExpression,
} from "emitkit";
import { Expression, Pattern, Program } from "@swc/core";

const symbolMap = {
  "+=": "plusEq",
  "-=": "minusEq",
};

const patternToExpr = (expr: Pattern): Expression => {
  const err = () => {
    throw new Error("could not convert pattern to expression");
  };

  switch (expr.type) {
    case "ArrayPattern":
      return expr.elements[0] ? patternToExpr(expr.elements[0]) : err();

    case "RestElement":
    case "ObjectPattern":
    case "AssignmentPattern":
      return err();
  }
  return expr;
};

class OLoadTransform extends AuxVisitor {
  auxVisitExpression(n: Expression): [Expression, boolean] | undefined {
    if (
      n.type !== "AssignmentExpression" ||
      (n.operator !== "+=" && n.operator !== "-=")
    )
      return;

    debugger;

    const symbol = symbolMap[n.operator];

    // left[Symbol.(plus|minus)Eq]
    const symbolAccess = emitMemberExpression(
      patternToExpr(n.left),
      emitComputedPropName(
        emitMemberExpression(emitIdentifier("Symbol"), emitIdentifier(symbol))
      )
    );

    const ternary = emitConditionalExpression(
      symbolAccess,
      emitAssignmentExpression(
        patternToExpr(n.left),
        emitCallExpression(symbolAccess, n.right)
      ),
      n // fallback on original compound assignment
    );

    return [
      ternary,
      // (as per EmitKit docs) tells the visitor
      // to ignore transforming child nodes of this
      // else the ternary consequent causes infinite recursion
      false,
    ];
  }
}

export default (m: Program) => new OLoadTransform().visitProgram(m);
