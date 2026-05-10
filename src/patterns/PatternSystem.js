import { BulletFactory } from '../bullets/BulletFactory.js';

// Bullet shooting patterns - no special hitbox (uses default 2px radius)
const ENEMY_BULLET_HITBOX = null;  // No override

export const PatternSystem = {
    // Single bullet aimed at target
    SINGLE: (originX, originY, targetX, targetY, scene) => {
        const angle = Math.atan2(targetY - originY, targetX - originX);
        return BulletFactory.createEnemyBullet(scene, originX, originY, angle, ENEMY_BULLET_HITBOX);
    },
    
    // Two bullets with slight spread (5 degrees)
    DOUBLE: (originX, originY, targetX, targetY, scene) => {
        const baseAngle = Math.atan2(targetY - originY, targetX - originX);
        const spread = Math.PI / 36; // 5 degrees in radians
        
        const bullet1 = BulletFactory.createEnemyBullet(scene, originX, originY, baseAngle - spread/2, ENEMY_BULLET_HITBOX);
        const bullet2 = BulletFactory.createEnemyBullet(scene, originX, originY, baseAngle + spread/2, ENEMY_BULLET_HITBOX);
        
        return [bullet1, bullet2];
    },
    
    // Three bullets in a spread (-10°, 0°, +10°)
    TRIPLE: (originX, originY, targetX, targetY, scene) => {
        const baseAngle = Math.atan2(targetY - originY, targetX - originX);
        const spread = Math.PI / 18; // 10 degrees
        
        const bullet1 = BulletFactory.createEnemyBullet(scene, originX, originY, baseAngle - spread, ENEMY_BULLET_HITBOX);
        const bullet2 = BulletFactory.createEnemyBullet(scene, originX, originY, baseAngle, ENEMY_BULLET_HITBOX);
        const bullet3 = BulletFactory.createEnemyBullet(scene, originX, originY, baseAngle + spread, ENEMY_BULLET_HITBOX);
        
        return [bullet1, bullet2, bullet3];
    },
    
    // Five bullets in a cone (60 degree spread)
    CONE_5: (originX, originY, targetX, targetY, scene) => {
        const baseAngle = Math.atan2(targetY - originY, targetX - originX);
        const totalSpread = Math.PI / 3; // 60 degrees
        const step = totalSpread / 4;
        
        const bullets = [];
        for (let i = 0; i < 5; i++) {
            const angle = baseAngle - totalSpread/2 + i * step;
            bullets.push(BulletFactory.createEnemyBullet(scene, originX, originY, angle, ENEMY_BULLET_HITBOX));
        }
        
        return bullets;
    },
    
    // Six bullets in a circle (60 degrees apart)
    CIRCLE_6: (originX, originY, targetX, targetY, scene) => {
        const bullets = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            bullets.push(BulletFactory.createEnemyBullet(scene, originX, originY, angle, ENEMY_BULLET_HITBOX));
        }
        
        return bullets;
    },
    
    // Seven bullets in a wide fan (120 degree spread)
    SPREAD_7: (originX, originY, targetX, targetY, scene) => {
        const baseAngle = Math.atan2(targetY - originY, targetX - originX);
        const totalSpread = Math.PI * 2 / 3; // 120 degrees
        const step = totalSpread / 6;
        
        const bullets = [];
        for (let i = 0; i < 7; i++) {
            const angle = baseAngle - totalSpread/2 + i * step;
            bullets.push(BulletFactory.createEnemyBullet(scene, originX, originY, angle, ENEMY_BULLET_HITBOX));
        }
        
        return bullets;
    },
    
    // Get pattern by name
    getPattern: function(patternName) {
        return this[patternName] || this.SINGLE;
    }
};

export default PatternSystem;
