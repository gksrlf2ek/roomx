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

// components
function Label(text, font, x, y, color) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}
function Button(text, font, x, y, w, h, textColor, textHighlight, boxColor, boxHighlight) {
    var hover = mouse.x > x && mouse.x < x + w && mouse.y > y && mouse.y < y + h;
    if (hover) {
        var boxColor = boxHighlight;
        var textColor = textHighlight;
    }
    ctx.font = font;
    ctx.fillStyle = boxColor;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = textColor;
    ctx.fillText(text, x + w / 2, y + h / 2);

    return hover && mouse.down;
}

// variables for game
stage = "title";

// setting for ctx
ctx.textAlign = "center";
ctx.textBaseline = "middle";

// game loop
function update() {
    // clear whole canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (stage === "title") {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        Label("Room:X", "50px serif", 450, 100, "white");
        if (Button("Start", "25px serif", 300, 200, 300, 50, "black", "white", "white", "#222222")) {
            stage = "game";
        }
    } else if (stage === "game") {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        Label("Game stage", "50px serif", 450, 100, "white");
    }
}
var interval = setInterval(update, 15);
