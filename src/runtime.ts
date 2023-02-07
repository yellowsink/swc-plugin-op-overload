import {binarySymbolMap, unarySymbolMap} from "./symbols.js"

// @ts-expect-error
for (const k of Object.keys(binarySymbolMap)) Symbol[k] = Symbol(k);

// @ts-expect-error
for (const k of Object.keys(unarySymbolMap)) Symbol[k] = Symbol(k);

// TODO add fallbacks on Object.prototype!