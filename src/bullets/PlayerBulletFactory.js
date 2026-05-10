import { CONSTANTS } from '../config/gameConstants.js';

export class PlayerBulletFactory {
    /**
     * Create a single player bullet
     * @param {Phaser.Scene} scene - The Phaser scene
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {object} weaponConfig - Weapon configuration
     * @param {number} angle - Optional angle in radians (0 = straight up)
     * @returns {Phaser.GameObjects.Rectangle} The created bullet
     */
    static createBullet(scene, x, y, weaponConfig, angle = -Math.PI / 2) {
        const bullet = scene.add.rectangle(
            x,
            y,
            weaponConfig.bulletSize.w,
            weaponConfig.bulletSize.h,
            weaponConfig.bulletColor
        );
        
        bullet.setOrigin(0.5, 0.5);
        bullet.setDepth(CONSTANTS.DEPTH_BULLET);
        scene.physics.add.existing(bullet);
        scene.playerBullets.add(bullet);
        
        // Calculate velocity based on angle
        const velocityX = Math.cos(angle) * weaponConfig.bulletSpeed;
        const velocityY = Math.sin(angle) * weaponConfig.bulletSpeed;
        bullet.body.setVelocity(velocityX, velocityY);
        bullet.body.allowGravity = false;
        
        // Store damage for collision handling
        bullet.damage = weaponConfig.bulletDamage;
        bullet.weaponId = weaponConfig.id;
        
        return bullet;
    }
    
    /**
     * Create a pattern of bullets based on weapon configuration
     * @param {Phaser.Scene} scene - The Phaser scene
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {object} weaponConfig - Weapon configuration
     * @returns {Array} Array of created bullets
     */
    static createPattern(scene, x, y, weaponConfig) {
        const bullets = [];
        const pattern = weaponConfig.pattern;
        const bulletCount = weaponConfig.bulletCount;
        const spreadAngle = weaponConfig.spreadAngle;
        
        if (pattern === 'SINGLE' || bulletCount === 1) {
            // Single bullet straight up
            bullets.push(this.createBullet(scene, x, y, weaponConfig, -Math.PI / 2));
        } 
        else if (pattern === 'SPREAD') {
            // Spread pattern with angled bullets
            const totalSpread = spreadAngle * 2;
            const baseAngle = -Math.PI / 2; // Straight up
            
            if (bulletCount === 3) {
                // Triple shot: left, center, right
                const step = totalSpread / 2;
                bullets.push(this.createBullet(scene, x, y, weaponConfig, baseAngle - step));
                bullets.push(this.createBullet(scene, x, y, weaponConfig, baseAngle));
                bullets.push(this.createBullet(scene, x, y, weaponConfig, baseAngle + step));
            } 
            else {
                // Generic spread for any bullet count
                const angleStep = totalSpread / (bulletCount - 1);
                for (let i = 0; i < bulletCount; i++) {
                    const angle = baseAngle - totalSpread / 2 + (i * angleStep);
                    bullets.push(this.createBullet(scene, x, y, weaponConfig, angle));
                }
            }
        } 
        else {
            // Fallback: single bullet
            bullets.push(this.createBullet(scene, x, y, weaponConfig, -Math.PI / 2));
        }
        
        return bullets;
    }
}
