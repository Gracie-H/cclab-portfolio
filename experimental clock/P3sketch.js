let ice;
let waterDrops = [];
let flowers = [];
let meltingFactor = 0;
let iceSize = 200;
let flowerRate = 0.08;

let iceImage;
let waterOvalSize = 0;  
let maxWaterOvalSize = 500;  

function preload() {
  iceImage = loadImage('ice.png');  
}

function setup() {
  createCanvas(600, 600).parent("sketch-container");
  ice = new Ice(width / 2, height / 3, iceSize);
}

function draw() {
  background(250, 20,50);
  
  ice.melt();
  ice.display();
  
 
  if (ice.opacity <= 0) {
  
    waterDrops = [];

    flowerRate = 0;
   
    waterOvalSize = maxWaterOvalSize; 
  }


  for (let i = waterDrops.length - 1; i >= 0; i--) {
    waterDrops[i].move();
    waterDrops[i].display();
   
    if (waterDrops[i].y > height) {
      waterDrops.splice(i, 1);
      flowers.push(new Flower(width / 2, height)); 
    }
  }


  for (let flower of flowers) {
    flower.grow();
    flower.moveToCenter();
    flower.display();
  }

  if (random() < flowerRate) {
    flowers.push(new Flower(width / 2, height));
  }

 
  drawWaterOval();
}

function drawWaterOval() {
  fill(0, 0, 255, 150);  
  noStroke();
 
  if (waterOvalSize < maxWaterOvalSize) {
    waterOvalSize += 1;  
  }
  
  ellipse(width / 2, height - 50, waterOvalSize, 40);  
}

class Ice {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.opacity = 255; 
  }

  melt() {
    if (this.size > 0) {
      this.size -= 0.3;  
      this.opacity -= 0.5;  
    }

    if (frameCount % 5 === 0 && this.size > 0 && this.opacity > 0) {
      waterDrops.push(new WaterDrop(this.x + random(-this.size / 2, this.size / 2), this.y + this.size / 2));
    }
  }

  display() {
    imageMode(CENTER);
    tint(255, this.opacity);  
    image(iceImage, this.x, this.y, 170, 120);  
    let c1 = color(150, 200, 255, this.opacity);
    let c2 = color(100, 150, 255, this.opacity);
    for (let i = 0; i < this.size; i++) {
      let inter = map(i, 0, this.size, 0, 1);
      let c = lerpColor(c1, c2, inter);
      fill(c);
      noStroke();
    }
  }
}

class WaterDrop {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 5;
    this.speed = random(1, 3);
    this.acceleration = random(0.05, 0.1);  
    this.flowSpeed = random(0.5, 1.5);  
  }

  move() {
    this.y += this.speed;
    this.speed += this.acceleration;  
    this.size += 0.05;  

   
    this.x += sin(frameCount * 0.1) * this.flowSpeed;
  }

  display() {
    fill(0, 0, 255);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);  
  }
}

class Flower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 5;
    this.petals = 5;
    this.color = color(random(255), random(255), random(255));
    this.growthSpeed = 0.3;
    this.speedX = 0.05;
    this.speedY = 0.05;
    this.reachedCenter = false;
    this.isGrowing = false;
  }

  grow() {
    if (this.isGrowing) {
      this.size += this.growthSpeed;
      if (this.size > 80) {
        this.size = 80;
      }
    }
  }

  moveToCenter() {
    let dx = width / 2 - this.x;
    let dy = height / 2 - this.y;

    this.x += dx * this.speedX;
    this.y += dy * this.speedY;

    if (abs(dx) < 1 && abs(dy) < 1) {
      this.reachedCenter = true;
      this.isGrowing = true;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    for (let i = 0; i < this.petals; i++) {
      push();
      rotate(TWO_PI / this.petals * i);
      fill(this.color);
      noStroke();
      ellipse(0, -this.size / 2, this.size, this.size * 1.5);
      pop();
    }
    pop();
  }
}
