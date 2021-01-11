var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

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

// variables for game
stage = "title";

// setting for ctx
ctx.textAlign = "center";

// game loop
function draw() {
    // clear whole canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (stage === "title") {
        // fill whole canvas with black
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw title at center
        ctx.font = "50px serif";
        ctx.fillStyle = "white";
        ctx.fillText("Room:X", 450, 100);

        // draw start button
        if (
            mouse.x - 300 > 0 &&
            mouse.x - 600 < 0 &&
            mouse.y - 200 > 0 &&
            mouse.y - 250 < 0
        ) {
            var backgroundColor = "#222222";
            var textColor = "white";
        } else {
            var backgroundColor = "white";
            var textColor = "black";
        }
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(300, 200, 300, 50);
        ctx.fillStyle = textColor;
        ctx.font = "25px serif";
        ctx.fillText("Start", 450, 235);
    } else if (stage === "game") {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "50px serif";
        ctx.fillText("Game stage", 450, 100);
    }
}

function update() {
    if (
        mouse.x - 300 > 0 &&
        mouse.x - 600 < 0 &&
        mouse.y - 200 > 0 &&
        mouse.y - 250 < 0 &&
        mouse.down
    ) {
        stage = "game";
    }
}

var gameloop = () => {
    update();
    draw();
};
var interval = setInterval(gameloop, 15);
