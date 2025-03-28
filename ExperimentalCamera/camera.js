let capture, handpose, predictions = [];
let mic, prevFrame;
let pixelBlocks = [];
let dandelion;
let exploded = false;
let gridAlpha = 100;
let gridColor;
let showGrid = true;
let bgColor = 0;
let windDir = { x: 0, y: 0 };
let ripples = [];
let waveBuffer = [];
let numSlices = 40;

function setup() {
  createCanvas(1280, 480);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();

  gridColor = color(255, 0, 0);

  mic = new p5.AudioIn();
  mic.start();

  prevFrame = createImage(640, 480);

  handpose = ml5.handpose(capture, () => console.log("Handpose ready"));
  handpose.on("predict", (results) => predictions = results);

  dandelion = new Dandelion(320, 240);
}

function draw() {
  let vol = mic.getLevel();
  bgColor = map(vol, 0, 0.2, 0, 255);
  background(0);

  // 左边实时镜像摄像头
  push();
  translate(640, 0);
  scale(-1, 1);
  image(capture, 0, 0, 640, 480);
  pop();

  if (showGrid) drawGrid(15, gridAlpha);

  capture.loadPixels();
  prevFrame.loadPixels();

  // 只有声音大时才触发喷发和水波
  if (vol > 0.02) {
    triggerPixelSpray(10);
    ripples.push({ x: 960, y: 240, r: 10 }); // 👈 改成右边中心
  }

  dandelion.update();
  dandelion.display();

  if (predictions.length > 0) {
    let hand = predictions[0];
    let [x, y] = hand.landmarks[9];
    x = 640 - x;
    dandelion.followTo(x, y);
    let d = dist(x, y, dandelion.position.x, dandelion.position.y);
    if (d < 80 && !exploded) {
      dandelion.explode();
      exploded = true;
      ripples.push({ x, y, r: 10 });
    }
    drawSymbol(x, y);
  }

  for (let i = pixelBlocks.length - 1; i >= 0; i--) {
    let p = pixelBlocks[i];
    let d = dist(mouseX, mouseY, p.x, p.y);
    if (d < 80) {
      let angle = atan2(mouseY - p.y, mouseX - p.x);
      p.x += cos(angle) * 1.5 + windDir.x;
      p.y += sin(angle) * 1.5 + windDir.y;
    } else {
      p.x += p.vx + windDir.x;
      p.y += p.vy + windDir.y;
    }
    p.opacity -= 3;
    if (p.opacity <= 0) {
      pixelBlocks.splice(i, 1);
    } else {
      fill(p.color[0], p.color[1], p.color[2], p.opacity);
      noStroke();
      rect(p.x, p.y, p.size, p.size);
    }
  }

  // 拖尾效果在右边显示（延迟 slice）
  waveBuffer.unshift(capture.get());
  if (waveBuffer.length > numSlices) waveBuffer.pop();
  let sliceW = 640 / numSlices;
  for (let i = 0; i < waveBuffer.length; i++) {
    let img = waveBuffer[i];
    let sx = int((i / numSlices) * capture.width);
    copy(
      img, sx, 0, sliceW, 480,
      640 + i * sliceW, 0, sliceW, 480
    );
  }

  // 👇 右边水波纹在拖尾上层绘制
  for (let r of ripples) {
    noFill();
    stroke(255, 100);
    ellipse(r.x, r.y, r.r);
    r.r += 2;
  }
  ripples = ripples.filter(r => r.r < 200);

  prevFrame.copy(capture, 0, 0, 640, 480, 0, 0, 640, 480);
}

function mouseDragged() {
  windDir = createVector(mouseX - pmouseX, mouseY - pmouseY).mult(0.02);
}

function drawGrid(spacing, alpha) {
  stroke(gridColor.levels[0], gridColor.levels[1], gridColor.levels[2], alpha);
  strokeWeight(3);
  for (let x = 0; x < 640; x += spacing) line(x, 0, x, height);
  for (let y = 0; y < height; y += spacing) line(0, y, 640, y);
}

function drawSymbol(x, y) {
  push();
  noFill();
  stroke(255, 180);
  translate(x, y);
  for (let i = 0; i < 6; i++) {
    ellipse(0, 0, i * 20, i * 20);
    rotate(PI / 6);
  }
  pop();
}

function triggerPixelSpray(amount) {
  for (let i = 0; i < amount; i++) {
    let px = random(640);
    let py = random(height);
    let col = capture.get(640 - px, py);
    pixelBlocks.push({
      x: px,
      y: py,
      vx: random(-1, 1),
      vy: random(-1, 1),
      size: random(10, 50),
      color: col,
      opacity: 255
    });
  }
}

class Dandelion {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.position = this.origin.copy();
    this.velocity = createVector(0, 0);
    this.noiseOffset = random(1000);
    this.particles = [];
    this.isExploded = false;
    for (let i = 0; i < 900; i++) {
      let angle = random(TWO_PI);
      let r = random(0, 80);
      let offset = createVector(cos(angle) * r, sin(angle) * r);
      this.particles.push({
        offset: offset,
        pos: p5.Vector.add(this.position, offset.copy()),
        vel: p5.Vector.random2D().mult(random(0.5, 1.5)),
        tail: []
      });
    }
  }

  followTo(x, y) {
    let target = createVector(x, y - 40);
    let dir = p5.Vector.sub(target, this.position);
    dir.mult(0.02);
    this.velocity.add(dir);
    this.velocity.limit(2);
  }

  explode() {
    this.isExploded = true;
    for (let p of this.particles) p.drifting = true;
  }

  update() {
    let wind = map(noise(this.noiseOffset), 0, 1, -0.9, 0.9);
    this.noiseOffset += 0.01;
    this.velocity.x += wind * 0.1;
    this.velocity.mult(0.98);
    this.position.add(this.velocity);
    for (let p of this.particles) {
      if (this.isExploded) {
        p.tail.push(p.pos.copy());
        if (p.tail.length > 10) p.tail.shift();
        p.pos.add(p.vel);
        p.vel.mult(0.99);
      } else {
        p.pos = p5.Vector.add(this.position, p.offset);
      }
    }
  }

  display() {
    if (!this.isExploded) {
      stroke(255);
      strokeWeight(5);
      line(this.position.x, this.position.y, this.position.x, this.position.y + 100);
    }
    noStroke();
    fill(255, 230);
    for (let p of this.particles) {
      ellipse(p.pos.x, p.pos.y, 5, 5);
      if (this.isExploded) {
        noFill();
        stroke(255, 100);
        strokeWeight(1);
        beginShape();
        for (let pt of p.tail) vertex(pt.x, pt.y);
        endShape();
      }
    }
  }
}
