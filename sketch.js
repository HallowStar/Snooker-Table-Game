let table;
let cue;
let score;
let engine;
let rules;
let timeRewind;

let menu;

function setup() {
  // Create a canvas that fills the entire browser window
  createCanvas(windowWidth, windowHeight);

  angleMode(RADIANS);

  engine = Engine.create();
  engine.world.gravity.y = 0;

  // Center the table based on the new dynamic width/height
  let tableW = 1200;
  let tableH = 600;
  let tableX = (windowWidth - tableW) / 2;
  let tableY = (windowHeight - tableH) / 2;

  table = new Table(tableX, tableY, tableW, tableH);

  // Update other UI components to use windowWidth/Height
  menu = new Menu();
  cue = new Cue(100, 400, 500);
  cue.setup();

  score = new Score(windowWidth - 150, 60);
  rules = new Rule();
  timeRewind = new TimeRewind(table);

  table.initializeBalls();
  table.initializeHoles();
  table.createWalls();
}

// Add this function so the game resizes if the user changes window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Optional: Recalculate table.x and table.y here if you want it to stay centered
}

function draw() {
  if (menu.gameState == "play") {
    background(30, 41, 52);

    Engine.update(engine, 1000 / 60);

    // Rewind Extension ()
    if (keyIsPressed && (key === "r" || key === "R")) {
      timeRewind.rewind();
      timeRewind.draw();
    } else {
      timeRewind.stop();
      timeRewind.saveState(); // Record the present
    }

    // Draw the table structure & logic
    table.draw();
    table.checkHole();

    // Draw the score board & apply rules
    score.draw();
    rules.drawCommentary();

    // Draw the cue stick
    cue.draw();

    push();
    stroke(255);
    fill(255);
    textSize(15);
    text(mouseX + " , " + mouseY, mouseX, mouseY);
    pop();
  } else {
    menu.draw();
  }
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    menu.gameState = "menu";
  }

  if (key == "1") {
    table.resetBalls();
  } else if (key == "2") {
    table.randomizeReds();
  } else if (key == "3") {
    table.practiceMode();
  }

  if (key == "d") {
    cue.rotateCue("d");
  } else if (key == "a") {
    cue.rotateCue("a");
  }

  if (keyCode == LEFT_ARROW) {
    cue.moveCue(LEFT_ARROW);
  } else if (keyCode == RIGHT_ARROW) {
    cue.moveCue(RIGHT_ARROW);
  } else if (keyCode === UP_ARROW) {
    cue.moveCue(UP_ARROW);
  } else if (keyCode === DOWN_ARROW) {
    cue.moveCue(DOWN_ARROW);
  }
}

// In sketch.js
function mouseClicked() {
  // If we are not in the 'play' state, handle menu clicks instead
  if (menu.gameState !== "play") {
    menu.handleMousePressed();
  } else {
    // Standard gameplay click logic
    cue.selectCue();
  }
}

function mouseDragged() {
  cue.dragCue();
  cue.dragPowerBar();
}

function mouseReleased() {
  if (cue.mode == "pull") {
    cue.powerRelease();
    table.hitCueBall(cue.forceVec);

    // Reset the force
    cue.forceVec = createVector(0, 0);
    cue.power = 0;
  }

  cue.mode = "none";
  console.log("ok released");
}

/*
App Design and Implementation

The application is designed with both mouse and keyboard interaction to balance precision and flexibility for the users. While snooker is a precision-based activity that benefits from continuous inputs, relying only on either mouse or keyboard would limit the flexibility and expressiveness. By combining both ways, users are able to choose the most suitable control style for certain conditions.

The main function that handles the cue interaction uses a state-based input model using the mode variable (none, rotate, move, or pull). This design will ensure that only one interaction type is active at certain conditions, preventing conflicting inputs. When it is selected and the mouse is pressed, the system will determine the correct interaction by measuring the cursor’s distance from 2 things such as the cue tip and center pivot. If the mouse is within the radius of the tip, it will enter the rotation mode which is continuously recalculated using trigonometry functions based on the difference of both mouse position and cue’s current position. This allows users to aim freely by dragging it into the desired direction as long as it is in front of the cue ball.

If the cursor is close to the pivot point, it will switch to movement mode where the position is updated using linear interpolation (lerp). By interpolating them between the current position and mouse position, it will smooth the movement and avoid sudden teleport. It is also updated simultaneously for consistency.

Shot power is controlled using a mouse-driven power bar using horizontal mouse dragging from the dragPowerBar() function. It maps the cursor position to a normalized cuePower value between 0 and 100 and is visually represented by pulling the cue backwards along with the bar calculated using vector mathematics derived from the cue’s current angle. After release, it converts the power into a directional force vector which is applied to the cue ball. Meanwhile, keyboard inputs allow cue repositioning depending on the arrow keys while the “WASD” rotates the cue in fixed angular steps.

Unique Extension: Temporal Rewind System

For the unique extension, I implemented the Temporal Rewind System which introduces time manipulation into the app. Each frame, the saveState() saves and records a snapshot of the complete game including the position, visibility, score, and states of every ball. These snapshots are stored in a fixed history array capable of storing up to 600 frames (approximately 10 seconds). When it is activated, the physics simulation runs in reverse by restoring the previous snapshots frame by frame in the rewind() function. All methods of the ball are reseted using Matter.js functions while removed balls are inserted back to the physics world. This allows players to reverse mistakes and analyze collision sequences and repeat difficult shots without starting from the beginning. By combining physics simulation with temporal state restoration, this extension transforms the application from a standard snooker game into an interactive training and analysis tool which is rarely seen in this type of game

*/
