class Ball {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.iniX = x;
    this.iniY = y;
    this.w = table.h / 36;
    this.color = color;
    this.ball;
  }

  setup() {
    this.ball = Bodies.circle(this.x, this.y, this.w / 2);
    World.add(engine.world, this.ball);
  }

  draw() {
    fill(this.color);
    drawVertices(this.ball.vertices);
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
