import { initializeWordList, getRandomWord, WORDS } from "./words.js";

// Game state variables
const WORD_LENGTH = 5;
const guesses = 6;
let currentRow = 0;
let currentCol = 0;
let currentGuess = [];
let rightGuessString;

// Initialize game
async function initGame() {
    try {
        // Show loading message
        const gameContainer = document.querySelector('.game-container');
        const loadingMsg = document.createElement('div');
        loadingMsg.textContent = 'Loading word list...';
        loadingMsg.style.marginBottom = '20px';
        gameContainer.appendChild(loadingMsg);

        // Initialize word list
        await initializeWordList();
        
        // Remove loading message
        loadingMsg.remove();

        // Set random word and create game board
        rightGuessString = getRandomWord();
        // console.log('Word to guess:', rightGuessString); // For testing
        
        const board = createGameBoard();
        const keyboard = createKeyboard();
        gameContainer.appendChild(board);
        gameContainer.appendChild(keyboard);

    } catch (error) {
        console.error('Error initializing game:', error);
        // Use fallback word if API fails
        rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
    }
}

// Start game when DOM loads
document.addEventListener('DOMContentLoaded', initGame);


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
    
    // Ignore only actual function keys, not letters when caps lock is on
    if (pressedKey.length > 1 && pressedKey.startsWith('F') && !isNaN(pressedKey.slice(1))) {
        return; // Ignore only F1-F12 keys
    }

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

function showNotification(message, type = 'default', duration = 1500) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove notification after duration
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

async function checkGuess() {
    if (currentCol !== WORD_LENGTH) {
        showNotification("Not enough letters!", "error");
        return;
    }

    let guessString = currentGuess.join('');

    // Dictionary check (keeping your existing validation)
    if (!WORDS.includes(guessString)) {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${guessString}`);
            if (!response.ok) {
                showNotification("Word not in list!", "error");
                return;
            }
            WORDS.push(guessString);
        } catch (error) {
            console.error('Error checking word:', error);
            showNotification("Word not in list!", "error");
            return;
        }
    }

    const rows = document.getElementsByClassName("letter-row");
    const currentRowEl = rows[currentRow];
    
    // Convert strings to arrays for easier manipulation
    let rightGuess = Array.from(rightGuessString.toLowerCase());
    let currentGuessArray = Array.from(guessString.toLowerCase());
    
    // Create arrays to track colors and letter frequencies
    let colors = new Array(WORD_LENGTH).fill('grey');
    let rightGuessLetterCount = {};
    
    // Count frequencies of letters in the target word
    rightGuess.forEach(letter => {
        rightGuessLetterCount[letter] = (rightGuessLetterCount[letter] || 0) + 1;
    });
    
    // First pass: Mark all correct letters (green)
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (currentGuessArray[i] === rightGuess[i]) {
            colors[i] = '#50c62e'; // green
            rightGuessLetterCount[currentGuessArray[i]]--;
        }
    }
    
    // Second pass: Mark yellow letters, respecting remaining frequencies
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (colors[i] === '#50c62e') continue; // Skip already green letters
        
        let currentLetter = currentGuessArray[i];
        if (rightGuessLetterCount[currentLetter] && rightGuessLetterCount[currentLetter] > 0) {
            colors[i] = 'gold';
            rightGuessLetterCount[currentLetter]--;
        }
    }
    
    // Apply colors with animation
    for (let i = 0; i < WORD_LENGTH; i++) {
        const box = currentRowEl.children[i];
        const letter = currentGuessArray[i];
        const color = colors[i];
        
        let delay = 250 * i;
        setTimeout(() => {
            box.style.backgroundColor = color;
            shadeKeyBoard(letter, color);
        }, delay);
    }

    // Check for win/lose conditions
    if (guessString === rightGuessString.toLowerCase()) {
        setTimeout(() => {
            showNotification("You guessed right! Game over!", "success", 3000);
        }, 1500);
        currentRow = guesses;
        return;
    }
    
    if (currentRow >= guesses - 1) {
        setTimeout(() => {
            showNotification(`Game Over! The word was "${rightGuessString}"`, "error", 3000);
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