import Phaser from 'phaser';
import MainScene from './src/scenes/MainScene.js';

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    parent: 'game-container',
    backgroundColor: '#000011',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: MainScene
};

// Create the game instance
export const game = new Phaser.Game(config);

export default game;
