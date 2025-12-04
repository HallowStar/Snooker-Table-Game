class Cue {
  constructor(x, y, h) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.angle = 0;
    this.cue;

    this.isClicked = false;
  }

  setup() {
    this.cue = Bodies.rectangle(this.x, this.y, 10, this.h, 3, {});

    World.add(engine.world, this.cue);
    console.log(this.cue);
  }

  draw() {
    push();
    rectMode(CENTER);
    if (this.isClicked) {
      push();
      stroke(255);
      textSize(30);
      fill(255);
      text("Cue Selected", width / 2, 100);
      pop();
    } else {
      push();
      stroke(255);
      textSize(30);
      fill(255);
      text("Cue Unselected", width / 2, 100);
      pop();
    }

    fill(100);
    rect(100, 400, 30, this.h + 20);
    translate(this.cue.position.x, this.cue.position.y);

    fill(255, 0, 0);
    ellipse(0, 0, 15);

    fill(218, 165, 32);
    rotate(this.angle);
    Body.setAngle(this.cue, this.angle);
    rect(0, 0, 10, this.h, 3);
    fill(139, 69, 19);
    rect(0, -240, 10, 20, 3, 3, 0, 0);

    pop();
  }

  selectCue() {
    if (
      mouseX > this.cue.position.x - 5 &&
      mouseX < this.cue.position.x + 5 &&
      mouseY > this.cue.position.y - 50 &&
      mouseY < this.cue.position.y + this.h
    ) {
      this.isClicked = true;
      console.log("pressed");
    } else {
      this.isClicked = false;
      this.angle = 0;
    }
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
}
