class Score {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.score = 0;
    this.text = "";

    this.timer = 200;

    this.values = {
      red: 1,
      yellow: 2,
      green: 3,
      brown: 4,
      blue: 5,
      pink: 6,
      black: 7,
      white: -4,
      foul: -4,
    };
  }

  //   Update score based on points
  updateScore(color) {
    if (this.values[color]) {
      this.score += this.values[color];
    }

    if (color === "white") {
      this.text = "FOUL! -4";
    } else {
      this.text =
        (color !== "white" && color !== "foul" ? "+" : "") +
        this.values[color] +
        " " +
        color +
        " ball";
    }

    this.timer = 200;
  }

  //   Score Board
  draw() {
    push();
    fill(255);
    textSize(32);
    textAlign(CENTER);

    // Draw background for score
    fill(0, 100);
    rect(this.x - 100, this.y - 40, 200, 60, 10);

    fill(255);
    text("SCORE: " + this.score, this.x, this.y);
    textSize(25);

    // Small message under score board
    if (this.timer > 0) {
      let opacity = map(this.timer, 0, 120, 0, 255);

      textSize(20);
      fill(255, 255, 0, opacity);
      text(this.text, this.x, this.y + 50);

      this.timer--; // Decrease timer
    }
    pop();
  }
}
