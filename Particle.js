class Particle {
  constructor(x, y, age, colorStr) {
    this.x = x;
    this.y = y;
    this.size = random(5, 10);
    this.color = colorStr;

    // Random direction and speed for the effect
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);

    // Time limit
    this.age = age;
  }

  draw() {
    push();
    noStroke();
    let c = color(this.color);
    let opacity = constrain(this.age, 0, 255);

    // Draw the particle effect
    fill(red(c), green(c), blue(c), opacity);
    ellipse(this.x, this.y, this.size);
    pop();
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    // Fade out over time
    this.age -= 5;
  }

  isFinished() {
    return this.age <= 0;
  }
}
