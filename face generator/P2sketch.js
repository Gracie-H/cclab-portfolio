let bc;

function setup() {
  createCanvas(400, 400).parent("sketch-container");
  
  sizechange=5;
  bc = 25;
  bgColor = color(200, 220, 240);
}

function draw() {
  push();
  background(bc);
  fill(172,201,139);
  
  //transparency
  for (let i = 0; i < height; i++) {
    stroke(lerpColor(bgColor, color(150, 150, 200), map(i, 0, height, 0, 1)));
    line(0, i, width, i);
  }
  rectMode(CENTER);
  fill(176,196,222);
  for (let i = 0; i < 15; i++) {
    let X = random(-200, 200); 
    let Y = random(-200, 200); 
    let rectWidth = random(30, 150);  
    let rectHeight = random(30, 150); 
    rect(mouseX + X, mouseY + Y, rectWidth, rectHeight);
  }

  //face
  let circleSize = min(mouseX, mouseY);
  fill(250, 250, 250);
  beginShape();
  
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 8, 0, TWO_PI);
    let offset = random(-circleSize * 0.2, circleSize * 0.2); 
    let x = mouseX + cos(angle) * (circleSize / 2 + offset);
    let y = mouseY + sin(angle) * (circleSize / 2 + offset);
    vertex(x, y);
  }
  endShape(CLOSE);
  
  //eyes
  push();
  fill(bc);
  pop();
  fill(106,90,205);
   circle(mouseX-40,mouseY-20,50);
  circle(mouseX+40,mouseY-20,50);
  fill(206,90,205);
  circle(mouseX-40,mouseY-20,40);
  circle(mouseX+40,mouseY-20,40);
  fill(106,190,205);
 circle(mouseX-40,mouseY-20,30);
  circle(mouseX+40,mouseY-20,30);
  fill(255,245,238);
  circle(mouseX-40,mouseY-20,20);
  circle(mouseX+40,mouseY-20,20);
  fill(255,255,0);
   circle(mouseX-40,mouseY-20,10);
  circle(mouseX+40,mouseY-20,10);
 
  //mouth
  fill(255,255,0);
  let mouthWidth = circleSize / 4;  
  let mouthHeight = circleSize / 7; 
  let mouth = circleSize / 4;
  rect(mouseX, mouseY + mouth, mouthWidth, mouthHeight);
  pop();
}
  
function mousePressed(){
 sizechange = random(10,200);
 bc = color(random(0, 255), random(0, 255), random(0, 255));
bgColor = color(random(200, 255), random(200, 255), random(200, 255));
}
  


