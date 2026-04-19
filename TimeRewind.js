class TimeRewind {
  constructor(table, maxSeconds = 10) {
    this.table = table;
    this.history = [];
    this.maxHistory = maxSeconds * 60;
    this.isRewinding = false;
  }

  draw() {
    push();
    // Cyan pulsing text
    textAlign(CENTER);
    textSize(40);
    let opacity = 150 + sin(frameCount * 0.2) * 100; // using sin function for wave effect
    fill(0, 255, 255, opacity);
    text("Time Rewinding", width / 2, 100);

    // Rewaind effect
    stroke(255, opacity * 0.2);
    strokeWeight(1);
    for (let i = 0; i < height; i += 20) {
      let y = (i + frameCount * 2) % height;
      line(0, y, width, y);
    }

    // Vignette overlay
    noFill();
    strokeWeight(100);
    stroke(0, 50);
    rect(0, 0, width, height);
    pop();
  }

  saveState() {
    if (this.isRewinding) {
      return;
    }

    let snapshot = {
      balls: [],
      currentScore: score.score, // stores the score at this exact frame
      firstHit: rules.firstHit, // stores rule state to prevent double-fouls
    };

    let allBalls = this.table.getAllBalls();

    // Get all ball information
    for (let i = 0; i < allBalls.length; i++) {
      snapshot.balls.push({
        obj: allBalls[i],
        body: allBalls[i].ball,
        x: allBalls[i].ball.position.x,
        y: allBalls[i].ball.position.y,
        angle: allBalls[i].ball.angle,
        opacity: allBalls[i].opacity,
        sinking: allBalls[i].sinking,
      });
    }

    this.history.push(snapshot);

    if (this.history.length > this.maxHistory) {
      this.history.shift(); // Remove the old one
    }
  }

  // Rewind to last position
  rewind() {
    if (this.history.length > 0) {
      this.isRewinding = true;
      let lastFrame = this.history.pop();

      // Restore Score and Rules
      score.score = lastFrame.currentScore;
      rules.firstHit = lastFrame.firstHit;

      // Restore Balls
      for (let i = 0; i < lastFrame.balls.length; i++) {
        Body.setPosition(lastFrame.balls[i].body, {
          x: lastFrame.balls[i].x,
          y: lastFrame.balls[i].y,
        });

        Body.setAngle(lastFrame.balls[i].body, lastFrame.balls[i].angle);
        Body.setVelocity(lastFrame.balls[i].body, { x: 0, y: 0 });

        lastFrame.balls[i].obj.opacity = lastFrame.balls[i].opacity;
        lastFrame.balls[i].obj.sinking = lastFrame.balls[i].sinking;

        // Add the physics back
        if (
          lastFrame.balls[i].opacity > 0 &&
          !this.isBodyInWorld(lastFrame.balls[i].body)
        ) {
          World.add(engine.world, lastFrame.balls[i].body);
        }
      }
    } else {
      this.isRewinding = false;
    }
  }

  isBodyInWorld(body) {
    return Composite.allBodies(engine.world).includes(body);
  }

  stop() {
    this.isRewinding = false;
  }
}
