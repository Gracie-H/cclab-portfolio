let capture;
let pixelBlocks = [];

function setup() {
    let canvas = createCanvas(600, 400);
    canvas.parent("canvas-container"); // 让 p5.js 画布放入 div
    capture = createCapture(VIDEO);
    capture.size(width, height);
    capture.hide();
    frameRate(30);
}

function draw() {
    background(0);

    // **实时显示摄像机**
    image(capture, 0, 0, width, height);

    // **绘制像素方块**
    for (let i = pixelBlocks.length - 1; i >= 0; i--) {
        let p = pixelBlocks[i];
        p.opacity -= 3; // 透明度降低

        if (p.opacity <= 0) {
            pixelBlocks.splice(i, 1); // 删除透明的方块
        } else {
            fill(p.color[0], p.color[1], p.color[2], p.opacity);
            noStroke();
            rect(p.x, p.y, p.size, p.size);
        }
    }

    // **每隔一定帧数截取像素**
    if (frameCount % 10 === 0) {
        captureFacePixels();
    }
}

// **像素格动态变化**
function captureFacePixels() {
    let w = capture.width;
    let h = capture.height;

    let faceRegions = [
        { x: w * 0.3, y: h * 0.35 }, // 眼睛
        { x: w * 0.7, y: h * 0.35 }, 
        { x: w * 0.5, y: h * 0.45 }, // 鼻子
        { x: w * 0.4, y: h * 0.6 }, // 嘴
        { x: w * 0.6, y: h * 0.6 }  
    ];

    for (let region of faceRegions) {
        let px = region.x + random(-10, 10);
        let py = region.y + random(-10, 10);
        let pxSize = random(10, 20);
        let color = capture.get(px, py);

        pixelBlocks.push({
            x: px,
            y: py,
            size: pxSize,
            color: color,
            opacity: 255
        });
    }
}
