
const display = document.querySelector(".time");

let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

function start() {
  if(!isRunning) {
    startTime = Date.now() - elapsedTime;
    timer = setInterval(update, 10);
    isRunning = true;
    pulseScreen("pulse-green");
    saveState();
  }
}

document.querySelector(".start-button").addEventListener("click", start);

function stop() {
  if(isRunning) {
    clearInterval(timer);
    elapsedTime = Date.now() - startTime;
    isRunning = false;
    pulseScreen("pulse-red");
    saveState();
  }
}

document.querySelector(".stop-button").addEventListener("click", stop);

function reset() {
  clearInterval(timer);
  startTime = 0;
  elapsedTime = 0;
  isRunning = false;
  display.textContent = "00:00:00";
  pulseScreen("pulse-yellow");
  saveState();
}

document.querySelector(".reset-button").addEventListener("click", reset);

function update() {
  let timeToDisplay = elapsedTime;

  if (isRunning) {
    const currentTime = Date.now();
    timeToDisplay = currentTime - startTime;
  }

  let hours = Math.floor(timeToDisplay / (1000 * 60 * 60));
  let minutes = Math.floor((timeToDisplay / (1000 * 60)) % 60);
  let seconds = Math.floor((timeToDisplay / 1000) % 60);

  hours = String(hours).padStart(2, "0");
  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");

  display.textContent = `${hours}:${minutes}:${seconds}`;
}

function pulseScreen(colorClass) {
  const overlay = document.getElementById("pulse-overlay");
  overlay.className = "";
  void overlay.offsetWidth;
  overlay.classList.add(colorClass);
}

// Custom Input
document.querySelector(".set-time-button").addEventListener("click", () => {
  const h = parseInt(document.getElementById("hours").value) || 0;
  const m = parseInt(document.getElementById("minutes").value) || 0;
  const s = parseInt(document.getElementById("seconds").value) || 0;

  elapsedTime = ((h * 60 * 60) + (m * 60) + s) * 1000;

  clearInterval(timer);

  isRunning = false;
  update();
  saveState();
});

document.querySelector(".ph").addEventListener("click", setCustomTime);

function setCustomTime() {
  document.querySelector(".custom-time-input").style.display = "flex";
}

document.querySelector(".set-time-button").addEventListener("click", removeCustomTime);

function removeCustomTime() {
  document.querySelector(".custom-time-input").style.display = "none";
}

// Themes Dropdown
document.querySelector(".themes-button").addEventListener("click", arrowToggle);

document.addEventListener("click", (event) => {
  const dropdown = document.querySelector(".themes-dropdown");
  const button = document.querySelector(".themes-button");

  const clickedInsideDropdown = dropdown.contains(event.target);
  const clickedButton = button.contains(event.target);

  if (!clickedInsideDropdown && !clickedButton && dropdown.classList.contains("active")) {
    closeDropdown();
  }
});

function closeDropdown() {
  const dropdown = document.querySelector(".themes-dropdown");
  const themes = document.querySelectorAll(".theme");

  dropdown.classList.remove("active");
  dropdown.classList.add("closing");

  const totalThemes = themes.length;

  themes.forEach((theme, index) => {
    const reverseIndex = totalThemes - 1 - index;
    theme.style.animation = `fadeOutSlide 0.3s ease forwards ${reverseIndex * 0.05}s`;
  });
}

function arrowToggle() {
  const dropdown = document.querySelector(".themes-dropdown");
  const themeOptions = document.querySelector(".theme-options");
  const themes = document.querySelectorAll(".theme");

  if (dropdown.classList.contains("active")) {
    closeDropdown();
  } else {
    dropdown.classList.add("active");
    themeOptions.style.pointerEvents = "auto";
    themeOptions.style.opacity = "1";

    themes.forEach((theme, index) => {
      theme.style.animation = "none";
      void theme.offsetHeight;
      theme.style.animation = `fadeInSlide 0.3s ease forwards ${index * 0.05}s`;
    });
  }
}

// Theme Functionality
const backgroundSize = "600% 600%";
const animation = "gradientMove 60s ease infinite";

document.querySelector(".ocean").addEventListener("click", oceanTheme);
document.querySelector(".forest").addEventListener("click", forestTheme);
document.querySelector(".desert").addEventListener("click", desertTheme);
document.querySelector(".sunset").addEventListener("click", sunsetTheme);
document.querySelector(".arctic").addEventListener("click", arcticTheme);

function setTheme(name, gradient) {
  const body = document.querySelector("body");
  body.style.background = gradient;
  body.style.backgroundSize = backgroundSize;
  body.style.animation = animation;

  localStorage.setItem("theme", name);
}

function oceanTheme() {
  setTheme("ocean", "linear-gradient(to right, #0093E9, #000000)");
}

function forestTheme() {
  setTheme("forest", "linear-gradient(to right, #043303, #000000)");
}

function desertTheme() {
  setTheme("desert", "linear-gradient(to right, #C9B194, #000000)");
}

function sunsetTheme() {
  setTheme("sunset", "linear-gradient(to right, #FF6B2D, #FF3E6C, #A155B9, #000000)");
}

function arcticTheme() {
  setTheme("arctic", "linear-gradient(to right, #4dd0e1, #000000)");
}

// Local Storage
function saveState() {
  const state = {
    startTime: isRunning ? startTime : null,
    elapsedTime,
    isRunning
  };
  localStorage.setItem("timerState", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("timerState");
  if (!saved) return;

  const state = JSON.parse(saved);
  elapsedTime = state.elapsedTime || 0;
  isRunning = state.isRunning;

  if (isRunning && state.startTime) {
    const now = Date.now();
    const timePassed = now - state.startTime;
    elapsedTime = timePassed;

    startTime = now - elapsedTime;
    timer = setInterval(update, 10);
  } else {
    update();
  }
}

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (!theme) return;

  switch (theme) {
    case "ocean":
      oceanTheme();
      break;
    case "forest":
      forestTheme();
      break;
    case "desert":
      desertTheme();
      break;
    case "sunset":
      sunsetTheme();
      break;
    case "arctic":
      arcticTheme();
      break;
  }
}

window.addEventListener("load", () => {
  loadState();
  loadTheme();
});