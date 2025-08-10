const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  drawGrid();
}

function drawGrid() {
  const step = 10; // 10px per grid line (10mm)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= canvas.width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
