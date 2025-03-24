let capture;
let pixelBlocks = [];
let mic;
let prevFrame;

function setup() {
  createCanvas(600, 500);
  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();

  mic = new p5.AudioIn();
  mic.start();

  prevFrame = createImage(width, height);
}

function draw() {
  background(0);

  // 镜像显示摄像头图像
  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0, width, height);
  pop();

  capture.loadPixels();
  prevFrame.loadPixels();

  // 🎤 声音触发：声音越大喷越多
  let vol = mic.getLevel();
  if (vol > 0.03) {
    triggerPixelSpray(15);
  }

  // ✋ 手势触发（图像变化检测）
  let imageChanged = false;
  let pixelThreshold = 25;  // 改名为 pixelThreshold
  for (let y = height / 3; y < height * 2 / 3; y += 10) {
    for (let x = width / 3; x < width * 2 / 3; x += 10) {
      let i = (y * width + x) * 4;
      let r1 = capture.pixels[i];
      let r2 = prevFrame.pixels[i];
      if (abs(r1 - r2) > pixelThreshold) {  // 使用新的变量名
        imageChanged = true;
        break;
      }
    }
    if (imageChanged) break;
  }

  if (imageChanged) {
    triggerPixelSpray(10);
  }

  // ✨ 鼠标吸引 + 粒子更新
  for (let i = pixelBlocks.length - 1; i >= 0; i--) {
    let p = pixelBlocks[i];

    // 鼠标靠近吸引
    let d = dist(mouseX, mouseY, p.x, p.y);
    if (d < 80) {
      let angle = atan2(mouseY - p.y, mouseX - p.x);
      p.x += cos(angle) * 1.5;
      p.y += sin(angle) * 1.5;
    }

    p.x += p.vx;
    p.y += p.vy;
    p.opacity -= 3;
    if (p.opacity <= 0) {
      pixelBlocks.splice(i, 1);
    } else {
      fill(p.color[0], p.color[1], p.color[2], p.opacity);
      noStroke();
      rect(p.x, p.y, p.size, p.size);
    }
  }

  // 更新当前帧为下一帧对比
  prevFrame.copy(capture, 0, 0, width, height, 0, 0, width, height);
}

// 🚀 统一的像素喷发函数
function triggerPixelSpray(amount) {
  for (let i = 0; i < amount; i++) {
    let px = random(width);
    let py = random(height);
    let col = capture.get(px, py);
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
