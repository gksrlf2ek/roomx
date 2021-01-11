var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// resize canvas according to window size
canvas.setAttribute("width", document.body.offsetWidth);
canvas.setAttribute("height", document.body.offsetHeight);
addEventListener("resize", (e) => {
    canvas.setAttribute("width", document.body.offsetWidth);
    canvas.setAttribute("height", document.body.offsetHeight);
});

// game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
var updateInterval = setInterval(update, 15);
