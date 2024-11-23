const guesses = 6;

let guesses_remaining = guesses;

// Game state management
let gameBoard = Array(25).fill('');

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
        let row = document.createElement("div")
        row.className = "letter-row"

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "game-cell"
            row.appendChild(box)
        }
        board.appendChild(row)
    }
    return board;
}

// Create keyboard UI
function createKeyboard() {
    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');

    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter','Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Del']
    ];

    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');

        row.forEach(letter => {
            const key = document.createElement('button');
            key.classList.add('keyboard-key');
            // Add data attribute for specific key
            key.dataset.key = letter.toLowerCase();
            // Or add specific class
            key.classList.add(`key-${letter.toLowerCase()}`);
            key.textContent = letter;
            key.addEventListener('click', () => handleKeyPress(letter));
            rowDiv.appendChild(key);
        });

        keyboard.appendChild(rowDiv);
    });

    return keyboard;
}

// Handle key press
function handleKeyPress(letter) {
    console.log(`Key pressed: ${letter}`);
    // Add your letter handling logic here
    if (gameBoard[index] !== '') return;


}