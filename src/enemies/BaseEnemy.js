import { CONSTANTS } from '../config/gameConstants.js';

export class BaseEnemy {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.health = config.health;
        this.state = config.initialState || 'IDLE';
        this.stateTimer = 0;
        this.sprite = null;
        this.stateHandlers = {};
        
        this.sprite = this.createSprite();
        this.sprite.setDepth(CONSTANTS.DEPTH_ENEMY);
        this.scene.physics.add.existing(this.sprite);
        if (this.sprite.body) {
            this.sprite.body.allowGravity = false;
            this.sprite.body.setCollideWorldBounds(true);
            this.applyHitboxConfig();
        }
        this.sprite.setData('enemyInstance', this);
        this.initStates();
    }
    
    initStates() {
        // Default state handlers - override in subclasses
        this.stateHandlers = {
            IDLE: (time, delta) => this.handleIdle(time, delta),
            ENTER: (time, delta) => this.handleEnter(time, delta),
            FALL: (time, delta) => this.handleFall(time, delta),
            EXIT: (time, delta) => this.handleExit(time, delta)
        };
    }
    
    spawnAt(position) {
        this.sprite.x = position.x;
        this.sprite.y = position.y;
        this.scene.enemies.add(this.sprite);
    }
    
    update(time, delta) {
        const handler = this.stateHandlers[this.state];
        if (handler) {
            handler.call(this, time, delta);
        }
        
        // Check if off-screen (bottom)
        if (this.sprite && this.sprite.y > CONSTANTS.BASE_HEIGHT + 20) {
            this.destroy();
        }
    }
    
    setState(newState, duration = null) {
        if (this.state === newState) return;
        
        const oldState = this.state;
        this.state = newState;
        this.stateTimer = duration || 0;
        
        if (this.onStateChange) {
            this.onStateChange(oldState, newState);
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        
        // Call subclass-specific visual feedback
        if (this.onVisualFeedback) {
            this.onVisualFeedback(amount);
        }
        
        if (this.health <= 0) {
            this.destroy();
            this.scene.score += this.config.scoreValue;
            this.scene.updateScoreText();
        } else if (this.onHit) {
            this.onHit();
        }
    }
    
    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }
        this.isDestroyed = true;
        this.onStateChange('DESTROYED');
    }
    
    onStateChange(newState) {
        if (this.onStateChangeCallback) {
            this.onStateChangeCallback(this, newState);
        }
    }
    
    applyHitboxConfig() {
        const hitbox = this.config.hitbox;
        
        // Default to full sprite size if no config
        if (!hitbox) {
            console.warn(`Enemy ${this.config.id} missing hitbox config, using default sprite size`);
            return;
        }
        
        // No hitbox if explicitly disabled
        if (hitbox.type === 'none') {
            return;
        }
        
        // Custom type = subclass override
        if (hitbox.type === 'custom') {
            return;
        }
        
        // Validate and apply hitbox type
        if (hitbox.type === 'circle') {
            if (typeof hitbox.radius !== 'number') {
                console.error(`Enemy ${this.config.id} circle hitbox missing radius`);
                return;
            }
            this.sprite.body.setCircle(hitbox.radius);
        } else if (hitbox.type === 'rectangle') {
            if (typeof hitbox.width !== 'number' || typeof hitbox.height !== 'number') {
                console.error(`Enemy ${this.config.id} rectangle hitbox missing width/height`);
                return;
            }
            this.sprite.body.setSize(hitbox.width, hitbox.height);
            
            const offsetX = hitbox.offsetX || 0;
            const offsetY = hitbox.offsetY || 0;
            this.sprite.body.setOffset(offsetX, offsetY);
        } else {
            console.warn(`Enemy ${this.config.id} unknown hitbox type: ${hitbox.type}`);
        }
    }
    
    // Builds the game object matching this.config.shape, centered at (0,0)
    createShape() {
        const shape = this.config.shape;
        
        if (shape === 'circle') {
            return this.scene.add.circle(0, 0, this.config.size / 2, this.config.color).setOrigin(0.5, 0.5);
        }
        
        if (shape === 'triangle') {
            return this.scene.add.triangle(0, 0, 0, 0, this.config.size, 0, this.config.size / 2, this.config.size, this.config.color).setOrigin(0.5, 0.5);
        }
        
        if (shape !== 'rectangle') {
            console.warn(`Enemy ${this.config.id} unknown shape: ${shape}, falling back to rectangle`);
        }
        
        return this.scene.add.rectangle(0, 0, this.config.size, this.config.size, this.config.color).setOrigin(0.5, 0.5);
    }
    
    // Abstract method - each subclass MUST implement
    createSprite() {
        throw new Error('createSprite() must be implemented by subclass');
    }
    
    // Cleanup method - subclasses can override for cleanup
    destroySprite() {
        this.sprite.destroy();
    }
    
    // Default state handlers - override in subclasses
    handleIdle(time, delta) {}
    handleEnter(time, delta) {
        this.stateTimer += delta;
        if (this.stateTimer >= 500) {
            this.setState('FALL');
        }
    }
    handleFall(time, delta) {
        if (this.config.speed.y) {
            this.sprite.body.setVelocityY(this.config.speed.y);
        }
    }
    handleExit(time, delta) {
        this.destroy();
    }
    
    // Utility: Get angle to target
    getAngleTo(targetX, targetY) {
        return Math.atan2(targetY - this.sprite.y, targetX - this.sprite.x);
    }
}