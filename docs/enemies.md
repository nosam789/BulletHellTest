# Enemy System

## Spawn Configuration

| Property | Value |
|----------|-------|
| ENEMY_SIZE | 32 px (square) |
| ENEMY_SPEED | 200 px/s downward |
| ENEMY_SPAWN_RATE | 667 ms interval |
| ENEMY_HEALTH | 100 HP |
| COLOR_ENEMY | 0x0000ff (blue) |

## Creation

```javascript
spawnEnemy() {
    x = random between ENEMY_SIZE/2 and BASE_WIDTH - ENEMY_SIZE/2
    y = 0 (top of screen)
    velocity = (0, 200) // downward
    health = 100
    depth = 5
}
```

## Behavior

- Falls straight down at 200 px/s
- No horizontal movement
- No gravity applied (constant velocity)
- No movement patterns (type A: plain fall)

## Health & Damage

- Takes 60 damage per bullet hit
- Requires 2 hits to destroy (100 - 60 - 60 ≤ 0)
- On hit: changes to random 24-bit color
- On death: destroyed + +10 score

## Cleanup

- Destroyed when `y > BASE_HEIGHT + 10`
- Removed from `this.enemies` physics group

## Collision

- **With bullet**: `hitEnemy()` handler
- **With player**: `hitPlayer()` handler
- Triggered via Phaser.Physics.Arcade.overlap
