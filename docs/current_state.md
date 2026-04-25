# Current Game State - Vertical Bullet Hell

## Overview
Vertical scrolling shooter built with Phaser.js 3.60.0. Mobile-optimized for portrait orientation with PC keyboard fallback. All graphics are procedurally generated (no external assets).

---

## Game Constants

| Constant | Value | Description |
|----------|-------|-------------|
| BASE_WIDTH | 360 | Canvas width |
| BASE_HEIGHT | 640 | Canvas height |
| PLAYER_SIZE | 24 | Player dimensions (square) |
| PLAYER_SPEED | 300 px/s | Max movement speed |
| BULLET_SIZE | 6 | Bullet width |
| BULLET_SPEED | 500 px/s | Bullet velocity (upward) |
| BULLET_DAMAGE | 60 | Damage per hit |
| ENEMY_SIZE | 32 | Enemy dimensions (square) |
| ENEMY_SPEED | 200 px/s | Enemy fall speed |
| ENEMY_SPAWN_RATE | 667 ms | Spawn interval |
| ENEMY_HEALTH | 100 | HP per enemy |
| FIRE_COOLDOWN | 200 ms | Auto-fire rate |
| COLOR_PLAYER | 0x00ff00 | Green |
| COLOR_BULLET | 0xffff00 | Yellow |
| COLOR_ENEMY | 0x0000ff | Blue |
| COLOR_BG | 0x000011 | Dark blue background |

---

## Player System

### Visuals
- 24x24 green square
- Positioned at bottom center (y = 560)
- Origin centered (0.5, 0.5)
- Depth: 10

### Movement
- **Keyboard**: WASD or Arrow keys (4-directional)
- **Touch**: 1:1 drag-to-move (single pointer only)
- Diagonal movement normalized to prevent speed boost
- Clamped to screen bounds (PLAYER_SIZE/2 margin)
- Max velocity: 300 px/s (all directions)

### Touch Control Details
- Single active pointer tracked (`activePointerId`)
- Stores initial touch position (`touchHome`) and player position (`playerHome`)
- Movement calculated as delta from initial positions
- Second pointer ignored (no multi-touch)
- Lift finger → player stops

---

## Bullet System

### Creation
- Auto-fire enabled (no manual fire control)
- Spawns at player position (y - PLAYER_SIZE)
- 6x12 yellow rectangle
- Upward velocity: 500 px/s
- No gravity applied

### Behavior
- Fires every 200ms continuously
- Destroyed when off-screen (y < -10 or y > BASE_HEIGHT + 10)
- Managed via `this.bullets` physics group

---

## Enemy System

### Spawning
- Every 667ms
- Random x-position (clamped to bounds)
- Starts at y = 0 (top of screen)
- Falls at 200 px/s

### Health & Damage
- 100 HP per enemy
- Takes 60 damage per bullet hit
- Requires 2 hits to destroy
- Changes color on damage (random 24-bit color)
- Destroyed + removed from scene on death

### Cleanup
- Destroyed when off-screen (y > BASE_HEIGHT + 10)
- Managed via `this.enemies` physics group

---

## Collision Detection

### Bullet → Enemy
- Handler: `hitEnemy(bullet, enemy)`
- Bullet destroyed on impact
- Enemy health reduced by BULLET_DAMAGE
- On death: +10 score, enemy destroyed

### Player → Enemy
- Handler: `hitPlayer(player, enemy)`
- Enemy destroyed on impact
- Player takes no damage (no health system)
- Score reduced by 5

---

## Scoring

- Starts at 0
- **Kill enemy**: +10
- **Player hit**: -5
- Displayed in top-left corner (24px white text)
- No game over condition implemented
- No high score tracking

---

## Technical Stack

### Engine
- Phaser.js 3.60.0 (CDN loaded)
- Arcade physics system
- Single scene architecture (`MainScene`)

### Input Configuration
```javascript
input: {
    multiTouch: false,     // Single pointer only
    preventDefault: false  // Allow browser gestures
}
```

### Scaling
- `Phaser.Scale.RESIZE` mode
- Auto-centered both axes
- Adapts to viewport size

### File Structure
- `index.html` - Game container + Phaser CDN
- `game.js` - All game logic (271 lines)
- No external assets

---

## Known Limitations

1. **No game over** - Score can go negative indefinitely
2. **No player health** - Player takes no damage
3. **No manual fire** - Auto-fire always on
4. **No multi-touch** - Second finger ignored
5. **No sound** - Audio system not implemented
6. **No restart** - Requires page refresh
7. **Placeholder graphics** - All shapes are colored rectangles
8. **Single enemy type** - No variety in behavior

---

## Recent Changes (Latest)

- **Removed**: Multi-touch/pointer handoff system
- **Removed**: Debug overlay UI and event logging
- **Simplified**: Touch controls to single-pointer 1:1 mapping
- **Cleaned**: Input config (`multiTouch: false`)
- **Status**: Codebase streamlined to core gameplay only

---

## Next Potential Improvements

- Player health system with game over
- Manual fire toggle (hold-to-fire)
- Enemy variety (patterns, speeds, health)
- Particle effects on explosions
- Sound effects
- High score persistence
- Better graphics (sprites)
- Pause/menu system
