import { BaseEnemy } from './BaseEnemy.js';
import { CONSTANTS } from '../config/gameConstants.js';

export class TapperEnemy extends BaseEnemy {
    constructor(scene, config) {
        super(scene, config);
        this.startTime = 0;
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
            TAP: (time, delta) => this.handleTap(time, delta),
            EXIT: (time, delta) => this.handleExit(time, delta)
        };
        
        this.startTime = this.scene.time.now;
        this.trackingStarted = false;
    }
    
    handleEnter(time, delta) {
        this.stateTimer += delta;
        this.startTime = this.scene.time.now;
        
        if (this.stateTimer >= this.config.enterDuration) {
            this.setState('TAP');
        }
    }
    
    handleTap(time, delta) {
        const elapsed = time - this.startTime;
        
        // Start tracking after delay
        if (elapsed >= this.config.entryDelay && !this.trackingStarted) {
            this.trackingStarted = true;
        }
        
        // Calculate weave offset (sine wave around tracking point)
        const weaveOffset = Math.sin(elapsed * this.config.frequency * Math.PI / 500) * this.config.amplitude;
        
        if (this.trackingStarted) {
            // Track player with weave
            const playerX = this.scene.player.x;
            const distanceToPlayer = playerX - this.startX;
            
            // Only move towards player (directional tracking)
            const trackingDirection = Math.sign(distanceToPlayer);
            const maxHorizontalSpeed = this.config.maxHorizontalSpeed * delta / 1000;
            
            // Calculate target X: player position with weave offset
            const targetX = playerX + this.config.trackingOffset * trackingDirection + weaveOffset;
            
            // Smoothly interpolate towards target
            const newX = Phaser.Math.Linear(this.sprite.x, targetX, this.config.trackingSpeed);
            
            // Apply max horizontal speed limit
            const velocityX = newX - this.sprite.x;
            if (Math.abs(velocityX) > maxHorizontalSpeed) {
                this.sprite.x += Math.sign(velocityX) * maxHorizontalSpeed;
            } else {
                this.sprite.x = newX;
            }
        } else {
            // Pre-tracking: just weave in place
            this.sprite.x = this.startX + weaveOffset;
        }
        
        this.sprite.body.setVelocityY(this.config.speed.y);
        
        // Clamp to screen bounds
        const halfSize = this.config.size / 2;
        this.sprite.x = Phaser.Math.Clamp(
            this.sprite.x,
            halfSize,
            CONSTANTS.BASE_WIDTH - halfSize
        );
    }
    
    spawnAt(position) {
        super.spawnAt(position);
        this.startX = position.x;
    }
    
    onVisualFeedback(damage) {
        const flashColor = 0xffffff;
        this.sprite.setFillStyle(flashColor);
        
        this.scene.time.delayedCall(100, () => {
            if (!this.sprite.isDestroyed) {
                this.sprite.setFillStyle(this.config.color);
            }
        });
    }
}
