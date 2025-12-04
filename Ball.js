class Ball {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.iniX = x;
    this.iniY = y;
    this.w = table.h / 36;
    this.color = color;

    this.prop = {
      friction: 0,
      restitution: 0.9,
      frictionAir: 0.015,
      density: 0.003,
    };

    this.ball;
  }

  setup() {
    this.ball = Bodies.circle(this.x, this.y, this.w / 2, this.prop);

    World.add(engine.world, this.ball);
  }

  draw() {
    fill(this.color);
    drawVertices(this.ball.vertices);
  }

  reset() {
    Body.setPosition(this.ball, { x: this.iniX, y: this.iniY });
    Body.setVelocity(this.ball, { x: 0, y: 0 });
    // this.x = this.iniX;
    // this.y = this.iniY;
  }

  random() {
    Body.setPosition(this.ball, {
      x: (this.x += random(-10, 10)),
      y: this.y + random(-10, 10),
    });
  }
}
