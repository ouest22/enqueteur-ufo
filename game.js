
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = { x: 50, y: 400, width: 30, height: 30, dx: 0, dy: 0, grounded: false, inForest: true };
const gravity = 0.5;
const friction = 0.8;
const keys = {};

const forestItems = [
    { x: 150, y: 350, width: 40, height: 40, name: "Mysterious Rock", description: "A strange, glowing rock." },
    { x: 300, y: 300, width: 40, height: 40, name: "Burn Mark", description: "A spot where the UFO might have landed." },
    { x: 450, y: 250, width: 40, height: 40, name: "Footprint", description: "Strange, alien-like footprint." }
];

const witnesses = [
    { x: 200, y: 450, name: "Old Farmer", dialog: "I saw something in the sky... could be a UFO." }
];

let foundItems = [];
let selectedItem = null;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update() {
    // Handle input
    if (keys["ArrowLeft"] || keys["left"]) player.dx = -3;
    if (keys["ArrowRight"] || keys["right"]) player.dx = 3;
    if ((keys[" "] || keys["jump"]) && player.grounded) {
        player.dy = -10;
        player.grounded = false;
    }

    // Apply gravity
    player.dy += gravity;
    player.dx *= friction;

    player.x += player.dx;
    player.y += player.dy;

    // Collision with forest items
    for (const item of forestItems) {
        if (player.x < item.x + item.width &&
            player.x + player.width > item.x &&
            player.y < item.y + item.height &&
            player.y + player.height > item.y) {
            if (!foundItems.includes(item.name)) {
                foundItems.push(item.name);
                selectedItem = item;
            }
        }
    }

    // Check if player is near witnesses
    for (const witness of witnesses) {
        if (player.x < witness.x + 50 && player.x + player.width > witness.x && player.y < witness.y + 50 && player.y + player.height > witness.y) {
            selectedItem = witness;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw forest background
    ctx.fillStyle = "#243c27";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = "#45322e";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw items in the forest
    forestItems.forEach(item => {
        ctx.fillStyle = "#8a6b36";
        ctx.fillRect(item.x, item.y, item.width, item.height);
    });

    // Draw witness
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(witnesses[0].x, witnesses[0].y, 50, 50);

    // Display found items and dialogue
    if (selectedItem) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`Found: ${selectedItem.name}`, 10, canvas.height - 80);
        if (selectedItem.description) {
            ctx.fillText(`${selectedItem.description}`, 10, canvas.height - 60);
        }
        if (selectedItem.dialog) {
            ctx.fillText(`Witness: ${selectedItem.dialog}`, 10, canvas.height - 40);
        }
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Touch controls setup
function createButton(label, keyName, left, bottom) {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.style.position = "fixed";
    btn.style.left = left;
    btn.style.bottom = bottom;
    btn.style.width = "60px";
    btn.style.height = "60px";
    btn.style.fontSize = "24px";
    btn.style.zIndex = 1000;
    btn.style.opacity = 0.7;

    btn.addEventListener("touchstart", () => keys[keyName] = true);
    btn.addEventListener("touchend", () => keys[keyName] = false);

    document.body.appendChild(btn);
}

createButton("←", "left", "20px", "20px");
createButton("→", "right", "100px", "20px");
createButton("⤒", "jump", "560px", "20px");

loop();
