const BASE_WIDTH = 360;
const BASE_HEIGHT = 640;
const PLAYER_SIZE = 24;
const PLAYER_SPEED = 300;
const BULLET_SIZE = 6;
const BULLET_SPEED = 500;
const ENEMY_SIZE = 32;
const ENEMY_SPEED = 100;
const ENEMY_SPAWN_RATE = 2000;
const FIRE_COOLDOWN = 200;
const AUTO_FIRE_HOLD_TIME = 2000;
const DPAD_BUTTON_SIZE = 35;
const DPAD_SPACING = 12;
const FIRE_BUTTON_SIZE = 45;
const BUTTON_OPACITY_INACTIVE = 0.4;
const BUTTON_OPACITY_ACTIVE = 0.8;
const SETTINGS_BUTTON_SIZE = 25;
const COLOR_PLAYER = 0x00ff00;
const COLOR_BULLET = 0xffff00;
const COLOR_ENEMY = 0xff0000;
const COLOR_BG = 0x000011;
const COLOR_BUTTON = 0x222244;
const COLOR_BUTTON_ACTIVE = 0x444477;
const COLOR_BUTTON_BORDER = 0x6666aa;
const COLOR_SETTINGS = 0x6666aa;

let settingsData = {
    dPadPosition: 'right',
    touchEnabled: true,
    autofireDefault: false
};

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        console.log("Starting Scene Creation");
        // Create score text with fixed positioning
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '24px', 
            fill: '#ffffff' 
        });
        this.scoreText.setDepth(100);
        console.log("Score text created");

        // Create player with specific rendering
        this.player = this.add.rectangle(
            BASE_WIDTH / 2,
            BASE_HEIGHT - 80,
            PLAYER_SIZE,
            PLAYER_SIZE,
            COLOR_PLAYER
        );
        this.player.setDepth(10);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setMaxVelocity(PLAYER_SPEED, PLAYER_SPEED);
        console.log("Player created - X:", this.player.x, "Y:", this.player.y);

        // Create groups (make sure groups are initialized properly)
        this.bullets = this.physics.add.group();
        this.enemies = this.physics.add.group();
        console.log("Groups created - bullets:", this.bullets.getChildren().length, "enemies:", this.enemies.getChildren().length);

        // Load WASD and Arrow keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        
        // Setup collisions
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, null, this);
        console.log("Collisions set up");

        this.score = 0;
        this.lastFired = 0;
        this.lastSpawned = 0;
        
        // Additional safety check to force physics state
        this.enemies.getChildren().forEach((enemy, index) => {
            console.log("Enemy in group:", index, "x:", enemy.x, "y:", enemy.y);
        });
        
        console.log("Scene creation complete");
    }

    update(time, delta) {
        // Make sure we have objects before updating
        if (!this.player || !this.enemies) {
            console.log("Missing objects in update");
            return;
        }
        
        this.movePlayer();
        this.handleShooting(time);
        this.handleSpawning();
        this.cleanupOffScreen();
    }

    movePlayer() {
        if (!this.player) return;
        
        let vx = 0;
        let vy = 0;
        
        if (this.cursors.left.isDown) vx -= 1;
        if (this.cursors.right.isDown) vx += 1;
        if (this.cursors.up.isDown) vy -= 1;
        if (this.cursors.down.isDown) vy += 1;
        
        if (this.wasd.left.isDown) vx -= 1;
        if (this.wasd.right.isDown) vx += 1;
        if (this.wasd.up.isDown) vy -= 1;
        if (this.wasd.down.isDown) vy += 1;
        
        // Normalize diagonal
        if (vx !== 0 && vy !== 0) {
            const length = Math.sqrt(vx * vx + vy * vy);
            vx = vx / length;
            vy = vy / length;
        }
        
        this.player.body.setVelocity(vx * PLAYER_SPEED, vy * PLAYER_SPEED);
    }

    handleShooting(time) {
        if (this.cursors.space.isDown && (time - this.lastFired) > FIRE_COOLDOWN) {
            this.createFireBullet();
            this.lastFired = time;
        }
    }

    createFireBullet() {
        const bullet = this.add.rectangle(
            this.player.x,
            this.player.y - PLAYER_SIZE,
            BULLET_SIZE,
            BULLET_SIZE * 2,
            COLOR_BULLET
        );
        this.physics.add.existing(bullet);
        bullet.body.setVelocity(0, -BULLET_SPEED);
        bullet.body.allowGravity = false;
        this.bullets.add(bullet);
        bullet.setDepth(20);
        console.log("Bullet created at X:", bullet.x, "Y:", bullet.y);
    }

    handleSpawning() {
        if ((this.time.now - this.lastSpawned) > ENEMY_SPAWN_RATE) {
            this.spawnEnemy();
        }
    }

    spawnEnemy() {
        console.log("Spawning enemy at time:", this.time.now);
        const x = Phaser.Math.Between(ENEMY_SIZE / 2, BASE_WIDTH - ENEMY_SIZE / 2);
        const enemy = this.add.rectangle(
            x,
            -ENEMY_SIZE / 2,
            ENEMY_SIZE,
            ENEMY_SIZE,
            COLOR_ENEMY
        );
        console.log("Rectangle created with x:", x);
        this.physics.add.existing(enemy);
        console.log("Physics added successfully");
        enemy.body.setVelocity(0, ENEMY_SPEED);
        enemy.body.allowGravity = false;
        this.enemies.add(enemy);
        enemy.setDepth(5);
        this.lastSpawned = this.time.now;
        console.log("Enemy spawned successfully");
    }

    hitEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

    hitPlayer(player, enemy) {
        enemy.destroy();
        this.score -= 5;
        this.scoreText.setText('Score: ' + this.score);
    }

    cleanupOffScreen() {
        const bullets = this.bullets.getChildren();
        bullets.forEach(bullet => {
            if (bullet.y < -50) {
                bullet.destroy();
            }
        });
        
        const enemies = this.enemies.getChildren();
        enemies.forEach(enemy => {
            if (enemy.y > BASE_HEIGHT + 50) {
                enemy.destroy();
            }
        });
    }
}

// Create the Phaser game
const config = {
    type: Phaser.AUTO,
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#' + COLOR_BG.toString(16).padStart(6, '0'),
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }  // Disable gravity for top-down
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: MainScene
};

console.log("Creating Phaser game");
const game = new Phaser.Game(config);
console.log("Phaser game created successfully");

function loadSettings() {
    const saved = localStorage.getItem('bulletHellSettings');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            settingsData = Object.assign(settingsData, parsed);
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
    }
}

function saveSettings() {
    try {
        localStorage.setItem('bulletHellSettings', JSON.stringify(settingsData));
    } catch (e) {
        console.error('Failed to save settings:', e);
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    try {
        if (game && game.scene) {
            const currentScene = game.scene.getScene('MainScene');
            if (currentScene && currentScene.resize) {
                currentScene.resize();
            }
        }
    } catch (e) {
        console.error('Resize error:', e);
    }
});

// Load settings on startup
loadSettings();