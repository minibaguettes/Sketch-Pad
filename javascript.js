/* --- VARIABLES / ELEMENTS --- */

const body = document.querySelector('body');
let gridContainer = document.getElementById('grid-container');
let userInput = 16;
let temp;

// create a new grid button
const newGridBtn = document.createElement('button');
newGridBtn.textContent = 'New Grid';
newGridBtn.setAttribute('id','new-grid-btn');
body.appendChild(newGridBtn);


/* --- INIT --- */

// initial grid: 16x16
createGrid(userInput);


/* --- EVENT LISTENERS --- */

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