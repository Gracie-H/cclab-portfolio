let people = [];
let wind = 0;
let stars = [];
let message = "";
let showMessageTime = 0;
let stormMode = false;
let clickSound;

function preload() {
  clickSound = loadSound('scripts/9.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 40; i++) {
    people.push(new Floater(random(width), random(-600, 0), random(0.5, 2.5)));
  }
  for (let i = 0; i < 80; i++) {
    stars.push({ x: random(width), y: random(height), r: random(0.5, 2), alpha: random(80, 150) });
  }
  noStroke();
}

function draw() {
  background(190, 255, 245, 10);
  drawStars();

  for (let f of people) {
    f.update();
    f.display();
  }

  if (millis() - showMessageTime < 3000 && message !== "") {
    fill(0, 100);
    textSize(16);
    textAlign(CENTER);
    text(message, width / 2, height - 40);
  }

  fill(255);
  textSize(12);
  textAlign(CENTER);
  text("Move mouse = wind | Click = color | SPACE = more | ENTER = storm", width / 2, height - 20);
}

function mouseMoved() {
  let direction = map(mouseX, 0, width, -1, 1);
  wind = direction * (stormMode ? 3.5 : 1.5);
}

function mousePressed() {
  for (let f of people) {
    if (dist(mouseX, mouseY, f.x, f.y) < f.size) {
      f.changeColor();
      message = "Touched a dream ☂️";
      showMessageTime = millis();
    }
  }

  if (clickSound && clickSound.isLoaded() && !clickSound.isPlaying()) {
    clickSound.play();
  }
}

function keyPressed() {
  if (key === ' ') {
    for (let i = 0; i < 10; i++) {
      people.push(new Floater(random(width), random(-200, 0), random(0.5, 2.5)));
    }
  }
  if (keyCode === ENTER) {
    stormMode = !stormMode;
    wind = stormMode ? 4 : 0;
    message = stormMode ? "Storm mode on" : "Calm returns";
    showMessageTime = millis();
  }
}

function drawStars() {
  for (let s of stars) {
    fill(255, 255, 255, s.alpha);
    circle(s.x, s.y, s.r);
  }
}

class Floater {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = random(40, 70);
    this.alpha = random(140, 220);
    this.offset = random(TWO_PI);

    this.color = random([color(255, 200, 230), color(200, 220, 255), color(220, 200, 255), color(255, 255, 240), color(180, 250, 230)]);
    this.dotColor = color(250, 0, 0);

    this.dots = [];
    let dotCount = 3 + int(random(1));
    for (let i = 0; i < dotCount; i++) {
      let angle = random(PI, TWO_PI);
      let r = random(this.size * 0.15, this.size * 0.4);
      this.dots.push({ x: r * cos(angle), y: r * sin(angle) });
    }
  }

  update() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < 100) {
      let angle = atan2(this.y - mouseY, this.x - mouseX);
      this.x += cos(angle) * 1.2;
      this.y += sin(angle) * 1.2;
    }
    this.x += wind * this.speed * 0.5;
    this.y += this.speed * 0.8;
    this.offset += 0.02;
    if (this.y > height + 40) this.y = random(-300, 0), this.x = random(width);
    if (this.x < -40) this.x = width + 40;
    if (this.x > width + 40) this.x = -40;
  }

  changeColor() {
    this.color = random([color(255, 200, 230), color(200, 220, 255), color(220, 200, 255), color(255, 255, 240), color(180, 250, 230)]);
    this.dotColor = color(random(100, 255), random(100, 255), random(100, 255), 180);
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(sin(this.offset) * 0.1);

    stroke(100, 180, 255, this.alpha);
    strokeWeight(2);
    noFill();
    line(0, 0, 0, this.size * 0.6);
    arc(0, this.size * 0.6 + 6, 10, 10, PI, TWO_PI);
    noStroke();

    fill(this.color);
    beginShape();
    for (let i = 0; i <= 8; i++) {
      let angle = PI + (i * PI) / 8;
      let wave = sin(frameCount * 0.05 + i + this.offset) * 3;
      let r = this.size / 2 + wave;
      vertex(r * cos(angle), r * sin(angle));
    }
    endShape(CLOSE);

    fill(this.dotColor);
    for (let d of this.dots) ellipse(d.x, d.y, 5, 5);

    if (dist(mouseX, mouseY, this.x, this.y) < this.size * 0.8) {
      push();
      fill(0, 80);
      textSize(11);
      textAlign(CENTER);
      text("Just floating…", 0, -this.size * 0.8);
      pop();
    }
    pop();
  }
}
