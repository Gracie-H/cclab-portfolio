let hearts = [];
let font;
let letters = ["L", "O", "V", "E"];
let letterPoints = [];
let isScattered = false;

function preload() {
  font = loadFont('Polka MN Bold.ttf'); // 加载字体
}

function setup() {
  createCanvas(600, 600);
  
  let fontSize = 250; // 调整字体大小适应画布
  let textWidthTotal = 500; // 估算 "LOVE" 的总宽度
  let startX = (width - textWidthTotal) / 2; // 居中
  let spacing = 130; // 字母间距

  for (let i = 0; i < letters.length; i++) {
    let xOffset = startX + i * spacing;
    let points = font.textToPoints(letters[i], xOffset, height / 2 + 80, fontSize, {
      sampleFactor: 0.15,
      simplifyThreshold: 0.0
    });
    letterPoints.push(points);
  }

  generateFilledHearts();
  noStroke();
}

function draw() {
  background(255, 50, 50);
  for (let heart of hearts) {
    heart.move();
    heart.display();
  }
}

// 生成填充爱心
function generateFilledHearts() {
  let density = 6; // 控制填充密度
  for (let i = 0; i < letterPoints.length; i++) {
    let bounds = getBoundingBox(letterPoints[i]);
    for (let x = bounds.xMin; x < bounds.xMax; x += density) {
      for (let y = bounds.yMin; y < bounds.yMax; y += density) {
        if (inside(x, y, letterPoints[i])) {
          hearts.push(new HeartShape(x, y));
        }
      }
    }
  }
}

// 获取字母边界框
function getBoundingBox(points) {
  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  for (let pt of points) {
    if (pt.x < xMin) xMin = pt.x;
    if (pt.x > xMax) xMax = pt.x;
    if (pt.y < yMin) yMin = pt.y;
    if (pt.y > yMax) yMax = pt.y;
  }
  return { xMin, xMax, yMin, yMax };
}

// 判断点是否在字母内部
function inside(x, y, points) {
  let inside = false;
  let j = points.length - 1;
  for (let i = 0; i < points.length; i++) {
    let xi = points[i].x, yi = points[i].y;
    let xj = points[j].x, yj = points[j].y;
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
    j = i;
  }
  return inside;
}

// 爱心类
class HeartShape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.angle = random(TWO_PI);
    this.size = random(3, 8);
    this.baseSize = this.size;
    this.speed = random(0.01, 0.05);
    this.scatterX = random(-120, 120); // 让散开范围更均匀
    this.scatterY = random(-120, 120);
  }

  move() {
    if (isScattered) {
      this.x = lerp(this.x, this.originalX + this.scatterX, 0.05);
      this.y = lerp(this.y, this.originalY + this.scatterY, 0.05);
    } else {
      this.x = lerp(this.x, this.originalX, 0.05);
      this.y = lerp(this.y, this.originalY, 0.05);
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    fill(random(255, 255), random(100, 150), random(150, 255), 200);
    noStroke();

    beginShape();
    for (let t = 0; t < TWO_PI; t += 0.05) {
      let x = 16 * pow(sin(t), 3);
      let y = 13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t);
      vertex(x * this.size / 16, -y * this.size / 16);
    }
    endShape(CLOSE);

    pop();
  }
}

// 鼠标点击切换散开/恢复
function mousePressed() {
  isScattered = !isScattered;
}
