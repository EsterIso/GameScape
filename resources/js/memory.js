const emojis = ['🧛', '🧟‍♀️', '🧙', '🦹', '🥷', '🧜‍♂️', '🧌', '🧚'];
let cards = [...emojis, ...emojis];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(emoji, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    
    const front = document.createElement('div');
    front.className = 'card-front';
    front.textContent = '?';

    const back = document.createElement('div');
    back.className = 'card-back';
    back.textContent = emoji;

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', () => flipCard(card, emoji));
    return card;
}

function flipCard(card, emoji) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push({ card, emoji });

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        canFlip = false;

        checkMatch();
    }
}

function checkMatch() {
    const [first, second] = flippedCards;
    
    if (first.emoji === second.emoji) {
        first.card.classList.add('matched');
        second.card.classList.add('matched');
        matchedPairs++;
        document.getElementById('matches').textContent = matchedPairs;

        if (matchedPairs === emojis.length) {
            setTimeout(() => alert('Congratulations! You won!'), 500);
        }
    } else {
        setTimeout(() => {
            first.card.classList.remove('flipped');
            second.card.classList.remove('flipped');
        }, 1000);
    }

    setTimeout(() => {
        flippedCards = [];
        canFlip = true;
    }, 1000);
}

function resetGame() {
    const gameGrid = document.getElementById('gameGrid');
    gameGrid.innerHTML = '';
    matchedPairs = 0;
    moves = 0;
    document.getElementById('moves').textContent = moves;
    document.getElementById('matches').textContent = matchedPairs;
    flippedCards = [];
    canFlip = true;
    initializeGame();
}

function initializeGame() {
    shuffle(cards);
    const gameGrid = document.getElementById('gameGrid');
    cards.forEach((emoji, index) => {
        gameGrid.appendChild(createCard(emoji, index));
    });
}

document.addEventListener('DOMContentLoaded', initializeGame);