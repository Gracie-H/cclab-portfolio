// const waveSketch = (p) => {
//     let waveY = [];
//     let cols = 100;
//     let amplitude = 50;
//     let offset = 0;
  
//     p.setup = () => {
//       let canvas = p.createCanvas(400, 400);
//       canvas.parent('gameCanvas1');
  
//       // ✅ 保证 canvas 不遮挡按钮
//       canvas.style('z-index', '-1');
//       canvas.style('position', 'absolute');
//       canvas.style('pointer-events', 'none');
  
//       for (let i = 0; i < cols; i++) {
//         waveY[i] = 200;
//       }
//     };
  
//     p.draw = () => {
//       p.background('#e1f5fe');
//       p.noStroke();
  
//       for (let i = 0; i < cols; i++) {
//         let x = (i / cols) * p.width;
//         let y = waveY[i];
//         p.fill('#4fc3f7');
//         p.rect(x, y, p.width / cols + 1, p.height - y);
//       }
  
//       offset += 0.01;
  
//       for (let i = 0; i < cols; i++) {
//         let wave = p.sin(offset + i * 0.2) * amplitude;
//         waveY[i] = p.lerp(waveY[i], 200 + wave, 0.05);
//       }
  
//       if (p.mouseIsPressed && p.mouseY < p.height) {
//         let index = p.floor((p.mouseX / p.width) * cols);
//         if (index >= 0 && index < cols) {
//           waveY[index] = p.mouseY;
//         }
//       }
//     };
//   };
  