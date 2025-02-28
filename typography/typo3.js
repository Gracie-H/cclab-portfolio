let typography;
let points = [];
let lines = [];
let font;
let centerX, centerY;

function preload() {
  font = loadFont('Polka MN Bold.ttf'); // 确保你的字体文件路径正确
}

function setup() {
  createCanvas(600, 600);
  textFont(font);

  centerX = width / 2;
  centerY = height / 2;

  let txtPoints = font.textToPoints("NEW YORK", centerX - 280, centerY + 50, 150, {
    sampleFactor: 0.25, // 控制点的密集度
    simplifyThreshold: 0
  });

  for (let p of txtPoints) {
    let newPoint = new TextPoint(p.x, p.y);
    points.push(newPoint);
    lines.push(new ExpandingLine(centerX, centerY)); // 线条从中心向外扩散
  }

  typography = new Typography(points);

  noStroke();
}

function draw() {
  background(10, 10, 10, 220);

  for (let line of lines) {
    line.move();
    line.display();
  }

  typography.display();
}

// 🌟 文字点类（带流动光晕）
class TextPoint {
  constructor(x, y) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.offset = random(PI);
  }

  move() {
    let distanceToMouse = dist(mouseX, mouseY, this.x, this.y);
    let attraction = map(distanceToMouse, 0, width, 8, 0.5);

    // 让点稍微漂浮，使文字更有动态感
    this.x = this.baseX + sin(frameCount * 0.05 + this.offset) * 3;
    this.y = this.baseY + cos(frameCount * 0.05 + this.offset) * 3;

    // 鼠标靠近时增加吸引效果
    if (distanceToMouse < 80) {
      this.x += (mouseX - this.x) * 0.05 * attraction;
      this.y += (mouseY - this.y) * 0.05 * attraction;
    }
  }

  display() {
    this.move();
    fill(255, 200, 250, 180);
    ellipse(this.x, this.y, 5, 5);
  }
}

// 🌟 文字点阵整体类
class Typography {
  constructor(points) {
    this.points = points;
  }

  display() {
    for (let p of this.points) {
      p.display();
    }
  }
}

// 🌟 线条从中心点向外扩散（透明度降低）
class ExpandingLine {
  constructor(x, y) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.angle = random(TWO_PI); // 随机扩散方向
    this.speed = random(1, 3);
    this.length = random(30, 120);
    this.alpha = random(80, 150); // 线条透明度降低
  }

  move() {
    let distanceToMouse = dist(mouseX, mouseY, this.startX, this.startY);
    let speedFactor = map(distanceToMouse, 0, width, 3, 0.5);

    // 线条从中心向外扩散
    this.x += cos(this.angle) * this.speed * speedFactor;
    this.y += sin(this.angle) * this.speed * speedFactor;

    // 鼠标靠近时，线条速度增加
    if (distanceToMouse < 120) {
      this.angle += random(-0.05, 0.05);
    }

    // 线条超出屏幕后重置到中心
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.x = this.startX;
      this.y = this.startY;
      this.angle = random(TWO_PI);
    }
  }

  display() {
    stroke(155, 255, 255, this.alpha); // 透明度降低
    strokeWeight(0.5);
    line(this.startX, this.startY, this.x, this.y);
  }
}
