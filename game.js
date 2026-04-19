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
const COLOR_PLAYER = 0x00ff00;
const COLOR_BULLET = 0xffff00;
const COLOR_ENEMY = 0xff0000;
const COLOR_BG = 0x000011;

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        // Create score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '24px', 
            fill: '#ffffff' 
        });
        this.scoreText.setDepth(100);
        
        // Create player
        this.player = this.add.rectangle(
            BASE_WIDTH / 2,
            BASE_HEIGHT - 80,
            PLAYER_SIZE,
            PLAYER_SIZE,
            COLOR_PLAYER
        );
        this.player.setOrigin(0.5, 0.5);
        this.player.setDepth(10);
        
        // Add physics
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setMaxVelocity(PLAYER_SPEED, PLAYER_SPEED);
        
        // Create groups
        this.bullets = this.physics.add.group();
        this.enemies = this.physics.add.group();
        
        // Load WASD and Arrow keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        
        // Set up collisions
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, null, this);
        
        // Set physics world bounds
        this.physics.world.setBounds(0, 0, BASE_WIDTH, BASE_HEIGHT);
        
        this.score = 0;
        this.lastFired = 0;
        this.lastSpawned = 0;
        
        console.log('[INIT] Game started. Press SPACE to shoot.');
    }

    update() {
        this.handleMovement();
        this.handleShooting();
        this.handleSpawning();
        this.cleanupOffScreen();
    }

    handleMovement() {
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
        
        // Normalize diagonal movement
        if (vx !== 0 && vy !== 0) {
            const length = Math.sqrt(vx * vx + vy * vy);
            vx = vx / length;
            vy = vy / length;
        }
        
        this.player.body.setVelocity(vx * PLAYER_SPEED, vy * PLAYER_SPEED);
    }

    handleShooting() {
        const spaceDown = this.cursors.space.isDown;
        const elapsed = this.time.now - this.lastFired;
        
        if (spaceDown && elapsed > FIRE_COOLDOWN) {
            this.createFireBullet();
            this.lastFired = this.time.now;
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

        bullet.setOrigin(0.5, 0.5);
        bullet.setDepth(20);
        this.physics.add.existing(bullet);
        this.bullets.add(bullet);
        
        bullet.body.setVelocity(0, -BULLET_SPEED);
        bullet.body.allowGravity = false;
    }

    handleSpawning() {
        const now = this.time.now;
        const elapsed = now - this.lastSpawned;
        const shouldSpawn = (this.lastSpawned === 0 || elapsed > ENEMY_SPAWN_RATE);
        
        if (shouldSpawn) {
            this.spawnEnemy();
            this.lastSpawned = now;
        }
    }

    spawnEnemy() {
        const x = Phaser.Math.Between(ENEMY_SIZE / 2, BASE_WIDTH - ENEMY_SIZE / 2);
        const enemy = this.add.rectangle(
            x,
            0,
            ENEMY_SIZE,
            ENEMY_SIZE,
            COLOR_ENEMY
        );

        enemy.setOrigin(0.5, 0.5);
        enemy.setDepth(5);
        this.physics.add.existing(enemy);
        this.enemies.add(enemy);
        
        enemy.body.setVelocity(0, ENEMY_SPEED);
        enemy.body.allowGravity = false;
    }

    cleanupOffScreen() {
        // Remove bullets that are off screen
        this.bullets.getChildren().forEach(bullet => {
            if (bullet.y < -10 || bullet.y > BASE_HEIGHT + 10) {
                bullet.destroy();
            }
        });
        
        // Remove enemies that are off screen
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.y > BASE_HEIGHT + 10) {
                enemy.destroy();
            }
        });
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
}

// Create the game
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
            gravity: { y: 0 },
            debugShowBody: false
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: MainScene
};

const game = new Phaser.Game(config);