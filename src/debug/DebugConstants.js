export const DEBUG_CATEGORIES = {
    VISUALIZERS: 'Visualizers',
    PLAYER_WEAPONS: 'Player Weapons'
};

export const DEBUG_FEATURES = {
    HITBOX_PLAYER: 'hitbox_player',
    HITBOX_ENEMY: 'hitbox_enemy',
    HITBOX_PLAYER_BULLET: 'hitbox_player_bullet',
    HITBOX_ENEMY_BULLET: 'hitbox_enemy_bullet',
    SHOW_COLLISION_BOX: 'show_collision_box'
};

export const DEBUG_UI = {
    X: 80,
    Y: 80,
    WIDTH: 200,
    HEIGHT: 320,
    BUTTON_HEIGHT: 40,
    BUTTON_PADDING: 10,
    BACKGROUND_COLOR: 0x000000,
    BACKGROUND_ALPHA: 0.85,
    BUTTON_COLOR: 0x333333,
    BUTTON_HOVER_COLOR: 0x555555,
    BUTTON_TEXT_COLOR: 0xffffff,
    BUTTON_TEXT_ACTIVE: 0x00ff00,
    FONT_SIZE: '18px',
    FONT_SIZE_TITLE: '20px'
};

export const DEBUG_KEYS = {
    TOGGLE: Phaser.Input.Keyboard.KeyCodes.P,
    CLOSE: Phaser.Input.Keyboard.KeyCodes.ESC,
    UP: Phaser.Input.Keyboard.KeyCodes.UP,
    DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
    ENTER: Phaser.Input.Keyboard.KeyCodes.ENTER,
    BACK: Phaser.Input.Keyboard.KeyCodes.BACKSPACE
};

export const HITBOX_COLORS = {
    PLAYER: 0x00ff00,
    ENEMY: 0xff0000,
    PLAYER_BULLET: 0xffff00,
    ENEMY_BULLET: 0xffa500
};

export const HITBOX_STYLES = {
    DEFAULT: {
        lineWidth: 2,
        fillAlpha: 0
    },
    SEMI_TRANSPARENT: {
        lineWidth: 2,
        fillAlpha: 0.3
    }
};

export const DEBUG_SUBMENU = {
    VISUALIZERS: {
        title: 'Visualizers',
        backText: 'BACKSPACE to return',
        buttons: ['Player', 'Enemy', 'Player Bullets', 'Enemy Bullets'],
        features: ['hitbox_player', 'hitbox_enemy', 'hitbox_player_bullet', 'hitbox_enemy_bullet']
    },
    PLAYER_WEAPONS: {
        title: 'Player Weapons',
        backText: 'BACKSPACE to return',
        buttons: ['BASIC', 'RAPID', 'SPREAD'],
        features: ['BASIC', 'RAPID', 'SPREAD']
    }
};

export const DEBUG_CHECKBOX = {
    CHECKED: '✓',
    UNCHECKED: ' '
};