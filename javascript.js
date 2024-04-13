/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~~~~ VARIABLES / ELEMENTS / PREPARATION ~~~~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


/* top section - title, settings */

const topTools = document.getElementById('top-tools');

/* middle section - paint tools, screen */

// tools
const tools = document.getElementById('tools');
const paint = document.getElementById('paint');
const etchSketch = document.getElementById('etch-sketch');
const eraser = document.getElementById('eraser');
const clear = document.getElementById('clear');
const outline = document.getElementById('outline'); 
let activeTool = paint;
activeTool.classList.add('active-tool');

// screen
let gridContainer = document.getElementById('grid-container');

/* bottom section - color choices, bottom info */

// get new colors
const colorPicker = document.getElementById("color-picker");
const randomColor = document.getElementById('random-color');
randomColor.style.backgroundColor = 'empty';

// default colors 
const colorDefault = document.getElementById('color-default');
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

// color history boxes
const colorTools = document.getElementById('color-tools');
for (let i = 0; i < 10; i++) {
  let colorHistory = document.createElement('button');
  colorHistory.classList.add('size');
  colorHistory.classList.add('empty');
  colorHistory.classList.add('color-border');
  colorTools.appendChild(colorHistory);
}

// bottom text info
const botText = document.getElementById('bot-text');
const gridInfo = document.getElementById('grid-info');
let userInput = 50;         // default grid size: 50x50
gridInfo.textContent = 'canvas size: ' + userInput;

/* initialization */

let currColor = '#000000';  // default color is black
let lastColor = '';
let temp;                   // temp to hold userInput
let colorIndex = 0;         // variable of index of color history used to loop through
let mode = 'paint';         // mode used to distinguish between paiting with selected color or painting with white (ERASER)

// convert rgb values to hex
const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

// create a new grid button
const newGridBtn = document.createElement('button');
newGridBtn.textContent = 'New Grid';
newGridBtn.setAttribute('id','new-grid-btn');
topTools.appendChild(newGridBtn);

// create the grid
createGrid(userInput);


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~ EVENT LISTENERS ~~~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


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
  gridInfo.textContent = 'canvas size: ' + userInput;
});

// main tools - hover and display text on bottom
document.addEventListener("mouseover", (e) => {
  let el = e.target;
  let text = 'minibaguettes, 2024';
  if (el.id == 'save') {
    text = 'save image';
  }
  else if (el.id == 'new-grid-btn') {
    text = 'new grid (any number from 1 to 100)';
  }
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
    text = 'clear screen';
  }
  else if (el.id == 'outline') {
    text = 'toggle grid outline';
  }
  else if (el.id == 'color-picker') {
    text = 'pick a new color';
  }
  else if (el.id == 'random-color') {
    text = 'get a random color';
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
});

randomColor.addEventListener("click", (e) => {
  getRandomColor(e);
});

// select default color
colorDefault.addEventListener("click", (e) => {
  currColor = e.target.style.backgroundColor;     // here, currColor = lastColor since we don't keep track of 
  lastColor = currColor;                          // default colors in the color history
});

// select existing color
colorTools.addEventListener("click", (e) => {
  // check if selected color history element still has default class (user has not selected more colors than slots)
  if (!e.target.classList.contains('empty')) {
    lastColor = currColor;
    currColor = rgb2hex(e.target.style.backgroundColor);
  }
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



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~~~~ FUNCTIONS ~~~~~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


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
  // if color has changed
  console.log(currColor + ' - ' + lastColor);
  if (currColor != lastColor) {                                          
    // if color history array DOES NOT contains current selected color, then add
    console.log(colorHistoryList);
    if (!colorHistoryList.includes(currColor) ) {  
      // if all color history elements have been changed (already cycled through the queue), then in descending order, replace the preceding element's color and id
      if (colorTools.querySelectorAll('.empty').length == 0) {
        for (var i = colorTools.children.length - 1; i > 0; i--) {
          colorTools.children[i].style.backgroundColor = colorTools.children[i-1].style.backgroundColor;
          colorTools.children[i].setAttribute('id', colorTools.children[i-1].getAttribute('id'));
        }
        colorIndex = 0;
      }
      colorTools.children[colorIndex].style.backgroundColor = currColor;  // set next color history 
      colorTools.children[colorIndex].classList.remove('empty');          // remove default class; when all elements no longer have this class, it will return to front of queue
      colorTools.children[colorIndex].setAttribute('id', currColor);      // set id to color hex
      console.log(currColor);
      colorIndex++;
      lastColor = currColor;
    }
    // if color history array DOES already contain current selected color, then do not add; shift to front
    else {
      let ci = colorHistoryList.indexOf(currColor);           // get index of current color's array position
      // if color history has more than 1 color
      if (colorHistoryList.length > 1) {
        for (var i = ci; i > 0; i--) {                        // replace preceding element's color and id from index
          colorTools.children[i].style.backgroundColor = colorTools.children[i-1].style.backgroundColor;
          colorTools.children[i].setAttribute('id', colorTools.children[i-1].getAttribute('id'));
        }
        colorTools.children[0].style.backgroundColor = currColor
        colorTools.children[0].setAttribute('id', currColor);
      }
    }
  }
  let arr = Array.from(colorTools.children).map(x => x.id);   // update array with current color history
  colorHistoryList = arr.filter(Boolean);
}

// generate random color 
function getRandomColor(e) {
  e.target.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
  lastColor = currColor;
  currColor =  rgb2hex( e.target.style.backgroundColor);
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