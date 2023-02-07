class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  $$opAdd(other) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  $$opSub(other) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  $$opMul(other) {
    return typeof other === "number"
      ? new Vec2(this.x * n, this.y * n)
      : this.x * other.x + this.y * other.y;
  }
}

let v1 = new Vec2(5, 8);
let v2 = new Vec2(8, 4);

const sum = v1 + v2;
console.log(sum * 5); // Vec2 { x: 65, y: 60 }