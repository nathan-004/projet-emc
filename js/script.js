const sections = document.querySelectorAll('section');
let currentSection = 0;

let scrolling = false;
const THROTTLE_DELAY = 500;
let lastAnimationTime = 0;

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
