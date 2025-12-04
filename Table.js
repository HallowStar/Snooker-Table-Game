class Table {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.balls = [];
    this.holes = [];
  }

  draw() {
    this.drawProperties();
    this.drawBalls();
    this.drawHoles();
  }

  initializeBalls() {
    let redBalls = [];

    let cueBall = new Ball(this.x + 150, this.y + this.h / 2, "white");
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

    Body.setVelocity(yellowBall.ball, { x: 30, y: -2 });

    console.log(this.balls);

    console.log(redBalls);
  }

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

  initializeHoles() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        this.holes.push(
          new Hole(this.x + i * 600, this.y + j * 600, (this.h / 36) * 1.5)
        );
      }
    }
  }

  createWalls() {
    let prop = {
      isStatic: true,
      restitution: 0.9,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
    };

    // Hidden Walls
    push();
    fill(0);
    // rect(this.x, this.y, this.w, 1);
    let wallOne = Bodies.rectangle(
      this.x + this.w / 2,
      this.y - 7,
      this.w,
      15,
      prop
    );
    // drawVertices(wallOne.vertices);

    let wallTwo = Bodies.rectangle(
      this.x + this.w / 2,
      this.y + this.h + 7,
      this.w,
      15,
      prop
    );

    // drawVertices(wallTwo.vertices);

    let wallThree = Bodies.rectangle(
      this.x - 7,
      this.y + this.h / 2,
      15,
      this.h,
      prop
    );

    // drawVertices(wallThree.vertices);

    let wallFour = Bodies.rectangle(
      this.x + this.w + 50,
      this.y + this.h / 2,
      100,
      this.h,
      prop
    );

    // drawVertices(wallFour.vertices);

    World.add(engine.world, [wallOne, wallTwo, wallThree, wallFour]);
  }

  drawProperties() {
    // Table Walls
    push();
    fill(0, 153, 51);
    rect(this.x - 30, this.y - 30, this.w + 60, 660, 25);
    pop();

    // Table
    fill(0, 204, 102);
    rect(this.x, this.y, this.w, this.h, 15);

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

  drawHoles() {
    for (let i = 0; i < this.holes.length; i++) {
      this.holes[i].draw();
    }
  }

  resetBalls() {
    for (let i = 0; i < this.balls.length; i++) {
      if (Array.isArray(this.balls[i])) {
        for (let j = 0; j < this.balls[i].length; j++) {
          this.balls[i][j].reset();
        }
      } else {
        this.balls[i].reset();
      }
    }

    console.log("Reseted");
  }

  randomizeBalls(mode) {
    if (mode == 2) {
      for (let i = 0; i < this.balls[1].length; i++) {
        let red = this.balls[1];
        red[i].random();
      }
    } else {
      for (let i = 1; i < this.balls.length; i++) {
        if (Array.isArray(this.balls[i])) {
          for (let j = 0; j < this.balls[i].length; j++) {
            this.balls[i][j].random();
          }
        } else {
          this.balls[i].random();
        }
      }
    }
  }
}
