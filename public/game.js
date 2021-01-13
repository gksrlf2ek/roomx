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

// helper function
function pos2iso(position, sizex, sizey) {
    var modpos = { x: position.x - canvas.width / 2, y: position.y - canvas.height / 2 };
    var v = Math.floor(modpos.y / sizey + modpos.x / sizex);
    var w = Math.floor(modpos.y / sizey - modpos.x / sizex);
    return { x: v, y: w };
}

function iso2pos(iso, sizex, sizey) {
    var x = (sizex / 2) * (iso.x - iso.y);
    var y = (sizey / 2) * (iso.x + iso.y);
    return { x: x + canvas.width / 2, y: y + canvas.height / 2 };
}

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
function Sprite(img, x, y, degree, scalex, scaley) {
    ctx.translate(x, y);
    if (degree) {
        ctx.rotate(degree * (Math.PI / 180));
    }
    ctx.scale(scalex || 1, scaley || 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.scale(1, 1);
    if (degree) {
        ctx.rotate(-degree * (Math.PI / 180));
    }
    ctx.translate(-x, -y);
}
function Room(x, y, size, color, left, right, bottom) {
    ctx.strokeStyle = color || "white";
    var k = (Math.tan(Math.PI / 3) * size) / 2;
    // color
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - size);
    ctx.lineTo(x - k, y - size / 2);
    ctx.lineTo(x - k, y + size / 2);
    ctx.lineTo(x, y);
    ctx.fillStyle = left || "black";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - size);
    ctx.lineTo(x + k, y - size / 2);
    ctx.lineTo(x + k, y + size / 2);
    ctx.lineTo(x, y);
    ctx.fillStyle = right || left || "black";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + k, y + size / 2);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - k, y + size / 2);
    ctx.lineTo(x, y);
    ctx.fillStyle = bottom || right || left || "black";
    ctx.fill();
    // line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - size);
    ctx.lineTo(x - k, y - size / 2);
    ctx.lineTo(x - k, y + size / 2);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x + k, y + size / 2);
    ctx.lineTo(x, y);
    ctx.lineTo(x - k, y + size / 2);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + k, y - size / 2);
    ctx.lineTo(x + k, y + size / 2);
    ctx.stroke();
}
function IsoTile(x, y, sizex, sizey, color) {
    ctx.fillStyle = color || "white";
    ctx.beginPath();
    ctx.moveTo(iso2pos({ x: x, y: y }, sizex, sizey).x, iso2pos({ x: x, y: y }, sizex, sizey).y);
    ctx.lineTo(iso2pos({ x: x, y: y + 1 }, sizex, sizey).x, iso2pos({ x: x, y: y + 1 }, sizex, sizey).y);
    ctx.lineTo(iso2pos({ x: x + 1, y: y + 1 }, sizex, sizey).x, iso2pos({ x: x + 1, y: y + 1 }, sizex, sizey).y);
    ctx.lineTo(iso2pos({ x: x + 1, y: y }, sizex, sizey).x, iso2pos({ x: x + 1, y: y }, sizex, sizey).y);
    ctx.lineTo(iso2pos({ x: x, y: y }, sizex, sizey).x, iso2pos({ x: x, y: y }, sizex, sizey).y);
    ctx.fill();
}

// configurations
var stage = "title";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

// images
var total = 1;
var player = new Image();
player.src = "./img/player.png";
player.onload = () => total--;

// stages
function titleStage() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    Label("Room:X", "50px serif", 450, 100, "white");
    if (Button("Start", "25px serif", 300, 200, 300, 50, "black", "white", "white", "#222222")) {
        stage = "game";
    }
}

function gameStage() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    Room(450, 250, 100, "white", "#888888", "#bbbbbb", "#eeeeee");
    IsoTile(pos2iso(mouse, 86.6, 50).x, pos2iso(mouse, 86.6, 50).y, 86.6, 50, "white");
}

// main loop
function update() {
    // clear whole canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (stage) {
        case "title":
            titleStage();
            break;
        case "game":
            gameStage();
            break;
    }
}

var loadChecker = setInterval(() => {
    if (total === 0) {
        setInterval(update, 100);
        clearInterval(loadChecker);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillText("Loading...", 450, 250);
    }
}, 100);
