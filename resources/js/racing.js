const roadArea = document.querySelector('.road');
let player = { 
    step: 5,
    baseSpeed: 5,
    speedMultiplier: 1,
    speedBoostEndTime: 0
};
let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false, Space: false };
let score = 0;
const startBtn = document.querySelector(".btn");
let playerIsInvincible = false;
let isSpeedBoostActive = false;
const powerUpDuration = 5000; // 5 seconds
let isNightMode = false;
const nightModeBtn = document.querySelector('.night-mode-toggle');
let backgroundMusic;
let isMusicPlaying = false;
const musicVolume = 0.2; // 20% volume

function setupAudio() {
    backgroundMusic = new Audio();
    backgroundMusic.src = '../resources/music/retro-racing.mp3';
    backgroundMusic.loop = true;
    backgroundMusic.volume = musicVolume;
}

function toggleMusic() {
    if (!backgroundMusic) {
        setupAudio();
    }
    
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicBtn.textContent = '🔇';
        musicBtn.title = 'Music Off';
    } else {
        backgroundMusic.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
        musicBtn.textContent = '🔊';
        musicBtn.title = 'Music On';
    }
    isMusicPlaying = !isMusicPlaying;
}

// Add this function to your existing code
function toggleNightMode() {
    isNightMode = !isNightMode;
    const road = document.querySelector('.road');
    const playerCar = document.querySelector('.car');
    const enemies = document.querySelectorAll('.enemies');
    
    if (isNightMode) {
        road.classList.add('night-mode');
        playerCar.classList.add('headlights-on');
        enemies.forEach(enemy => enemy.classList.add('night-mode'));
        nightModeBtn.textContent = '☀️';
    } else {
        road.classList.remove('night-mode');
        playerCar.classList.remove('headlights-on');
        enemies.forEach(enemy => enemy.classList.remove('night-mode'));
        nightModeBtn.textContent = '🌙';
    }
}

const powerUps = {
    SPEED_BOOST: 'speed',
    SHIELD: 'shield'
};

const enemyCarImages = [
    '/resources/image/enemy-car-1.png',
    '/resources/image/enemy-car-2.png',
    '/resources/image/enemy-car-3.png',
    '/resources/image/enemy-car-4.png'
];

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
startBtn.addEventListener('click', startgame);

function keyDown(event) {
    if (event.key === " ") {
        event.preventDefault();
        keys.Space = true;
    } else {
        keys[event.key] = true;
    }
}

function keyUp(event) {
    if (event.key === " ") {
        keys.Space = false;
    } else {
        keys[event.key] = false;
    }
}

function moveLines() {
    let lines = document.querySelectorAll('.lines');
    lines.forEach(item => {
        if (item.y >= 700) {
            item.y = item.y - 750;
        }
        item.y = item.y + player.step;
        item.style.top = item.y + 'px';
    });
}

function moveEnemies(playercar) {
    let vehicles = document.querySelectorAll('.enemies');
    let playercarb = playercar.getBoundingClientRect();

    vehicles.forEach(item => {
        let othercarb = item.getBoundingClientRect();
        if (!playerIsInvincible && 
            !((playercarb.bottom < othercarb.top) || 
              (playercarb.top > othercarb.bottom) || 
              (playercarb.left > othercarb.right) || 
              (playercarb.right < othercarb.left))) {
            // Store night mode state before game over
            const wasNightMode = isNightMode;
            
            alert("The Final Score is " + (score) + "\n Press OK to play again");
            
            // Reset game state without page reload
            resetGameState();
            
            // Clear existing elements
            while (roadArea.firstChild) {
                roadArea.removeChild(roadArea.firstChild);
            }
            
            // Reset button state
            startBtn.style.backgroundColor = "crimson";
            startBtn.style.cursor = "pointer";
            startBtn.innerHTML = "Start Game";
            document.querySelector(".push").style.border = "5px solid crimson";
            
            // Restore night mode if it was active
            if (wasNightMode) {
                isNightMode = true;
                const road = document.querySelector('.road');
                if (road) road.classList.add('night-mode');
                nightModeBtn.textContent = '☀️';
            }
            
            return;
        }
        if (item.y >= 815) {
            score = score + 1;
            startBtn.innerHTML = "Score: " + score;
            item.y = -300;
            item.style.left = Math.floor(Math.random() * 350) + 'px';
            // Assign a new random enemy car image
            const randomImageIndex = Math.floor(Math.random() * enemyCarImages.length);
            item.style.backgroundImage = `url('${enemyCarImages[randomImageIndex]}')`;
            if (isNightMode) {
                item.classList.add('night-mode');
            }
        }
        item.y = item.y + player.step;
        item.style.top = item.y + 'px';
    });
}

function resetGameState() {
    score = 0;
    player.start = false;
    player.step = player.baseSpeed;
    player.speedMultiplier = 1;
    playerIsInvincible = false;
    isSpeedBoostActive = false;
    
    // Reset all key states
    keys = { 
        ArrowUp: false, 
        ArrowDown: false, 
        ArrowRight: false, 
        ArrowLeft: false, 
        Space: false 
    };
    
    // Remove any active power-ups
    const playerCar = document.querySelector('.car');
    if (playerCar) {
        playerCar.classList.remove('shield-active', 'speed-active');
    }
    
    // Remove any existing power-ups from the road
    const powerUps = document.querySelectorAll('.power-up');
    powerUps.forEach(powerUp => powerUp.remove());
}


function playArea() {
    let playercar = document.querySelector('.car');
    let road = roadArea.getBoundingClientRect();
    
    if (player.start) {
        moveLines();
        moveEnemies(playercar);
        createPowerUp();
        
        if (keys.ArrowUp && player.y > (road.top + 80)) {
            player.y = player.y - player.step;
        }
        if (keys.ArrowDown && player.y < (road.bottom - 150)) {
            player.y = player.y + player.step;
        }
        if (keys.ArrowLeft && player.x > 0) {
            player.x = player.x - player.step;
        }
        if (keys.ArrowRight && player.x < (road.width - 64)) {
            player.x = player.x + player.step;
        }

        playercar.style.top = player.y + 'px';
        playercar.style.left = player.x + 'px';
        window.requestAnimationFrame(playArea);
    }
}

function init() {
    player.start = true;
    player.step = player.baseSpeed;
    window.requestAnimationFrame(playArea);

    // Create road lines
    for (let i = 0; i < 5; i++) {
        let roadlines = document.createElement('div');
        roadlines.setAttribute('class', 'lines');
        roadlines.y = i * 150;
        roadlines.style.top = roadlines.y + 'px';
        roadArea.appendChild(roadlines);
    }

    // Create player car
    let playercar = document.createElement('div');
    playercar.setAttribute('class', 'car');
    // Add headlights if night mode is active
    if (isNightMode) {
        playercar.classList.add('headlights-on');
    }
    roadArea.appendChild(playercar);

    player.x = playercar.offsetLeft;
    player.y = playercar.offsetTop;

    // Create enemy cars with random images
    for (let x = 0; x < 4; x++) {
        let enemies = document.createElement('div');
        enemies.setAttribute('class', 'enemies');
        const randomImageIndex = Math.floor(Math.random() * enemyCarImages.length);
        enemies.style.backgroundImage = `url('${enemyCarImages[randomImageIndex]}')`;
        enemies.y = ((x + 1) * 350) * -1;
        enemies.style.top = enemies.y + 'px';
        enemies.style.left = Math.floor(Math.random() * 350) + 'px';
        if (isNightMode) {
            enemies.classList.add('night-mode');
        }
        roadArea.appendChild(enemies);
    }
}

nightModeBtn.addEventListener('click', toggleNightMode);

function createPowerUp() {
    if (Math.random() < 0.002) { // 5% chance to spawn a power-up
        const powerUp = document.createElement('div');
        powerUp.classList.add('power-up');
        
        // Randomly choose between shield and speed
        const type = Math.random() < 0.5 ? powerUps.SHIELD : powerUps.SPEED_BOOST;
        powerUp.classList.add(type);
        
        powerUp.style.left = Math.floor(Math.random() * (roadArea.offsetWidth - 30)) + 'px';
        powerUp.style.top = '-30px';
        powerUp.dataset.type = type;
        roadArea.appendChild(powerUp);
        
        movePowerUp(powerUp);
    }
}

function movePowerUp(powerUp) {
    let posY = 0;
    
    function animate() {
        if (!player.start) return;
        
        posY += player.step;
        powerUp.style.top = posY + 'px';
        
        // Remove if out of bounds
        if (posY > roadArea.offsetHeight) {
            powerUp.remove();
            return;
        }
        
        // Check collision with player
        const playerCar = document.querySelector('.car');
        if (isColliding(powerUp, playerCar)) {
            activatePowerUp(powerUp.dataset.type);
            powerUp.remove();
            return;
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function isColliding(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

function activatePowerUp(type) {
    const playerCar = document.querySelector('.car');
    const currentTime = Date.now();
    
    if (type === powerUps.SHIELD) {
        playerIsInvincible = true;
        playerCar.classList.add('shield-active');
        setTimeout(() => {
            playerIsInvincible = false;
            playerCar.classList.remove('shield-active');
        }, powerUpDuration);
    } 
    else if (type === powerUps.SPEED_BOOST) {
        // If speed boost is already active, extend the duration
        if (isSpeedBoostActive) {
            player.speedBoostEndTime = Math.max(player.speedBoostEndTime, currentTime + powerUpDuration);
        } else {
            // First speed boost activation
            isSpeedBoostActive = true;
            player.step = player.baseSpeed * 1.5;
            player.speedBoostEndTime = currentTime + powerUpDuration;
            playerCar.classList.add('speed-active');
        }

        // Check for speed boost end
        const checkSpeedBoostEnd = () => {
            if (currentTime >= player.speedBoostEndTime) {
                isSpeedBoostActive = false;
                player.step = player.baseSpeed;
                playerCar.classList.remove('speed-active');
            } else if (isSpeedBoostActive) {
                // Continue checking if still active
                requestAnimationFrame(checkSpeedBoostEnd);
            }
        };
        
        requestAnimationFrame(checkSpeedBoostEnd);
    }
}

const musicBtn = document.createElement('button');
musicBtn.className = 'music-toggle';
musicBtn.textContent = '🔇';
musicBtn.title = 'Music Off';
document.querySelector('.push').appendChild(musicBtn);

musicBtn.addEventListener('click', toggleMusic);

function startgame() {
    document.querySelector(".push").style.border = "5px solid rgb(86,50,57)";
    startBtn.style.backgroundColor = "rgb(86,50,57)";
    startBtn.style.cursor = "not-allowed";
    startBtn.innerHTML = "Use Arrow keys to Navigate";
    
    // Start background music if it's enabled
    if (!backgroundMusic) {
        setupAudio();
    }
    if (isMusicPlaying) {
        backgroundMusic.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
    }
    
    init();
}