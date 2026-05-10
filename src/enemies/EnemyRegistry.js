import { ENEMY_TYPES as TYPE_KEYS } from '../config/gameConstants.js';
import { FallerEnemy } from './FallerEnemy.js';
import { TapperEnemy } from './TapperEnemy.js';
import { ShooterEnemy } from './ShooterEnemy.js';

// Enemy configuration registry
export const ENEMY_CONFIGS = {
    [TYPE_KEYS.FALLER]: {
        id: 'faller',
        health: 100,
        size: 32,
        speed: { x: 0, y: 300 },
        color: 0x0000ff,
        shape: 'rectangle',
        scoreValue: 10,
        spawnWeight: 50,
        enterDuration: 500,
        initialState: 'ENTER',
        hitbox: {
            type: 'rectangle',
            width: 24,
            height: 24,
            offsetX: 4,
            offsetY: 4
        }
    },
    
    [TYPE_KEYS.TAPPER]: {
        id: 'tapper',
        health: 80,
        size: 28,
        speed: { x: 0, y: 220 },
        color: 0xff00ff,
        shape: 'triangle',
        scoreValue: 20,
        spawnWeight: 30,
        enterDuration: 300,
        entryDelay: 100,
        trackingSpeed: 0.03,
        trackingOffset: 40,
        amplitude: 60,
        frequency: 0.8,
        maxHorizontalSpeed: 200,
        initialState: 'ENTER',
        hitbox: {
            type: 'circle',
            radius: 12
        }
    },
    
    [TYPE_KEYS.SHOOTER]: {
        id: 'shooter',
        health: 300,
        size: 40,
        speed: { y: 60 },
        color: 0xffff00,
        shape: 'circle',
        scoreValue: 30,
        spawnWeight: 20,
        enterDuration: 500,
        hoverDuration: 1000,
        shootDuration: 2000,
        hoverSpeed: 40,
        shootCooldown: 2000,
        bulletPattern: 'TRIPLE',
        initialState: 'ENTER',
        hitbox: {
            type: 'rectangle',
            width: 32,
            height: 32,
            offsetX: 4,
            offsetY: 4
        }
    }
};

// Map type keys to enemy classes
export const ENEMY_CLASSES = {
    [TYPE_KEYS.FALLER]: FallerEnemy,
    [TYPE_KEYS.TAPPER]: TapperEnemy,
    [TYPE_KEYS.SHOOTER]: ShooterEnemy
};

// Generate weighted spawn pool
export function createSpawnPool() {
    const pool = [];
    
    for (const [type, config] of Object.entries(ENEMY_CONFIGS)) {
        for (let i = 0; i < config.spawnWeight; i++) {
            pool.push(type);
        }
    }
    
    return pool;
}

// Get random enemy type based on weights
export function getRandomEnemyType() {
    const spawnPool = createSpawnPool();
    const randomIndex = Phaser.Math.Between(0, spawnPool.length - 1);
    return spawnPool[randomIndex];
}

// Get enemy class by type
export function getEnemyClass(type) {
    return ENEMY_CLASSES[type];
}

// Get enemy config by type
export function getEnemyConfig(type) {
    return ENEMY_CONFIGS[type];
}

// Get spawn rate (average based on weights)
export function getSpawnRate() {
    // For now, use a fixed rate
    // Future: Could be dynamic based on active enemies or difficulty
    return 2000;
}
