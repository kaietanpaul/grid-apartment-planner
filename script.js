 const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fit its container and redraw
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    render();
}

// Draw grid lines; each pixel is 1mm and lines every 10mm
function drawGrid() {
    const step = 10; // 10px per grid line (10mm)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    // vertical lines
    for (let x = 0; x <= canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    // horizontal lines
    for (let y = 0; y <= canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// State for drawn objects
let objects = [];
let isDrawing = false;
let startX = 0;
let startY = 0;
let previewRect = null;

// Initialize UI controls and list
function initUI() {
    const body = document.body;
    // controls container
    const controls = document.createElement('div');
    controls.id = 'controls';
    controls.style.padding = '8px';
    controls.style.background = '#f8f8f8';
    controls.style.display = 'flex';
    controls.style.flexWrap = 'wrap';
    controls.style.gap = '8px';
    controls.style.alignItems = 'center';

    // Name input
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Object name';
    nameInput.id = 'nameInput';
    nameInput.style.flex = '1 1 120px';

    // Color input
    const colorInput = document.createElement('input');    colorInput.type = 'color';
    colorInput.value = '#ff7f50';
    colorInput.id = 'colorInput';

    // Tile dimension inputs
    const tileWInput = document.createElement('input');
    tileWInput.type = 'number';
    tileWInput.placeholder = 'Tile width (mm)';
    tileWInput.id = 'tileWidthInput';
    tileWInput.min = 1;
    tileWInput.value = 100;
    tileWInput.style.width = '120px';

    const tileHInput = document.createElement('input');
    tileHInput.type = 'number';
    tileHInput.placeholder = 'Tile height (mm)';
    tileHInput.id = 'tileHeightInput';
    tileHInput.min = 1;
    tileHInput.value = 100;
    tileHInput.style.width = '120px';

    // Recalculate button
    const calcBtn = document.createElement('button');
    calcBtn.textContent = 'Recalculate Tiles';
    calcBtn.onclick = () => updateObjectsList();

    // Export button
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Layout';
    exportBtn.onclick = () => exportLayout();

    // Import file input
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.onchange = () => importLayout(importInput.files[0]);

    // Append controls
    controls.appendChild(nameInput);
    controls.appendChild(colorInput);
    controls.appendChild(tileWInput);
    controls.appendChild(tileHInput);
    controls.appendChild(calcBtn);
    controls.appendChild(exportBtn);
    controls.appendChild(importInput);

    body.insertBefore(controls, body.firstChild);

    // Objects list container
    const list = document.createElement('div');
    list.id = 'objectsList';
    list.style.padding = '8px';
    list.style.fontFamily = 'monospace';
    body.appendChild(list);
}

// Render canvas: grid, objects, preview
function render() {
    drawGrid();
    drawObjects();
    if (isDrawing && previewRect) {
        const color = document.getElementById('colorInput')?.value || '#ff0000';
        ctx.strokeStyle = color;
        ctx.setLineDash([5, 3]);
        ctx.lineWidth = 1;
        ctx.strokeRect(previewRect.x, previewRect.y, previewRect.w, previewRect.h);
        ctx.setLineDash([]);
    }
}

// Draw saved objects
function drawObjects() {
    objects.forEach(obj => {
        ctx.fillStyle = obj.color;
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
        ctx.fillStyle = '#000000';
        ctx.font = '12px sans-serif';
        ctx.fillText(obj.name || '', obj.x + 4, obj.y + 14);
    });
}

// Update list and calculate tiles
function updateObjectsList() {
    const tileWidth = parseFloat(document.getElementById('tileWidthInput').value) || 1;
    const tileHeight = parseFloat(document.getElementById('tileHeightInput').value) || 1;
    const list = document.getElementById('objectsList');
    list.innerHTML = '';
    objects.forEach((obj, index) => {
        const areaMM = Math.abs(obj.w) * Math.abs(obj.h);
        const tiles = Math.ceil(areaMM / (tileWidth * tileHeight));
        const div = document.createElement('div');
        div.textContent = `${index + 1}. ${obj.name || 'Object'} - Size: ${Math.round(obj.w)}mm x ${Math.round(obj.h)}mm, Tiles needed: ${tiles}`;
        list.appendChild(div);
    });
}

// Export current layout to JSON
function exportLayout() {
    const data = {
        objects: objects,
        tileWidth: parseFloat(document.getElementById('tileWidthInput').value) || 1,
        tileHeight: parseFloat(document.getElementById('tileHeightInput').value) || 1
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Import layout from JSON
function importLayout(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            objects = data.objects || [];
            document.getElementById('tileWidthInput').value = data.tileWidth || 100;
            document.getElementById('tileHeightInput').value = data.tileHeight || 100;
            updateObjectsList();
            render();
        } catch (err) {
            alert('Invalid file');
        }
    };
    reader.readAsText(file);
}

// Canvas drawing handlers
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    isDrawing = true;
    startX = x;
    startY = y;
    previewRect = { x, y, w: 0, h: 0 };
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    previewRect.w = x - startX;
    previewRect.h = y - startY;
    render();
});

canvas.addEventListener('mouseup', () => {
    if (!isDrawing) return;
    isDrawing = false;
    const name = document.getElementById('nameInput').value || 'Object';
    const color = document.getElementById('colorInput').value || '#ff0000';
    const obj = {
        name: name,
        color: color,
        x: previewRect.x,
        y: previewRect.y,
        w: previewRect.w,
        h: previewRect.h
    };
    objects.push(obj);
    previewRect = null;
    updateObjectsList();
    render();
});

// Initialize everything
window.addEventListener('resize', resizeCanvas);
initUI();
resizeCanvas();
updateObjectsList();
render();
