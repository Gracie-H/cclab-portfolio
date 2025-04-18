window.addEventListener("DOMContentLoaded", () => {
  new p5(sketch, 'visual-container');
});

const sketch = (p) => {
  let particles = [];
  let exploded = false;
  let centerX, centerY;
  let healingColor;

  p.setup = () => {
    const canvas = p.createCanvas(300, 300);
    canvas.parent('visual-container');
    centerX = p.width / 2;
    centerY = p.height / 2;
    p.noStroke();
    setHealingColor(p);
    createParticles(p);
  };

  p.draw = () => {
    p.clear();
    for (let particle of particles) {
      if (exploded) particle.explode();
      else particle.reset();
      particle.update();
      particle.display(p);
    }
    if (!exploded) {
      p.fill(healingColor);
      p.ellipse(centerX, centerY, 120);
    }
  };

  p.mousePressed = () => {
    const d = p.dist(p.mouseX, p.mouseY, centerX, centerY);
    if (d < 80) exploded = true;
  };

  function setHealingColor(p) {
    const mood = document.getElementById('suggestion').innerText;
    if (mood.includes('reset')) healingColor = p.color('#b0bec5');
    else if (mood.includes('stillness')) healingColor = p.color('#bbdefb');
    else if (mood.includes('static')) healingColor = p.color('#ffcdd2');
    else if (mood.includes('flowing')) healingColor = p.color('#c8e6c9');
    else healingColor = p.color('#dcedc8');
  }

  function createParticles(p) {
    for (let i = 0; i < 300; i++) {
      const angle = p.random(p.TWO_PI);
      const r = p.random(10, 40);
      const x = centerX + p.cos(angle) * r;
      const y = centerY + p.sin(angle) * r;
      particles.push(new Particle(x, y, p));
    }
  }

  class Particle {
    constructor(x, y, p) {
      this.origin = p.createVector(x, y);
      this.pos = this.origin.copy();
      this.vel = p5.Vector.random2D().mult(p.random(1, 4));
      this.size = p.random(3, 6);
      this.alpha = 255;
      this.c = healingColor;
    }
    explode() { this.pos.add(this.vel); this.alpha -= 2; }
    reset() { this.pos.lerp(this.origin, 0.1); this.alpha = 255; }
    update() { this.vel.mult(0.98); }
    display(p) {
      p.fill(p.red(this.c), p.green(this.c), p.blue(this.c), this.alpha);
      p.ellipse(this.pos.x, this.pos.y, this.size);
    }
  }
};
