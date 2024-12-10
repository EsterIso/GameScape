// platform.js
export class Game {
    constructor() {
        this.initializeGame();
        this.setupAudio();
    }

    setupAudio() {
        // Create audio element
        this.backgroundMusic = new Audio();
        this.backgroundMusic.src = '../resources/music/retro-platformer.mp3';  // Path to your music file
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.2;  // 70% volume
    }

    setupNotificationSystem() {
        // Create notification container if it doesn't exist
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'default', duration = 1500) {
        // Ensure container exists
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to container
        container.appendChild(notification);

        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Remove notification without blocking
        const removeNotification = () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode === container) {
                    container.removeChild(notification);
                }
            }, 300);
        };

        setTimeout(removeNotification, duration);
    }

    initializeGame() {
        this.player = document.querySelector('.player');
        this.container = document.querySelector('.game-container');
        if (!this.player || !this.container) {
            console.error('Required elements not found');
            return;
        }

        this.level = 1;
        this.coinsCollected = 0;
        this.playerPos = { x:50 , y: 450 };
        this.velocity = { x: 0, y: 0 };
        this.onGround = false;
        this.platforms = [];
        this.coins = [];
        this.keys = {};
        this.gameActive = true;
        this.isTransitioning = false;
        this.lives = 3; 
        this.levelCompleted = false;
        this.isDead = false;
        this.enemies = [];
        this.enemySpeed = 1;

        this.levels = {
            1: {
                platforms: [
                    { x: 0, y: 550, width: 800, height: 50 }, 
                    { x: 200, y: 450, width: 100, height: 20 },
                    { x: 400, y: 350, width: 100, height: 20 },
                    { x: 600, y: 250, width: 100, height: 20 }
                ],
                enemies: [
                    { x: 300, y: 530, width: 100, patrolStart: 200, patrolEnd: 400 }, 
                    { x: 450, y: 330, width: 80, patrolStart: 400, patrolEnd: 500 }  
                ],
                goal: { x: 700, y: 200 },
                playerStart: { x: 50, y: 450 },
                coinCount: 3
            },
            2: {
                platforms: [
                    { x: 0, y: 550, width: 800, height: 50 },
                    { x: 150, y: 450, width: 80, height: 20 },
                    { x: 350, y: 400, width: 80, height: 20 },
                    { x: 550, y: 350, width: 80, height: 20 },
                    { x: 355, y: 250, width: 80, height: 20 },
                    { x: 150, y: 200, width: 80, height: 20 }
                ],
                enemies: [
                    { x: 200, y: 530, patrolStart: 100, patrolEnd: 300 },
                    { x: 600, y: 530, patrolStart: 500, patrolEnd: 700 },
                    { x: 350, y: 230, patrolStart: 300, patrolEnd: 400 }
                ],
                goal: { x: 50, y: 150 },
                playerStart: { x: 50, y: 450 },
                coinCount: 4
            },
            3: {
                platforms: [
                    { x: 0, y: 550, width: 800, height: 50 },
                    { x: 700, y: 450, width: 100, height: 20 },
                    { x: 500, y: 400, width: 100, height: 20 },
                    { x: 300, y: 350, width: 100, height: 20 },
                    { x: 100, y: 300, width: 100, height: 20 },
                    { x: 300, y: 250, width: 100, height: 20 },
                    { x: 500, y: 200, width: 100, height: 20 },
                    { x: 700, y: 150, width: 100, height: 20 }
                ],
                enemies: [
                    { x: 200, y: 530, patrolStart: 100, patrolEnd: 400 },
                    { x: 600, y: 530, patrolStart: 400, patrolEnd: 700 },
                    { x: 300, y: 330, patrolStart: 250, patrolEnd: 350 },
                    { x: 500, y: 180, patrolStart: 450, patrolEnd: 550 }
                ],
                goal: { x: 750, y: 100 },
                playerStart: { x: 50, y: 450 },
                coinCount: 5
            },
            4: {
                platforms: [
                    { x: 0, y: 550, width: 800, height: 50 },
                    { x: 200, y: 450, width: 60, height: 20 },
                    { x: 400, y: 400, width: 60, height: 20 },
                    { x: 600, y: 350, width: 60, height: 20 },
                    { x: 400, y: 300, width: 60, height: 20 },
                    { x: 200, y: 250, width: 60, height: 20 },
                    { x: 400, y: 200, width: 60, height: 20 },
                    { x: 600, y: 150, width: 60, height: 20 }
                ],
                enemies: [
                    { x: 300, y: 530, patrolStart: 200, patrolEnd: 500 },
                    { x: 400, y: 380, patrolStart: 350, patrolEnd: 450 },
                    { x: 200, y: 230, patrolStart: 150, patrolEnd: 250 },
                    { x: 600, y: 130, patrolStart: 550, patrolEnd: 650 }
                ],
                goal: { x: 600, y: 100 },
                playerStart: { x: 50, y: 450 },
                coinCount: 6
            },
            5: {
                platforms: [
                    { x: 0, y: 550, width: 300, height: 50 },
                    { x: 500, y: 550, width: 300, height: 50 },
                    { x: 100, y: 450, width: 80, height: 20 },
                    { x: 300, y: 350, width: 80, height: 20 },
                    { x: 500, y: 350, width: 80, height: 20 },
                    { x: 700, y: 450, width: 80, height: 20 }
                ],
                enemies: [
                    { x: 150, y: 530, patrolStart: 50, patrolEnd: 250 },
                    { x: 600, y: 530, patrolStart: 500, patrolEnd: 700 },
                    { x: 400, y: 330, patrolStart: 300, patrolEnd: 500 }
                ],
                goal: { x: 750, y: 500 },
                playerStart: { x: 50, y: 450 },
                coinCount: 5
            },
            6: {
                platforms: [
                    { x: 0, y: 550, width: 800, height: 50 },
                    { x: 100, y: 500, width: 600, height: 20 },
                    { x: 200, y: 450, width: 400, height: 20 },
                    { x: 300, y: 400, width: 200, height: 20 },
                    { x: 350, y: 350, width: 100, height: 20 },
                    { x: 375, y: 300, width: 50, height: 20 }
                ],
                goal: { x: 385, y: 250 },
                playerStart: { x: 50, y: 450 },
                coinCount: 7
            },
            7: {
                platforms: [
                    { x: 0, y: 550, width: 800, height: 50 },
                    { x: 0, y: 350, width: 600, height: 20 },
                    { x: 200, y: 450, width: 600, height: 20 },
                    { x: 0, y: 250, width: 600, height: 20 },
                    { x: 200, y: 150, width: 600, height: 20 }
                ],
                goal: { x: 750, y: 100 },
                playerStart: { x: 50, y: 450 },
                coinCount: 8
            },
            8: {
                platforms: [
                    { x: 0, y: 550, width: 150, height: 50 },
                    { x: 250, y: 500, width: 100, height: 20 },
                    { x: 450, y: 450, width: 100, height: 20 },
                    { x: 650, y: 400, width: 100, height: 20 },
                    { x: 450, y: 350, width: 100, height: 20 },
                    { x: 250, y: 300, width: 100, height: 20 },
                    { x: 450, y: 250, width: 100, height: 20 },
                    { x: 650, y: 200, width: 100, height: 20 }
                ],
                goal: { x: 700, y: 150 },
                playerStart: { x: 50, y: 450 },
                coinCount: 10
            }
        };

        this.setupEventListeners();
        this.setupLevel(this.level);
        this.gameLoop();
    }

    setupEventListeners() {
        this.handleKeyDown = (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
            }
        };

        this.handleKeyUp = (e) => {
            this.keys[e.code] = false;
        };

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);

        const resetButton = document.getElementById('resetGame');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetLevel());
        }
    }

    setupLevel(level) {

        // Show title screen only on first level and game start
        if (level === 1 && !this.gameStarted) {
            this.showTitleScreen();
            return;
        }

        this.currentLevelConfig = this.levels[level];
        if (!this.currentLevelConfig) return;

        // Clear existing elements
        while (this.platforms.length) {
            const platform = this.platforms.pop();
            platform.parentNode?.removeChild(platform);
        }
        
        while (this.coins.length) {
            const coin = this.coins.pop();
            coin.parentNode?.removeChild(coin);
        }

        if (this.goal) {
            this.goal.parentNode?.removeChild(this.goal);
        }

        // Create platforms
        this.currentLevelConfig.platforms.forEach(platform => {
            const p = document.createElement('div');
            p.className = 'platform';
            p.style.left = platform.x + 'px';
            p.style.top = platform.y + 'px';
            p.style.width = platform.width + 'px';
            p.style.height = platform.height + 'px';
            this.container.appendChild(p);
            this.platforms.push(p);
        });

        // Create coins with fixed positions
        for (let i = 0; i < this.currentLevelConfig.coinCount; i++) {
            const coin = document.createElement('div');
            coin.className = 'coin';
            const platformIndex = i % this.currentLevelConfig.platforms.length;
            const platform = this.currentLevelConfig.platforms[platformIndex];
            const x = platform.x + (platform.width - 20) * ((i * 0.3) % 1);
            const y = platform.y - 40;
            coin.style.left = x + 'px';
            coin.style.top = y + 'px';
            this.container.appendChild(coin);
            this.coins.push(coin);
        }

        // Create goal
        this.goal = document.createElement('div');
        this.goal.className = 'goal';
        this.goal.style.left = this.currentLevelConfig.goal.x + 'px';
        this.goal.style.top = this.currentLevelConfig.goal.y + 'px';
        this.container.appendChild(this.goal);

        // Always reset velocity when setting up a new level
        this.velocity = { x: 0, y: 0 };
        this.playerPos = { ...this.currentLevelConfig.playerStart };
        this.updatePlayerPosition();

        // Clear existing enemies before creating new ones
        while (this.enemies.length) {
            const enemy = this.enemies.pop();
            if (enemy.element && enemy.element.parentNode) {
                enemy.element.parentNode.removeChild(enemy.element);
            }
        }

        // Create new enemies for the current level
        if (this.currentLevelConfig.enemies) {
            this.currentLevelConfig.enemies.forEach(enemyConfig => {
                const enemy = document.createElement('div');
                enemy.className = 'enemy';
                enemy.innerHTML = `
                    <div class="enemy-eyes">
                        <div class="eye left"></div>
                        <div class="eye right"></div>
                    </div>
                    <div class="enemy-mouth"></div>
                `;
                enemy.style.left = enemyConfig.x + 'px';
                enemy.style.top = enemyConfig.y + 'px';
                this.container.appendChild(enemy);
                
                this.enemies.push({
                    element: enemy,
                    x: enemyConfig.x,
                    y: enemyConfig.y,
                    patrolStart: enemyConfig.patrolStart,
                    patrolEnd: enemyConfig.patrolEnd,
                    direction: 1
                });
            });
        }

        // Update HUD with coin requirement
        const levelDisplay = document.getElementById('level');
        if (levelDisplay) {
            levelDisplay.textContent = `${this.level} (Lives: ${this.lives})`;
        }
    }

    showTitleScreen() {
        this.gameActive = false;
        
        // Create and style title screen
        const titleScreen = document.createElement('div');
        titleScreen.className = 'title-screen';
        
        // Add clouds
        for (let i = 0; i < 3; i++) {
            const cloud = document.createElement('div');
            cloud.className = `cloud cloud-${i + 1}`;
            titleScreen.appendChild(cloud);
        }
        
        // Add title and start button
        const titleContent = document.createElement('div');
        titleContent.className = 'title-content';
        titleContent.innerHTML = `
            <h1>Platform Adventure</h1>
            <p>Collect all coins to advance!</p>
            <button class="start-button">Start Game</button>
        `;
        
        titleScreen.appendChild(titleContent);
        this.container.appendChild(titleScreen);
        
        // Add click handler for start button
        const startButton = titleScreen.querySelector('.start-button');
        startButton.addEventListener('click', () => {
            this.startGame();
            titleScreen.remove();
        });
    }
    
    startGame() {
        this.gameActive = true;
        this.gameStarted = true;
        this.setupLevel(this.level);
        this.gameLoop();
        this.backgroundMusic.play().catch(error => {
            console.log('Audio autoplay failed:', error);
        });
    }

    updatePlayerPosition() {
        if (this.player) {
            this.player.style.left = `${this.playerPos.x}px`;
            this.player.style.top = `${this.playerPos.y}px`;
        }
    }

    checkCollision(rect1, rect2) {
        return !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom);
    }

    handleCollisions() {
        // Platform collisions
        this.onGround = false;
        
        const playerRect = {
            left: this.playerPos.x,
            right: this.playerPos.x + 30,
            top: this.playerPos.y,
            bottom: this.playerPos.y + 30
        };

        this.currentLevelConfig.platforms.forEach(platform => {
            const platformRect = {
                left: platform.x,
                right: platform.x + platform.width,
                top: platform.y,
                bottom: platform.y + platform.height
            };

            if (this.checkCollision(playerRect, platformRect)) {
                if (this.velocity.y > 0 && 
                    this.playerPos.y + 30 - this.velocity.y <= platform.y) {
                    this.playerPos.y = platform.y - 30;
                    this.velocity.y = 0;
                    this.onGround = true;
                }
            }
        });

        // Coin collection
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            const coinRect = coin.getBoundingClientRect();
            const playerClientRect = this.player.getBoundingClientRect();
            
            if (this.checkCollision(playerClientRect, coinRect)) {
                coin.parentNode?.removeChild(coin);
                this.coins.splice(i, 1);
                this.updateCoins(1);
                
                // If this was the last coin, show special notification
                if (this.coins.length === 0) {
                    this.showNotification('All coins collected! Head to the goal!', 'success', 1500);
                } else {
                    this.showNotification(`Coin collected! ${this.coins.length} remaining`, 'success', 1000);
                }
            }
        }

        // Goal collision with notification instead of alert
        if (this.goal) {
            const goalRect = this.goal.getBoundingClientRect();
            if (this.checkCollision(this.player.getBoundingClientRect(), goalRect)) {
                if (this.coins.length === 0 && !this.isTransitioning) {
                    this.isTransitioning = true; // Prevent multiple transitions
                    this.levelCompleted = true; // Set level as completed
                    this.showNotification('Level Complete!', 'success', 1500);
                    
                    // Delay level advance to allow for notification
                    setTimeout(() => {
                        this.nextLevel();
                        this.isTransitioning = false;
                    }, 1500);
                } else if (!this.recentGoalNotification && !this.isTransitioning) {
                    this.recentGoalNotification = true;
                    this.showNotification(`Collect all coins first! ${this.coins.length} remaining`, 'error', 1500);
                    
                    // Reset the notification flag after a delay
                    setTimeout(() => {
                        this.recentGoalNotification = false;
                    }, 1500);
                    
                    // Push player slightly away from goal
                    this.playerPos.x -= this.velocity.x * 2;
                    this.playerPos.y -= this.velocity.y * 2;
                    this.velocity.x *= -0.5;
                    this.velocity.y *= -0.5;
                }
            }
        }
    }

    handleDeath() {
        // Check if level is completed before handling death
        if (this.levelCompleted) {
            return; // Skip death handling if level is completed
        }

        this.lives--;
        this.isDead = true;
        this.showNotification('You died!', 'error', 1500);
        
        if (this.lives > 0) {
            setTimeout(() => {
                this.isDead = false;
                this.resetLevel();
                this.showNotification(`${this.lives} lives remaining`, 'default', 1500);
            }, 1500);
        } else {
            this.showNotification('Game Over!', 'error', 2000);
            setTimeout(() => {
                this.lives = 3;
                this.level = 1;
                this.coinsCollected = 0;
                this.isDead = false;
                this.levelCompleted = false; // Reset completion status
                this.setupLevel(this.level);
                this.showNotification('Starting over with 3 lives', 'default', 1500);
            }, 2000);
        }
    }
    
    checkForFall() {
        // If player is above the game area, they haven't fallen yet
        if (this.playerPos.y < 570) return false;
    
        // Get all platforms at the bottom level (y = 550)
        const bottomPlatforms = this.currentLevelConfig.platforms.filter(p => p.y >= 550);
        
        // Check if player is above any bottom platform
        for (const platform of bottomPlatforms) {
            if (this.playerPos.x >= platform.x - 30 && 
                this.playerPos.x <= platform.x + platform.width) {
                return false;
            }
        }
    
        // If we get here, player is at bottom level but not above any platform
        return true;
    }

    update() {
        if (!this.gameActive || this.isDead) return;

        // Reduced 
        this.velocity.y += 0.3; 

        // Jump 
        if (this.keys['Space'] && this.onGround) {
            this.velocity.y = -10.5; 
            this.onGround = false;
        }

        // Left/Right movement
        if (this.keys['ArrowLeft']) {
            this.velocity.x = -3; 
            this.player.style.transform = 'scaleX(-1)';
        } else if (this.keys['ArrowRight']) {
            this.velocity.x = 3; 
            this.player.style.transform = 'scaleX(1)';
        } else {
            // More friction for quicker stopping
            this.velocity.x *= 0.7; 
        }
        

        // Update position with speed limit
        this.velocity.x = Math.max(-4, Math.min(4, this.velocity.x)); 
        this.velocity.y = Math.max(-8, Math.min(8, this.velocity.y)); 
        
        this.playerPos.x += this.velocity.x;
        this.playerPos.y += this.velocity.y;

        // Update the fall check
        if (this.playerPos.y > 600) {
            this.handleDeath();
            return;
        }

        // Handle boundaries
        if (this.playerPos.x < 0) this.playerPos.x = 0;
        if (this.playerPos.x > 770) this.playerPos.x = 770;
        if (this.playerPos.y < 0) this.playerPos.y = 0;
        
        // Check for falling
        if (this.checkForFall()) {
            this.handleDeath();
            return;
        }

        // Update enemies
        this.updateEnemies();

        // Update position only if not dead
        if (!this.isDead) {
            this.handleCollisions();
            this.updatePlayerPosition();
        }
    }

    updateEnemies() {
        this.enemies.forEach((enemy, index) => {
            // Update enemy position
            enemy.x += this.enemySpeed * enemy.direction;
            
            // Change direction at patrol boundaries
            if (enemy.x <= enemy.patrolStart) {
                enemy.x = enemy.patrolStart;
                enemy.direction = 1;
                enemy.element.style.transform = 'scaleX(1)';
            } else if (enemy.x >= enemy.patrolEnd) {
                enemy.x = enemy.patrolEnd;
                enemy.direction = -1;
                enemy.element.style.transform = 'scaleX(-1)';
            }
            
            enemy.element.style.left = enemy.x + 'px';
            
            // Check collision with player
            const enemyRect = {
                left: enemy.x,
                right: enemy.x + 30,
                top: enemy.y,
                bottom: enemy.y + 30
            };
            
            const playerRect = {
                left: this.playerPos.x,
                right: this.playerPos.x + 30,
                top: this.playerPos.y,
                bottom: this.playerPos.y + 30
            };
            
            if (this.checkCollision(playerRect, enemyRect)) {
                // Check if player is above enemy (jumping on them)
                if (this.velocity.y > 0 && 
                    this.playerPos.y + 30 - this.velocity.y <= enemy.y) {
                    // Kill enemy
                    enemy.element.remove();
                    this.enemies.splice(index, 1);
                    // Bounce player
                    this.velocity.y = -8;
                    this.showNotification('Enemy defeated!', 'success', 1000);
                } else {
                    // Player dies
                    this.handleDeath();
                }
            }
        });
    }

    updateCoins(value) {
        this.coinsCollected += value;
        const coinsDisplay = document.getElementById('coins');
        if (coinsDisplay) {
            const remaining = this.coins.length;
            coinsDisplay.textContent = `${this.coinsCollected} (${remaining} remaining)`;
        }
    }

    nextLevel() {
        this.levelCompleted = false;
        this.level++;
        if (this.level > Object.keys(this.levels).length) {
            this.showNotification('Congratulations! You completed all levels!', 'success', 2000);
            this.level = 1;
            this.velocity = { x: 0, y: 0 };
        }
        this.setupLevel(this.level);
    }

    resetLevel() {
        this.setupLevel(this.level);
    }

    gameLoop = () => {
        if (this.gameActive) {
            this.update();
            requestAnimationFrame(this.gameLoop);
        }
    };
}