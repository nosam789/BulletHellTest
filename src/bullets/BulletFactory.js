import { CONSTANTS } from '../config/gameConstants.js';

export class BulletFactory {
    static createPlayerBullet(scene, x, y) {
        const bullet = scene.add.rectangle(
            x,
            y,
            CONSTANTS.BULLET_SIZE,
            CONSTANTS.BULLET_HEIGHT,
            CONSTANTS.BULLET_COLOR
        );
        
        bullet.setOrigin(0.5, 0.5);
        bullet.setDepth(CONSTANTS.DEPTH_BULLET);
        scene.physics.add.existing(bullet);
        scene.playerBullets.add(bullet);
        
        bullet.body.setVelocity(0, -CONSTANTS.BULLET_SPEED);
        bullet.body.allowGravity = false;
        
        return bullet;
    }
    
    static createEnemyBullet(scene, x, y, angle, hitboxConfig = null) {
        const bullet = scene.add.circle(
            x,
            y,
            CONSTANTS.ENEMY_BULLET_SIZE / 2,
            CONSTANTS.ENEMY_BULLET_COLOR
        );
        
        bullet.setDepth(CONSTANTS.DEPTH_BULLET);
        scene.physics.add.existing(bullet);
        scene.enemyBullets.add(bullet);
        
        const velocityX = Math.cos(angle) * CONSTANTS.ENEMY_BULLET_SPEED;
        const velocityY = Math.sin(angle) * CONSTANTS.ENEMY_BULLET_SPEED;
        bullet.body.setVelocity(velocityX, velocityY);
        bullet.body.allowGravity = false;
        
        // Apply custom hitbox if provided
        if (hitboxConfig) {
            BulletFactory.applyHitbox(bullet.body, hitboxConfig);
        }
        
        return bullet;
    }
    
    static applyHitbox(body, config) {
        if (config.type === 'circle') {
            body.setCircle(config.radius);
        } else if (config.type === 'rectangle') {
            body.setSize(config.width, config.height);
            body.setOffset(config.offsetX || 0, config.offsetY || 0);
        }
    }
}
