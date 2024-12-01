// Game state variables
const WORD_LENGTH = 5;
const guesses = 6;
let currentRow = 0;  // Track which row we're on
let currentCol = 0;  // Track which column we're on
let currentGuess = [];
const rightGuessString = "WORLD"; // Example word
const WORDS = ["WORLD", "HELLO", "GAMES"]; // Example word list

// Create and append game board when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('.game-container');
    const board = createGameBoard();
    const keyboard = createKeyboard();
    gameContainer.appendChild(board);
    gameContainer.appendChild(keyboard);
});

// Create game board UI
function createGameBoard() {
    const board = document.createElement('div');
    board.classList.add('game-board');

    for (let i = 0; i < guesses; i++) {
        const row = document.createElement("div");
        row.className = "letter-row";
        
        for (let j = 0; j < WORD_LENGTH; j++) {
            const box = document.createElement("div");
            box.className = "game-cell";
            row.appendChild(box);
        }
        board.appendChild(row);
    }
    return board;
}

// Create keyboard UI
function createKeyboard() {
    const keyboard = document.createElement('div');
    keyboard.id = 'keyboard';
    keyboard.classList.add('keyboard');

    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Del']
    ];

    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');

        row.forEach(letter => {
            const key = document.createElement('button');
            key.classList.add('keyboard-key');
            key.dataset.key = letter.toLowerCase();
            key.textContent = letter;
            rowDiv.appendChild(key);
        });

        keyboard.appendChild(rowDiv);
    });

    return keyboard;
}

// Handle physical keyboard input
document.addEventListener("keyup", (e) => {
    if (currentRow >= guesses) {
        return;
    }

    let pressedKey = String(e.key);
    if (pressedKey === "Backspace" && currentCol !== 0) {
        deleteLetter();
        return;
    }

    if (pressedKey === "Enter") {
        checkGuess();
        return;
    }

    let found = pressedKey.match(/[a-z]/gi);
    if (!found || found.length > 1) {
        return;
    } else {
        insertLetter(pressedKey);
    }
});

// Handle virtual keyboard input
document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("keyboard-key")) {
        return;
    }
    
    let key = e.target.textContent;
    if (key === "Del") {
        key = "Backspace";
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}));
});

function insertLetter(pressedKey) {
    if (currentCol >= WORD_LENGTH) {
        return;
    }
    
    pressedKey = pressedKey.toLowerCase();
    const rows = document.getElementsByClassName("letter-row");
    const currentRowEl = rows[currentRow];
    const box = currentRowEl.children[currentCol];
    
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess.push(pressedKey);
    currentCol++;
}

function deleteLetter() {
    const rows = document.getElementsByClassName("letter-row");
    const currentRowEl = rows[currentRow];
    const box = currentRowEl.children[currentCol - 1];
    
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuess.pop();
    currentCol--;
}

function checkGuess() {
    if (currentCol !== WORD_LENGTH) {
        alert("Not enough letters!");
        return;
    }

    let guessString = currentGuess.join('');
    if (!WORDS.includes(guessString.toUpperCase())) {
        alert("Word not in list!");
        return;
    }

    const rows = document.getElementsByClassName("letter-row");
    const currentRowEl = rows[currentRow];
    let rightGuess = Array.from(rightGuessString.toLowerCase());

    for (let i = 0; i < WORD_LENGTH; i++) {
        let letterColor = '';
        let box = currentRowEl.children[i];
        let letter = currentGuess[i];

        let letterPosition = rightGuess.indexOf(letter);
        if (letterPosition === -1) {
            letterColor = 'grey';
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = '#50c62e';
            } else {
                letterColor = 'gold';
            }
            rightGuess[letterPosition] = "#";
        }

        let delay = 250 * i;
        setTimeout(() => {
            box.style.backgroundColor = letterColor;
            shadeKeyBoard(letter, letterColor);
        }, delay);
    }

    if (guessString === rightGuessString.toLowerCase()) {
        setTimeout(() => {
            alert("You guessed right! Game over!");
        }, 1500);
        currentRow = guesses;
        return;
    }
    
    if (currentRow >= guesses - 1) {
        setTimeout(() => {
            alert("You've run out of guesses! Game over!");
            alert(`The right word was: "${rightGuessString}"`);
        }, 1500);
        currentRow = guesses;
        return;
    }
    
    // Move to next row
    currentRow++;
    currentCol = 0;
    currentGuess = [];
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-key")) {
        if (elem.textContent.toLowerCase() === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === '#50c62e') {
                return;
            } 

            if (oldColor === 'gold' && color !== '#50c62e') {
                return;
            }

            elem.style.backgroundColor = color;
            break;
        }
    }
}