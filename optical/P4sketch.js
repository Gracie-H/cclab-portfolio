let radius;
let speed;
let circlesNum = 90;
let patternColor;
let w = 50;
let sizeChange;

function setup() {
  createCanvas(600, 400).parent("sketch-container");
  radius = width;
  speed = 0.015;
  patternColor = color(0, 222, 255);
  noFill();
}

function draw() {
  background(255, 444, 222); 
  
  for (let x = 0; x < 12; x++) {
    push();
    fill(2, 2, 2);
    ellipse(w * x + 25, height / 2, w / 3, w / 1.5);
   
    fill(250, 2, 2);
    ellipse(w * x + 25, height / 2, w / 8, w / 2);
    ellipse(width / 2, w * x + 25, w / 8, w / 2);
    ellipse(w * x + 25, height / 2, w / 8, w / 8);
    pop();
  }
  
  let sizeChange = sin(frameCount * speed) * radius;

  for (let i = 0; i < circlesNum; i++) {
    let radius = (i + 1) * 30 + sizeChange;
    if (radius > 0) {
      strokeWeight(2);
      stroke(0);
      ellipse(width / 2, height / 2, radius / 3, radius);
      drawBluePattern(width / 2, height / 2, radius / 2);
    }
  }
}


function drawBluePattern(x, y, size) {
  stroke(patternColor);
  strokeWeight(0.8);

 
  for (let i = 0; i < 8; i++) {
    let angle = i * PI / 4;
    let circleX = x + cos(angle) * size * 0.4;
    let circleY = y + sin(angle) * size * 0.4;
    ellipse(circleX, circleY, size * 0.1, size * 0.1);
  }
}
