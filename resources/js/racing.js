const roadArea = document.querySelector('.road');
let player = { 
    step: 5,
    baseSpeed: 5,
    speedMultiplier: 1,
    speedBoostEndTime: 0,
    start: false,
    x: 0,
    y: 0
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

function toggleNightMode() {
    isNightMode = !isNightMode;
    const road = document.querySelector('.road');
    const playerCar = document.querySelector('.car');
    const enemies = document.querySelectorAll('.enemies');
    
    if (isNightMode) {
        road.classList.add('night-mode');
        playerCar?.classList.add('headlights-on');
        enemies.forEach(enemy => enemy.classList.add('night-mode'));
        nightModeBtn.textContent = '☀️';
    } else {
        road.classList.remove('night-mode');
        playerCar?.classList.remove('headlights-on');
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
    const roadHeight = roadArea.offsetHeight;
    const lineHeight = roadHeight * 0.15; // Match the 15% height from CSS
    const totalLines = Math.ceil(roadHeight / (lineHeight * 0.7)) + 1; // Add extra line for smooth transition
    
    // Create or remove lines based on road size
    const currentLines = lines.length;
    if (currentLines < totalLines) {
        for (let i = currentLines; i < totalLines; i++) {
            let roadline = document.createElement('div');
            roadline.setAttribute('class', 'lines');
            roadline.y = i * (lineHeight * 0.7);
            roadline.style.top = roadline.y + 'px';
            roadArea.appendChild(roadline);
        }
    } else if (currentLines > totalLines) {
        for (let i = totalLines; i < currentLines; i++) {
            if (lines[i]) lines[i].remove();
        }
    }

    // Update lines position
    lines = document.querySelectorAll('.lines'); // Refresh lines collection
    lines.forEach(item => {
        if (item.y >= roadHeight) {
            item.y = item.y - (roadHeight + lineHeight);
        }
        item.y = item.y + player.step;
        item.style.top = item.y + 'px';
    });
}


function moveEnemies(playercar) {
    let vehicles = document.querySelectorAll('.enemies');
    let playercarb = playercar.getBoundingClientRect();
    const roadHeight = roadArea.offsetHeight;

    vehicles.forEach(item => {
        let othercarb = item.getBoundingClientRect();
        
        // Collision detection
        if (!playerIsInvincible && 
            !((playercarb.bottom < othercarb.top) || 
              (playercarb.top > othercarb.bottom) || 
              (playercarb.left > othercarb.right) || 
              (playercarb.right < othercarb.left))) {
            const wasNightMode = isNightMode;
            endGame(wasNightMode);
            return;
        }

        // Reset enemy position when it goes off screen
        if (item.y >= roadHeight) {
            score = score + 1;
            startBtn.innerHTML = "Score: " + score;
            item.y = -100; // Start slightly above the road
            item.style.left = Math.floor(Math.random() * (roadArea.offsetWidth - 50)) + 'px';
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

function createPowerUp() {
    if (Math.random() < 0.002) { // 0.2% chance to spawn a power-up
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
    if (!element1 || !element2) return false;
    
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
        setTimeout(() => {
            isSpeedBoostActive = false;
            player.step = player.baseSpeed;
            playerCar.classList.remove('speed-active');
        }, powerUpDuration);
    }
}

function playArea() {
    let playercar = document.querySelector('.car');
    let road = roadArea.getBoundingClientRect();
    
    if (player.start) {
        moveLines();
        moveEnemies(playercar);
        createPowerUp();
        
        if (keys.ArrowUp && player.y > (road.top + 70)) {
            player.y = player.y - player.step;
        }
        if (keys.ArrowDown && player.y < (road.bottom - 85)) {
            player.y = player.y + player.step;
        }
        if (keys.ArrowLeft && player.x > 0) {
            player.x = player.x - player.step;
        }
        if (keys.ArrowRight && player.x < (road.width - 50)) {
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
    const roadHeight = roadArea.offsetHeight;
    const lineHeight = roadHeight * 0.15;
    const totalLines = Math.ceil(roadHeight / (lineHeight * 0.7)) + 1;

    // Create initial road lines
    for (let i = 0; i < totalLines; i++) {
        let roadlines = document.createElement('div');
        roadlines.setAttribute('class', 'lines');
        roadlines.y = i * (lineHeight * 0.7);
        roadlines.style.top = roadlines.y + 'px';
        roadArea.appendChild(roadlines);
    }

    // Create player car
    let playercar = document.createElement('div');
    playercar.setAttribute('class', 'car');
    if (isNightMode) {
        playercar.classList.add('headlights-on');
    }
    roadArea.appendChild(playercar);

    // Set initial position
    player.x = (roadArea.offsetWidth - 50) / 2;
    player.y = roadHeight - 120;

    // Create enemy cars
    for (let x = 0; x < 4; x++) {
        let enemies = document.createElement('div');
        enemies.setAttribute('class', 'enemies');
        const randomImageIndex = Math.floor(Math.random() * enemyCarImages.length);
        enemies.style.backgroundImage = `url('${enemyCarImages[randomImageIndex]}')`;
        enemies.y = ((x + 1) * 350) * -1;
        enemies.style.top = enemies.y + 'px';
        enemies.style.left = Math.floor(Math.random() * (roadArea.offsetWidth - 50)) + 'px';
        if (isNightMode) {
            enemies.classList.add('night-mode');
        }
        roadArea.appendChild(enemies);
    }
    
    window.requestAnimationFrame(playArea);
}

function resetGameState() {
    score = 0;
    player.start = false;
    player.step = player.baseSpeed;
    player.speedMultiplier = 1;
    playerIsInvincible = false;
    isSpeedBoostActive = false;
    
    keys = { 
        ArrowUp: false, 
        ArrowDown: false, 
        ArrowRight: false, 
        ArrowLeft: false, 
        Space: false 
    };
    
    const playerCar = document.querySelector('.car');
    if (playerCar) {
        playerCar.classList.remove('shield-active', 'speed-active');
    }
    
    const powerUps = document.querySelectorAll('.power-up');
    powerUps.forEach(powerUp => powerUp.remove());
}

function endGame(wasNightMode) {
    alert("The Final Score is " + (score) + "\n Press OK to play again");
    resetGameState();
    
    while (roadArea.firstChild) {
        roadArea.removeChild(roadArea.firstChild);
    }
    
    startBtn.style.backgroundColor = "crimson";
    startBtn.style.cursor = "pointer";
    startBtn.innerHTML = "Start Game";
    document.querySelector(".push").style.border = "5px solid crimson";
    
    if (wasNightMode) {
        isNightMode = true;
        roadArea.classList.add('night-mode');
        nightModeBtn.textContent = '☀️';
    }
}

// Setup music controls
const musicBtn = document.createElement('button');
musicBtn.className = 'music-toggle';
musicBtn.textContent = '🔇';
musicBtn.title = 'Music Off';
document.querySelector('.push').appendChild(musicBtn);

musicBtn.addEventListener('click', toggleMusic);
nightModeBtn.addEventListener('click', toggleNightMode);

function startgame() {
    document.querySelector(".push").style.border = "5px solid rgb(86,50,57)";
    startBtn.style.backgroundColor = "rgb(86,50,57)";
    startBtn.style.cursor = "not-allowed";
    startBtn.innerHTML = "Use Arrow keys to Navigate";
    
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