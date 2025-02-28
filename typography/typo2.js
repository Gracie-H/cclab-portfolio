let myFont;
let txt = "RESPIRABLE";
let fontSize = 80;
let points = [];
let airParticles = [];
let breathSize = 0;
let noiseOffset = 0;
let letterSpacing = 5; // 让字母间距更紧凑

function preload() {
  myFont = loadFont('Polka MN Bold.ttf'); // 确保 p5.js 能加载字体
}

function setup() {
  createCanvas(600, 600);
  textSize(fontSize);
  textAlign(LEFT, CENTER);

  // 计算文本总宽度并居中
  let totalWidth = 0;
  for (let i = 0; i < txt.length; i++) {
    totalWidth += textWidth(txt[i]) + letterSpacing;
  }
  totalWidth -= letterSpacing;
  
  let xOffset = (width - totalWidth) / 2;
  let yOffset = height / 2;
  
  // 生成文字的点阵数据
  for (let i = 0; i < txt.length; i++) {
    let letter = txt[i];
    let letterPoints = myFont.textToPoints(letter, xOffset, yOffset, fontSize, {
      sampleFactor: 0.3, // 采样点密度
      simplifyThreshold: 0
    });

    points = points.concat(letterPoints);
    xOffset += textWidth(letter) + letterSpacing;
  }

  // 生成空气粒子
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    for (let j = 0; j < 5; j++) {
      airParticles.push(createParticle(p.x, p.y));
    }
  }
}

function draw() {
  background(10, 20, 30, 50);
  
  breathSize = sin(frameCount * 0.02) * 5; // 文字呼吸变化
  noiseOffset += 0.01; // 让空气粒子流动更自然

  // 绘制空气粒子
  noStroke();
  for (let i = airParticles.length - 1; i >= 0; i--) {
    let a = airParticles[i];

    // 使用 Perlin Noise 让粒子产生更自然的空气流动
    let noiseX = noise(a.noiseSeed + noiseOffset) * 2 - 1;
    let noiseY = noise(a.noiseSeed + noiseOffset + 100) * 2 - 1;
    
    a.x += noiseX * 1.5;
    a.y += noiseY * 1.5;
    
    // 让泡泡逐渐变大并变透明
    a.size = lerp(a.size, a.maxSize, 0.02);
    a.opacity -= 2; 

    fill(200, 250, 255, a.opacity);
    ellipse(a.x, a.y, a.size, a.size);
    
    // 让粒子漂浮上升
    a.y -= a.speed;
    
    if (a.opacity <= 0) {
      airParticles.splice(i, 1); // 透明后删除粒子
    }
  }

  // 让文字有更明显的“呼吸波动”效果
  fill(255, 255, 255, 200);
  noStroke();
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    let waveX = sin(frameCount * 0.05 + p.y * 0.02) * 3; // 让文字点产生流动波动
    let waveY = cos(frameCount * 0.05 + p.x * 0.02) * 3;
    ellipse(p.x + waveX, p.y + waveY + breathSize, 3, 3);
  }
}

// 生成空气粒子的函数
function createParticle(x, y) {
  return {
    x: x + random(-5, 5),
    y: y + random(-5, 5),
    baseX: x,
    baseY: y,
    speed: random(0.5, 1.5),
    opacity: random(100, 200),
    size: random(4, 8), // 初始小气泡
    maxSize: random(20, 40), // 扩散到最大尺寸
    lifespan: random(120, 180), // 粒子存在时间
    noiseSeed: random(1000)
  };
}

// 点击屏幕产生空气爆发效果
function mousePressed() {
  for (let i = 0; i < 30; i++) {
    airParticles.push(createParticle(mouseX, mouseY));
  }
}
