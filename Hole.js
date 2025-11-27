class Hole {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
  }

  draw() {
    fill(0);
    ellipse(this.x, this.y, this.w);
  }
}
