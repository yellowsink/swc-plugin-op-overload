class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  sub(other) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  scale(n) {
    return new Vec2(this.x * n, this.y * n);
  }
}

const v1 = new Vec2(5, 8);
const v2 = new Vec2(8, 4);

console.log(v1.add(v2).scale(5)); // Vec2 { x: 65, y: 60 }
