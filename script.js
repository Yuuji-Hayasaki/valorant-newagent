// =========================
// Elements
// =========================
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");

const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

const letterWindow = document.querySelector(".letter-window");
const catFlowers = document.getElementById("cat-flowers");
const petalsContainer = document.getElementById("petals-container");

// =========================
// State trackers
// =========================
let yesScale = 1;
let dodgeCount = 0;

// =========================
// Open Envelope
// =========================
envelope.addEventListener("click", () => {
    envelope.style.display = "none";
    letter.style.display = "flex";
    setTimeout(() => letterWindow.classList.add("open"), 50);
});

// =========================
// NO button dodge logic & YES button growth
// =========================
noBtn.addEventListener("mouseover", (e) => {
    dodgeCount++;

    // Hide NO button after too many dodges
    if (dodgeCount > 12) {
        noBtn.style.transition = "all 0.5s ease";
        noBtn.style.transform = "scale(0)";
        noBtn.style.opacity = "0";
        setTimeout(() => noBtn.style.display = "none", 500);
        return;
    }

    const rect = letterWindow.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();

    const cursorX = e.clientX;
    const cursorY = e.clientY;

    // direction away from cursor
    let dirX = btnRect.left + btnRect.width / 2 - cursorX;
    let dirY = btnRect.top + btnRect.height / 2 - cursorY;
    const length = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
    dirX /= length;
    dirY /= length;

    // random dodge distance
    const minDistance = 100;
    const maxDistance = 250;
    let distance = Math.random() * (maxDistance - minDistance) + minDistance;

    let moveX = dirX * distance;
    let moveY = dirY * distance;

    // constrain inside letter window
    const padding = 20;

    let newLeft = btnRect.left + moveX;
    let newTop = btnRect.top + moveY;

    // constrain horizontally
    if (newLeft < rect.left + padding) moveX += rect.left + padding - newLeft;
    if (newLeft + btnRect.width > rect.right - padding) moveX -= newLeft + btnRect.width - (rect.right - padding);

    // constrain vertically
    if (newTop < rect.top + padding) moveY += rect.top + padding - newTop;
    if (newTop + btnRect.height > rect.bottom - padding) moveY -= newTop + btnRect.height - (rect.bottom - padding);

    // avoid overlapping Yes button
    if (
        newLeft + moveX < yesRect.right + 10 &&
        newLeft + moveX + btnRect.width > yesRect.left - 10 &&
        newTop + moveY < yesRect.bottom + 10 &&
        newTop + moveY + btnRect.height > yesRect.top - 10
    ) {
        moveX *= -1;
        moveY *= -1;
    }

    noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;

    // YES button grows bigger with each dodge (max 2x)
    yesScale += 0.05; // faster growth
    if (yesScale > 2) yesScale = 2;
    yesBtn.style.transform = `scale(${yesScale})`;
});

// =========================
// YES button click logic
// =========================
yesBtn.addEventListener("click", () => {
    title.textContent = "Yippeeee! 💖";
    catImg.src = "cat_dance.gif";
    letterWindow.classList.add("final");

    // Hide main buttons
    buttons.style.display = "none";

    // Show final text
    finalText.style.display = "block";

    // Show outside cats
    document.getElementById("cat-rose-left").style.display = "block";
    document.getElementById("cat-boquet-right").style.display = "block";

    // Start petals
    startPetals();
});

// =========================
// Continuous Falling Petals
// =========================
function startPetals() {
    setInterval(() => {
        const petal = document.createElement("span");
        petal.classList.add("petal");
        petal.textContent = "🌸";

        // random horizontal position
        petal.style.left = Math.random() * window.innerWidth + "px";

        // random animation duration
        petal.style.animationDuration = 4 + Math.random() * 4 + "s";

        // random size and opacity
        petal.style.fontSize = 36 + Math.random() * 36 + "px";
        petal.style.opacity = 0.6 + Math.random() * 0.4;

        petalsContainer.appendChild(petal);

        // remove after animation completes
        setTimeout(() => petal.remove(), 8000);
    }, 300);
}