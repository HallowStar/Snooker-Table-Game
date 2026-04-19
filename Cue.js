class Cue {
  constructor(x, y, h) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.angle = 0;
    this.cue;

    this.powerButtonPos = {
      x: width / 2 - 350,
      y: 170,
      w: 500,
      h: 30,
    };

    this.cuePower = 0;
    this.forceVec = createVector(0, 0);

    this.basePos = createVector(x, y); // original cue position

    this.pullDistance = 0;
    this.maxPullDistance = 200;
    this.forwardOffset = 30;

    this.prevX = mouseX;

    this.isClicked = false;
    this.isDragged = false;
    this.isPulling = false;
    this.mode = "none";
  }

  setup() {
    this.cue = Bodies.rectangle(this.x, this.y, 10, this.h, {
      isSensor: true,
    });

    World.add(engine.world, this.cue);
    console.log(this.cue);
  }

  draw() {
    push();
    rectMode(CENTER);

    // Cue Select Button
    push();
    stroke(255);
    textSize(15);
    this.isClicked ? fill(0, 200, 0) : fill(255, 0, 0);
    rect(150, 100, 200, 40);
    fill(255);
    text(this.isClicked ? "Cue Selected" : "Cue Unselected", 95, 105);
    pop();

    // Draw the power bar
    this.drawPowerButton(
      this.powerButtonPos.x,
      this.powerButtonPos.y,
      this.powerButtonPos.w,
      this.powerButtonPos.h
    );

    if (!this.isClicked) {
      Body.setPosition(this.cue, { x: 100, y: 400 });
    }

    // Cue Place
    fill(100);
    rect(100, 400, 30, this.h + 20);
    translate(this.cue.position.x, this.cue.position.y);

    // Cue Pivot point
    fill(255, 0, 0);
    ellipse(0, 0, 15);

    rotate(this.angle);
    Body.setAngle(this.cue, this.angle);

    // Cue Design
    fill(218, 165, 32);
    rect(0, 0, 10, this.h, 3);
    fill(139, 69, 19);
    rect(0, -this.h / 2 + 10, 10, 20, 3, 3, 0, 0);

    pop();
  }

  drawPowerButton(x, y, w, h) {
    push();
    rectMode(CENTER);

    // Label
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("Power : " + round(this.cuePower) + "%", x, y + 60);

    // Rail/Slot
    fill(252, 186, 3);
    rect(x, y, w + 10, h + 10, 5);
    fill(20);
    rect(x, y, w, h, 5);

    // Power Fill
    let powerWidth = map(this.cuePower, 0, 100, 0, w);
    rectMode(CORNER);
    fill(255, 50, 50);
    rect(x - w / 2, y - h / 2, powerWidth, h, 5);

    // Slider
    rectMode(CENTER);
    let sliderX = map(this.cuePower, 0, 100, x + w / 2, x - w / 2);

    fill(255);
    rect(sliderX, y, 20, h + 15, 3);
    pop();
  }

  // Mouse in Cue Select Button Location
  selectCue() {
    if (mouseX > 50 && mouseX < 250 && mouseY > 80 && mouseY < 120) {
      this.isClicked = !this.isClicked;
    }
  }

  // Drag The Cue Logic
  dragCue() {
    if (!this.isClicked) {
      return;
    }

    if (mouseIsPressed && this.mode === "none") {
      // Calculate distances of mouse to the center of the cue
      let distanceFromCenter = dist(
        mouseX,
        mouseY,
        this.cue.position.x,
        this.cue.position.y
      );

      // Find the cue tip position
      let tipPos = this.getTipPosition();
      let distanceToTip = dist(mouseX, mouseY, tipPos.x, tipPos.y);

      if (distanceToTip < 40) {
        this.mode = "rotate";
      } else if (distanceFromCenter < 30) {
        this.mode = "move";
      }
    }

    // Rotate Cue
    if (this.mode === "rotate") {
      // Point the cue towards the mouse
      let dx = mouseX - this.cue.position.x;
      let dy = mouseY - this.cue.position.y;
      this.angle = Math.atan2(dy, dx) + HALF_PI;
    }

    // Move Cue
    if (this.mode === "move") {
      let lerpAmount = 0.3;

      // Make the movement smooth using lerp function
      let newX = lerp(this.cue.position.x, mouseX, lerpAmount);
      let newY = lerp(this.cue.position.y, mouseY, lerpAmount);

      // Update the physics position of the cue
      Body.setPosition(this.cue, { x: newX, y: newY });
      this.basePos.set(newX, newY);
    }
  }

  getTipPosition() {
    let forward = p5.Vector.fromAngle(this.angle - HALF_PI);
    return p5.Vector.add(
      createVector(this.cue.position.x, this.cue.position.y),
      forward.mult(this.h / 2)
    );
  }

  getForwardBasePos() {
    let forward = p5.Vector.fromAngle(this.angle - HALF_PI);
    return p5.Vector.add(this.basePos, forward.mult(this.forwardOffset));
  }

  dragPowerBar() {
    if (this.mode !== "none" && this.mode !== "pull") {
      return;
    }

    // Check if mouse is hovering over the power bar area
    if (
      mouseX > this.powerButtonPos.x - this.powerButtonPos.w / 2 &&
      mouseX < this.powerButtonPos.x + this.powerButtonPos.w / 2 &&
      mouseY > this.powerButtonPos.y - this.powerButtonPos.h / 2 &&
      mouseY < this.powerButtonPos.y + this.powerButtonPos.h / 2
    ) {
      this.mode = "pull";
      this.isPulling = true;

      // Dragging to the left increases power
      this.cuePower = map(
        mouseX,
        this.powerButtonPos.x + this.powerButtonPos.w / 2,
        this.powerButtonPos.x - this.powerButtonPos.y / 2,
        0,
        100
      );

      // Doesn't go below 0 or above 100
      this.cuePower = constrain(this.cuePower, 0, 100);

      // Pull the cue back
      this.pullDistance = map(this.cuePower, 0, 100, 0, this.maxPullDistance);

      // Calculate backward direction based on the cue's angle
      let backward = p5.Vector.fromAngle(this.angle - HALF_PI).mult(-1);

      // Calculating the position of the cue stick
      let newPos = p5.Vector.add(
        this.basePos,
        backward.mult(this.pullDistance)
      );

      // Update the position
      Body.setPosition(this.cue, { x: newPos.x, y: newPos.y });
    }
  }

  powerRelease() {
    if (!this.isPulling) {
      return;
    }

    // Get the power and direction of the cue
    let power = this.cuePower;
    let direction = p5.Vector.fromAngle(this.angle - Math.PI / 2);

    this.pullDistance = 0;

    // The power of the force
    let speedFactor = 0.001;
    this.forceVec = direction.copy().mult(power * speedFactor);

    // Reset visuals for next shot
    this.cuePower = 0;
    this.pullDistance = 0;

    // Update position after releasing the cue stick (slightly forward than before)
    let forwardBase = this.getForwardBasePos();
    Body.setPosition(this.cue, { x: forwardBase.x, y: forwardBase.y });

    this.basePos.set(forwardBase);

    // Reset the mode
    this.isPulling = false;
    this.mode = "none";
  }

  moveCue(arrow) {
    // Rotate right -> "right arrow"
    // Rotate left -> "left arrow"
    // Move -> WASD

    if (this.isClicked) {
      if (arrow == LEFT_ARROW) {
        console.log("left pressed");

        Body.setPosition(this.cue, {
          x: this.cue.position.x - 10,
          y: this.cue.position.y,
        });
      } else if (arrow == RIGHT_ARROW) {
        console.log("right pressed");
        Body.setPosition(this.cue, {
          x: this.cue.position.x + 10,
          y: this.cue.position.y,
        });
      } else if (arrow == UP_ARROW) {
        console.log("up pressed");
        Body.setPosition(this.cue, {
          x: this.cue.position.x,
          y: this.cue.position.y - 10,
        });

        console.log(this.cue.position.y);
      } else if (arrow == DOWN_ARROW) {
        console.log("down pressed");
        Body.setPosition(this.cue, {
          x: this.cue.position.x,
          y: this.cue.position.y + 10,
        });
      }
    }
  }

  // Rotate the Cue Stick
  rotateCue(key) {
    if (this.isClicked) {
      if (key == "d") {
        this.angle += Math.PI / 18;
        console.log(this.angle);
      } else if (key == "a") {
        this.angle -= Math.PI / 18;
        console.log(this.angle);
      }
    } else {
    }
  }

  // Draw a line helper for the user to hit the cue ball based on the stick direction
  drawAimHelper(cueBallPos) {
    if (!this.isClicked || this.isPulling || table.balls[0].ball.speed > 0.1) {
      return;
    }

    push();

    // Length of the line
    let aimLength = 400;

    // Angle & Direction from the cue stick
    let angle = this.angle - HALF_PI;
    let direction = p5.Vector.fromAngle(angle);

    // Draw the dotted aiming line
    stroke(255);
    strokeWeight(2);

    // Draw a dashed line using a loop
    for (let i = 20; i < aimLength; i += 20) {
      let startX = cueBallPos.x + direction.x * i;
      let startY = cueBallPos.y + direction.y * i;
      let endX = cueBallPos.x + direction.x * (i + 10);
      let endY = cueBallPos.y + direction.y * (i + 10);
      line(startX, startY, endX, endY);
    }

    pop();
  }
}
