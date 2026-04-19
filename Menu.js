class Menu {
  constructor() {
    // Gamestate : menu, play, instructions, gameOver
    this.gameState = "menu";
    this.title = "Snooker Game";
  }

  draw() {
    background(30, 41, 52);

    if (this.gameState === "menu") {
      this.drawMainMenu();
    } else if (this.gameState === "instructions") {
      this.drawInstructions();
    } else if (this.gameState === "gameOver") {
      this.drawGameOver();
    }
  }

  //   Draw the play menu
  drawMainMenu() {
    push();
    textAlign(CENTER);
    fill(255);
    textSize(60);
    text(this.title, width / 2, height / 2 - 400);

    textAlign(LEFT);
    textSize(24);
    text("Made by Rivaldo Caga", 250, 80);
    text("SIM ID : 10264392", 250, 120);
    text("UOL ID : 240621801", 250, 160);

    // Play Button
    this.drawButton(width / 2, height / 2 - 300, 250, 70, "Play", () => {
      this.gameState = "play";
    });

    // Instructions Button
    this.drawButton(
      width / 2,
      height / 2 - 200,
      250,
      70,
      "Instructions",
      () => {
        this.gameState = "instructions";
      }
    );
    pop();
  }

  //   Draw instructions menu
  drawInstructions() {
    fill(255);
    textAlign(CENTER);
    textSize(40);
    text("HOW TO PLAY", width / 2, 120);

    textSize(20);
    textAlign(LEFT);

    text("Cue Stick Instructions:  ", width / 2 - 500, 220);
    text("1. WASD -> Rotate The Stick: ", width / 2 - 500, 250);
    text("2. Arrow Keys -> Move the Cue Stick", width / 2 - 500, 280);
    text("3. Drag the center of the stick to move it: ", width / 2 - 500, 310);
    text(
      "4. Drag the very top of the stick to rotate it: ",
      width / 2 - 500,
      340
    );
    text(
      "5. Click Select to Equip the Cue Stick (Select Button): ",
      width / 2 - 500,
      370
    );

    text("Game Instructions: ", width / 2, 220);
    text("1. Select the Cue Stick", width / 2, 250);
    text("2. Move the Cue Ball to the D-zone", width / 2, 280);
    text(
      "3. Drag the cue stick and move to the back of the cue stick",
      width / 2,
      310
    );
    text("4. Drag the power bar to the left to increase power", width / 2, 340);
    text(
      "5. Release the power bar to launch the cue stick to the cue ball",
      width / 2,
      370
    );
    text("6. Get as many points as possible", width / 2, 400);
    text("7. Press 'R' to rewind time", width / 2, 430);

    text("Rules: ", width / 2 - 500, 430);
    text("1. Must follow a sequence (red ball first)", width / 2 - 500, 460);
    text(
      "2. If the red ball is potted, then the next target will be the colored balls",
      width / 2 - 500,
      490
    );
    text(
      "3. If the colored ball is not potted, it will reset the target to red ball until it is potted again",
      width / 2 - 500,
      520
    );
    text(
      "4. If the cue ball doesn't hit any ball or is potted, it will trigger a foul ",
      width / 2 - 500,
      550
    );
    text(
      "5. If you hit or pot the wrong ball, it will trigger a foul ",
      width / 2 - 500,
      580
    );

    text("Point System: ", width / 2 - 500, 640);
    text("1. Red Ball : 1 point", width / 2 - 500, 670);
    text("2. Yellow Ball : 2 points", width / 2 - 500, 700);
    text("3. Green Ball : 3 points", width / 2 - 500, 730);
    text("4. Brown Ball : 4 points", width / 2 - 500, 760);
    text("5. Blue Ball : 5 points", width / 2 - 500, 790);

    text("6. Pink Ball : 6 points", width / 2 - 500, 820);

    text("7. Black Ball : 7 points", width / 2 - 500, 850);

    text("7. Foul : - 4 points", width / 2 - 500, 880);

    // Back Button
    this.drawButton(150, 80, 150, 50, "BACK", () => {
      this.gameState = "menu"; // Transitions back to main menu
    });
  }

  //  Draw Game Over Menu
  drawGameOver() {
    push();
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(80);
    text("GAME OVER", width / 2, height / 2 - 400);

    textSize(40);

    // Access the final score from your Score class instance
    text("Final Score: " + score.score, width / 2, height / 2 - 300);

    // Restart Button
    this.drawButton(width / 2, height / 2 - 200, 250, 70, "Play Again", () => {
      // Reset the score and balls
      this.gameState = "play";

      table.resetBalls();
      score.score = 0;
    });

    // Main Menu Button
    this.drawButton(width / 2, height / 2 - 100, 250, 70, "Main Menu", () => {
      this.gameState = "menu";
    });

    pop();
  }

  //   Draw Button
  drawButton(x, y, w, h, label, gameStateCall) {
    push();
    rectMode(CENTER);
    let hoveredPosition =
      mouseX > x - w / 2 &&
      mouseX < x + w / 2 &&
      mouseY > y - h / 2 &&
      mouseY < y + h / 2;

    // Hover effect
    if (hoveredPosition) {
      fill(0, 153, 51);
      cursor(HAND);
    } else {
      fill(47, 79, 79);
    }

    stroke(255);
    strokeWeight(2);
    rect(x, y, w, h, 15);

    fill(255);
    noStroke();
    textSize(24);
    textAlign(CENTER, CENTER);
    text(label, x, y);

    // Click logic
    if (hoveredPosition && mouseIsPressed) {
      gameStateCall();
      mouseIsPressed = false;
    }
    pop();
  }
}
