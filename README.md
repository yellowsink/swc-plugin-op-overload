# swc-plugin-op-overload

Adds operator overloading to javascript.

Will not work with typescript.

If your build pipeline is working with esm (probably),
then add `[Symbol.add]` etc as members on your types, like so:

```js
class Vec2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	[Symbol.add](other) {
		return new Vec2(
			this.x + other.x,
			this.y + other.y
		)
	}
}
```

If your build pipeline for some reason is not using ESM
(I would suggest checking the output of this plugin to verify
before assuming!), you can use `$$add` etc instead of `Symbol.add`.

Note that this is expected to quite notably increase bundle size.

Handles null values just fine.

For binary operators, the argument is the other.
For unary operators, there are no arguments.

Compound assignments (`+=`, etc) work as expected.

If you omit a handler on your type it will be treated
using normal JS rules.

At the moment none of this behaviour is optimised taking advantage
of TS annotations, all of it is dependent on what the type is
at runtime.