// Get the modal
var modal = document.getElementById("scoreboardModal");

// Get the button that opens the modal
var btn = document.querySelector(".show-scoreboard");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  updateScoreboard();
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function updateScoreboard() {
  const modalText = document.getElementById('modal-text');

  let scoreboardString = `Scoreboard:
    Mode: ${easyMode ? 'Easy' : 'Normal'}
    1 guess: ${easyMode ? scoreboardEasy[0] : scoreboardNormal[0]}
    2 guesses: ${easyMode ? scoreboardEasy[1] : scoreboardNormal[1]}
    3 guesses: ${easyMode ? scoreboardEasy[2] : scoreboardNormal[2]}
    4 guesses: ${easyMode ? scoreboardEasy[3] : scoreboardNormal[3]}
    5 guesses: ${easyMode ? scoreboardEasy[4] : scoreboardNormal[4]}
    Answer not found: ${easyMode ? scoreboardEasy[5] : scoreboardNormal[5]}`;

  modalText.innerText = scoreboardString;
}

function isPrime(n) {
  if (n <= 1) return false;
  if (n === 2) return true;

  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }

  return true;
}

function generateRandomNumber() {
  let number = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  return String(number);
}

let random_number = generateRandomNumber();
let previousGuesses = document.querySelector('.previous-guesses');
let attempts = 5;
let guesses = 0;
let hintsDiv = document.querySelector('.hints');
let gameInstructions = document.querySelector('#intro-text');
let firstGame = true;

let easyMode = false;
document.querySelector("#mode-toggle").addEventListener('change', function() {
  easyMode = this.checked;
  resetGame();
});

const hint_functions = [
  {
    hint: (random_number) => `The first digit is ${random_number[0]}.`,
  },
  {
    hint: (random_number) => `The last digit is ${random_number[random_number.length - 1]}.`,
  },
  {
    hint: (random_number) => `There are ${Array.from(random_number).filter(num => isPrime(Number(num))).length} prime numbers in the sequence.`,
  },
  {
    hint: (random_number) => `The sum of the digits is ${Array.from(random_number).reduce((a, b) => Number(a) + Number(b), 0)}.`,
  },
  {
    hint: (random_number) => `The number is ${random_number.split('').every((val, i, arr) => arr.indexOf(val) === i) ? '' : 'not'} unique (has repeated digits).`,
  },
  {
    hint: (random_number) => `The number contains more ${Array.from(random_number).filter(num => Number(num) % 2 === 0).length > Array.from(random_number).filter(num => Number(num) % 2 !== 0).length ? 'even' : 'odd'} digits.`,
  },
];

// Scoreboard
let scoreboardEasy = [0, 0, 0, 0, 0, 0];
let scoreboardNormal = [0, 0, 0, 0, 0, 0];
let scoreboardVisible = false;
const scoreboardButton = document.querySelector('.show-scoreboard');
const scoreboardText = document.querySelectorAll('.scoreboard-text');  // changed to querySelectorAll

const hintPool = [...hint_functions];
const input = document.querySelector('.guess-input');
const submitButton = document.querySelector('.submit-guess');
const feedback = document.querySelector('.feedback');
const playAgainButton = document.querySelector('.play-again');
const restartButton = document.querySelector('.restart-button');
const digitButtons = document.querySelectorAll('.digit');
const clearButton = document.querySelector('.clear-button');

function resetGame() {
  random_number = generateRandomNumber();
  guesses = 0;
  previousGuesses.innerHTML = '';
  feedback.textContent = '';
  input.value = '';
  input.placeholder = "Enter a 5-digit number";
  submitButton.disabled = false;
  input.disabled = false;
  playAgainButton.style.display = 'none';
  restartButton.style.display = 'block';
  input.focus();
  hintPool.length = 0;
  hintPool.push(...hint_functions);
  hintsDiv.textContent = '';
  feedback.style.display = 'none';

  if (firstGame) {
    gameInstructions.style.display = 'block';
    firstGame = false;
  } else {
    gameInstructions.style.display = 'none';
  }
}

playAgainButton.addEventListener('click', resetGame);
restartButton.addEventListener('click', resetGame);
restartButton.addEventListener('click', function(event) {
  event.preventDefault();
  resetGame();
});

input.addEventListener('keydown', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    submitButton.click();
  }
});

submitButton.addEventListener('click', function() {
  feedback.style.display = 'block';
  gameInstructions.style.display = 'none';

  const user_guess = input.value;
  if (!/^\d{5}$/.test(user_guess)) {
    feedback.textContent = 'Please enter a valid 5-digit number.';
    return;
  }

  let guessRepresentation = '';
  if (easyMode) {
    guessRepresentation = Array.from(user_guess).map((digit, i) => {
      if (Number(digit) === Number(random_number[i])) {
        return `<span class="correct-guess">${digit}</span>`;
      } else if (random_number.includes(digit)) {
        return `<span class="wrong-spot-guess">${digit}</span>`;
      } else {
        return `<span class="incorrect-guess">${digit}</span>`;
      }
    }).join('');
  } else {
    guessRepresentation = Array.from(user_guess).map((digit, i) => {
      return `<span class="${Number(digit) === Number(random_number[i]) ? 'correct-guess' : 'incorrect-guess'}">${digit}</span>`;
    }).join('');
  }

  guesses++;
  previousGuesses.insertAdjacentHTML('beforeend', `<li>${guessRepresentation}</li>`);

  if (user_guess === random_number) {
    feedback.textContent = `Congratulations! You've guessed the number in ${guesses} attempts.`;
    submitButton.disabled = true;
    input.disabled = true;
    playAgainButton.style.display = 'block';
    restartButton.style.display = 'none';
    if(easyMode) {
      scoreboardEasy[guesses-1]++;
    } else {
      scoreboardNormal[guesses-1]++;
    }
    return;
  }

if (guesses === attempts) {
    feedback.innerHTML = `Sorry, you did not guess the number. It was <b>${random_number}</b>.`;
    submitButton.disabled = true;
    input.disabled = true;
    playAgainButton.style.display = 'block';
    restartButton.style.display = 'none';
    if(easyMode) {
      scoreboardEasy[5]++;
    } else {
      scoreboardNormal[5]++;
    }
    return;
}


  if (guesses < attempts) {
    feedback.textContent = 'Incorrect guess. Try again.';
    const hintIndex = Math.floor(Math.random() * hintPool.length);
    const hint = hintPool[hintIndex].hint(random_number);
    hintsDiv.insertAdjacentHTML('beforeend', `<li>${hint}</li>`);
    hintPool.splice(hintIndex, 1);
  }

  input.value = '';
  input.focus();
});

scoreboardButton.addEventListener('click', function() {
  // We don't need to check if the scoreboard is visible, just show it
  let scoreboardString = `Scoreboard:
  Mode: ${easyMode ? 'Easy' : 'Normal'}
  1 guess: ${easyMode ? scoreboardEasy[0] : scoreboardNormal[0]}
  2 guesses: ${easyMode ? scoreboardEasy[1] : scoreboardNormal[1]}
  3 guesses: ${easyMode ? scoreboardEasy[2] : scoreboardNormal[2]}
  4 guesses: ${easyMode ? scoreboardEasy[3] : scoreboardNormal[3]}
  5 guesses: ${easyMode ? scoreboardEasy[4] : scoreboardNormal[4]}
  Answer not found: ${easyMode ? scoreboardEasy[5] : scoreboardNormal[5]}`;

  // Show the scoreboard in the modal
  updateScoreboard();
  modal.style.display = "block";
});

digitButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (input.value.length < 5) {
      input.value += button.textContent;
    }
  });
});

clearButton.addEventListener('click', () => {
  input.value = '';
  input.placeholder = "Enter a 5-digit number";
});

resetGame();