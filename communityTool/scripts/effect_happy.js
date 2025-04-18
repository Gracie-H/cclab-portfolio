let sparkles = [];
let bursts = [];
let trails = [];
let bgHue = 200;
let clickSound;
let hasPlayed = false; // ✅ 用于限制声音只播放一次

function preload() {
  clickSound = loadSound('scripts/6.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function draw() {
  // 背景渐变
  bgHue = (bgHue + 0.2) % 360;
  background(bgHue, 30, 95, 5);

  // Sparkles 漂浮
  for (let s of sparkles) {
    push();
    translate(s.x, s.y);
    rotate(s.angle);
    fill(s.col);
    ellipse(0, 0, s.size, s.size * 0.8);
    pop();

    s.y -= s.speed;
    s.x += sin(frameCount * 0.01 + s.offset) * 0.5;
    s.alpha -= 0.3;
    s.angle += 0.01;
    s.col.setAlpha(s.alpha);
  }
  sparkles = sparkles.filter(s => s.alpha > 0);

  // 爆发粒子
  for (let b of bursts) {
    fill(b.col);
    ellipse(b.x, b.y, b.size);
    b.x += b.vx;
    b.y += b.vy;
    b.vx *= 0.98;
    b.vy *= 0.98;
    b.alpha -= 1.5;
    b.col.setAlpha(b.alpha);
    trails.push({
      x: b.x,
      y: b.y,
      r: b.size * 0.8,
      col: b.col,
      alpha: b.alpha
    });
  }
  bursts = bursts.filter(b => b.alpha > 0);

  // 粒子轨迹
  for (let t of trails) {
    fill(t.col.levels[0], t.col.levels[1], t.col.levels[2], t.alpha);
    ellipse(t.x, t.y, t.r);
    t.alpha -= 0.8;
  }
  trails = trails.filter(t => t.alpha > 0);

  // 自动生成 sparkles
  if (frameCount % 2 === 0) {
    let h = random(0, 360);
    sparkles.push({
      x: random(width),
      y: height + 10,
      size: random(3, 6),
      speed: random(0.5, 1),
      alpha: 80,
      angle: random(TWO_PI),
      offset: random(TWO_PI),
      col: color(h, 40 + random(40), 100, 80)
    });
  }
}

function mousePressed() {
  let baseHue = random(0, 360);

  // ✅ 第一次点击时播放 loop 音频
  if (!hasPlayed && clickSound && clickSound.isLoaded()) {
    clickSound.loop();
    hasPlayed = true;
  }

  // 添加爆发粒子
  for (let i = 0; i < 100; i++) {
    bursts.push({
      x: mouseX,
      y: mouseY,
      vx: random(-4, 4),
      vy: random(-4, 4),
      size: random(2, 5),
      alpha: 100,
      col: color(baseHue + random(-10, 10), 20 + random(100), 100, 100)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
