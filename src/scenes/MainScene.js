import Phaser from 'phaser';
import { CONSTANTS } from '../config/gameConstants.js';
import { BulletFactory } from '../bullets/BulletFactory.js';
import { SpawnerSystem } from '../system/SpawnerSystem.js';
import { CollisionSystem } from '../system/CollisionSystem.js';
import { getEnemyClass } from '../enemies/EnemyRegistry.js';
import DebugSystem from '../system/DebugSystem.js';
import PauseManager from '../system/PauseManager.js';
import WeaponManager from '../weapons/WeaponManager.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }
    
    create() {
        // Initialize score
        this.score = 0;
        this.lastFired = 0;
        
        // Create score text
        this.scoreText = this.add.text(
            16,
            16,
            'Score: 0',
            { fontSize: '24px', fill: '#ffffff' }
        );
        this.scoreText.setDepth(CONSTANTS.DEPTH_TEXT);
        
        // Create player
        this.player = this.add.rectangle(
            CONSTANTS.BASE_WIDTH / 2,
            CONSTANTS.PLAYER_START_Y,
            CONSTANTS.PLAYER_SIZE,
            CONSTANTS.PLAYER_SIZE,
            CONSTANTS.PLAYER_COLOR
        );
        this.player.setDepth(CONSTANTS.DEPTH_PLAYER);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setMaxVelocity(CONSTANTS.PLAYER_SPEED, CONSTANTS.PLAYER_SPEED);
        this.applyPlayerHitbox();
        
        // Create physics groups
        this.playerBullets = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.enemies = this.physics.add.group();
        
        // Setup input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        
        // Initialize systems
        this.spawnerSystem = new SpawnerSystem(this);
        this.collisionSystem = new CollisionSystem(this);
        this.pauseManager = new PauseManager(this);
        this.debugSystem = new DebugSystem(this);
        this.debugSystem.setPauseManager(this.pauseManager);
        this.weaponManager = new WeaponManager(this);
        this.weaponManager.equipWeapon('SPREAD');
        
        // Track active enemies
        this.activeEnemies = [];
        
        // Setup touch controls
        this.input.on('pointerdown', this.handleTouchStart, this);
    }
    
    update(time, delta) {
        this.debugSystem.update();

        if (this.pauseManager.isGamePaused()) {
            return;
        }

        this.movePlayer(time, delta);
        this.handleShooting(time);
        this.spawnerSystem.update(time);
        this.updateEnemies(time, delta);
        this.cleanupOffScreen();
    }
    
    movePlayer(time, delta) {
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
        
        this.player.body.setVelocity(vx * CONSTANTS.PLAYER_SPEED, vy * CONSTANTS.PLAYER_SPEED);
    }
    
    handleShooting(time) {
        // Auto-shoot if enabled
        if (this.weaponManager.isAutoShootEnabled()) {
            this.weaponManager.fire(time, this.player.x, this.player.y - CONSTANTS.PLAYER_SIZE / 2);
        }
        
        // Manual fire with spacebar (overrides cooldown)
        if (this.cursors.space.isDown && time - this.lastFired > CONSTANTS.FIRE_COOLDOWN) {
            this.weaponManager.fire(time, this.player.x, this.player.y - CONSTANTS.PLAYER_SIZE / 2);
            this.lastFired = time;
        }
    }
    
    updateEnemies(time, delta) {
        // Update all tracked enemies directly
        this.activeEnemies.forEach(enemy => {
            if (!enemy.isDestroyed) {
                enemy.update(time, delta);
            }
        });
    }
    
    handleTouchStart(pointer) {
        if (this.pauseManager.isGamePaused()) {
            return;
        }
        
        this.activePointerId = pointer.identifier;
        this.touchHome = { x: pointer.x, y: pointer.y };
        this.playerHome = { x: this.player.x, y: this.player.y };
    }
    
    handleTouchMove(pointer) {
        if (this.pauseManager.isGamePaused()) {
            return;
        }
        
        if (pointer.identifier !== this.activePointerId) {
            return;
        }
        
        if (!this.touchHome || !this.playerHome) {
            return;
        }
        
        const dx = pointer.x - this.touchHome.x;
        const dy = pointer.y - this.touchHome.y;
        
        const hitboxHalfSize = CONSTANTS.PLAYER_SIZE / 2 - 2;
        
        this.player.x = Phaser.Math.Clamp(
            this.playerHome.x + dx,
            hitboxHalfSize,
            CONSTANTS.BASE_WIDTH - hitboxHalfSize
        );
        this.player.y = Phaser.Math.Clamp(
            this.playerHome.y + dy,
            hitboxHalfSize,
            CONSTANTS.BASE_HEIGHT - hitboxHalfSize
        );
    }
    
    handleTouchEnd(pointer) {
        if (this.pauseManager.isGamePaused()) {
            return;
        }
        
        if (pointer.identifier !== this.activePointerId) {
            return;
        }
        
        this.activePointerId = null;
        this.touchHome = null;
        this.playerHome = null;
    }
    
    cleanupOffScreen() {
        // Clean up player bullets
        this.playerBullets.getChildren().forEach(bullet => {
            if (bullet.y < -50) {
                bullet.destroy();
            }
        });
        
        // Clean up enemy bullets
        this.enemyBullets.getChildren().forEach(bullet => {
            if (
                bullet.x < -50 ||
                bullet.x > CONSTANTS.BASE_WIDTH + 50 ||
                bullet.y < -50 ||
                bullet.y > CONSTANTS.BASE_HEIGHT + 50
            ) {
                bullet.destroy();
            }
        });
    }
    
    updateScoreText() {
        this.scoreText.setText('Score: ' + this.score);
    }
    
    applyPlayerHitbox() {
        const hitbox = {
            type: 'rectangle',
            width: 16,
            height: 16,
            offsetX: 4,
            offsetY: 4
        };
        
        if (hitbox.type === 'rectangle') {
            this.player.body.setSize(hitbox.width, hitbox.height);
            this.player.body.setOffset(hitbox.offsetX, hitbox.offsetY);
        }
    }

    destroy() {
        this.debugSystem.destroy();
        this.spawnerSystem.destroy();
        this.collisionSystem.destroy();

        if (this.pauseManager.isGamePaused()) {
            console.warn('[MainScene] Destroying while paused! Game state inconsistent.');
        }

        this.pauseManager.destroy();
    }
}
