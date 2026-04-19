class Table {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.shotActive;

    this.history = []; // Stores snapshots of the table
    this.maxHistory = 600;
    this.isRewinding = false;

    this.balls = [];
    this.holes = [];
    this.checkCollisionBetweenBalls();
  }

  draw() {
    this.drawProperties();
    this.drawHoles();
    this.drawBalls();
    this.drawCushions();

    this.checkShotResults();
    this.checkGameOver();

    // Draw the aim helper
    let cueBall = this.balls[0];

    if (cueBall && !cueBall.sinking) {
      cue.drawAimHelper(cueBall.ball.position, table.balls);
    }
  }

  // Check for collision between 2 balls
  checkCollisionBetweenBalls() {
    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        let labelA = pair.bodyA.label;
        let labelB = pair.bodyB.label;

        if (labelA === "white" || labelB === "white") {
          let whiteBallObj = this.balls[0];
          if (whiteBallObj.isPlacing) return;

          let hitBall = labelA === "white" ? labelB : labelA;

          // Check if it's actually a ball (ignore walls/pockets)
          const validBalls = [
            "red",
            "yellow",
            "green",
            "brown",
            "blue",
            "pink",
            "black",
          ];

          if (validBalls.includes(hitBall)) {
            // Match the variable name to your Rule class property 'firstHit'
            if (!rules.firstHit) {
              let redsLeft = 0;

              if (Array.isArray(this.balls[1])) {
                redsLeft = this.balls[1].length;
              }

              let result = rules.validateHit(hitBall, redsLeft);
              console.log("First ball touched:", hitBall, "Result:", result);
            }
          }
        }
      });
    });
  }

  // Declare all balls
  initializeBalls() {
    let redBalls = [];

    let cueBall = new Ball(this.x - 150, 300, "white");
    cueBall.setup();

    let startX = this.x + this.w - 50;
    let startY = this.y + this.h / 2;

    // Push the red balls
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < i; j++) {
        let redBall = new Ball(
          startX - 300 + i * 25,
          startY - i * 18 + 18 + j * 35,
          "red"
        );
        redBalls.push(redBall);
      }
    }

    // Declare the colored balls
    let pinkBall = new Ball(startX - 310, startY, "pink");
    let blackBall = new Ball(startX - 70, startY, "black");
    let blueBall = new Ball(startX - this.w / 2 + 55, startY, "blue");
    let brownBall = new Ball(startX - this.w + 300, startY, "brown");
    let yellowBall = new Ball(startX - this.w + 300, startY + 100, "yellow");
    let greenBall = new Ball(startX - this.w + 300, startY - 100, "green");

    // Assign all of the balls to the array
    this.balls.push(
      cueBall,
      redBalls,
      pinkBall,
      blackBall,
      blueBall,
      yellowBall,
      brownBall,
      greenBall
    );

    // Run the Physic Engines
    this.setupBallPhysics();
  }

  // Declare Physical Balls
  setupBallPhysics() {
    for (let i = 0; i < this.balls.length; i++) {
      if (Array.isArray(this.balls[i])) {
        for (let j = 0; j < this.balls[i].length; j++) {
          this.balls[i][j].setup();
        }
      } else {
        this.balls[i].setup();
      }
    }
  }

  // Declare all holes
  initializeHoles() {
    let offset = 12; // Pushes the holes slightly back into the cushions
    let holeSize = (this.h / 36) * 1.5;

    // Corner Pockets
    // Top Left
    this.holes.push(new Hole(this.x - offset, this.y - offset, holeSize));

    // Top Right
    this.holes.push(
      new Hole(this.x + this.w + offset, this.y - offset, holeSize)
    );

    // Bottom Left
    this.holes.push(
      new Hole(this.x - offset, this.y + this.h + offset, holeSize)
    );

    // Bottom Right
    this.holes.push(
      new Hole(this.x + this.w + offset, this.y + this.h + offset, holeSize)
    );

    // Top Middle
    this.holes.push(new Hole(this.x + this.w / 2, this.y - offset, holeSize));

    // Bottom Middle
    this.holes.push(
      new Hole(this.x + this.w / 2, this.y + this.h + offset, holeSize)
    );
  }

  // Check if cue ball is inside D Zone
  isInsideDZone(x, y) {
    let centerX = this.x + 250;
    let centerY = this.y + this.h / 2;
    let radius = 100;

    let isLeftOfLine = x <= centerX;

    // Must be within the radius of the center point
    let d = dist(x, y, centerX, centerY);

    return isLeftOfLine && d <= radius;
  }

  // Create Invisible Physic Walls
  createWalls() {
    let prop = { isStatic: true, restitution: 0.7, friction: 0.5 };

    let triangleProp = {
      isStatic: true,
      restitution: 0.5,
      chamfer: { radius: 3 },
    };

    // Main Cushions
    let wallTopLeft = Bodies.rectangle(
      this.x + this.w * 0.25 + 2,
      this.y - 55,
      this.w / 2 - 45,
      110,
      prop
    );

    let wallTopRight = Bodies.rectangle(
      this.x + this.w * 0.75,
      this.y - 55,
      this.w / 2 - 45,
      110,
      prop
    );

    let wallBottomLeft = Bodies.rectangle(
      this.x + this.w * 0.25 + 2,
      this.y + this.h + 55,
      this.w / 2 - 50,
      110,
      prop
    );

    let wallBottomRight = Bodies.rectangle(
      this.x + this.w * 0.75,
      this.y + this.h + 55,
      this.w / 2 - 50,
      110,
      prop
    );

    let wallLeft = Bodies.rectangle(
      this.x - 55,
      this.y + this.h / 2,
      110,
      this.h - 45,
      prop
    );
    let wallRight = Bodies.rectangle(
      this.x + this.w + 55,
      this.y + this.h / 2,
      110,
      this.h - 45,
      prop
    );

    // Wall Top Left Triangle
    let triangleTopLeft = Bodies.fromVertices(
      this.x + 17,
      this.y - 8,
      [
        { x: 0, y: 16 },
        { x: 0, y: 28 },
        { x: -20, y: 16 },
      ],
      triangleProp
    );

    let triangleTopRight = Bodies.fromVertices(
      this.x - 8,
      this.y + 15,
      [
        { x: 0, y: 12 },
        { x: 0, y: 35 },
        { x: 12, y: 35 },
      ],
      triangleProp
    );

    // Wall Bottom Left Triangle
    let triangleBottomLeft = Bodies.fromVertices(
      this.x - 8,
      this.y + this.h - 15,
      [
        { x: 0, y: 12 },
        { x: 0, y: 35 },
        { x: 12, y: 12 },
      ],
      triangleProp
    );

    let triangleBottomRight = Bodies.fromVertices(
      this.x + 18,
      this.y + this.h + 8,
      [
        { x: 0, y: 12 },
        { x: 0, y: 25 },
        { x: -25, y: 25 },
      ],
      triangleProp
    );

    // Wall Middle Left Triangle
    let triangleMiddleRight = Bodies.fromVertices(
      this.x + this.w / 2 + 18,
      this.y - 8,
      [
        { x: 0, y: 12 },
        { x: 0, y: 25 },
        { x: -8, y: 12 },
      ],
      triangleProp
    );

    let triangleMiddleLeft = Bodies.fromVertices(
      this.x + this.w / 2 - 18,
      this.y - 8,
      [
        { x: 0, y: 12 },
        { x: 0, y: 25 },
        { x: 8, y: 12 },
      ],
      triangleProp
    );

    // Wall Top Right Triangle
    let triangleRightTop = Bodies.fromVertices(
      this.x + this.w - 15,
      this.y - 8,
      [
        { x: 0, y: 12 },
        { x: 0, y: 25 },
        { x: 20, y: 12 },
      ],
      triangleProp
    );

    let triangleRightTopBot = Bodies.fromVertices(
      this.x + this.w + 8,
      this.y + 15,
      [
        { x: 0, y: 12 },
        { x: 0, y: 30 },
        { x: -12, y: 30 },
      ],
      triangleProp
    );

    // Wall Bottom Right Triangle
    let triangleBottomLeftBot = Bodies.fromVertices(
      this.x + this.w - 15,
      this.y + this.h + 10,
      [
        { x: 0, y: 12 },
        { x: 0, y: 25 },
        { x: 20, y: 25 },
      ],
      triangleProp
    );

    let triangleBottomRightBot = Bodies.fromVertices(
      this.x + this.w + 8,
      this.y + this.h - 15,
      [
        { x: 0, y: 12 },
        { x: 0, y: 35 },
        { x: -13, y: 12 },
      ],
      triangleProp
    );

    // Wall Bottom Left Triangle
    let triangleBottomLeftLeft = Bodies.fromVertices(
      this.x + this.w / 2 - 18,
      this.y + this.h + 10,
      [
        { x: 0, y: 12 },
        { x: 0, y: 25 },
        { x: 10, y: 25 },
      ],
      triangleProp
    );

    let triangleBottomRightRight = Bodies.fromVertices(
      this.x + this.w / 2 + 20,
      this.y + this.h + 8,
      [
        { x: 0, y: 12 },
        { x: 0, y: 25 },
        { x: -10, y: 25 },
      ],
      triangleProp
    );

    World.add(engine.world, [
      wallTopLeft,
      wallTopRight,
      wallBottomLeft,
      wallBottomRight,
      wallLeft,
      wallRight,
      triangleTopLeft,
      triangleTopRight,
      triangleBottomRight,
      triangleBottomLeft,
      triangleMiddleLeft,
      triangleMiddleRight,
      triangleRightTop,
      triangleRightTopBot,
      triangleBottomRightBot,
      triangleBottomLeftBot,
      triangleBottomLeftLeft,
      triangleBottomRightRight,
    ]);
  }

  drawProperties() {
    // Table Walls
    push();
    fill(150, 75, 0);
    rect(this.x - 40, this.y - 50, this.w + 80, 680, 25);
    pop();
    1;

    // Table
    fill(0, 204, 102);
    rect(this.x - 10, this.y - 10, this.w + 20, this.h + 20, 15);

    // Line
    push();
    stroke(255);
    strokeWeight(2);
    line(this.x + 250, this.y, this.x + 250, this.y + this.h);
    pop();

    // Arc
    push();
    noFill();
    stroke(255);
    strokeWeight(2);
    translate(this.x + 250, this.y + this.h / 2);
    rotate(radians(90));
    arc(0, 0, 200, 200, 0, PI);
    pop();
  }

  drawCushions() {
    push();
    fill(0, 153, 51); // Darker green for the cushions
    // Left Side
    beginShape();
    vertex(this.x - 12, this.y);
    vertex(this.x, this.y + 25);
    vertex(this.x, this.y + this.h - 25);
    vertex(this.x - 12, this.y + this.h);
    endShape(CLOSE);

    // Top Left
    beginShape();
    vertex(this.x, this.y - 12);
    vertex(this.x + 25, this.y);
    vertex(this.x + this.w / 2 - 20, this.y);
    vertex(this.x + this.w / 2 - 12, this.y - 12);
    endShape(CLOSE);

    // Bottom Left
    beginShape();
    vertex(this.x, this.y + this.h + 12);
    vertex(this.x + 25, this.y + this.h);
    vertex(this.x + this.w / 2 - 20, this.y + this.h);
    vertex(this.x + this.w / 2 - 12, this.y + this.h + 12);
    endShape(CLOSE);

    // Top Right
    beginShape();
    vertex(this.x + this.w / 2 + 12, this.y - 12);
    vertex(this.x + this.w / 2 + 20, this.y);
    vertex(this.x + this.w - 25, this.y);
    vertex(this.x + this.w, this.y - 12);
    endShape(CLOSE);

    // Bottom Right
    beginShape();
    vertex(this.x + this.w / 2 + 12, this.y + this.h + 12);
    vertex(this.x + this.w / 2 + 20, this.y + this.h);
    vertex(this.x + this.w - 25, this.y + this.h);
    vertex(this.x + this.w, this.y + 12 + this.h);
    endShape(CLOSE);

    // rect(this.x, this.y - 12, 10, 10);

    // Right Side
    beginShape();
    vertex(this.x + this.w + 12, this.y);
    vertex(this.x + this.w, this.y + 25);
    vertex(this.x + this.w, this.y + this.h - 25);
    vertex(this.x + 12 + this.w, this.y + this.h);
    endShape(CLOSE);
    pop();
  }

  // Draw the balls
  drawBalls() {
    for (let i = 0; i < this.balls.length; i++) {
      if (Array.isArray(this.balls[i])) {
        for (let j = 0; j < this.balls[i].length; j++) {
          this.balls[i][j].draw();
        }
      } else {
        this.balls[i].draw();
      }
    }
  }

  // Draw holes
  drawHoles() {
    for (let i = 0; i < this.holes.length; i++) {
      this.holes[i].draw();
    }
  }

  // Reset the balls to its normal position
  resetBalls() {
    this.clearAllBalls();
    this.initializeBalls();
  }

  // Randomize the clusters
  randomizeReds() {
    let redBalls = [];

    let startX = this.x + this.w * 0.7;
    let startY = this.y + this.h / 2;

    // 3 Clusters
    for (let i = 0; i < 3; i++) {
      let randomPositionX = random(-300, 300);
      let randomPositionY = random(-250, 250);

      for (let i = 0; i < 5; i++) {
        let x = startX + randomPositionX + random(-50, 50);
        let y = startY + randomPositionY + random(-50, 50);

        let redBall = new Ball(x, y, "red");
        redBall.setup();
        redBalls.push(redBall);
      }
    }

    // reset all colored balls
    this.resetColoredBallsOnly();
    this.balls[1] = redBalls; // Replace red ball array
  }

  // Clear all balls
  clearAllBalls() {
    let allBalls = this.getAllBalls();

    for (let i = 0; i < allBalls.length; i++) {
      World.remove(engine.world, allBalls[i].ball);
    }

    this.balls = [];
  }

  // Reset Colored Ball Positions
  resetColoredBallsOnly() {
    // Remove current reds from world
    if (Array.isArray(this.balls[1])) {
      for (let i = 0; i < this.balls[1].length; i++) {
        World.remove(engine.world, this.balls[1][i].ball);
      }
    }

    // Reset positions of the existing colors (Cue, Pink, Black, etc.)
    for (let i = 0; i < this.balls.length; i++) {
      if (i === 1) {
        continue;
      }

      // Skip reds array
      let b = this.balls[i];

      Body.setPosition(b.ball, { x: b.iniX, y: b.iniY });
      Body.setVelocity(b.ball, { x: 0, y: 0 });
    }
  }

  // Practice Mode
  practiceMode() {
    // Reset the colored ball
    this.resetColoredBallsOnly();

    let redBalls = [];

    // Use the Pink ball's initial position for the position
    let pinkBall = this.balls[2];
    let centerX = pinkBall.iniX;
    let centerY = pinkBall.iniY;

    // Vertical Line
    for (let i = -4; i <= 4; i++) {
      if (i === 0) {
        continue;
      }

      // Skip the spot where the Pink ball is
      let x = centerX;
      let y = centerY + i * 35;

      let redBall = new Ball(x, y, "red");
      redBall.setup();
      redBalls.push(redBall);
    }

    // Horizontal Lines
    for (let j = 1; j <= 6; j++) {
      let x = centerX + j * 35;
      let y = centerY;

      let redBall = new Ball(x, y, "red");
      redBall.setup();
      redBalls.push(redBall);
    }

    this.balls[1] = redBalls;
  }

  // Check if the cue stick hits the cue ball
  hitCueBall(velocity) {
    let cueBallObj = this.balls[0];
    let cueBall = cueBallObj.ball;

    // Tip position
    let tip = cue.getTipPosition();

    // Distance from tip to ball center
    let d = dist(tip.x, tip.y, cueBall.position.x, cueBall.position.y);

    // Allow small tolerance
    let hitThreshold = this.balls[0].w / 2 + 5;

    if (d <= hitThreshold) {
      console.log("HIT");

      // Reset for next shot
      rules.firstHit = false;
      this.shotActive = true;

      cueBallObj.needsPlacement = false;

      Body.applyForce(cueBall, cueBall.position, {
        x: velocity.x,
        y: velocity.y,
      });

      cueBallObj.triggerImpact(
        cueBall.position.x,
        cueBall.position.y,
        500,
        "white"
      );

      // Reset the mode
      cue.mode = "none";

      return true;
    }
  }

  // Check if ball is moving
  isBallMoving() {
    for (let i = 0; i < this.balls.length; i++) {
      let b = this.balls[i];
      if (Array.isArray(b)) {
        for (let red of b) {
          if (red.ball.speed > 0.1) {
            return true;
          }
        }
      } else {
        if (b.ball.speed > 0.1) {
          return true;
        }
      }
    }
    return false;
  }

  checkShotResults() {
    // Only run logic if a shot is currently in progress
    if (this.shotActive && !this.isBallMoving()) {
      // Foul if nothing was hit
      if (!rules.firstHit) {
        rules.triggerFoul("Foul! Missed all balls");
      }

      //  Logic to decide if next target is Red or Color
      rules.endOfShotReset();

      this.shotActive = false;
      console.log("Shot sequence updated. Next target: " + rules.hitTarget);
    }
  }

  // Check if ball went in the hole
  checkHole() {
    // Loop through all holes
    for (let i = 0; i < this.holes.length; i++) {
      for (let j = this.balls.length - 1; j >= 0; j--) {
        let ball = this.balls[j];

        if (Array.isArray(ball)) {
          // Handle the red balls array
          for (let k = ball.length - 1; k >= 0; k--) {
            if (this.holes[i].logic(ball[k].ball)) {
              this.triggerSink(ball[k]);
            }
          }
        } else {
          // Handle individual balls (Cue, Black, Pink, etc.)
          if (this.holes[i].logic(ball.ball)) {
            if (ball.color === "white") {
              this.triggerSink(ball);
            } else {
              this.triggerSink(ball);
            }
          }
        }
      }
    }

    this.removeSinkBalls();
  }

  // Remove potted balls
  removeSinkBalls() {
    for (let i = this.balls.length - 1; i >= 0; i--) {
      let ballItem = this.balls[i];

      if (Array.isArray(ballItem)) {
        for (let j = ballItem.length - 1; j >= 0; j--) {
          // Only remove from array after it's invisible
          if (ballItem[j].opacity <= 0 && ballItem[j].sinking) {
            ballItem.splice(j, 1);
          }
        }
      } else {
        if (ballItem.opacity <= 0 && ballItem.sinking) {
          if (ballItem.color === "white") {
            ballItem.reset(); // Handles respawn and physics re-entry
            World.add(engine.world, ballItem.ball); // Re-add to world!
          } else {
            if (!rules.consecutiveColors) {
              ballItem.reset();
              World.add(engine.world, ballItem.ball);
            } else {
              this.balls.splice(i, 1);
            }
          }
        }
      }
    }
  }

  // Trigger sink animations
  triggerSink(ball) {
    if (!ball.sinking) {
      ball.sinking = true;

      if (ball.color == "white") {
        ball.createCollisionEffect(
          ball.ball.position.x,
          ball.ball.position.y,
          500,
          "red"
        );
      } else {
        ball.createCollisionEffect(
          ball.ball.position.x,
          ball.ball.position.y,
          500,
          "yellow"
        );
      }

      let totalRedBalls = 0;

      if (Array.isArray(this.balls[1])) {
        totalRedBalls = this.balls[1].length;
      }

      let status = rules.validatePot(ball.color, totalRedBalls);

      if (status == "valid") {
        score.updateScore(ball.color);
      }

      World.remove(engine.world, ball.ball);

      console.log("Physics removed, animation started for:", ball.color);
    }
  }

  // Helper to get a flat list of all Ball objects
  getAllBalls() {
    let list = [];
    for (let b of this.balls) {
      if (Array.isArray(b)) {
        for (let red of b) list.push(red);
      } else {
        list.push(b);
      }
    }
    return list;
  }

  // Check if the game has finished
  checkGameOver() {
    // Check if only the white ball is left
    let allBalls = this.getAllBalls();

    // If only 1 ball remains
    if (allBalls.length === 1 && allBalls[0].color === "white") {
      if (!this.isBallMoving() && this.shotActive === false) {
        menu.gameState = "gameOver";
      }
    }
  }
}
