import { PlayerBulletFactory } from '../bullets/PlayerBulletFactory.js';
import { getWeaponConfig, getWeaponKeys } from './WeaponRegistry.js';

export default class WeaponManager {
    constructor(scene) {
        this.scene = scene;
        this.activeWeapons = new Set(); // Set of weapon keys
        this.lastFireTimePerWeapon = {}; // Per-weapon cooldown tracking
        this.fireSequenceCounter = {}; // Per-weapon fire sequence for alternating patterns
        this.autoShootEnabled = true;
        
        // Initialize with no weapons active (debug menu can toggle them on)
    }
    
    /**
     * Get all active weapon keys
     * @returns {Array<string>} Array of weapon keys
     */
    getActiveWeaponKeys() {
        return Array.from(this.activeWeapons);
    }
    
    /**
     * Get all active weapon configs
     * @returns {Array<Object>} Array of weapon config objects
     */
    getActiveWeapons() {
        return this.getActiveWeaponKeys().map(key => getWeaponConfig(key));
    }
    
    equipWeapon(weaponKey) {
        this.activeWeapons.clear();
        this.lastFireTimePerWeapon = {};
        this.fireSequenceCounter = {};
        this.activeWeapons.add(weaponKey);
        
        const weapon = getWeaponConfig(weaponKey);
        this.autoShootEnabled = weapon.autoShootEnabled;
    }
    
    /**
     * Toggle a weapon on/off
     * @param {string} weaponKey - Key from WEAPON_CONFIGS
     */
    toggleWeapon(weaponKey) {
        if (this.activeWeapons.has(weaponKey)) {
            this.activeWeapons.delete(weaponKey);
            delete this.lastFireTimePerWeapon[weaponKey];
            delete this.fireSequenceCounter[weaponKey];
        } else {
            this.activeWeapons.add(weaponKey);
            if (!this.lastFireTimePerWeapon[weaponKey]) {
                this.lastFireTimePerWeapon[weaponKey] = 0;
            }
            if (!this.fireSequenceCounter[weaponKey]) {
                this.fireSequenceCounter[weaponKey] = 0;
            }
        }
    }
    
    /**
     * Check if a weapon is currently active
     * @param {string} weaponKey - Key from WEAPON_CONFIGS
     * @returns {boolean} True if weapon is active
     */
    isActiveWeapon(weaponKey) {
        return this.activeWeapons.has(weaponKey);
    }
    
    /**
     * Check if weapon can fire at current time
     * @param {number} time - Current Phaser time
     * @param {Object} weapon - Weapon config object
     * @returns {boolean} True if can fire
     */
    canFireForWeapon(time, weapon) {
        if (!weapon) {
            return false;
        }
        const lastFireTime = this.lastFireTimePerWeapon[weapon.id] || 0;
        return time - lastFireTime >= weapon.fireRate;
    }
    
    /**
     * Check if auto-shoot is enabled
     * @returns {boolean} True if auto-shoot is active and at least one weapon is active
     */
    isAutoShootEnabled() {
        return this.autoShootEnabled && this.activeWeapons.size > 0;
    }
    
    /**
     * Set global auto-shoot toggle
     * @param {boolean} enabled - Enable or disable auto-shoot
     */
    setAutoShoot(enabled) {
        this.autoShootEnabled = enabled;
    }
    
    /**
     * Fire all active weapons
     * @param {number} time - Current Phaser time
     * @param {number} x - X position to fire from
     * @param {number} y - Y position to fire from
     * @returns {Array} Array of all bullets created
     */
    fire(time, x, y) {
        const allBullets = [];
        const activeConfigs = this.getActiveWeapons();
        
        activeConfigs.forEach(weapon => {
            if (this.canFireForWeapon(time, weapon)) {
                // Calculate position offset for ALTERNATING_POSITION pattern
                let xOffset = 0;
                if (weapon.pattern === 'ALTERNATING_POSITION') {
                    const sequence = this.fireSequenceCounter[weapon.id] || 0;
                    const isOdd = sequence % 2 === 1;
                    xOffset = isOdd ? -weapon.positionOffset : weapon.positionOffset;
                    this.fireSequenceCounter[weapon.id] = sequence + 1;
                }
                
                const bullets = PlayerBulletFactory.createPattern(
                    this.scene, x + xOffset, y, weapon
                );
                allBullets.push(...bullets);
                this.lastFireTimePerWeapon[weapon.id] = time;
            }
        });
        
        return allBullets;
    }
    
    /**
     * Get all available weapon keys
     * @returns {Array<string>} Array of all weapon keys
     */
    getAllWeaponKeys() {
        return getWeaponKeys();
    }
}
