// Game Constants - Centralized configuration
export const CONSTANTS = {
    // Canvas dimensions
    BASE_WIDTH: 360,
    BASE_HEIGHT: 640,
    
    // Player
    PLAYER_SIZE: 24,
    PLAYER_SPEED: 300,
    PLAYER_COLOR: 0x00ff00,
    PLAYER_START_Y: 560,
    
    // Player bullets
    BULLET_SIZE: 6,
    BULLET_HEIGHT: 12,
    BULLET_SPEED: 500,
    BULLET_DAMAGE: 60,
    BULLET_COLOR: 0xffff00,
    FIRE_COOLDOWN: 200,
    
    // Enemy bullets
    ENEMY_BULLET_SIZE: 4,
    ENEMY_BULLET_SPEED: 250,
    ENEMY_BULLET_DAMAGE: 20,
    ENEMY_BULLET_COLOR: 0xff0000,
    
    // Background
    BG_COLOR: 0x000011,
    
    // Physics
    DEPTH_PLAYER: 10,
    DEPTH_BULLET: 20,
    DEPTH_ENEMY: 5,
    DEPTH_TEXT: 100,
    
    // Hitbox configuration
    HITBOX_TYPES: {
        NONE: 'none',
        RECTANGLE: 'rectangle',
        CIRCLE: 'circle',
        CUSTOM: 'custom'
    }
};

// Debug constants
export const DEBUG_PAUSE = true;

// Enemy type enums
export const ENEMY_TYPES = {
    FALLER: 'FALLER',
    TAPPER: 'TAPPER',
    SHOOTER: 'SHOOTER'
};
