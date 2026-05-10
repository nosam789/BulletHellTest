import { DEBUG_KEYS, DEBUG_FEATURES, HITBOX_STYLES } from '../debug/DebugConstants.js';
import DebugMenu from '../debug/DebugMenu.js';
import DebugVisualizers from '../debug/DebugVisualizers.js';

class DebugSystem {
    constructor(scene) {
        this.scene = scene;
        this.isOpen = false;
        this.activeFeatures = new Set();
        this.hitboxStyles = {
            ...DEBUG_FEATURES
        };
        this.pauseManager = null;
        
        this.menu = new DebugMenu(this);
        this.visualizers = new DebugVisualizers(scene, this);
        this.menu.show(false);
        
        this.setupInput();
    }

    setPauseManager(pauseManager) {
        this.pauseManager = pauseManager;
    }

    setupInput() {
        console.log('[DebugSystem] setupInput called');
        this.scene.input.keyboard.on('keydown', (event) => {
            if (event.code === 'KeyP' || event.keyCode === 80) {
                this.toggle();
            }
            if (event.key === 'Escape') {
                this.close();
            }
        });
    }

    toggle() {
        if (!this.pauseManager) {
            console.error('[DebugSystem] PauseManager not set!');
            return;
        }
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.pauseManager.pause('debug-menu', 'DebugSystem');
            this.menu.show(true);
        } else {
            this.menu.show(false);
            this.pauseManager.resume('debug-menu');
        }
    }

    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.menu.show(false);
        
        if (this.pauseManager) {
            this.pauseManager.resume('debug-menu');
        }
    }

    isActive(feature) {
        return this.activeFeatures.has(feature);
    }

    toggleFeature(feature) {
        if (this.activeFeatures.has(feature)) {
            this.activeFeatures.delete(feature);
            console.log(`[DebugSystem] Feature disabled: ${feature}`);
        } else {
            this.activeFeatures.add(feature);
            console.log(`[DebugSystem] Feature enabled: ${feature}`);
        }
    }

    activateFeature(feature) {
        this.activeFeatures.add(feature);
    }

    deactivateFeature(feature) {
        this.activeFeatures.delete(feature);
    }

    onCategorySelect(category) {
        console.log(`[DebugSystem] Category selected: ${category}`);
        
        switch(category) {
            case 'Visualizers':
                this.menu.openSubmenu(category);
                break;
            case 'Player Weapons':
                this.menu.openSubmenu(category);
                break;
            default:
                console.warn(`[DebugSystem] Unknown category: ${category}`);
        }
    }

    setHitboxStyle(feature, style) {
        this.hitboxStyles[feature] = style;
    }

    getHitboxStyle(feature) {
        return this.hitboxStyles[feature] || HITBOX_STYLES.DEFAULT;
    }

    update() {
        // Update visualizers if any hitbox feature is active
        if (this.activeFeatures.size > 0) {
            this.visualizers.update();
        }
    }

    destroy() {
        this.menu.destroy();
        this.visualizers.destroy();
    }
}

export default DebugSystem;