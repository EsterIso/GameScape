// firebase-dashboard.js
import { db } from './firebase-config.js';
import { onClerkLoaded } from './clerk.js';
import { 
  collection, 
  getDocs,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp,
  setDoc,
  doc,
  getDoc,  
  updateDoc,
  increment,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Track when a new player signs in for the first time
async function trackNewPlayer(user) {
  try {
    console.log('Attempting to track new player:', user.id);
    const playerRef = doc(db, 'players', user.id);
    await setDoc(playerRef, {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      firstLogin: serverTimestamp(),
      lastActive: serverTimestamp(),
      totalGamesPlayed: 0
    }, { merge: true });
    console.log('Successfully tracked new player:', user.id);
  } catch (error) {
    console.error('Error tracking new player:', error);
  }
}

// Update player's last active timestamp
async function updatePlayerActivity(userId) {
  if (!userId) return;
  try {
    const playerRef = doc(db, 'players', userId);
    await updateDoc(playerRef, {
      lastActive: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating player activity:', error);
  }
}

// Track game start
async function trackGameStart(gameId, userId) {
  if (!userId) return;
  try {
    // Update player's game count
    const playerRef = doc(db, 'players', userId);
    await updateDoc(playerRef, {
      totalGamesPlayed: increment(1),
      lastActive: serverTimestamp()
    });

    // Record game session
    const sessionId = `${userId}_${gameId}_${Date.now()}`;
    await setDoc(doc(db, 'gameSessions', sessionId), {
      userId,
      gameId,
      startTime: serverTimestamp(),
      active: true
    });

    // Update active games count
    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, {
      activePlayers: increment(1),
      totalPlays: increment(1)
    });
  } catch (error) {
    console.error('Error tracking game start:', error);
  }
}

// Track game end
async function trackGameEnd(gameId, userId) {
  if (!userId) return;
  try {
    // Find and update the game session
    const sessionsQuery = query(
      collection(db, 'gameSessions'),
      where('userId', '==', userId),
      where('gameId', '==', gameId),
      where('active', '==', true),
      limit(1)
    );

    const snapshot = await getDocs(sessionsQuery);
    if (!snapshot.empty) {
      const sessionDoc = snapshot.docs[0];
      await updateDoc(doc(db, 'gameSessions', sessionDoc.id), {
        endTime: serverTimestamp(),
        active: false
      });
    }

    // Update active games count
    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, {
      activePlayers: increment(-1)
    });
  } catch (error) {
    console.error('Error tracking game end:', error);
  }
}

// Initialize dashboard stats
function initializeDashboardStats() {
  // Only initialize stats if we're on the main dashboard page
  const isMainDashboard = window.location.pathname === '/' || 
                         window.location.pathname === '/index.html';

  if (!isMainDashboard) {
    console.log('Not on dashboard page, skipping stats initialization');
    return;
  }

  // Total games (number of game types)
  onSnapshot(collection(db, 'games'), (snapshot) => {
    const totalGamesElement = document.getElementById('total-games');
    if (totalGamesElement) {
      totalGamesElement.textContent = snapshot.size || 5;
    }
  });

  // Active players (players in active game sessions)
  const activeSessionsQuery = query(
    collection(db, 'gameSessions'),
    where('active', '==', true)
  );

  onSnapshot(activeSessionsQuery, (snapshot) => {
    const activePlayersElement = document.getElementById('active-players');
    if (activePlayersElement) {
      activePlayersElement.textContent = snapshot.size || 0;
    }
  });

  // Total registered players
  onSnapshot(collection(db, 'players'), (snapshot) => {
    const totalPlayersElement = document.getElementById('total-players');
    if (totalPlayersElement) {
      totalPlayersElement.textContent = snapshot.size || 0;
    }
  });

  // Average game rating
  onSnapshot(collection(db, 'gameRatings'), (snapshot) => {
    const avgRatingElement = document.getElementById('avg-rating');
    if (avgRatingElement && !snapshot.empty) {
      let totalRating = 0;
      snapshot.forEach(doc => {
        const rating = doc.data().rating;
        if (typeof rating === 'number') {
          totalRating += rating;
        }
      });
      avgRatingElement.textContent = (totalRating / snapshot.size).toFixed(1);
    }
  });
}

// Initialize everything and set up Clerk listeners
// Initialize everything and set up Clerk listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('Starting Firebase initialization...');
  
  // Initialize dashboard stats
  initializeDashboardStats();

  // Wait for Clerk to be ready
  onClerkLoaded(() => {
      console.log('Clerk is now available, setting up auth listener...');
      
      Clerk.addListener(async ({ user, type }) => {
          console.log('Clerk auth event:', type, user?.id);
          
          if (user) {
              try {
                  // Check if player document exists
                  const playerRef = doc(db, 'players', user.id);
                  const playerDoc = await getDoc(playerRef);
                  
                  if (!playerDoc.exists()) {
                      console.log('Creating new player document for:', user.id);
                      await setDoc(playerRef, {
                          id: user.id,
                          email: user.emailAddresses[0]?.emailAddress,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          firstLogin: serverTimestamp(),
                          lastActive: serverTimestamp(),
                          totalGamesPlayed: 0
                      });
                      console.log('Player document created successfully');
                  } else {
                      console.log('Updating existing player activity');
                      await updateDoc(playerRef, {
                          lastActive: serverTimestamp()
                      });
                  }

                  // Set up activity tracking
                  const activityInterval = setInterval(() => {
                      updatePlayerActivity(user.id);
                  }, 60000);

                  // Clean up interval when user signs out
                  window.addEventListener('beforeunload', () => {
                      clearInterval(activityInterval);
                  });
              } catch (error) {
                  console.error('Error handling user:', error);
              }
          }
      });
  });
});

// Export functions for use in game files
export {
  trackGameStart,
  trackGameEnd,
  updatePlayerActivity,

};

window.trackGameStart = trackGameStart;
window.trackGameEnd = trackGameEnd;