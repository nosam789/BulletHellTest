# Shared Systems

## Scoring

| Event | Effect |
|-------|--------|
| Enemy killed | +10 |
| Player hit | -5 |

- Stored in `this.score` (integer)
- Displayed via Phaser.Text at (16, 16)
- Font: 24px white
- No game over condition
- No persistence

## Bullet System

### Configuration

| Property | Value |
|----------|-------|
| BULLET_SIZE | 6 px (width) |
| BULLET_HEIGHT | 12 px (height) |
| BULLET_SPEED | 500 px/s upward |
| BULLET_DAMAGE | 60 |
| FIRE_COOLDOWN | 200 ms |
| COLOR_BULLET | 0xffff00 (yellow) |

### Behavior

- Auto-fire always enabled
- Spawns at `(player.x, player.y - PLAYER_SIZE)`
- Velocity: `(0, -500)`
- No gravity
- No manual fire control
- No spread or aiming

### Cleanup

- Destroyed when `y < -10` or `y > BASE_HEIGHT + 10`
- Managed via `this.bullets` physics group

## Collision System

### Bullet → Enemy

```javascript
hitEnemy(bullet, enemy) {
    enemy.health -= 60
    bullet.destroy()
    if (enemy.health <= 0) {
        enemy.destroy()
        score += 10
    } else {
        enemy.color = random(0x000000, 0xFFFFFF)
    }
}
```

### Player → Enemy

```javascript
hitPlayer(player, enemy) {
    enemy.destroy()
    score -= 5
    // No player damage
}
```

### Collision Setup

```javascript
this.physics.add.collider(this.bullets, this.enemies, this.hitEnemy, null, this)
this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, null, this)
```

## Physics World

```javascript
this.physics.world.setBounds(0, 0, BASE_WIDTH, BASE_HEIGHT)
this.player.body.setCollideWorldBounds(true)
this.player.body.setMaxVelocity(300, 300)
```

## Game Loop

```javascript
update(time) {
    handleMovement()
    handleAutoFire(time)
    handleSpawning()
    cleanupOffScreen()
}
```

## Memory Management

- Bullets/enemies destroyed when off-screen
- Phaser handles garbage collection
- Groups: `this.bullets`, `this.enemies`
