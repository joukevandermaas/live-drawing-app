"use strict"

const canvas = document.getElementById("this-is-it");
const ctx = canvas.getContext('2d');

let mouseDown = false;
let rainbow = false;

let components = {
    r: 255,
    g: 0,
    b: 0
}

let lastX = -1;
let lastY = -1;

let origColor = '';
let color = '';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const connection = new signalR.HubConnection('/draw');

connection.on('draw', (prevX, prevY, x, y, color) => {
    drawLine(prevX, prevY, x, y, color);
});

connection.on('clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

connection.on('initialize', (lines, c) => {
    color = c;
    origColor = c;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let from = line.from;
        let to = line.to;

        drawLine(from.x, from.y, to.x, to.y, line.color);
    }
});

connection.on('redraw', (lines) => {
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let from = line.from;
        let to = line.to;

        drawLine(from.x, from.y, to.x, to.y, line.color);
    }
});

connection.start();


function drawLine(x1, y1, x2, y2, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function normalizeEvent(e) {   
    let rect = canvas.getBoundingClientRect();
    if (e.changedTouches) {
        return [
            e.changedTouches[0].clientX - rect.left,
            e.changedTouches[0].clientY - rect.top
        ]
    } else {
        return [ 
            e.clientX - rect.left,
            e.clientY - rect.top
        ];
    }
}

function handleStart(e) {
    e.preventDefault();
    let positions = normalizeEvent(e);

    mouseDown = true;
    lastX = positions[0];
    lastY = positions[1];
}

function handleEnd() {    
    mouseDown = false;
}

function handleMove(e) {
    if (mouseDown) {
        let [x, y] = normalizeEvent(e);

        if (rainbow) {
            let { r, g, b } = components;
            let step = 5;

            if (r >= 255 || (r > 0 && g > 0)) {
                components.r -= step;
                components.g += step;
            }
            if (g >= 255 || (g > 0 && b > 0)) {
                components.g -= step;
                components.b += step;
            }           
            if (b >= 255 || (b > 0 && r > 0)) {
                components.b -= step;
                components.r += step;
            }

            for (let comp in components) {
                if (components[comp] > 255) {
                    components[comp] = 255;
                }
                if (components[comp] < 0) {
                    components[comp] = 0;
                }
            }


            color = `rgb(${components.r}, ${components.g}, ${components.b})`;
        }
        

        drawLine(lastX, lastY, x, y, color);
        connection.invoke('draw', lastX, lastY, x, y, color);

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

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    connection.invoke('redraw');
}

function toggleRainbow() {
    rainbow = !rainbow;
    color = origColor;
    components = {
        r: 255,
        g: 0,
        b: 0
    }
}

document.onkeyup = (e) => {
    if (e.key === 'k') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        connection.invoke('clear');

    }
    if (e.key === 'r') {
        toggleRainbow();
    }
    if (e.key === 'd') {;
        let data = canvas.toDataURL('image/png');

        connection.invoke('image', data);
    }
}