function setup() {
  createCanvas(600, 600).parent("sketch-container");
}// Create screen reader accessible description


function draw() {
  background(192,192,192,10);
  //Set the fill color to red
  fill(240,30,0);
  //Draw a rectangle
  rectMode(CENTER);
  rect(width / 2.4, height / 1.95, 30000, 630);
  fill(250,250,250)
  rect(width / 2.2, height / 1.95, 30, 630);
  fill(250,250,250)
  rect(width / 13.4, height / 1.95, 300, 630);
  

  
  //set the fill color to grey
  fill(119,136,153)
  
  //draw circle as pupil 1
  // x, y, diameter
  push()
  fill(119,136,153)
  circle(374,250,47)
  fill(250,250,250)
  circle(374,250,23)
  pop()
  
  //draw circle as pupil z1
  circle(354,222,36)
  
  //draw circle as pupil z3
  push()
  fill(255,255,255)
  circle(323,216,36)
  push()
  fill(30,144,255)
  circle(330,216,16)
  pop()
  push()
  fill(250,250,250)
  circle(330,216,5)
  pop()

  
  //draw circle as pupil z2
  circle(300,220,26)
  push()
  fill(173,216,230)
  circle(300,220,16)
  pop()
  push()
  fill(173,216,230)
  circle(310,210,6)
  pop()
  
  //draw circle as pupil z4
  circle(280,231,24)
  
  push()
  //draw circle as pupil z5
  fill(30,144,255)
  circle(265,238,20)
  pop()
  
  
  //draw circle as pupil 2
  circle(367,284,27)
  fill(173,216,230)
  circle(367,284,17)
  pop()
  
  //draw circle as pupil 3
  fill(192,192,192)
  circle(345,312,45)
  fill(250,250,250)
  circle(345,312,25)
  fill(119,136,153)
  circle(345,322,8)
  fill(30,144,255)
  circle(335,302,5)
  fill(173,216,230)
  circle(355,302,10)
  
  
  
  //draw circle as pupil 4
  fill(135,206,235)
  circle(317,338,35)
  push()
  fill(119,136,153)
  circle(327,328,18)
  pop()
  push()
  fill(250,250,250)
  circle(327,328,8)
  pop()

  
 

  
  //draw circle as pupil 5
  push();
  fill(119,136,153)
  circle(286,354,39)
  fill(250,250,250)
  circle(286,354,29)
  fill(119,136,153)
  circle(286,354,22)
  fill(30,144,255)
  circle(286,354,9)
  pop()
  
  push();
  //draw circle as pupil 6
  circle(246,364,49)
  fill(250,250,250)
  circle(246,374,20)
  fill(30,144,255)
  circle(236,354,12)
  pop()
  
  //draw circle as pupil 7
  push();
  fill(255,255,255)
  circle(210,360,34)
  fill(173,216,230)
  circle(210,360,14)

  
  
  //draw circle as pupil 8
  fill(173,216,230)
  circle(190,344,27)
  circle(190,344,15)
  pop()
 
  
  //draw circle as pupil 9
  push()
  fill(119,136,153)
  circle(190,324,20)
  pop()
  
  //draw circle as pupil 10
  circle(198,308,27)
  fill(250,250,250)
  circle(198,308,9)
  
  push()
  //draw circle as pupil 11
  fill(30,144,255)
  circle(210,291,23)
  pop()
  
   //draw circle as pupil 12
  circle(220,276,25)
  
  //draw circle as pupil 13
  fill(250,250,250)
  circle(234,260,20)
  push()
  fill(119,136,153)
  circle(234,260,10)
  pop()
  
  //draw circle as pupil z5
  circle(250,248,23)
  push()
  fill(250,250,250)
  circle(250,248,16)
  pop()

   
  //draw circle as pupil z5
  circle(250,248,10)
}