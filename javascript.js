/* ---------------------------- */
/* --- VARIABLES / ELEMENTS --- */
/* ---------------------------- */

const topTools = document.getElementById('top-tools');
const botText = document.getElementById('bot-text');

const tools = document.getElementById('tools');
const paint = document.getElementById('paint');
const etchSketch = document.getElementById('etch-sketch');
const eraser = document.getElementById('eraser');
const clear = document.getElementById('clear');
const outline = document.getElementById('outline');

const colorTools = document.getElementById('color-tools');
const colorPicker = document.getElementById("color-picker");

let gridContainer = document.getElementById('grid-container');

// generate color boxes
for (let i = 0; i < 6; i++) {
  let colorHistory = document.createElement('button');
  colorHistory.classList.add('color');
  colorHistory.classList.add('size');
  colorHistory.classList.add('white');
  colorHistory.textContent = i;
  colorTools.appendChild(colorHistory);
}

const colorRandom = document.getElementById('random-color');

let currColor = '#000000';  // default color is black
let lastColor = '';
let userInput = 50;         // default 25x25
let temp;                   // temp to hold userInput
let colorIndex = 0;         // variable of index of color history used to loop through
let mode = 'paint';         // mode used to distinguish between paiting with selected color or painting with white (ERASER)

// create a new grid button
const newGridBtn = document.createElement('button');
newGridBtn.textContent = 'New Grid';
newGridBtn.setAttribute('id','new-grid-btn');
topTools.appendChild(newGridBtn);

/* ----------------------- */
/* --------- INIT -------- */
/* ----------------------- */

// initial grid: 16x16
createGrid(userInput);

/* ----------------------- */
/* --- EVENT LISTENERS --- */
/* ----------------------- */


// new grid button pressed -> erase current grid and generate new grid
newGridBtn.addEventListener("click", function() {
  temp = userInput;
  userInput = prompt('Enter a number from 1 to 100: ');
  promptUser(userInput);
  // if prompt is exited, do not change grid size
  if (userInput == null) {
    userInput = temp;
  }
  removeGrid();
  createGrid(userInput);
});

// main tools - hover and display text on bottom
document.addEventListener("mouseover", (e) => {
  let el = e.target;
  if (el.id == 'paint') {
    botText.textContent = 'paint';
  }
  else if (el.id == 'etch-sketch') {
    botText.textContent = 'etch sketch';
  }
  else if (el.id == 'eraser') {
    botText.textContent = 'eraser';
  }
  else if (el.id == 'clear') {
    botText.textContent = 'clear';
  }
  else {
    botText.textContent = 'for help, click help';
  }
});

// main tools - click to select
document.addEventListener("click", (e) => {
  let el = e.target;
  if (el.id == 'paint' || el.id == 'eraser') {
    // enable paint click
    gridContainer.addEventListener("mousedown", paintClick);
    gridContainer.addEventListener("mouseover", paintClick);
    // disable paint drag
    for (var i = 0; i < gridContainer.childNodes.length; i++) {
      gridContainer.childNodes[i].removeEventListener("mouseover", paintDrag);
    }
    mode = el.id;
  }
  else if (el.id == 'etch-sketch') {
    // disable paint click
    gridContainer.removeEventListener("mousedown", paintClick);
    gridContainer.removeEventListener("mouseover", paintClick);
    // enable paint drag
    for (var i = 0; i < gridContainer.childNodes.length; i++) {
      gridContainer.childNodes[i].addEventListener("mouseover", paintDrag);
    }
  }
  else if (el.id == 'clear') {
    for (var i = 0; i < gridContainer.childNodes.length; i++) {
      gridContainer.childNodes[i].style.backgroundColor = '#FFFFFF';
    }
  }
  else if (el.id == 'outline') {
    if (gridContainer.childNodes[0].classList.contains('outline')) {
      for (var i = 0; i < gridContainer.childNodes.length; i++) {
        gridContainer.childNodes[i].classList.remove('outline');
      }
    }
    else {
      for (var i = 0; i < gridContainer.childNodes.length; i++) {
        gridContainer.childNodes[i].classList.add('outline');
      }
    }
  }
});

// select new color
colorPicker.addEventListener("input", function() {
  lastColor = currColor;
  currColor = colorPicker.value;
  console.log(lastColor);
  console.log(currColor);
});

// select existing color
colorTools.addEventListener("click", (e) => {
  // check if selected color history element still has default class (user has not selected more colors than slots)
  if (!e.target.classList.contains('white')) {
    currColor = e.target.style.backgroundColor;
    lastColor = currColor;
  }
});

colorRandom.addEventListener("click", (e) => {
  randomColor(e);
});

// detect mouse down to paint
let isColoring = false;
gridContainer.addEventListener("mousedown", (e) => {
  isColoring = true;
  e.preventDefault(); // prevent 'not-allowed' cursor
});

['mouseup', 'mouseleave'].forEach(function(ev) {
  gridContainer.addEventListener(ev, (e) => {
    isColoring = false;
  });
})



/* ----------------- */
/* --- FUNCTIONS --- */
/* ----------------- */


// create a wxw grid
function createGrid(w) {
  for (let i = 0; i < (w*w); i++) {
    let square = document.createElement('div');
    square.classList.add('square');
    square.addEventListener('mouseover', paintClick);
    square.addEventListener('mousedown', paintClick);
    document.documentElement.style.setProperty(`--size`, `${w}`); // create css variable 'size' and set it to user's desired value
    gridContainer.appendChild(square);
  }
}

// remove grid
function removeGrid() {
  while (gridContainer.lastElementChild) {
    gridContainer.removeChild(gridContainer.lastElementChild);
  }
}

// check if user input is a number or is less than 100
function promptUser(input) {
  if (isNaN(input)) {
    userInput = prompt('That is not a number. Please enter a number from 1 to 100: ');
    promptUser(userInput);
  }
  else if (input > 100) {
    userInput = prompt('Must be less than 101. Please enter a number from 1 to 100: ');
    promptUser(userInput);
  }
  else if (input < 1 && input != null) {
    userInput = prompt('Must be larger than 0. Please enter a number from 1 to 100: ');
    promptUser(userInput);
  }
}

function erase() {
  console.log('erasing');
}

// normal paint tool - click
function paintClick() {
  if (isColoring) {
    if (mode == 'paint') {
      this.style.backgroundColor = currColor;
    }
    else if (mode == 'eraser') {
      this.style.backgroundColor = '#FFFFFF';
    }
    shiftColorHistory();
  }
}

// etch sketch paint tool - drag, no click
function paintDrag() {
  this.style.backgroundColor = currColor;
  shiftColorHistory();
}

// when selecting another color, add color to colorHistory 'queue' and remove last in 'queue'
function shiftColorHistory() {
  if (currColor != lastColor) {                                         // if color has changed
    if (colorTools.querySelectorAll('.white').length == 0) {            // if all color history elements have been changed (already cycled through the queue),
      for (var i = 5; i > 0; i--) {         //  then in descending order, replace the preceding element's color
        colorTools.children[i].style.backgroundColor = colorTools.children[i-1].style.backgroundColor;
      }
      colorIndex = 0;
    }
    colorTools.children[colorIndex].style.backgroundColor = currColor;  // set next color history 
    colorTools.children[colorIndex].classList.remove('white');          // remove default class; when all elements no longer have this class, it will return to front of queue
    colorIndex++;
    lastColor = currColor;
  }
}

function randomColor(e) {
  e.target.style.backgroundColor = 'rgb(' + [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)].join(',') + ')';
  lastColor = currColor;
  currColor =  e.target.style.backgroundColor;
}

// ODIN - extra credit
// randomly generate colors; gets darker by 10% each time (assuming event is gridContainer rather than square)
// function randomColor(event) {
//   if (event.target.classList.contains('square')) {
//     event.target.style.backgroundColor = 'rgb(' + [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)].join(',') + ')';
//     event.target.style.opacity =  getComputedStyle(event.target).opacity - 0.1;
//   }
// }