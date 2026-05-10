import { BaseEnemy } from './BaseEnemy.js';
import { CONSTANTS } from '../config/gameConstants.js';

export class FallerEnemy extends BaseEnemy {
    constructor(scene, config) {
        super(scene, config);
    }
    
    createSprite() {
        const sprite = this.scene.add.rectangle(
            0, 0, this.config.size, this.config.size, this.config.color
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
            FALL: (time, delta) => this.handleFall(time, delta)
        };
    }
    
    handleEnter(time, delta) {
        this.stateTimer += delta;
        this.sprite.body.setVelocity(0, this.config.speed.y);
        
        if (this.stateTimer >= this.config.enterDuration) {
            this.setState('FALL');
        }
    }
    
    handleFall(time, delta) {
        this.sprite.body.setVelocity(0, this.config.speed.y);
    }
    
    onVisualFeedback(damage) {
        const randomColor = Phaser.Math.Between(0x100000, 0xFFFFFF);
        this.sprite.setFillStyle(randomColor);
        
        this.scene.time.delayedCall(150, () => {
            if (!this.sprite.isDestroyed) {
                this.sprite.setFillStyle(this.config.color);
            }
        });
    }
}
