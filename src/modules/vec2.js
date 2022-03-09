export class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  set(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    return this;
  }
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  normalize() {
    const len = this.mag();
    this.x /= len;
    this.y /= len;
    return this;
  }
  toBuffer(arr, ind) {
    arr[ind] = this.x;
    arr[ind + 1] = this.y;
    return this;
  }
  toArray(v) {
    switch (v) {
      case 3:
        return [this.x, this.y, 0];
      case 4:
        return [this.x, this.y, 0, 1];
      default:
        return [this.x, this.y];
    }
  }
}
