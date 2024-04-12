/* ---------------------------- */
/* --- VARIABLES / ELEMENTS --- */
/* ---------------------------- */

const topTitle = document.getElementById('top-title');
// const topTitleText = document.createElement('p');
// topTitleText.textContent = 'untitled';
// topTitleText.setAttribute('id', 'top-title-text');
// topTitle.appendChild(topTitleText);
topTitle.textContent = 'untitled';
const topTools = document.getElementById('top-tools');
const botText = document.getElementById('bot-text');

const tools = document.getElementById('tools');
const paint = document.getElementById('paint');
const etchSketch = document.getElementById('etch-sketch');
const eraser = document.getElementById('eraser');
const clear = document.getElementById('clear');
const outline = document.getElementById('outline'); 
let activeTool = paint;
activeTool.classList.add('active-tool');

const colorPicker = document.getElementById("color-picker");
const colorDefault = document.getElementById('color-default');
const colorTools = document.getElementById('color-tools');

let gridContainer = document.getElementById('grid-container');

// generate default colors 
let defaultColors1 = ['#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4'];
let defaultColors2 = ['#ffffff', '#a349a4', '#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7'];

let colorDefault1 = document.createElement('div');
let colorDefault2 = document.createElement('div');
colorDefault.appendChild(colorDefault1);
colorDefault.appendChild(colorDefault2);

for (let i = 0; i < defaultColors1.length; i++) {
  let color = document.createElement('button');
  color.classList.add('size');
  color.classList.add('color-border');
  color.style.backgroundColor = defaultColors1[i];
  color.setAttribute("id", defaultColors1[i]);
  colorDefault1.appendChild(color);
}

for (let i = 0; i < defaultColors2.length; i++) {
  let color = document.createElement('button');
  color.classList.add('size');
  color.classList.add('color-border');
  color.style.backgroundColor = defaultColors2[i];
  color.setAttribute("id", defaultColors2[i]);
  colorDefault2.appendChild(color);
}

// generate color boxes
for (let i = 0; i < 10; i++) {
  let colorHistory = document.createElement('button');
  colorHistory.classList.add('size');
  colorHistory.classList.add('empty');
  colorHistory.classList.add('color-border');
  colorTools.appendChild(colorHistory);
}

const randomColor = document.getElementById('random-color');
randomColor.style.backgroundColor = 'empty';


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
  let text = 'MiniBaguettes';
  if (el.id == 'paint') {
    text = 'paint';
  }
  else if (el.id == 'etch-sketch') {
    text = 'etch sketch';
  }
  else if (el.id == 'eraser') {
    text = 'eraser';
  }
  else if (el.id == 'clear') {
    text = 'clear';
  }
  else if (el.id == 'outline') {
    text = 'outline';
  }
  else if (el.id == 'color-picker') {
    text = 'pick a new color';
  }
  else if (el.id == 'random-color') {
    text = 'random color';
  }
  else if (el.id.includes('#', 0)) {
    text = el.id;
  }
  botText.textContent = text;
});

// main tools - click to select
document.addEventListener("click", (e) => {
  let el = e.target;
  if (el.id != activeTool.id && el.id == 'paint' || el.id == 'etch-sketch' || el.id == 'eraser') {
    activeTool.classList.remove('active-tool');
    activeTool = e.target;
    activeTool.classList.add('active-tool');
  }
  
  // paint, eraser
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

  // etch sketch brush
  else if (el.id == 'etch-sketch') {
    // disable paint click
    gridContainer.removeEventListener("mousedown", paintClick);
    gridContainer.removeEventListener("mouseover", paintClick);
    // enable paint drag
    for (var i = 0; i < gridContainer.childNodes.length; i++) {
      gridContainer.childNodes[i].addEventListener("mouseover", paintDrag);
    }
  }
  
  // clear screen
  else if (el.id == 'clear') {
    for (var i = 0; i < gridContainer.childNodes.length; i++) {
      gridContainer.childNodes[i].style.backgroundColor = '#FFFFFF';
    }
  }

  // toggle grid outline
  // when sending html to canvas via html2canvas, the container must have background color in order to see grid
  //  so add/remove outline class to/from squares AND add/remove background color class to/from gridContainer
  else if (el.id == 'outline') {
    if (gridContainer.childNodes[0].classList.contains('outline')) {
      gridContainer.classList.remove('grid-color');
      for (var i = 0; i < gridContainer.childNodes.length; i++) {
        gridContainer.childNodes[i].classList.remove('outline');
      }
    }
    else {
      gridContainer.classList.add('grid-color');
      for (var i = 0; i < gridContainer.childNodes.length; i++) {
        gridContainer.childNodes[i].classList.add('outline');
      }
    }
    el.classList.toggle('active-tool'); // if outline is active, set bg color; if outline is disabled, default color
  }
});

// select new color
colorPicker.addEventListener("input", function() {
  lastColor = currColor;
  currColor = colorPicker.value;
  console.log(lastColor);
  console.log(currColor);
});

// select default color
colorDefault.addEventListener("click", (e) => {
  currColor = e.target.style.backgroundColor;
  lastColor = currColor;
});

// select existing color
colorTools.addEventListener("click", (e) => {
  // check if selected color history element still has default class (user has not selected more colors than slots)
  if (!e.target.classList.contains('empty')) {
    currColor = e.target.style.backgroundColor;
    lastColor = currColor;
  }
});

randomColor.addEventListener("click", (e) => {
  getRandomColor(e);
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

let colorHistoryList = [];

// when selecting another color, add color to colorHistory 'queue' and remove last in 'queue'
function shiftColorHistory() {
  if (currColor != lastColor) {                                           // if color has changed
    if (!colorHistoryList.includes(currColor)) {                          // if color history array already contains newly selected color, do not add again
      if (colorTools.querySelectorAll('.empty').length == 0) {            // if all color history elements have been changed (already cycled through the queue),
        for (var i = colorTools.children.length - 1; i > 0; i--) {        //  then in descending order, replace the preceding element's color and id
          colorTools.children[i].style.backgroundColor = colorTools.children[i-1].style.backgroundColor;
          colorTools.children[i].setAttribute('id', colorTools.children[i-1].getAttribute('id'));
        }
        colorIndex = 0;
      }
      colorTools.children[colorIndex].style.backgroundColor = currColor;  // set next color history 
      colorTools.children[colorIndex].classList.remove('empty');          // remove default class; when all elements no longer have this class, it will return to front of queue
      colorTools.children[colorIndex].setAttribute('id', currColor);      // set id to color hex
      colorIndex++;
      lastColor = currColor;
    }
  }
  let arr = Array.from(colorTools.children).map(x => x.id);               // update array with current color history
  colorHistoryList = arr.filter(Boolean);
}

function getRandomColor(e) {
  e.target.style.backgroundColor = 'rgb(' + [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)].join(',') + ')';
  lastColor = currColor;
  currColor =  e.target.style.backgroundColor;
}

// ODIN - extra credit
// randomly generate colors; gets darker by 10% each time (assuming event is gridContainer rather than square)
// function getRandomColor(event) {
//   if (event.target.classList.contains('square')) {
//     event.target.style.backgroundColor = 'rgb(' + [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)].join(',') + ')';
//     event.target.style.opacity =  getComputedStyle(event.target).opacity - 0.1;
//   }
// }

// https://html2canvas.hertzen.com/
// https://stackoverflow.com/questions/10673122/how-to-save-canvas-as-an-image-with-canvas-todataurl
function takeScreenShot() {
  html2canvas(document.querySelector(".capture")).then(canvas => {
    // let newWin = window.open();
    // newWin.document.body.appendChild(canvas);
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // if you dont replace you will get a DOM 18 exception.
    window.location.href=image; // save image locally
  });
}