// Game state management
let gameBoard = Array(9).fill('');
let currentPlayer = 'X';
let gameMode = null; // 'pvp' or 'cpu'
let gameActive = false;

// DOM Elements
const playerButton = document.querySelector('.player');
const cpuButton = document.querySelector('.cpu');
const gameContainer = document.querySelector('.game-container');

// Create game board UI
function createGameBoard() {
    const board = document.createElement('div');
    board.classList.add('game-board'); // Add class to board

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('game-cell'); // Add class to cell
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        board.appendChild(cell);
    }

    return board;
}


// Reset game
function resetGame() {
    gameBoard = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    updateBoard();
}

// Create reset button
function createResetButton() {
    const resetButton = document.createElement('button');
    resetButton.id = 'resetGame';
    resetButton.textContent = 'Reset Game';
    resetButton.style.marginTop = '20px';
    resetButton.addEventListener('click', resetGame);
    return resetButton;
}

// Update the visual board
function updateBoard() {
    const cells = document.querySelectorAll('.game-container [data-index]');
    cells.forEach((cell, index) => {
        cell.textContent = gameBoard[index];
    });
}

// Check for winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }

    if (!gameBoard.includes('')) return 'tie';
    return null;
}

// CPU move
function cpuMove() {
    // Simple AI: Look for winning move, then blocking move, then center, then random
    const winningMove = findBestMove('O');
    if (winningMove !== -1) {
        makeMove(winningMove);
        return;
    }

    const blockingMove = findBestMove('X');
    if (blockingMove !== -1) {
        makeMove(blockingMove);
        return;
    }

    // Try center
    if (gameBoard[4] === '') {
        makeMove(4);
        return;
    }

    // Random empty cell
    const emptyCells = gameBoard.reduce((acc, cell, index) => 
        cell === '' ? [...acc, index] : acc, []);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    makeMove(randomIndex);
}

// Find best move for CPU
function findBestMove(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        const line = [gameBoard[a], gameBoard[b], gameBoard[c]];
        if (line.filter(cell => cell === player).length === 2 &&
            line.includes('')) {
            const emptyIndex = pattern[line.indexOf('')];
            if (gameBoard[emptyIndex] === '') return emptyIndex;
        }
    }
    return -1;
}

// Handle cell click
function handleCellClick(index) {
    if (!gameActive || gameBoard[index] !== '') return;
    
    makeMove(index);
    
    const winner = checkWinner();
    if (winner) {
        handleGameEnd(winner);
        return;
    }

    if (gameMode === 'cpu' && currentPlayer === 'O') {
        setTimeout(cpuMove, 500);
    }
}

// Make a move
function makeMove(index) {
    gameBoard[index] = currentPlayer;
    updateBoard();
    const winner = checkWinner();
    if (winner) {
        handleGameEnd(winner);
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Handle game end
function handleGameEnd(winner) {
    gameActive = false;
    setTimeout(() => {
        if (winner === 'tie') {
            alert("It's a tie!");
        } else {
            alert(`Player ${winner} wins!`);
        }
    }, 100);
}

// Initialize game mode
function initializeGame(mode) {
    gameMode = mode;
    gameActive = true;
    
    // Clear previous game board if it exists
    const existingBoard = gameContainer.querySelector('[data-index]')?.parentElement;
    const existingReset = document.getElementById('resetGame');
    if (existingBoard) existingBoard.remove();
    if (existingReset) existingReset.remove();
    
    // Create and append new game board
    const board = createGameBoard();
    const resetButton = createResetButton();
    gameContainer.appendChild(board);
    gameContainer.appendChild(resetButton);
    
    resetGame();
}

// Event listeners
playerButton.addEventListener('click', () => initializeGame('pvp'));
cpuButton.addEventListener('click', () => initializeGame('cpu'));

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('header').classList.toggle('dark-mode');
});

// Initialize theme based on user preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    document.querySelector('header').classList.add('dark-mode');
}