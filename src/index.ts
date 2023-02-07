import {
  AuxVisitor,
  emitAssignmentExpression,
  emitBinaryExpression,
  emitCallExpression,
  emitComputedPropName,
  emitConditionalExpression,
  emitIdentifier,
  emitMemberExpression,
  emitStringLiteral,
} from "emitkit";
import { Expression, Pattern, Program } from "@swc/core";
import {
  binarySymbolMap,
  compoundToNormalOp,
  isBinaryOpSupported,
  isCompoundOpSupported,
  isUnaryOpSupported,
  unarySymbolMap,
} from "./symbols.js";

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
  constructor(useSym: boolean) {
    super();
    this.useSym = useSym;
  }

  useSym;

  auxVisitExpression(n: Expression): [Expression, boolean] | undefined {
    const buildSymbolAccess = (left: Expression, symbol: string) =>
      emitMemberExpression(
        patternToExpr(left),
        this.useSym
          ? emitComputedPropName(
              emitMemberExpression(
                emitIdentifier("Symbol"),
                emitIdentifier(symbol)
              )
            )
          : emitIdentifier("$$op" + symbol[0].toUpperCase() + symbol.slice(1))
      );

    const buildNullCheck = (expr: Expression) =>
      emitBinaryExpression(expr, emitIdentifier("null"), "==");

    switch (n.type) {
      case "AssignmentExpression":
        if (!isCompoundOpSupported(n.operator)) return;

        const left = patternToExpr(n.left);

        return [
          emitConditionalExpression(
            buildNullCheck(left),
            emitAssignmentExpression(
              left,
              emitCallExpression(
                buildSymbolAccess(
                  left,
                  binarySymbolMap[compoundToNormalOp(n.operator)]
                ),
                n.right
              )
            ),
            n // fallback on original compound assignment
          ),
          false,
        ];

      case "BinaryExpression":
        if (!isBinaryOpSupported(n.operator)) return;
        return [
          emitConditionalExpression(
            buildNullCheck(n.left),
            emitCallExpression(
              buildSymbolAccess(n.left, binarySymbolMap[n.operator]),
              n.right
            ),
            n // fallback on original op
          ),
          false,
        ];

      case "UnaryExpression":
        if (!isUnaryOpSupported(n.operator)) return;
        return [
          emitConditionalExpression(
            buildNullCheck(n.argument),
            emitAssignmentExpression(
              n.argument,
              emitCallExpression(
                buildSymbolAccess(n.argument, unarySymbolMap[n.operator])
              )
            ),
            n // fallback on original op
          ),
          false,
        ];
    }
  }
}

export default (m: Program) => {
  // @ts-expect-error
  m.type = "Script" as string;
  if (m.type === "Module")
    m.body.splice(0, 0, {
      type: "ImportDeclaration",
      source: emitStringLiteral("swc-plugin-op-overload/runtime.js"),
      span: { end: 0, ctxt: 0, start: 0 },
      specifiers: [],
      typeOnly: false,
    });

  return new OLoadTransform(m.type === "Module").visitProgram(m);
};
