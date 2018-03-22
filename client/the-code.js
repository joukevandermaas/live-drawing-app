const canvas = document.getElementById("this-is-it");
const ctx = canvas.getContext('2d');

let isMouseDown = false;

let lastX = -1;
let lastY = -1;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.onmousedown = (e) => {
    isMouseDown = true;
    lastX = e.clientX;
    lastY = e.clientY;
}

canvas.onmouseup = () => {
    isMouseDown = false;
}
canvas.onmousemove = (e) => {
    if (isMouseDown) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();

        lastX = e.clientX;
        lastY = e.clientY;
    }
}