class Ball {
  constructor(x, y, colorStr) {
    this.x = x;
    this.y = y;
    this.iniX = x;
    this.iniY = y;
    this.w = table.h / 36;
    this.color = colorStr;
    this.opacity = 255;

    this.ball;

    // Physic Properties
    this.prop = {
      friction: 0,
      restitution: 0.7,
      frictionAir: 0.015,
      density: 0.003,
    };

    // Store Particles
    this.particles = [];

    this.sinking = false;
    this.isPlacing = false;

    // Determine if the ball can be dragged or not
    this.needsPlacement = true;

    // Impact animation properties
    this.impact = false;
    this.impactTimer = 20;

    // Store ball trails
    this.ballTrail = [];
  }

  setup() {
    this.ball = Bodies.circle(this.x, this.y, this.w / 2, this.prop);

    this.ball.label = this.color;

    World.add(engine.world, this.ball);
  }

  draw() {
    this.detectMovement();
    this.drawTrail();
    this.sinkingAnimation();
    this.handleDragging();

    let c = color(this.color);

    // Draw the ball
    fill(red(c), green(c), blue(c), this.opacity);
    drawVertices(this.ball.vertices);

    if (this.particles.length > 0) {
      this.drawImpactShape();
    }

    // Draw impact if active
    if (this.impact) {
      this.drawImpactShape();
      this.impactTimer--;
      if (this.impactTimer <= 0) {
        this.impact = false;
      }
    }
  }

  // Reset the position of the ball
  reset() {
    if (this.opacity <= 0) {
      console.log("reseted");
      this.opacity = 255;
      this.sinking = false;

      // Reset to starting position
      Body.setPosition(this.ball, { x: this.iniX, y: this.iniY });
      Body.setVelocity(this.ball, { x: 0, y: 0 });
      Body.setAngularVelocity(this.ball, 0);

      this.needsPlacement = true;

      this.ball.force = { x: 0, y: 0 };
      this.ball.torque = 0;

      World.add(engine.world, this.ball);
    }
  }

  // Collision Particle Effect
  createCollisionEffect(x, y, age, color) {
    let particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(x, y, age, color));
    }
  }

  // Trigger Collision Effect
  triggerImpact(x, y, age, color) {
    console.log("triggered impact");
    this.impact = true;
    this.particles = []; // reset old particles
    this.createCollisionEffect(x, y, age, color);
  }

  // Draw the particle burst
  drawImpactShape() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].move();
      this.particles[i].draw();

      // Remove finished particles so the array is ready for the next hit
      if (this.particles[i].isFinished()) {
        this.particles.splice(i, 1);
      }
    }
  }

  // Detect if the ball is moving
  detectMovement() {
    let speed = this.ball.speed;

    if (speed > 0.15) {
      this.ballTrail.push({
        x: this.ball.position.x,
        y: this.ball.position.y,
        speed: speed,
        life: 1,
      });

      if (this.ballTrail.length > 25) {
        this.ballTrail.shift();
      }
    }
  }

  // Handle Cue Ball Dragging
  handleDragging() {
    // Only for cue balls
    if (this.color !== "white" || table.shotActive || !this.needsPlacement)
      return;

    if (cue.mode == "none") {
      if (mouseIsPressed) {
        let d = dist(
          mouseX,
          mouseY,
          this.ball.position.x,
          this.ball.position.y
        );

        // Allow dragging when it is outside of the area (initial)
        if (!this.isPlacing && d < this.w * 2) {
          this.isPlacing = true;
          this.ball.isSensor = true; // Go through other balls
          Body.setStatic(this.ball, true);
        }

        // Follow mouse freely while dragging
        if (this.isPlacing) {
          Body.setPosition(this.ball, { x: mouseX, y: mouseY });
        }
      } else {
        if (this.isPlacing) {
          this.isPlacing = false;
          this.ball.isSensor = false; // Solid again
          Body.setStatic(this.ball, false);

          // Check if it's inside the D-Zone
          if (table.isInsideDZone(this.ball.position.x, this.ball.position.y)) {
            console.log("Ball placed successfully!");
            Body.setVelocity(this.ball, { x: 0, y: 0 });
          } else {
            Body.setPosition(this.ball, { x: this.iniX, y: this.iniY });
            Body.setVelocity(this.ball, { x: 0, y: 0 });
          }
        }
      }
    }
  }

  // Trail animation
  drawTrail() {
    push();
    noStroke();

    for (let i = 0; i < this.ballTrail.length; i++) {
      let p = this.ballTrail[i];

      // Fade over time
      p.life -= 0.04;

      if (p.life <= 0) {
        continue;
      }

      // Trail thickness reacts to speed
      let size = map(p.speed, 0, 10, this.w * 0.3, this.w);

      let distance = map(i, 0, this.ballTrail.length, 0.3, 1);
      size *= distance;

      // Opacity fade
      let opacity = p.life * 180;

      // Glow layers
      fill(255, opacity * 0.15);
      ellipse(p.x, p.y, size * 2);

      fill(255, opacity * 0.3);
      ellipse(p.x, p.y, size * 1.3);

      // Core
      fill(255, opacity);
      ellipse(p.x, p.y, size * 0.6);
    }

    // Clean dead points
    for (let i = this.ballTrail.length - 1; i >= 0; i--) {
      if (this.ballTrail[i].life <= 0) {
        this.ballTrail.splice(i, 1);
      }
    }

    pop();
  }

  // Sinking animation (when the ball goes in the hole)
  sinkingAnimation() {
    if (this.sinking) {
      push();
      this.opacity -= 30; // Fades out

      // Ensure it does not go beyond or below the requirement
      this.opacity = max(0, this.opacity);

      pop();
    }
  }
}
