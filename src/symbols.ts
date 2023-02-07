export const binarySymbolMap = {
	// arithmetic
	"+": "add",
	"-": "sub",
	"*": "mul",
	"/": "div",
	"%": "mod",
	"**": "pow",
	// logic
	"||": "or",
	"&&": "and",
	// comparison
	"==": "eq",
	"===": "seq",
	"!=": "neq",
	"!==": "sneq",
	">": "gt",
	">=": "gte",
	"<": "lt",
	"<=": "lte",
	// bit ops
	">>": "shr",
	">>>": "shru",
	"<<": "shl",
	"|": "bwOr",
	"^": "bwXor",
	"&": "bwAnd",
	// misc
	in: "in",
	instanceof: "instof",
	"??": "coal",
} as const;

export const unarySymbolMap = {
	// arithmetic
	"-": "neg",
	"+": "pos",
	// logic
	"!": "not",
	// bit ops
	"~": "bwNot",
	// misc
	typeof: "typeof",
	// void should remain as is for bundlers' benefit
	// and delete needs extra context
	//"void": "void",
	//"delete": "del"
} as const;

export type SupportedBinaryOp = keyof typeof binarySymbolMap;
export type SupportedCompoundOp = `${SupportedBinaryOp}=`;
export type SupportedUnaryOp = keyof typeof unarySymbolMap;

export const isBinaryOpSupported = (op: string): op is SupportedBinaryOp =>
	op in binarySymbolMap;
export const isUnaryOpSupported = (op: string): op is SupportedUnaryOp =>
	op in unarySymbolMap;

export const isCompoundOpSupported = (op: string): op is SupportedCompoundOp =>
	op.slice(0, -1) in binarySymbolMap;

export const compoundToNormalOp = <T extends SupportedBinaryOp>(op: `${T}=`): T =>
	op.slice(0, -1) as any;