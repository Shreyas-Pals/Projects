const socket = io();
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

function draw(x, y, color) {
    ctx.fillStyle = color;             
    ctx.fillRect(x, y, 2, 2);         
}

function connect(x1,y1,x2,y2){
    ctx.strokeStyle = "red";    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

socket.on('pixel_update_message', (data) => {
    draw(data.x,data.y,data.color)
})

/** @type {HTMLCanvasElement} */
let prevX = null;
let prevY = null;

canvas.addEventListener("mousemove", (e) => {
    if (e.buttons !== 1) {
        prevX = null;
        prevY = null;
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (prevX !== null && prevY !== null) {
        connect(prevX,prevY,x,y);
    }

    socket.emit("pixel_update_sent", {x, y, color: "red"});

    prevX = x;
    prevY = y;
});
