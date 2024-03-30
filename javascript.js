/* --- VARIABLES / ELEMENTS --- */

const body = document.querySelector('body');
let gridContainer = document.getElementById('grid-container');
let userInput;

// create a new grid button
const newGridBtn = document.createElement('button');
newGridBtn.textContent = 'New Grid';
newGridBtn.setAttribute('id','new-grid-btn');
body.appendChild(newGridBtn);


/* --- INIT --- */

// initial grid: 16x16
createGrid(16);


/* --- EVENT LISTENERS --- */

// new grid button pressed -> erase current grid and generate new grid
newGridBtn.addEventListener("click", function() {
  userInput = prompt('Enter a number: ');
  promptUser(userInput);
  removeGrid();
  createGrid(userInput);
});

/* --- extra credit --- */
// look for grid mouse hover -> color randomly and decrease opacity by 10% each time 
document.addEventListener("mouseover", (event) => {
  if (event.target.classList.contains('square')) {
    event.target.style.backgroundColor = 'rgb(' + [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)].join(',') + ')';
    event.target.style.opacity =  getComputedStyle(event.target).opacity - 0.1;
  }
});


/* --- FUNCTIONS --- */

// create a wxw grid
function createGrid(w) {
  for (let i = 0; i < (w*w); i++) {
    let square = document.createElement('div');
    square.classList.add('square');
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
    userInput = prompt('Input not number. Enter a number: ');
    promptUser(userInput);
  }
  else if (input > 100) {
    userInput = prompt('Less than 100. Enter a number: ');
    promptUser(userInput);
  }
}