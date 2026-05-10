import { DEBUG_PAUSE } from '../config/gameConstants.js';

class PauseManager {
    constructor(scene) {
        this.scene = scene;
        this.pauseStack = [];
        this.isPaused = false;
        
        if (DEBUG_PAUSE) {
            console.log('[PauseManager] Initialized');
        }
    }
    
    pause(id, caller = 'unknown') {
        if (this.pauseStack.includes(id)) {
            if (DEBUG_PAUSE) {
                console.warn(`[PauseManager] Already paused by ID '${id}', ignoring`);
            }
            return;
        }
        
        this.pauseStack.push({
            id: id,
            caller: caller,
            timestamp: this.scene.time.now
        });
        
        if (this.pauseStack.length === 1) {
            this._applyPause();
        }
        
        if (DEBUG_PAUSE) {
            console.log(`[PauseManager] PAUSED [ID: ${id}, Caller: ${caller}, Stack: ${this.pauseStack.length}]`);
        }
    }
    
    resume(id) {
        const index = this.pauseStack.findIndex(entry => entry.id === id);
        
        if (index === -1) {
            if (DEBUG_PAUSE) {
                console.warn(`[PauseManager] Resume ID '${id}' not found in stack`);
            }
            return;
        }
        
        this.pauseStack.splice(index, 1);
        
        if (this.pauseStack.length === 0) {
            this._applyResume();
        }
        
        if (DEBUG_PAUSE) {
            console.log(`[PauseManager] RESUMED [ID: ${id}, Stack: ${this.pauseStack.length}]`);
        }
    }
    
    isGamePaused() {
        return this.isPaused;
    }
    
    toggle() {
        if (this.isPaused) {
            if (DEBUG_PAUSE) {
                console.warn('[PauseManager] Cannot toggle: ambiguous stack');
            }
            return false;
        }
        
        const tempId = `toggle-${this.scene.time.now}`;
        this.pause(tempId, 'toggle');
        return true;
    }
    
    getPauseInfo() {
        return {
            paused: this.isPaused,
            stackDepth: this.pauseStack.length,
            pauses: this.pauseStack.map(entry => ({
                id: entry.id,
                caller: entry.caller,
                timestamp: entry.timestamp,
                duration: this.scene.time.now - entry.timestamp
            }))
        };
    }
    
    _applyPause() {
        this.isPaused = true;
        this.scene.physics.world.pause();
        
        if (DEBUG_PAUSE) {
            console.log('[PauseManager] Physics paused, game logic blocked via update() check');
        }
    }
    
    _applyResume() {
        this.scene.physics.world.resume();
        this.isPaused = false;
        
        if (DEBUG_PAUSE) {
            console.log('[PauseManager] Physics resumed, game logic enabled');
        }
    }
    
    destroy() {
        if (DEBUG_PAUSE) {
            console.log('[PauseManager] Destroyed');
        }
    }
}

export default PauseManager;
