let table;
let engine;

function setup() {
  createCanvas(2000, 1200);

  engine = Engine.create(); // create the engine
  engine.world.gravity.y = 0; // set gravity to zero (not falling)

  table = new Table(300, 300, 1200, 600); // declare the table

  table.initializeBalls();
  table.initializeHoles();
}

function draw() {
  background(200);

  Engine.update(engine);

  table.draw();
}

function keyPressed() {
  if (key == "1") {
    table.resetBalls();
  } else if (key == "2") {
    table.randomizeBalls(2);
  } else if (key == "3") {
    table.randomizeBalls(3);
  }
}

function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
