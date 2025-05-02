// const treeSketch = (p) => {
//     let tree = [];
//     let grown = false;
//     let growStart;
  
//     p.setup = () => {
//       const canvas = p.createCanvas(400, 400);
//       canvas.parent('gameCanvas2');
  

//       canvas.style('z-index', '-1');
//       canvas.style('position', 'absolute');
//       canvas.style('pointer-events', 'none');
  
//       p.background(245);
//     };
  
//     p.draw = () => {
//       p.background('#f1f8e9');
//       p.fill('#2e7d32');
//       p.rect(0, p.height - 20, p.width, 20);
  
//       if (grown) {
//         let progress = p.constrain((p.millis() - growStart) / 5000, 0, 1);
//         for (let branch of tree) {
//           branch.update(progress);
//           branch.display();
//         }
//       }
//     };
  
//     p.mousePressed = () => {
//       if (!grown) {
//         generateTree(p);
//         grown = true;
//         growStart = p.millis();
//       }
//     };
  
//     function generateTree(p) {
//       let base = p.createVector(p.width / 2, p.height - 20);
//       tree.push(new Branch(p, base, -p.HALF_PI, 80, 8));
//     }
  
//     class Branch {
//       constructor(p, pos, angle, len, level) {
//         this.p = p;
//         this.pos = pos;
//         this.angle = angle;
//         this.len = len;
//         this.level = level;
//         this.children = [];
//         this.grown = false;
//       }
  
//       update(progress) {
//         if (!this.grown && this.level > 0 && progress > (1 - this.level * 0.1)) {
//           let end = this.p.createVector(
//             this.pos.x + this.p.cos(this.angle) * this.len,
//             this.pos.y + this.p.sin(this.angle) * this.len
//           );
//           this.children.push(new Branch(this.p, end, this.angle - 0.4, this.len * 0.7, this.level - 1));
//           this.children.push(new Branch(this.p, end, this.angle + 0.4, this.len * 0.7, this.level - 1));
//           this.grown = true;
//         }
//         for (let c of this.children) c.update(progress);
//       }
  
//       display() {
//         let end = this.p.createVector(
//           this.pos.x + this.p.cos(this.angle) * this.len,
//           this.pos.y + this.p.sin(this.angle) * this.len
//         );
//         this.p.stroke(60);
//         this.p.strokeWeight(this.level);
//         this.p.line(this.pos.x, this.pos.y, end.x, end.y);
//         for (let c of this.children) c.display();
//       }
//     }
//   };
  