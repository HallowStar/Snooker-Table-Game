class Ball {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.iniX = x;
    this.iniY = y;
    this.w = table.h / 36;
    this.color = color;
  }

  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.w);
  }

  reset() {
    this.x = this.iniX;
    this.y = this.iniY;
  }

  random() {
    this.x += random(-10, 10);
    this.y += random(-10, 10);
  }
}
