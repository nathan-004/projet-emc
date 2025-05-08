const sections = document.querySelectorAll('section');
let currentSection = 0;

let scrolling = false;
const THROTTLE_DELAY = 500;
let lastAnimationTime = 0;

const canvasID = [];

sections.forEach(element => {
  canvasID.push(element.id + "_background");
});

const canvasColor = [
  ["black", "lightgray", "black"],
  ["lightgray", "black", "black"],
  ["white", "black", "black"],
  ["white", "black", "black"],
];

let canvas = document.getElementById(canvasID[currentSection]);
let ctx = canvas.getContext('2d');

document.getElementById("close-button").addEventListener("click", event => {
  document.getElementById("popup-container").style.display = "none";
});

function popup(title, text, img_src="", backgroundColor="white") {
  document.getElementById("title").innerHTML = title;
  document.getElementById("texte").innerHTML = text;
  
  if (img_src == "") {
    document.getElementById("popup-image").style.display = "none";
  }
  else {
    document.getElementById("popup-image").src = img_src;
  }

  document.getElementById("popup").style.backgroundColor = backgroundColor;

  document.getElementById("popup-container").style.display = "initial";
}

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
  if (isWheel) scrolling = true;

  currentSection = index;
  setCanvas();
  resizeCanvas();
  sections[index].scrollIntoView({ behavior: 'smooth' });
  
  changeColorButton();

  if (isWheel) {
    setTimeout(() => {
      scrolling = false;
    }, 600);
  }
}

function initNavButtons() {
  const container = document.getElementById("button-container");
  let index = 0;

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

function changeColorButton() {
  const container = document.getElementById("button-container");
  const childsList = container.children;

  for (let i = 0; i < childsList.length; i++) {
    if (i == currentSection) {
      childsList[i].style.backgroundColor = "white";
    }
    else {
      childsList[i].style.backgroundColor = "black";
    }
  }
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
        ctx.fillStyle = canvasColor[currentSection][0];
      } else {
        ctx.fillStyle = canvasColor[currentSection][1];
      }

      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      ctx.strokeStyle = canvasColor[currentSection][2];
      ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
}

function isHoveredOrNeighbor(row, col) {
  const r = hoverCell.row;
  const c = hoverCell.col;

  if (currentSection == 0) {
    return (
      (row === r && col === c) || // cell hovered
      (row === r - 1 && col === c) || // haut
      (row === r + 1 && col === c) || // bas
      (row === r && col === c - 1) || // gauche
      (row === r && col === c + 1)    // droite
    );
  }
  else {
    return (row === r && col === c);
  }
}

function setCanvas() {
  canvas = document.getElementById(canvasID[currentSection]);
  ctx = canvas.getContext('2d');
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
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();
popup("Bienvenue", 'Vous vous trouvez sur une page définissant le terme "populisme politique".</br> Voici quelques conseils pour une expérience optimale : </br>- Regarder le site sur un ordinateur </br>- Ne pas utiliser Firefox </br> </br><span style="text-align: right;">Cordialement</span>', "images/default_image.webp", "white")