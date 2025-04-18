let points = [];
let lines = [];
let ripples = [];
let trails = [];
let clickSound;
let pulse = 0;
let pulseDir = 1;
let bgParticles = [];

function preload() {
  clickSound = loadSound('scripts/4.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  for (let i = 0; i < 30; i++) {
    points.push({
      x: random(width),
      y: random(height),
      vx: random(-0.2, 0.2),
      vy: random(-0.2, 0.2),
      r: random(3, 6)
    });
  }

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let d = dist(points[i].x, points[i].y, points[j].x, points[j].y);
      if (d < 180) lines.push([i, j]);
    }
  }

  for (let i = 0; i < 120; i++) {
    bgParticles.push({
      x: random(width),
      y: random(height),
      r: random(0.3, 1.8),
      alpha: random(30, 90),
      dx: random(-0.05, 0.05),
      dy: random(-0.08, 0.08)
    });
  }
}

function draw() {
  background(242, 239, 229, 25); // 米色宣纸背景

  // 背景粒子：缓慢移动
  for (let b of bgParticles) {
    fill(200, 180, 160, b.alpha);
    ellipse(b.x, b.y, b.r);
    b.x += b.dx;
    b.y += b.dy;
    if (b.x < 0 || b.x > width) b.dx *= -1;
    if (b.y < 0 || b.y > height) b.dy *= -1;
  }

  // 呼吸中心晕圈
  pulse += pulseDir * 0.3;
  if (pulse > 10 || pulse < -2) pulseDir *= -1;
  fill(180, 170, 150, 15);
  ellipse(width / 2, height / 2, 220 + pulse * 2.5);
  fill(180, 170, 150, 10);
  ellipse(width / 2, height / 2, 160 + pulse * 2);

  // 点 + 羽化晕边
  for (let p of points) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    // 羽化晕圈（用 radialGradient 模拟墨染）
    let g = drawingContext.createRadialGradient(p.x, p.y, 1, p.x, p.y, p.r * 2);
    g.addColorStop(0, 'rgba(100, 80, 60, 0.3)');
    g.addColorStop(1, 'rgba(100, 80, 60, 0)');
    drawingContext.fillStyle = g;
    ellipse(p.x, p.y, p.r * 4);

    trails.push({ x: p.x, y: p.y, r: p.r, alpha: 40 });
  }

  // 自然纹理式连线
  stroke(120, 100, 80, 40);
  strokeWeight(0.4);
  for (let l of lines) {
    let a = points[l[0]];
    let b = points[l[1]];
    let d = dist(a.x, a.y, b.x, b.y);
    if (d < 160 + sin(frameCount * 0.01) * 10) {
      line(a.x, a.y, b.x, b.y);
    }
  }

  noStroke();
  // 轨迹残影
  for (let t of trails) {
    fill(140, 120, 100, t.alpha);
    ellipse(t.x, t.y, t.r);
    t.alpha -= 1;
  }
  trails = trails.filter(t => t.alpha > 0);

  // ripple 涟漪：墨圈感
  for (let r of ripples) {
    stroke(100, 80, 60, r.alpha);
    strokeWeight(1);
    noFill();
    ellipse(r.x, r.y, r.radius);
    r.radius += 1.5;
    r.alpha -= 1;
  }
  ripples = ripples.filter(r => r.alpha > 0);
}

function mousePressed() {
  ripples.push({ x: mouseX, y: mouseY, radius: 10, alpha: 100 });
  if (clickSound && clickSound.isLoaded()) {
    clickSound.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
