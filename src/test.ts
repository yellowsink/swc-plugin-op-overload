import { transform } from "@swc/core";
import oloadTransform from "./index.js";

const testRaw = `

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  [Symbol.plusEq](other) {
    return new Point(
      this.x + other.x,
      this.y + other.y
    )
  }

  [Symbol.minusEq](other) {
    return new Point(
      this.x - other.x,
      this.y - other.y
    )
  }
}

let p1 = new Point(5, 7);
let p2 = new Point(1, 4);

p1 += p2; // p1 = (6, 11)

p2 -= p1; // p2 = (-5, -7)

`;

// @ts-expect-error
globalThis.run = async () => {
  const { code } = await transform(testRaw, {
    plugin: oloadTransform,
    jsc: { target: "es2022" },
  });
  console.log(code);
};

// @ts-expect-error
run();

//setInterval(()=>{})
