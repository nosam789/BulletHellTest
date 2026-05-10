import { getRandomEnemyType, getEnemyClass, getEnemyConfig, getSpawnRate } from '../enemies/EnemyRegistry.js';
import { CONSTANTS } from '../config/gameConstants.js';

export class SpawnerSystem {
    constructor(scene) {
        this.scene = scene;
        this.lastSpawn = 0;
        this.spawnRate = getSpawnRate();
    }
    
    update(time) {
        if (time - this.lastSpawn >= this.spawnRate) {
            this.spawnEnemy();
            this.lastSpawn = time;
        }
    }
    
    spawnEnemy() {
        const type = getRandomEnemyType();
        const Config = getEnemyConfig(type);
        const EnemyClass = getEnemyClass(type);
        
        const config = { ...Config }; // Clone config
        const enemy = new EnemyClass(this.scene, config);
        enemy.spawnAt(this.getSpawnPosition());
        
        // Track enemy in scene
        this.scene.activeEnemies.push(enemy);
    }
    
    getSpawnPosition() {
        const minX = 32;
        const maxX = CONSTANTS.BASE_WIDTH - 32;
        const x = Phaser.Math.Between(minX, maxX);
        
        return {
            x: x,
            y: -20
        };
    }
    
    setSpawnRate(rate) {
        this.spawnRate = rate;
    }
}
