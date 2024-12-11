class Player {
  constructor(x, y, size, image) {
    this.pos = createVector(x, y);
    this.size = size;
    this.image = image;
  }

  move(speed) {
    if (keyIsDown(UP_ARROW)) this.pos.y -= speed;
    if (keyIsDown(DOWN_ARROW)) this.pos.y += speed;
    if (keyIsDown(LEFT_ARROW)) this.pos.x -= speed;
    if (keyIsDown(RIGHT_ARROW)) this.pos.x += speed;

    this.pos.x = constrain(this.pos.x, this.size / 2, width - this.size / 2);
    this.pos.y = constrain(this.pos.y, this.size / 2, height - this.size / 2);
  }

  draw() {
    image(this.image, this.pos.x - this.size / 2, this.pos.y - this.size / 2, this.size, this.size);
  }
}

class Item {
  constructor(x, y, size, image) {
    this.pos = createVector(x, y);
    this.size = size;
    this.image = image;
  }
  
move() {
    // 保证物体位置在画布内
    this.pos.x = constrain(this.pos.x, this.size / 2, width - this.size / 2);
    this.pos.y = constrain(this.pos.y, this.size / 2, height - this.size / 2);
  }
  
  
   draw() {
    image(this.image, this.pos.x - this.size / 2, this.pos.y - this.size / 2, this.size, this.size);
  }

  // 使用物体中心点检测感应
  isCollected(player) {
    let detectionRadius = this.size* 2;
    

    return dist(player.pos.x, player.pos.y, this.pos.x, this.pos.y) < detectionRadius + player.size ;
  }
}


class Obstacle {
  constructor(x, y, size, image, speedX, speedY) {
    this.pos = createVector(x, y);
    this.size = size;
    this.image = image;
    this.speed = createVector(speedX, speedY);
  }

  move() {
    this.pos.add(this.speed);

    if (this.pos.x <= 0 || this.pos.x >= width - this.size) this.speed.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height - this.size) this.speed.y *= -1;
  }

  draw() {
    image(this.image, this.pos.x - this.size / 2, this.pos.y - this.size / 2, this.size, this.size);
  }

  checkCollision(player) {
    return dist(player.pos.x, player.pos.y, this.pos.x, this.pos.y) < this.size / 2 + player.size / 2;
  }
}

class Scene {
  constructor(bgImage, objects = []) {
    this.bgImage = bgImage;
    this.objects = objects; // Could include items or other game elements
  }

  draw() {
    image(this.bgImage, 0, 0, width, height);
    this.objects.forEach((obj) => obj.draw());
  }
}


let player;
let playerSize = 30;
let items = [];
let obstacles = [];
let itemSize = 20;
let obstacleSize = 40;
let collectedItems = 0;
let bounceEffect = false;
let effectTimer = 0;
let x;
let y;
let w;
let h;




let shapes = [];
let meImage;
const shapeCount = 20;
let score = 0;
let gameTime = 15;
let timer;




let currentScene = 0; // 0: Room, 1: Flashback with Photo, 2: Flashback with Toy, 3: Maze Scene, 4+: Photo sub-scenes
let cellSize = 40;
let playerX = 1, playerY = 1; // Starting position of player in maze
let maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Define ABCDE 
// let shapes = [
//   { x: 150, y: 150, dx: 2, dy: 2, size: 40, label: "A" },
//   { x: 300, y: 150, dx: -2, dy: 1.5, size: 40, label: "B" },
//   { x: 450, y: 150, dx: 1.5, dy: -2, size: 40, label: "C" },
//   { x: 225, y: 275, dx: -1, dy: 1, size: 40, label: "D" },
//   { x: 375, y: 275, dx: 1, dy: -1.5, size: 40, label: "E" },
// ];

// class Player {
//   constructor(x, y, size, image) {
//     this.pos = createVector(x, y);
//     this.size = size;
//     this.image = image;
//   }

//   move(speed) {
//     if (keyIsDown(UP_ARROW)) this.pos.y -= speed;
//     if (keyIsDown(DOWN_ARROW)) this.pos.y += speed;
//     if (keyIsDown(LEFT_ARROW)) this.pos.x -= speed;
//     if (keyIsDown(RIGHT_ARROW)) this.pos.x += speed;

//     this.pos.x = constrain(this.pos.x, this.size / 2, width - this.size / 2);
//     this.pos.y = constrain(this.pos.y, this.size / 2, height - this.size / 2);
// //   }

//   draw() {
//     image(this.image, this.pos.x - 5, this.pos.y - 5, 160, 130);
//   }
// }


let bgVideo; 

function preload(){
   bgImage = loadImage('bg1.jpg');
   object1Image = loadImage('obj1.png');
  bg2Image = loadImage('bg2.jpg');
  logo1Image = loadImage('logo1.jpg');
  logo2Image = loadImage('logo2.jpg');
  obj2Image = loadImage('obj2.png');
  bg3Image = loadImage('bg3.jpg');
  
  photoImage = loadImage('photoImage.png');
  toyImage = loadImage('toyImage.png');
  mazeImage = loadImage('mazeImage.png');
  toyBImage = loadImage('toyB.jpg');
  didiImage  = loadImage('didi.png');
  dogToyImage = loadImage('dogToy.png');
  meImage = loadImage('me.png');
  scholarImage = loadImage('scholar.png');
  heavenImage = loadImage('heaven.jpg');
  didiAImage = loadImage('didiA.png')
  bGVideo = createVideo('bG.mp4');
  winImage = loadImage('win.jpg');
  
}

function setup() {
  createCanvas(600, 400);
  player = createVector(width / 2, height / 2);
  
  
 bGVideo.hide(); 
 
   
  

  

  for (let i = 0; i < shapeCount; i++) {
    shapes.push(createRandomCircle(random(100, width - 100), random(100, height - 100)));
  }

  timer = millis();

   // Generate collectible items
  for (let i = 0; i < 4; i++) {
    items.push(createVector(random(itemSize, width - itemSize), random(itemSize, height - itemSize)));
  }

  //  for (let i = 0; i < 10; i++) {
  //   shapes.push({
  //     x: random(width),
  //     y: random(height),
  //     w: random(50, 100), 
  //     h: random(50, 100),
  //     dx: random(-2, 2), 
  //     dy: random(-2, 2), 
  //     isSpecial: random() > 0.8, // 20% 
  //   });
  // }
  
   // Generate moving obstacles
  for (let i = 0; i < 10; i++) {
    obstacles.push({
      pos: createVector(random(obstacleSize, width - obstacleSize), random(obstacleSize, height - obstacleSize)),
      speed: createVector(random(-2, 2), random(-2, 2)) // Random speed for each obstacle
    });
  }

}

function draw() {
  background(220);
  console.log(mouseX,mouseY)

  if (currentScene === 0) {
    displayRoom();
  } else if (currentScene === 1) {
    displayPhotoGame();
  } else if (currentScene === 2) {
    displayCollisionGame();
  } else if (currentScene === 3) {
    displayMaze();
  } else if (currentScene >= 4 && currentScene <= 8) {
    displaySubSpace(currentScene);
  }
 if (currentScene === 1 && shapes.length === 0) {
  for (let i = 0; i < shapeCount; i++) {
    shapes.push(createRandomCircle(random(100, width - 100), random(100, height - 100)));
  }
  
  
  let specialCircle = createRandomCircle(random(100, width - 100), random(100, height - 100), true);
  shapes.push(specialCircle);
}
}






function displayRoom() {
  push();
  noStroke();
  image(bgImage, 0, -120, 600, 500);
  


  image(photoImage, 150, 150, 130, 130); 
  noStroke();


  image(toyImage, 345, 145, 150, 150); 
  noStroke();

 
  image(mazeImage, 260, 240, 130, 130); 

  fill(0);
  textSize(10);
  text("Click on an item to reveal a memory or enter the maze.", 170, 394);
  pop();
}







function drawCircleShape(x, y, diameter, label) {
  ellipse(x, y, diameter);
  textSize(12);
  text(label, x - diameter / 4, y + 5);
}


// function drawPhotoScene() {
//   background(150, 100, 250);
//   image(bg3Image, 0,0,600,400);
//   fill(255);
//   textSize(12);
//   text("Shapes are moving! Click to explore.", 50, 50);
//   text("Press 'R' to return to the main room.", 50,65);

//   // Draw and animate moving shapes
//   for (let i = 0; i < shapes.length; i++) {
//     let shape = shapes[i];

//     fill(100, 200, 250);
//     ellipse(shape.x, shape.y, shape.size);

//     fill(255);
//     textSize(12);
//     text(shape.label, shape.x - 5, shape.y + 5);

//     // Update position
//     shape.x += shape.dx;
//     shape.y += shape.dy;

//     // Check for collisions with the boundaries
//     if (shape.x - shape.size / 2 < 50 || shape.x + shape.size / 2 > width - 50) {
//       shape.dx *= -1; // Reverse direction on x-axis
//     }
//     if (shape.y - shape.size / 2 < 100 || shape.y + shape.size / 2 > height - 100) {
//       shape.dy *= -1; // Reverse direction on y-axis
//     }
//   }
// }








function displayCollisionGame() {
  scenes[currentScene].draw();

  player.move(5);
  player.draw();

  // Draw items
  items.forEach((item, index) => {
    if (item && item.isCollected(player)) {
      items[index] = null; // Remove collected item
      collectedItems++;
    } else if (item) {
      item.draw();
    }
  });

  // Draw obstacles
  obstacles.forEach((obstacle) => {
    obstacle.move();
    obstacle.draw();
    if (obstacle.checkCollision(player)) bouncePlayer(obstacle);
  });

  fill(0);
  textSize(16);
  text(`Items Collected: ${collectedItems}`, 10, 20);
}






function displayCollisionGame() {
  image(heavenImage, 0,0,600,400);

  
  // Apply visual effect for collision
  if (bounceEffect) {
    background(255, 100, 100); 
    effectTimer++;
    if (effectTimer > 10) {
      bounceEffect = false; 
    }
  } else {
   
  }

  // Display message in the top-left corner
  fill(0);
  textSize(16);
  
  text("Click the frame and start moving", 320, 30);


  let speed = 5; //  speed
  
  if (keyIsDown(UP_ARROW)) {
    player.y -= speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    player.y += speed;
  }
  if (keyIsDown(LEFT_ARROW)) {
    player.x -= speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.x += speed;
  }

  // Constrain player range
  player.x = constrain(player.x, playerSize / 2, width - playerSize / 2);
  player.y = constrain(player.y, playerSize / 2, height - playerSize / 2);
  
 let playerCenterX = player.x + 160 / 2; 
let playerCenterY = player.y + 130 / 2; 

  
  let sensitivity = 10;


  fill(0, 0, 255);
  image(didiImage,player.x-8,player.y-8, 100,80);



  fill(0, 255, 0);
  for (let i = 0; i < items.length; i++) {
    if (items[i]) {
      //////////////////////////////////////////////////////////////////////
      image(dogToyImage,items[i].x, items[i].y, itemSize*2, itemSize*2);
      
//       ellipse(items[i].x, items[i].y, itemSize);
    }
  }

  
  fill(255, 0, 0);
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    image(toyImage, obs.pos.x, obs.pos.y, obstacleSize*1.5, obstacleSize*1.5);

   
    obs.pos.add(obs.speed);

   
    if (obs.pos.x <= 0 || obs.pos.x >= width - obstacleSize) {
      obs.speed.x *= -1;
    }
    if (obs.pos.y <= 0 || obs.pos.y >= height - obstacleSize) {
      obs.speed.y *= -1;
    }

    // Check for collision 
    if (dist(player.x, player.y, obs.pos.x + obstacleSize / 2, obs.pos.y + obstacleSize / 2) < (obstacleSize / 2 + playerSize / 2)) {
      bouncePlayer(obs); // Bounce away
    }
  }

  // Check for collision with items
  for (let i = 0; i < items.length; i++) {
    if (items[i] && dist(player.x, player.y, items[i].x, items[i].y) < (itemSize / 1.5 + playerSize / 1.5)) {
      items[i] = null; 
      collectedItems++;
    }
  }

  fill(0);
  textSize(16);
  text(`Items Collected: ${collectedItems}`, 430, 50);

  // Check win condition
  if (collectedItems === 4) {
   image(winImage,0,0, 600,400);
    // fill(0);
    // textSize(32);
    // textAlign(CENTER, CENTER);
    // text("You Win!", width / 2, height / 2);
    noLoop(); // Stop the game loop
  }
}

function bouncePlayer(obstacle) {
  bounceEffect = true;
  effectTimer = 0;

  // Calculate bounce direction (away from obstacle)
  let bounceDirection = p5.Vector.sub(player, obstacle.pos).normalize();
  player.add(bounceDirection.mult(50)); // Push the player away
  player.x = constrain(player.x, playerSize / 2, width - playerSize / 2); // Keep player inside canvas
  player.y = constrain(player.y, playerSize / 2, height - playerSize / 2);

}









function displayPhotoGame() {
  
    bGVideo.loop(); 
   
  image(bGVideo, 0, 0, width, height);

  for (let shape of shapes) {
    if (shape.isSpecial) {
    
    }
    

  
    shape.x += shape.dx;
    shape.y += shape.dy;


    if (shape.x - shape.w / 2 < 0 || shape.x + shape.w / 2 > width) shape.dx *= -1;
    if (shape.y - shape.h / 2 < 0 || shape.y + shape.h / 2 > height) shape.dy *= -1;
  }
  
 multiCircleDraw();
  noStroke();
push();
  fill(250);
  textSize(16);
  textAlign(CENTER);
  text(`Score: ${score}`, width / 2, 30);
  text("Press 'R' to return to the main room.", width / 2, 50);
  pop();
  
   if (shapes.length === 0) {
    currentScene = 3; // Transition to the maze
    playerX = 1; // Reset player position in the maze
    playerY = 1;
  }
}


function handleVideoEnd() {
 
  bGVideo.loop();
}






// function displayPhotoGame() {
//      {
//     bGVideo.loop(); 
//   }
//    bGVideo.hide();
//    image(bGVideo, 0, 0, width, height);

 
//   multiCircleDraw();
//   noStroke();
//   fill(0);
//   textSize(16);
//   textAlign(CENTER);
//   text(`Score: ${score}`, width / 2, 30);
//   text("Press 'R' to return to the main room.", width / 2, 50);
  
//    if (shapes.length === 0) {
//     currentScene = 3; // Transition to the maze
//     playerX = 1; // Reset player position in the maze
//     playerY = 1;
//   }
// }








function multiCircleDraw() {
  for (let shape of shapes) {

    if (shape.isSpecial) {
      stroke(0);
      strokeWeight(0.1); 
    } else {
      noStroke(); 
    }


    if (shape.image) { 
      image(
        shape.image, 
        shape.x - shape.w / 2, 
        shape.y - shape.h / 2, 
        shape.w, 
        shape.h  
      );
    } 

 
    shape.x += shape.dx;
    shape.y += shape.dy;

    
    if (shape.x - shape.w / 2 < 0 || shape.x + shape.w / 2 > width) shape.dx *= -1;
    if (shape.y - shape.h / 2 < 0 || shape.y + shape.h / 2 > height) shape.dy *= -1;
  }
}






function initializeShapes() {
  shapes = [];
  for (let i = 0; i < shapeCount*1.5; i++) {
    shapes.push({
      x: random(50, width - 50), 
      y: random(50, height - 50), 
      w: random(40, 150), 
      h: random(60, 180), 
      dx: random(-2, 2) || 1, 
      dy: random(-2, 2) || 1, 
      isSpecial: random() > 0.9, 
      image: random() > 0.5 ? didiAImage : meImage, 
    });
  }

}





// function initializeShapes() {
//   shapes = [];
//   for (let i = 0; i < shapeCount; i++) {
//     shapes.push(createRandomCircle(random(50, width - 50), random(50, height - 50)));
//   }

//   
//   specialCircle = createRandomCircle(random(50, width - 50), random(50, height - 50), true);
//   shapes.push(specialCircle);
// }

function displayEmptyScene() {
  background(50, 100, 200); 
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text("You found the hidden circle!", width / 2, height / 2);
  text("Press 'R' to return to the main room.", width / 2, height / 2 + 50);
}


let colorChangeTimer = 0; // Timer for controlling color changes
let currentColors = [];  // Store current colors for each wall block
let wallColors = []; // Store dynamic colors for each wall block
let targetColors = []; // Store target colors for smooth transitions
function displayMaze() {
  // Draw the maze background
  image(bg2Image, 0, -120, 1210, 800);

  // Initialize colors for walls
  if (wallColors.length === 0) {
    for (let y = 0; y < maze.length; y++) {
      wallColors[y] = [];
      targetColors[y] = [];
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 1) {
          // Initial random color and target color
          wallColors[y][x] = color(random([255, 0]), random([255, 255, 0]), random([0, 255]), 150);
          targetColors[y][x] = color(random([255, 0]), random([255, 255, 0]), random([0, 255]), 150);
        }
      }
    }
  }

  // Gradually transition colors
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 1) {
        wallColors[y][x] = lerpColor(wallColors[y][x], targetColors[y][x], 0.02); // Smooth transition

        // Change target color periodically
        if (frameCount % 80 === 0) {
          targetColors[y][x] = color(random([255, 0]), random([255, 255, 0]), random([0, 255]), 150);
        }
      }
    }
  }

  // Explicitly set stroke properties to ensure borders are consistent
  stroke(0); // Black stroke
  strokeWeight(0.5); // Stroke thickness

  // Draw the maze grid
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 1) {
        fill(wallColors[y][x]); 
      } else {
        fill(240, 150); // Semi-transparent 
      }
      rect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  // Draw the logos
  image(logo1Image, 46, 45, 30, 30); 
  image(logo2Image, 326, 326, 30, 30); 

  // Draw the player
  image( scholarImage, playerX * cellSize + cellSize / 7,   playerY * cellSize + cellSize / 7,  37,  37  );


  fill(0);
  textSize(12);
  text("Press 'R' to return to the main room", 200, height - 10);
  text("Grade1-12 to College", 200, height - 25);

  // Check if the player has reached the goal
  if (playerX === maze[0].length - 2 && playerY === maze.length - 2) {
    currentScene = 2; // Change scene when the player reaches the goal
  }
}




function displaySubSpace(sceneIndex) {
  background(100 + sceneIndex * 20, 100, 200);
  fill(255);
  textSize(18);
  text(`Welcome to Sub-space ${sceneIndex - 3}`, 50, 50);
  text("Press 'B' to return to the photo scene.", 50, 80);
  text("Press 'R' to return to the main room.", 50, 110);
}





function keyPressed() {
  if (key === 'r' || key === 'R') {
    currentScene = 0;
    initializeShapes();
    playerX = 1;
    playerY = 1;
  } else if (currentScene === 3) {
    if (keyCode === LEFT_ARROW && maze[playerY][playerX - 1] === 0) {
      playerX--;
    } else if (keyCode === RIGHT_ARROW && maze[playerY][playerX + 1] === 0) {
      playerX++;
    } else if (keyCode === UP_ARROW && maze[playerY - 1][playerX] === 0) {
      playerY--;
    } else if (keyCode === DOWN_ARROW && maze[playerY + 1][playerX] === 0) {
      playerY++;
    }
  } else if (key === 'b' || key === 'B') {
    if (currentScene >= 4 && currentScene <= 8) {
      currentScene = 1;
    }
  }
}





function createRandomCircle(x, y, isSpecial = false) {
  return {
    x,
    y,
    w: random(50, 150),
    h: random(50, 150),
    dx: random(-2, 2) || 1,
    dy: random(-2, 2) || 1,
    isSpecial // Added missing comma before this property
  };
}





function mousePressed() {
   if (currentScene === 0) {
    if (dist(mouseX, mouseY, 200, 200) < 50) {
      currentScene = 1; 
    }
  } else if (currentScene === 1) {
    for (let i = shapes.length - 1; i >= 0; i--) {
      let shape = shapes[i];
      
      if (shape && dist(mouseX, mouseY, shape.x, shape.y) < Math.max(shape.w, shape.h) / 2) {
        if (shape.isSpecial) {
          currentScene = 3; // switch to maze game
          shapes = []; 
        } else {
          score += 10; 
          shapes.splice(i, 1); 
        }
      }
    }
  }


   if (currentScene === 0) {
    if (mouseX > 160 && mouseX < 240 && mouseY > 160 && mouseY < 240) {
      currentScene = 1; 
    } else if (mouseX > 365 && mouseX < 435 && mouseY > 165 && mouseY < 235) {
      currentScene = 2; 
    } else if (mouseX > 260 && mouseX < 340 && mouseY > 260 && mouseY < 340) {
      currentScene = 3; 
    }
  }
}
