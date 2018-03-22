const canvas = document.getElementById("this-is-it");
const ctx = canvas.getContext('2d');

let isMouseDown = false;

let lastX = -1;
let lastY = -1;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const connection = new signalR.HubConnection('/draw');

connection.on('draw', (prevX, prevY, x, y) => {
    drawLine(prevX, prevY, x, y);
});

connection.start();

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function normalizeEvent(e) {
    let x, y;

    if (e.changedTouches) {
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }

    return [x, y];
}

function handleStart(e) {
    e.preventDefault();
    let [x, y] = normalizeEvent(e);

    isMouseDown = true;
    lastX = x;
    lastY = y;
}

function handleEnd() {    
    isMouseDown = false;
}

function handleMove(e) {
    if (isMouseDown) {
        let [x, y] = normalizeEvent(e);
        
        drawLine(lastX, lastY, x, y);
        connection.invoke('draw', lastX, lastY, x, y);

        lastX = x;
        lastY = y;
    }
}

canvas.onmousedown = handleStart;
canvas.onmouseup = handleEnd;
canvas.onmousemove = handleMove;

canvas.addEventListener("touchstart", handleStart, false);
canvas.addEventListener("touchend", handleEnd, false);
canvas.addEventListener("touchmove", handleMove, false);