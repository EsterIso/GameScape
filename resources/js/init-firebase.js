// init-firebase.js
import { db } from './firebase-config.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

async function initializeGames() {
    const games = [
        { id: 'tictactoe', name: 'TicTacToe', activePlayers: 0, totalPlays: 0 },
        { id: 'memory', name: 'Matching Game', activePlayers: 0, totalPlays: 0 },
        { id: 'letterbox', name: 'LetterBox', activePlayers: 0, totalPlays: 0 },
        { id: 'platform', name: '2D Platformer', activePlayers: 0, totalPlays: 0 },
        { id: 'racing', name: 'Track Attack', activePlayers: 0, totalPlays: 0 }
    ];

    for (const game of games) {
        try {
            console.log(`Initializing ${game.name}...`);
            await setDoc(doc(db, 'games', game.id), game);
            console.log(`${game.name} initialized successfully`);
        } catch (error) {
            console.error(`Error initializing ${game.name}:`, error);
        }
    }
    console.log('All games initialized');
}

// Run the initialization
initializeGames();