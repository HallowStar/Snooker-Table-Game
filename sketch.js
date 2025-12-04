let table;
let cue;
let engine;

function setup() {
  createCanvas(1800, 1000);

  // rectMode(CENTER)
  angleMode(RADIANS);

  engine = Engine.create(); // create the engine
  engine.world.gravity.y = 0; // set gravity to zero (not falling)

  table = new Table(300, 300, 1200, 600); // declare the table
  cue = new Cue(100, 400, 500);

  table.initializeBalls();
  table.initializeHoles();
  table.createWalls();

  cue.setup();
}

function draw() {
  background(30, 41, 52);

  Engine.update(engine);

  table.draw();
  cue.draw();
}

function keyPressed() {
  if (key == "1") {
    table.resetBalls();
  } else if (key == "2") {
    table.randomizeBalls(2);
  } else if (key == "3") {
    table.randomizeBalls(3);
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

function mouseClicked() {
  cue.selectCue();
}

function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
