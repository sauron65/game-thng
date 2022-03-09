import { Vec2 } from "./vec2.js";

export class RectBoundingBox extends Vec2 {
  constructor(x = 0, y = 0, width = 1, height = 1, XYIsCenter = true) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.c = XYIsCenter
  }
  collision(a) {
    let t1, b1, r1, l1, t2, b2, r2, l2;
    let b = this;
    a.x = a.x;
    a.y = a.y;
    a.x = a.x;
    a.y = a.y;
    if (a.c) {
      t1 = a.y - a.height / 2;
      b1 = a.y + a.height / 2;
      r1 = a.x + a.width / 2;
      l1 = a.x - a.width / 2;
    } else {
      t1 = a.y;
      b1 = a.y + a.height;
      r1 = a.x + a.width;
      l1 = a.x;
    }
    if (b.c) {
      t2 = b.y - b.height / 2;
      b2 = b.y + b.height / 2;
      r2 = b.x + b.width / 2;
      l2 = b.x - b.width / 2;
    } else {
      t2 = b.y;
      b2 = b.y + b.height;
      r2 = b.x + b.width;
      l2 = b.x;
    }
    if (t1 > b2 || r1 < l2 || b1 < t2 || l1 > r2) {
      return false;
    }
    return true;
  }
}