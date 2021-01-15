var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// mouse position
var mouse = { x: 0, y: 0, down: false, pressed: false };
addEventListener("mousemove", (e) => {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
});
addEventListener("mousedown", (e) => {
    mouse.down = true;
    mouse.pressed = true;
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
function Button(text, font, x, y, w, h, textColor, textHighlight, boxColor, boxHighlight, option) {
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

    return hover && (option ? mouse[option] : mouse.pressed);
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
    var k = size;
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

var item = null;
var furniture = [];
var coins = 30;

var x = canvas.width / 2;
var y = canvas.height / 2;
var rot = 0;
var dodgeballs = [];

ctx.textAlign = "center";
ctx.textBaseline = "middle";

// images
var total = 3;
var player = new Image();
player.src = "./img/player.png";
player.onload = () => total--;
var box = new Image();
box.src = "./img/box.png";
box.onload = () => total--;
box.price = 3;
var chair = new Image();
chair.src = "./img/chair.png";
chair.onload = () => total--;
chair.price = 10;

// stages
function titleStage() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    Label("Room:X", "50px serif", 450, 100, "white");
    if (Button("Start", "25px serif", 300, 200, 300, 50, "black", "white", "white", "#222222")) {
        stage = "room";
        item = box;
    }
}

function roomStage() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    Room(450, 250, 96, "white", "#888888", "#bbbbbb", "#eeeeee");

    // button for chainging item to place
    if (Button("box", "25px serif", 100, 450, 150, 50, "white", "black", "#222222", "white")) {
        item = box;
    }
    if (Button("chair", "25px serif", 300, 450, 150, 50, "white", "black", "#222222", "white")) {
        item = chair;
    }

    // button for gaming
    if (Button("dodge", "20px serif", 400, 25, 100, 50, "black", "white", "white", "#222222")) {
        stage = "dodge";
    }

    // if mouse is clicked and inside of view (not in buttons' area), add item in furniture and sort
    var pos = iso2pos(pos2iso({ x: mouse.x, y: mouse.y }, 64, 32), 64, 32);
    if (mouse.pressed && mouse.y < 450 && mouse.y > 100 && coins > item.price && !furniture.find((v) => v.x === pos.x && v.y === pos.y)) {
        pos.img = item;
        coins -= item.price;
        furniture.push(pos);
        furniture.sort((a, b) => a.y - b.y);
    }

    // draw every furnitures
    for (let i = 0; i < furniture.length; i++) {
        Sprite(furniture[i].img, furniture[i].x, furniture[i].y);
    }

    // draw furniture position guide only if mouse is not in buttons' area
    if (mouse.y < 450 && mouse.y > 100) {
        var pos = { x: mouse.x, y: mouse.y };
        IsoTile(pos2iso(pos, 64, 32).x, pos2iso(pos, 64, 32).y, 64, 32, "red");
    }

    // draw UI
    ctx.fillStyle = "#888888";
    ctx.fillRect(10, 10, 80, 80);
    Sprite(item, 50, 50);

    ctx.fillStyle = "white";
    ctx.font = "15px serif";
    ctx.fillText(item.price, 20, 20);

    ctx.fillStyle = "white";
    ctx.font = "25px serif";
    ctx.fillText(coins, 850, 50);
}

function dodgeStage() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw player
    Sprite(player, x, y, rot);

    // draw interface
    if (Button("<", "25px serif", 775, 425, 50, 50, "white", "black", "#222222", "white", "down")) {
        rot -= 4;
    }
    if (Button(">", "25px serif", 825, 425, 50, 50, "white", "black", "#222222", "white", "down")) {
        rot += 4;
    }

    // draw dodge balls
    for (let i = 0; i < dodgeballs.length; i++) {
        ctx.fillStyle = dodgeballs[i].color;
        ctx.fillRect(dodgeballs[i].x - 2, dodgeballs[i].y - 2, 4, 4);
    }

    // create dodge ball
    if (Math.random() < 0.1) {
        var ball = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            color: ["red", "yellow", "green"][Math.floor(Math.random() * 3)],
            dir: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 },
        };
        var rnd = Math.random();
        if (rnd < 0.25) {
            ball.x = 0;
        } else if (rnd < 0.5) {
            ball.x = canvas.width;
        } else if (rnd < 0.75) {
            ball.y = 0;
        } else {
            ball.y = canvas.height;
        }
        dodgeballs.push(ball);
    }

    // move dodge ball
    for (let i = dodgeballs.length - 1; i >= 0; i--) {
        dodgeballs[i].x += dodgeballs[i].dir.x;
        dodgeballs[i].y += dodgeballs[i].dir.y;
        if (dodgeballs[i].x < 0 || dodgeballs[i].y < 0 || dodgeballs[i].x > canvas.width || dodgeballs[i].y > canvas.height) {
            dodgeballs.splice(i, 1);
        }
    }

    // check if ball hits player
    for (let i = 0; i < dodgeballs.length; i++) {
        if (Math.abs(x - dodgeballs[i].x) < (player.width + 4) / 2 && Math.abs(y - dodgeballs[i].y) < (player.height + 4) / 2) {
            ctx.fillStyle = "white";
            ctx.font = "25px serif";
            ctx.fillText("hit", canvas.width / 2, 100);
        }
    }
}

// main loop
function update() {
    // clear whole canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (stage) {
        case "title":
            titleStage();
            break;
        case "room":
            roomStage();
            break;
        case "dodge":
            dodgeStage();
            break;
    }

    mouse.pressed = false;
}

var loadChecker = setInterval(() => {
    if (total === 0) {
        setInterval(update, 15);
        clearInterval(loadChecker);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillText("Loading...", 450, 250);
    }
}, 100);
