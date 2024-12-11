let Data = [1.5, 2.5, 1, 2, 1, 3.2, 2.5];

let appCategories = [
  ['coffee', 'juice', 'water'],  //monday
  ['bubbleTea' , 'water'], //Tuesday
  ['coffee' , 'water'], // Wednesday
  ['juice', 'tea' , 'water'], //Thurday
  ['coffee' , 'water'], //Friday
  ['juice', 'coffee' , 'water'], //Saturday
  ['bubbleTea', 'tea' , 'water'] //Sunday
];


let dataGrowth = [];
let intakeData = [];
let growSpeed = 0.5; 


function setup() {
  createCanvas(600, 400).parent("sketch-container"); 

  // max size of data for daily
  for (let i = 0; i < Data.length; i++) {
    dataGrowth[i] = 0; 
    intakeData[i] = Data[i] * 50; 
  }
}

function draw() {

 
  let r = map(frameCount % 600, 0, 600, 135, 0);  
  let g = map(frameCount % 600, 0, 600, 206, 50);  
  let b = map(frameCount % 600, 0, 600, 235, 102); 

  background(r, g, b);
  
// data growth
  for (let i = 0; i < dataGrowth.length; i++) {
    if (dataGrowth[i] < intakeData[i]) {
      dataGrowth[i] += growSpeed; 
    }

    // the data circle (sugar intake value)
    drawCircle(i * 70 + 82, height / 2, dataGrowth[i], appCategories[i]);
  }
}

function drawCircle(x, y, size, categories) {
  fill(10, 250, 200, 150); 
  noStroke();
  ellipse(x, y, size, size);
  
  push();
  noFill(); 
  stroke(250,250,250); 
  strokeWeight(0.5); 
  ellipse(x+10, y, size * 0.2, size * 0.2); 
  ellipse(x, y+2, size * 0.4, size * 0.4); 
  pop();

  // Draw orbiting circles for each drinks
  let angleStep = TWO_PI / categories.length;
  for (let i = 0; i < categories.length; i++) {
    let orbitRadius = size / 2; //distance
    let angle = frameCount * 0.01 + i * angleStep; 

    // Calculate orbiting circle position
    let orbitX = x + cos(angle) * orbitRadius;
    let orbitY = y + sin(angle) * orbitRadius;

    fill(getCategoryColor(categories[i]));
  
    circle(orbitX, orbitY, 15); 
    fill(250,0,0);
    circle(orbitX, orbitY, 8); 
    rect(orbitX, orbitY/3, 8); 
    triangle(orbitX+50, orbitY+200, 4,4,2,3); 
    

    push();
    fill(33,55,250);
    rect(69,300,30);
    rect(139,300,30);
    rect(209,300,30);
    rect(279,300,30);
    rect(349,300,30);
    rect(419,300,30);
    rect(489,300,30);
    pop();
    
    push();
    fill(250,0,0); 
    textSize(15); 
    text('W', x-5, 350); 
    pop();
    
  
  }
}

function getCategoryColor(category) {
  if (category === 'coffee') return color(0, 0, 0); //Black
  if (category === 'juice') return color(255, 165, 0); // Orange
  if (category === 'bubbleTea') return color(165,42, 42); //Brown
  if (category === 'tea') return color(0, 225, 0);  //Green
  if (category === 'water') return color(0, 0, 225);  //Blue
  
  function resetData() {
  for (let i = 0; i < dataGrowth.length; i++) {
    dataGrowth[i] = 0; }
  }
}
