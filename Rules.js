class Rule {
  constructor() {
    this.hitTarget = "red";
    this.requiredBall = "red";
    this.isFoul = false;

    // When there are no red balls
    this.consecutiveColors = false;

    this.anyBallPottedThisShot = false;

    // When a ball first hit other ball
    this.firstHit = false;

    // Color orders
    this.colorOrder = ["yellow", "green", "brown", "blue", "pink", "black"];
    this.colorIndex = 0;

    // Foul Message
    this.foulMsg = "";
    this.foulTimer = 0;
  }

  // Check if the potted ball is correct
  validatePot(ballColor, totalRed) {
    if (ballColor == "white") {
      this.firstHit = true;
      return this.triggerFoul("Foul! Cue ball pocketed");
    }

    // A valid ball was pocketed, turn continues
    this.anyBallPottedThisShot = true;

    if (!this.consecutiveColors) {
      if (this.requiredBall == "red") {
        if (ballColor == "red") {
          this.requiredBall = "color";
          this.hitTarget = "color";
          if (totalRed <= 1) this.checkRedBalls(totalRed);
          return "valid";
        }
      } else if (this.requiredBall == "color") {
        if (ballColor !== "red") {
          this.requiredBall = "red";
          this.hitTarget = "red";
          this.checkRedBalls(totalRed);
          return "valid";
        }
      }
    } else {
      let requiredColor = this.colorOrder[this.colorIndex];
      if (ballColor === requiredColor) {
        this.colorIndex++;
        if (this.colorIndex < this.colorOrder.length) {
          this.requiredBall = this.colorOrder[this.colorIndex];
          this.hitTarget = this.colorOrder[this.colorIndex];
        }
        return "valid";
      }
    }

    return this.triggerFoul(
      `Foul! Pocketed ${ballColor} instead of ${this.requiredBall}.`
    );
  }

  //  Check if cue ball hits the correct ball
  validateHit(ballColor, totalReds) {
    if (this.firstHit) {
      return;
    }

    if (totalReds === 0) {
      this.consecutiveColors = true;
    }

    this.firstHit = true;

    // Red Balls still on table
    if (!this.consecutiveColors) {
      // If hit colored balls instead of red
      if (this.hitTarget == "red" && ballColor !== "red") {
        return this.triggerFoul("Foul! Must Hit Red First");
      }

      //  If hit red balls instead of colored
      if (this.hitTarget == "color" && ballColor == "red") {
        return this.triggerFoul("Foul! Must hit a color first");
      }
    }
    // No Red Balls
    else {
      let requiredColor = this.colorOrder[this.colorIndex];

      if (ballColor !== requiredColor) {
        return this.triggerFoul("Foul! Must hit " + requiredColor + " first");
      }
    }

    return "valid";
  }

  // Reset if the target ball if it doesn't pot
  endOfShotReset() {
    if (!this.anyBallPottedThisShot) {
      if (!this.consecutiveColors) {
        this.requiredBall = "red";
        this.hitTarget = "red";
      }
    }

    // reset for the next turn
    this.firstHit = false;
    this.anyBallPottedThisShot = false;
  }

  //  Check if there are still red balls
  checkRedBalls(totalReds) {
    console.log(totalReds);
    if (totalReds === 0) {
      this.consecutiveColors = true;
      this.colorIndex = 0;
      this.requiredBall = this.colorOrder[0];
      this.hitTarget = this.colorOrder[0];
      console.log("All reds gone! Follow the color sequence: Yellow to Black.");
    }
  }

  // Reset Sequence of orders
  resetSequence() {
    if (!this.consecutiveColors) {
      this.requiredBall = "red";
      this.hitTarget = "red";
    }
  }

  //  Trigger Foul Message
  triggerFoul(msg) {
    console.log(msg);
    score.updateScore("foul"); // Subtract points

    this.foulMsg = msg;
    this.foulTimer = 180;

    // On a foul, the next shot always resets to a Red (if any left)
    if (!this.consecutiveColors) {
      this.resetSequence();
    }

    return "foul";
  }

  //   Commentary Board
  drawCommentary() {
    push();
    fill(255);
    textSize(20);
    text("Foul Board", 310, 70);
    fill(47, 79, 79);
    rect(300, 80, 300, 40);
    pop();

    if (this.foulTimer > 0) {
      push();
      textAlign(CENTER);
      rectMode(CENTER);

      // Calculate fade out
      let opacity = map(this.foulTimer, 0, 180, 0, 255);

      // Draw a small dark bar behind the text
      noStroke();
      fill(0, opacity * 0.6);
      rect(width / 2, height - 100, textWidth(this.foulMsg) + 40, 40, 10);

      // Draw the Foul Text
      fill(255, 255, 255, opacity); // Red color for fouls
      textSize(20);
      textAlign(LEFT);
      text(this.foulMsg, 325, 108);

      this.foulTimer--;
      pop();
    }
  }
}
