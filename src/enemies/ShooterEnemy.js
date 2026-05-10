import { BaseEnemy } from './BaseEnemy.js';
import { BulletFactory } from '../bullets/BulletFactory.js';
import { PatternSystem } from '../patterns/PatternSystem.js';

export class ShooterEnemy extends BaseEnemy {
    constructor(scene, config) {
        super(scene, config);
        this.lastShotTime = 0;
    }
    
    createSprite() {
        const sprite = this.scene.add.rectangle(
            0, 0,
            this.config.size,
            this.config.size,
            this.config.color
        ).setOrigin(0.5, 0.5);
        
        return sprite;
    }
    
    destroySprite() {
        super.destroySprite();
    }
    
    initStates() {
        this.stateHandlers = {
            ...this.stateHandlers,
            ENTER: (time, delta) => this.handleEnter(time, delta),
            HOVER: (time, delta) => this.handleHover(time, delta),
            SHOOT: (time, delta) => this.handleShoot(time, delta),
            EXIT: (time, delta) => this.handleExit(time, delta)
        };
    }
    
    handleEnter(time, delta) {
        this.stateTimer += delta;
        this.sprite.body.setVelocity(0, this.config.speed.y);
        
        if (this.stateTimer >= this.config.enterDuration) {
            this.setState('HOVER', this.config.hoverDuration);
        }
    }
    
    handleHover(time, delta) {
        this.stateTimer += delta;
        
        // Slow descent while hovering
        this.sprite.body.setVelocity(0, this.config.hoverSpeed || 40);
        
        if (this.stateTimer >= this.config.hoverDuration) {
            this.setState('SHOOT', this.config.shootDuration);
        }
    }
    
    handleShoot(time, delta) {
        this.stateTimer += delta;
        
        // Stop movement while shooting
        this.sprite.body.setVelocity(0, 0);
        
        // Shoot if cooldown passed
        if (time - this.lastShotTime >= this.config.shootCooldown) {
            this.shoot();
            this.lastShotTime = time;
        }
        
        if (this.stateTimer >= this.config.shootDuration) {
            this.setState('HOVER', this.config.hoverDuration);
        }
    }
    
    shoot() {
        const player = this.scene.player;
        if (!player || player.isDestroyed) return;
        
        const patternKey = this.config.bulletPattern || 'SINGLE';
        const pattern = PatternSystem.getPattern(patternKey);
        
        if (pattern) {
            pattern(this.sprite.x, this.sprite.y, player.x, player.y, this.scene);
        }
    }
    
    onVisualFeedback(damage) {
        const flashColor = 0xff0000;
        this.sprite.setFillStyle(flashColor);
        
        this.scene.time.delayedCall(200, () => {
            if (!this.sprite.isDestroyed) {
                this.sprite.setFillStyle(this.config.color);
            }
        });
    }
}
