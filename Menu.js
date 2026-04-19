class Menu {
  constructor() {
    this.gameState = "menu"; // States: "menu", "play", "instructions"
    this.buttons = [];
    this.titleY = -100;

    // Background Elements
    this.bgParticles = [];
    this.floatingBalls = [];
    this.floatingCues = [];

    // Interactive Effects State
    this.titleGlow = 0;
    this.subtitleAlpha = 0;
    this.viewOffset = createVector(0, 0);
    this.breathing = 0;

    this.initAtmosphere();
    this.setupButtons();
  }

  initAtmosphere() {
    // Ambient Dust Particles
    for (let i = 0; i < 50; i++) {
      this.bgParticles.push({
        x: random(width),
        y: random(height),
        size: random(1, 3),
        speed: random(0.2, 0.5),
        alpha: random(30, 100),
      });
    }

    // Thematic Snooker Balls (Full set of 22)
    const colors = [
      "#ff0000",
      "#ffff00",
      "#00ff00",
      "#8b4513",
      "#0000ff",
      "#ffc0cb",
      "#000000",
      "#ffffff",
    ];
    for (let i = 0; i < 22; i++) {
      this.floatingBalls.push({
        x: random(width),
        y: random(height),
        velX: random(-0.5, 0.5),
        velY: random(-0.5, 0.5),
        size: random(20, 35),
        col: color(random(colors)),
        rot: random(TWO_PI),
        rotSpeed: random(-0.01, 0.01),
      });
    }

    // Floating Cue Sticks
    for (let i = 0; i < 2; i++) {
      this.floatingCues.push({
        x: random(width),
        y: random(height),
        angle: random(TWO_PI),
        rotSpeed: random(0.004, 0.008),
        speed: random(0.2, 0.5),
        len: 450,
      });
    }
  }

  setupButtons() {
    this.buttons = [];
    let centerX = width / 2;
    let startY = height / 2 + 80;

    this.buttons.push(
      new MenuButton(
        centerX,
        startY,
        320,
        65,
        "START SESSION",
        "Play a standard game with full snooker rules.",
        () => {
          this.gameState = "play";
        }
      )
    );

    this.buttons.push(
      new MenuButton(
        centerX,
        startY + 90,
        320,
        65,
        "PRACTICE DRILLS",
        "Master your shots with specialized training layouts.",
        () => {
          table.practiceMode();
          this.gameState = "play";
        }
      )
    );

    this.buttons.push(
      new MenuButton(
        centerX,
        startY + 180,
        320,
        65,
        "SCATTER REDS",
        "Start with randomized clusters for a unique challenge.",
        () => {
          table.randomizeReds();
          this.gameState = "play";
        }
      )
    );

    this.buttons.push(
      new MenuButton(
        centerX,
        startY + 270,
        320,
        65,
        "INSTRUCTIONS",
        "Learn the mechanics and controls of the game.",
        () => {
          this.gameState = "instructions";
        }
      )
    );

    // Back Button for Instructions Page
    this.backButton = new MenuButton(
      centerX,
      height / 2 + 260,
      320,
      65,
      "BACK TO MENU",
      "Return to the main selection screen.",
      () => {
        this.gameState = "menu";
      }
    );
  }

  draw() {
    this.updateCamera();
    this.drawGradientBackground();

    push();
    translate(this.viewOffset.x, this.viewOffset.y + this.breathing);
    this.drawFloatingBalls();
    this.drawFloatingCues();
    this.drawAmbientDust();
    pop();

    if (this.gameState === "menu") {
      this.drawMainMenu();
    } else if (this.gameState === "instructions") {
      this.drawInstructionsPage();
    }
  }

  updateCamera() {
    this.breathing = sin(frameCount * 0.015) * 6;
    let targetX = map(mouseX, 0, width, -10, 10);
    let targetY = map(mouseY, 0, height, -10, 10);
    this.viewOffset.x = lerp(this.viewOffset.x, targetX, 0.05);
    this.viewOffset.y = lerp(this.viewOffset.y, targetY, 0.05);
  }

  drawMainMenu() {
    this.titleY = lerp(this.titleY, height / 3.5, 0.06);
    let dToTitle = dist(mouseX, mouseY, width / 2, this.titleY);
    this.titleGlow = lerp(this.titleGlow, dToTitle < 150 ? 60 : 25, 0.1);
    this.subtitleAlpha = lerp(
      this.subtitleAlpha,
      dToTitle < 200 ? 255 : 150,
      0.1
    );

    push();
    textAlign(CENTER, CENTER);
    drawingContext.shadowBlur = this.titleGlow;
    drawingContext.shadowColor = color(0, 255, 150);
    fill(255);
    textSize(110);
    textStyle(BOLD);
    text("SNOOKER", width / 2, this.titleY);

    drawingContext.shadowBlur = 10;
    fill(0, 255, 150, this.subtitleAlpha);
    textSize(24);
    textStyle(ITALIC);
    text("ULTIMATE PHYSICS SIMULATOR", width / 2, this.titleY + 75);
    pop();

    for (let btn of this.buttons) {
      btn.update();
      btn.draw();
    }
  }

  drawInstructionsPage() {
    push();
    rectMode(CENTER);
    let centerX = width / 2;
    let centerY = height / 2;

    // HUD Backdrop
    fill(10, 25, 20, 245);
    stroke(0, 255, 150, 180);
    strokeWeight(2);
    rect(centerX, centerY, 850, 620, 15);

    // Header
    textAlign(CENTER, TOP);
    fill(0, 255, 150);
    textSize(42);
    textStyle(BOLD);
    text("SYSTEM :: FIELD_GUIDE", centerX, centerY - 275);
    line(centerX - 350, centerY - 225, centerX + 350, centerY - 225);

    // Categories with Fixed Alignment
    this.drawInstructionRow(
      "AIMING",
      "Drag the CUE TIP to rotate, or use 'A' & 'D' keys for fine adjustments.",
      centerY - 140
    );
    this.drawInstructionRow(
      "POSITION",
      "Drag the CUE CENTER to move, or use ARROW KEYS for precise placement.",
      centerY - 40
    );
    this.drawInstructionRow(
      "STRIKE",
      "Use the POWER BAR (top) to set strength. Release the mouse to hit.",
      centerY + 60
    );
    this.drawInstructionRow(
      "REWIND",
      "Hold 'R' to manipulate time. Reverses physics to undo previous shots.",
      centerY + 160
    );

    // Interactive Back Button
    this.backButton.update();
    this.backButton.draw();
    pop();
  }

  drawInstructionRow(label, desc, y) {
    let centerX = width / 2;
    textAlign(LEFT, TOP);
    fill(0, 255, 150);
    textSize(18);
    textStyle(BOLD);
    text(label, centerX - 380, y);

    fill(235);
    textSize(16);
    textStyle(NORMAL);
    textWrap(WORD);
    text(desc, centerX + 100, y, 600); // Fixed wrapping area

    stroke(0, 255, 150, 40);
    line(centerX - 380, y + 50, centerX + 380, y + 50);
  }

  handleMousePressed() {
    if (this.gameState === "menu") {
      for (let btn of this.buttons) {
        if (btn.isHovered()) btn.onClick();
      }
    } else if (this.gameState === "instructions") {
      if (this.backButton.isHovered()) this.backButton.onClick();
    }
  }

  // Visual Utility Functions
  drawGradientBackground() {
    let c1 = color(15, 45, 40);
    let c2 = color(5, 10, 15);
    noFill();
    for (let r = 0; r <= width; r += 12) {
      let inter = map(r, 0, width, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      strokeWeight(12);
      ellipse(width / 2, height / 2, r * 2, r * 2);
    }
  }

  drawFloatingBalls() {
    for (let b of this.floatingBalls) {
      b.x += b.velX;
      b.y += b.velY;
      b.rot += b.rotSpeed;
      if (b.x < -50) b.x = width + 50;
      if (b.x > width + 50) b.x = -50;
      if (b.y < -50) b.y = height + 50;
      if (b.y > height + 50) b.y = -50;
      push();
      translate(b.x, b.y);
      rotate(b.rot);
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = b.col;
      noStroke();
      fill(b.col);
      ellipse(0, 0, b.size);
      fill(255, 100);
      ellipse(-b.size / 4, -b.size / 4, b.size / 3);
      pop();
    }
  }

  drawFloatingCues() {
    for (let c of this.floatingCues) {
      c.angle += c.rotSpeed;
      c.x += cos(c.angle) * c.speed;
      c.y += sin(c.angle) * c.speed;
      if (c.x < -c.len) c.x = width + c.len;
      if (c.x > width + c.len) c.x = -c.len;
      if (c.y < -c.len) c.y = height + c.len;
      if (c.y > height + c.len) c.y = -c.len;
      push();
      translate(c.x, c.y);
      rotate(c.angle);
      rectMode(CENTER);
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = color(218, 165, 32, 100);
      fill(218, 165, 32, 120);
      rect(0, 0, 6, c.len, 6);
      fill(139, 69, 19, 150);
      rect(0, c.len / 2 - 30, 10, 60, 2);
      pop();
    }
  }

  drawAmbientDust() {
    noStroke();
    for (let p of this.bgParticles) {
      fill(0, 255, 150, p.alpha);
      ellipse(p.x, p.y, p.size);
      p.y -= p.speed;
      if (p.y < -10) p.y = height + 10;
    }
  }
}

class MenuButton {
  constructor(x, y, w, h, label, description, onClick) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.description = description;
    this.onClick = onClick;
    this.hoverAnim = 0;
  }

  update() {
    if (this.isHovered()) {
      this.hoverAnim = lerp(this.hoverAnim, 1, 0.12);
    } else {
      this.hoverAnim = lerp(this.hoverAnim, 0, 0.12);
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    scale(1 + this.hoverAnim * 0.05);
    rectMode(CENTER);

    if (this.isHovered()) {
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = color(0, 255, 150);
    }

    fill(20, 30, 40, 225);
    stroke(0, 255, 150, 150 + this.hoverAnim * 105);
    strokeWeight(1.5 + this.hoverAnim);
    rect(0, 0, this.w, this.h, 4);

    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    textStyle(this.isHovered() ? BOLD : NORMAL);
    text(this.label, 0, 0);

    if (this.hoverAnim > 0.05 && this.description) this.drawSideTooltip();
    pop();
  }

  drawSideTooltip() {
    push();
    let alpha = this.hoverAnim * 255;
    let slideOffset = 45 + (1 - this.hoverAnim) * 20;
    let boxW = 280;
    let boxH = 110;

    stroke(0, 255, 150, alpha * 0.8);
    strokeWeight(2);
    line(this.w / 2 + 5, 0, this.w / 2 + slideOffset, 0);
    line(this.w / 2 + slideOffset, -10, this.w / 2 + slideOffset, 10);

    translate(this.w / 2 + slideOffset + 10, 0);
    rectMode(CORNER);
    fill(10, 30, 25, alpha * 0.95);
    stroke(0, 255, 150, alpha);
    rect(0, -boxH / 2, boxW, boxH, 8);

    noStroke();
    textAlign(LEFT, TOP);
    textSize(11);
    textStyle(BOLD);
    fill(0, 255, 150, alpha);
    text("SYSTEM :: DATA_INFO", 15, -boxH / 2 + 12);

    fill(235, alpha);
    textSize(14);
    textStyle(NORMAL);
    textWrap(WORD);
    text(this.description, 15, -boxH / 2 + 40, boxW - 30);
    pop();
  }

  isHovered() {
    return (
      mouseX > this.x - this.w / 2 &&
      mouseX < this.x + this.w / 2 &&
      mouseY > this.y - this.h / 2 &&
      mouseY < this.y + this.h / 2
    );
  }
}
