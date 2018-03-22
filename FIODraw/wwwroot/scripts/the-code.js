"use strict"

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

connection.on('clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

connection.on('initialize', (lines) => {
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let from = line.from;
        let to = line.to;

        drawLine(from.x, from.y, to.x, to.y);
    }
});

connection.start().then(() => {
    connection.invoke('initialize');
});


function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function normalizeEvent(e) {   
    if (e.changedTouches) {
        return [
            x = e.changedTouches[0].clientX,
            y = e.changedTouches[0].clientY
        ]
    } else {
        return [ e.clientX, e.clientY ];
    }
}

function handleStart(e) {
    e.preventDefault();
    let positions = normalizeEvent(e);

    isMouseDown = true;
    lastX = positions[0];
    lastY = positions[1];
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

document.onkeyup = (e) => {
    if (e.key === 'k') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        connection.invoke('clear');

    }
    if (e.key === 'd') {
        document.body.innerHTML = canvas.toDataURL('image/png');
    }
}