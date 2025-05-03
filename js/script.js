const sections = document.querySelectorAll('section');
let currentSection = 0;

let scrolling = false;
const THROTTLE_DELAY = 500;
let lastAnimationTime = 0;

const canvas = document.getElementById('header_background');
const ctx = canvas.getContext('2d');

const cellSize = 50; // Taille d'une cellule
let rows, cols;
let hoverCell = { row: -1, col: -1 };

window.addEventListener('wheel', (event) => {
  const now = Date.now();

  if (scrolling) return;
  if (now - lastAnimationTime < THROTTLE_DELAY) return;

  if (event.deltaY > 0) {
    if (currentSection < sections.length - 1) {
      currentSection++;
      scrollToSection(currentSection, true); // indique que ça vient de la molette
      lastAnimationTime = now;
    }
  } else if (event.deltaY < 0) {
    if (currentSection > 0) {
      currentSection--;
      scrollToSection(currentSection, true);
      lastAnimationTime = now;
    }
  }
});

// scrollToSection accepte un second paramètre "isWheel" pour activer le blocage temporaire
function scrollToSection(index, isWheel = false) {
  console.log("Scroll vers section", index);
  if (isWheel) scrolling = true;

  currentSection = index;
  sections[index].scrollIntoView({ behavior: 'smooth' });

  if (isWheel) {
    setTimeout(() => {
      scrolling = false;
    }, 600);
  }
}

function initNavButtons() {
  const container = document.getElementById("button-container");

  sections.forEach(element => {
    const button = document.createElement("div");

    button.addEventListener("click", () => {
      const index = Array.from(sections).indexOf(element);
      scrollToSection(index); // appel sans "isWheel" → pas de blocage
    });

    button.classList.add("button");
    container.appendChild(button);
  });
}

initNavButtons();
scrollToSection(currentSection);


function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cols = Math.floor(canvas.width / cellSize);
  rows = Math.floor(canvas.height / cellSize);
  drawGrid();
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (isHoveredOrNeighbor(row, col)) {
        ctx.fillStyle = 'black';
      } else {
        ctx.fillStyle = 'lightgray';
      }

      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      ctx.strokeStyle = 'black';
      ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
}

function isHoveredOrNeighbor(row, col) {
  const r = hoverCell.row;
  const c = hoverCell.col;

  return (
    (row === r && col === c) || // cell hovered
    (row === r - 1 && col === c) || // haut
    (row === r + 1 && col === c) || // bas
    (row === r && col === c - 1) || // gauche
    (row === r && col === c + 1)    // droite
  );
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  if (row !== hoverCell.row || col !== hoverCell.col) {
    hoverCell = { row, col };
    drawGrid();
  }
});

window.addEventListener('resize', resizeCanvas);

resizeCanvas();