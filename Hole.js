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

  // Return true if the distance between the ball and hole is close
  logic(ball) {
    let d = dist(this.x, this.y, ball.position.x, ball.position.y);

    return d < this.w / 2;
  }

}
