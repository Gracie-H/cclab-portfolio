// const peopleSketch = (p) => {
//     let people = [];
//     let wind = 0;
  
//     p.setup = () => {
//       let canvas = p.createCanvas(400, 400);
//       canvas.parent('gameCanvas3');
  
//       // ✅ 确保 canvas 不遮挡页面元素
//       canvas.style('z-index', '-1');
//       canvas.style('position', 'absolute');
//       canvas.style('pointer-events', 'none');
  
//       for (let i = 0; i < 30; i++) {
//         people.push(new Floater(p.random(p.width), p.random(-400, 0), p.random(0.5, 1.2)));
//       }
//     };
  
//     p.draw = () => {
//       p.background('#e3f2fd');
//       p.fill('#90caf9');
//       p.noStroke();
  
//       for (let f of people) {
//         f.update();
//         f.display();
//       }
  
//       p.fill(80);
//       p.textAlign(p.CENTER);
//       p.text('Move your mouse left/right to control the wind 🌬️', p.width / 2, p.height - 10);
//     };
  
//     p.mouseMoved = () => {
//       let direction = p.map(p.mouseX, 0, p.width, -1, 1);
//       wind = direction * 1.5;
//     };
  
//     class Floater {
//       constructor(x, y, speed) {
//         this.x = x;
//         this.y = y;
//         this.speed = speed;
//         this.size = p.random(20, 40);
//       }
  
//       update() {
//         this.x += wind * this.speed;
//         this.y += this.speed;
//         if (this.y > p.height + 20) {
//           this.y = p.random(-200, 0);
//           this.x = p.random(p.width);
//         }
//         if (this.x < -20) this.x = p.width + 20;
//         if (this.x > p.width + 20) this.x = -20;
//       }
  
//       display() {
//         p.push();
//         p.translate(this.x, this.y);
//         p.fill('#64b5f6');
//         p.ellipse(0, 0, this.size, this.size * 0.5); // umbrella
//         p.rect(-3, 0, 6, this.size); // person
//         p.pop();
//       }
//     }
//   };
  