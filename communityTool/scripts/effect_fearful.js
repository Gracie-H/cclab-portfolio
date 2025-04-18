let orbs = [];
let ripples = [];
let clickRipples = [];
let starfield = [];
let bgImg;
let pulseRadius = 180;
let pulseDir = 1;
let centerAngle = 0;
let centerGlow;
let clickSound;

function preload() {
  bgImg = loadImage('2222.jpg');
  clickSound = loadSound('scripts/7.mp3');



}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(RGB, 255, 255, 255, 255);
  angleMode(RADIANS);

  centerGlow = createGraphics(width, height);
  centerGlow.noStroke();
  for (let r = 400; r > 0; r -= 5) {
    centerGlow.fill(255, 250, 255, map(r, 400, 0, 0, 70));
    centerGlow.ellipse(width / 2, height / 2, r * 2);
  }

  // 星点
  for (let i = 0; i < 200; i++) {
    starfield.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      alpha: random(30, 100)
    });
  }

  // orbs with rotation
  for (let i = 0; i < 60; i++) {
    let angle = random(TWO_PI);
    let dist = random(180, 500);
    orbs.push({
      angle: angle,
      dist: dist,
      speed: random(0.001, 0.003),
      r: random(18, 28),
      pulseOffset: random(TWO_PI),
      trail: [],
      sparks: [],
      satellites: []
    });
  }
}

function draw() {
  image(bgImg, 0, 0, width, height);
  fill(255, 255, 255, 8);
  rect(0, 0, width, height);

  // 星空背景
  for (let s of starfield) {
    fill(255, s.alpha);
    ellipse(s.x, s.y, s.size);
  }

  // 呼吸圈
  pulseRadius += pulseDir * 0.5;
  if (pulseRadius > 200 || pulseRadius < 160) pulseDir *= -1;
  fill(255, 255, 255, 20);
  ellipse(width / 2, height / 2, pulseRadius * 2);

  // 中心旋转星体 + 星芒
  push();
  translate(width / 2, height / 2);
  rotate(centerAngle);
  for (let i = 0; i < 8; i++) {
    let len = 30;
    stroke(255, 255, 255, 50);
    line(0, 0, len, 0);
    rotate(PI / 4);
  }
  pop();
  centerAngle += 0.004;
  image(centerGlow, 0, 0);

  // 自动中心波纹
  if (frameCount % 60 === 0) {
    ripples.push({ r: 0, alpha: 80 });
  }

  for (let r of ripples) {
    stroke(240, 240, 255, r.alpha);
    noFill();
    ellipse(width / 2, height / 2, r.r);
    r.r += 2;
    r.alpha -= 0.8;
  }
  ripples = ripples.filter(r => r.alpha > 0);

  for (let r of clickRipples) {
    stroke(255, r.alpha);
    noFill();
    ellipse(r.x, r.y, r.r);
    r.r += 4;
    r.alpha -= 2;
  }
  clickRipples = clickRipples.filter(r => r.alpha > 0);

  noStroke();

  // 更新球体
  for (let o of orbs) {
    // 鼠标吸引影响
    let dMouse = dist(mouseX, mouseY, width / 2 + cos(o.angle) * o.dist, height / 2 + sin(o.angle) * o.dist);
    if (dMouse < 120) o.speed += 0.0005;

    o.angle += o.speed;
    o.dist *= 0.996;
    let x = width / 2 + cos(o.angle) * o.dist;
    let y = height / 2 + sin(o.angle) * o.dist + sin(frameCount * 0.03 + o.pulseOffset) * 4;

    // 外发光
    for (let glow = o.r + 6; glow > o.r; glow -= 2) {
      fill(255, 255, 255, map(glow, o.r, o.r + 6, 8, 0));
      ellipse(x, y, glow);
    }

    fill(240, 220, 255, 80);
    ellipse(x, y, o.r);

    // 尾巴轨迹流体
    o.trail.push({ x, y, r: o.r * 0.4, alpha: 60 });
    if (o.trail.length > 15) o.trail.shift();
    for (let t of o.trail) {
      fill(240, 240, 255, t.alpha);
      ellipse(t.x, t.y, t.r);
      t.alpha -= 1;
    }

    // 星屑
    if (frameCount % 5 === 0) {
      o.sparks.push({
        x: x + random(-o.r / 2, o.r / 2),
        y: y + random(-o.r / 2, o.r / 2),
        alpha: 90
      });
    }
    for (let s of o.sparks) {
      fill(255, 255, 255, s.alpha);
      ellipse(s.x, s.y, 1.5);
      s.alpha -= 2;
    }
    o.sparks = o.sparks.filter(s => s.alpha > 0);

    // 小卫星环绕
    let satCount = 2;
    for (let i = 0; i < satCount; i++) {
      let sa = frameCount * 0.05 + i * TWO_PI / satCount;
      let sx = x + cos(sa) * (o.r + 4);
      let sy = y + sin(sa) * (o.r + 4);
      fill(255, 255, 255, 30);
      ellipse(sx, sy, 3);
    }
  }
}

function mousePressed() {
  clickRipples.push({ x: mouseX, y: mouseY, r: 10, alpha: 120 });
  // 若你有声音效果系统可以加上 playSFX();

  if (clickSound && clickSound.isLoaded()) {
    clickSound.play();
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
