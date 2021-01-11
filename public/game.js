var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// resize canvas according to window size
canvas.setAttribute("width", document.body.offsetWidth);
canvas.setAttribute("height", document.body.offsetHeight);
addEventListener("resize", (e) => {
    canvas.setAttribute("width", document.body.offsetWidth);
    canvas.setAttribute("height", document.body.offsetHeight);
});

// mouse position
var mouse = { x: 0, y: 0, down: false };
addEventListener("mousemove", (e) => {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
});
addEventListener("mousedown", (e) => {
    mouse.down = true;
});
addEventListener("mouseup", (e) => {
    mouse.down = false;
});

// game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (mouse.down) {
        // for test
        ctx.fillRect(mouse.x - 5, mouse.y - 5, 10, 10);
    }
}
var updateInterval = setInterval(update, 15);
