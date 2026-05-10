import { CONSTANTS } from '../config/gameConstants.js';

export class CollisionSystem {
    constructor(scene) {
        this.scene = scene;
        this.setupCollisions();
    }
    
    setupCollisions() {
        // Player bullets hit enemies
        this.scene.physics.add.overlap(
            this.scene.playerBullets,
            this.scene.enemies,
            this.handleBulletEnemy,
            null,
            this
        );
        
        // Enemy bullets hit player
        this.scene.physics.add.overlap(
            this.scene.player,
            this.scene.enemyBullets,
            this.handleEnemyBulletPlayer,
            null,
            this
        );
        
        // Enemies hit player
        this.scene.physics.add.overlap(
            this.scene.player,
            this.scene.enemies,
            this.handleEnemyPlayer,
            null,
            this
        );
    }
    
    handleBulletEnemy(bullet, enemy) {
        if (bullet.isDestroyed || enemy.isDestroyed) return;
        
        bullet.destroy();
        const enemyInstance = enemy.getData('enemyInstance');
        if (enemyInstance) {
            const damage = bullet.damage || CONSTANTS.BULLET_DAMAGE;
            enemyInstance.takeDamage(damage);
        }
    }
    
    handleEnemyBulletPlayer(player, bullet) {
        if (bullet.isDestroyed) return;
        
        bullet.destroy();
        this.scene.score -= 5;
        this.scene.updateScoreText();
        
        // Visual feedback - flash player
        this.flashPlayer();
    }
    
    handleEnemyPlayer(player, enemy) {
        if (enemy.isDestroyed) return;
        
        const enemyInstance = enemy.getData('enemyInstance');
        if (enemyInstance) {
            enemyInstance.destroy();
        }
        this.scene.score -= 5;
        this.scene.updateScoreText();
        
        this.flashPlayer();
    }
    
    flashPlayer() {
        this.scene.tweens.add({
            targets: this.scene.player,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 3
        });
    }
}
