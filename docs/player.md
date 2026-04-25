# Player System

## Visual Configuration

| Property | Value |
|----------|-------|
| PLAYER_SIZE | 24 px (square) |
| PLAYER_SPEED | 300 px/s |
| COLOR_PLAYER | 0x00ff00 (green) |
| Start Position | (BASE_WIDTH/2, BASE_HEIGHT - 80) |
| Depth | 10 |
| Origin | (0.5, 0.5) - centered |

## Movement

### Keyboard Controls

| Input | Direction |
|-------|-----------|
| WASD | 4-directional |
| Arrow Keys | 4-directional |

- Diagonal movement normalized (prevents speed increase)
- Max velocity clamped to 300 px/s all directions
- World bounds collision enabled

### Touch Controls

| Property | Value |
|----------|-------|
| Mode | 1:1 drag-to-move |
| Active Pointers | 1 (single touch only) |
| Multi-touch | Disabled |

#### Touch Behavior

1. `pointerdown`: Record `touchHome` and `playerHome`
2. `pointermove`: Move player by `delta = current - touchHome`
3. `pointerup`: Clear active pointer

```javascript
handleTouchStart(pointer) {
    this.activePointerId = pointer.identifier
    this.touchHome = {x, y}
    this.playerHome = {x: player.x, y: player.y}
}

handleTouchMove(pointer) {
    if (pointerId !== activePointerId) return
    dx = pointer.x - touchHome.x
    dy = pointer.y - touchHome.y
    player.x = clamp(playerHome.x + dx)
    player.y = clamp(playerHome.y + dy)
}

handleTouchEnd(pointer) {
    this.activePointerId = null
    this.touchHome = null
    this.playerHome = null
}
```

#### Bounds Clamping

```javascript
MIN = PLAYER_SIZE / 2 = 12
MAX_WIDTH = BASE_WIDTH - PLAYER_SIZE / 2 = 348
MAX_HEIGHT = BASE_HEIGHT - PLAYER_SIZE / 2 = 628
```

## Physics Body

```javascript
this.player.body.setCollideWorldBounds(true)
this.player.body.setMaxVelocity(300, 300)
```

## Limitations

- No player health
- No damage states
- No invincibility frames
- Touch movement stops on lift (no momentum)
- Second finger ignored (no multi-touch)
