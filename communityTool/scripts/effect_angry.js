// Healing result effect for 'angry': red web with click-triggered explosive dissolve → ripple waves

let points = [];
let lines = [];
let exploded = false;
let rippleStarted = false;
let rippleStartTime = 0;
let ripples = [];
let clicksound;



function preload() {

  clickSound = loadSound('scripts/8.mp3');




}



function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  noFill();
  strokeWeight(1);
  initWeb();
}

function draw() {
  background(0, 15);

  if (!exploded && !rippleStarted) {
    for (let p of points) {
      p.x += p.vx * 1.5;
      p.y += p.vy * 1.5;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      fill(255, 80, 80, p.alpha);
      noStroke();
      ellipse(p.x, p.y, 6);
    }

    stroke(255, 80, 80, 80);
    for (let l of lines) {
      let a = points[l[0]];
      let b = points[l[1]];
      if (a.alpha > 0 && b.alpha > 0) {
        line(a.x, a.y, b.x, b.y);
      }
    }
  }

  if (exploded && !rippleStarted) {
    for (let p of points) {
      if (!p.exploded) {
        p.vx = random(-5, 5);
        p.vy = random(-5, 5);
        p.exploded = true;
      }
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 2;
      fill(255, 80, 80, p.alpha);
      noStroke();
      ellipse(p.x, p.y, 6);
    }

    stroke(255, 80, 80, 80);
    for (let l of lines) {
      let a = points[l[0]];
      let b = points[l[1]];
      if (a.alpha > 0 && b.alpha > 0) {
        line(a.x, a.y, b.x, b.y);
      }
    }

    if (points.every(p => p.alpha <= 0)) {
      if (!rippleStarted) {
        background(0);
        rippleStarted = true;
        rippleStartTime = millis() - 2000; // reduce wait to 1 second
        for (let i = 0; i < 200; i++) {
          ripples.push({
            r: 0,
            delay: i * 100,
            alpha: 255
          });
        }
      }
    }
  }

  if (rippleStarted) {
    background(0);
    let elapsed = millis() - rippleStartTime;
    for (let r of ripples) {
      if (elapsed > r.delay) {
        stroke(250, r.alpha); // soothing mint ripple color
        noFill();
        ellipse(width / 2, height / 2, r.r);
        r.r += 2;
        r.alpha -= 0.5;
        if (r.alpha <= 0) {
          r.r = 0;
          r.alpha = 255;
        }
      }
    }
  }
}

function mousePressed() {
  if (!exploded) exploded = true;

  if (clickSound && clickSound.isLoaded()) {
    clickSound.play();
  }
  
}

function initWeb() {
  points = [];
  lines = [];
  for (let i = 0; i < 16; i++) {
    points.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      ox: 0,
      oy: 0,
      exploded: false,
      alpha: 255
    });
  }
  for (let i = 0; i < points.length - 1; i++) {
    lines.push([i, i + 1]);
  }
  lines.push([0, points.length - 1]);
  for (let p of points) {
    p.ox = p.x;
    p.oy = p.y;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
