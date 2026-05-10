# Current State - Vertical Bullet Hell
<!-- Last Updated: Weapon System + Debug Menu Implementation -->

## Overview
Component-based, data-driven vertical bullet hell shooter built with **Phaser 3.90.0**. Mobile-optimized for portrait orientation (360x640). All graphics are colored rectangles (no external assets).

---

## Architecture

### File Structure
```
src/
├── bullets/
│   ├── BulletFactory.js         # Enemy bullet creation
│   └── PlayerBulletFactory.js   # Player bullet pattern generation
├── config/gameConstants.js      # All numeric constants
├── debug/                       # Debug system (menu, visualizers, constants)
├── enemies/                     # Enemy system (BaseEnemy + 3 types)
├── patterns/PatternSystem.js    # 6 enemy shooting patterns
├── scenes/MainScene.js          # Game orchestration
├── weapons/                     # Weapon system (NEW)
│   ├── WeaponManager.js         # Multi-weapon manager
│   └── WeaponRegistry.js        # Weapon configs
└── system/                      # Core systems
    ├── spawner/
    │   └── spawnerSystem.js     # Enemy spawner
    ├── collision/
    │   └── collisionSystem.js   # Collision detection
    ├── PauseManager.js          # Stack-based pause system
    └── DebugSystem.js           # Debug menu & input handling
```

### Key Design Patterns
- **Component-based**: Each system in separate module
- **Data-driven**: Weapon configs in `WeaponRegistry.js`, Enemy configs in `EnemyRegistry.js`
- **State machines**: Each enemy has ENTER/BEHAVIOR/EXIT states
- **Pattern system**: Reusable bullet shooting patterns (enemy & player)
- **Multi-weapon**: Player can equip multiple weapons simultaneously
- **Stack-based pause**: PauseManager maintains pause state stack for reentrancy
- **Debug menu**: Checkbox-based feature toggles with keyboard navigation

---

## Game Constants

Centralized in `gameConstants.js`:

| Constant | Value | Notes |
|---------|-------|-------|
| BASE_WIDTH | 360 | Portrait orientation |
| BASE_HEIGHT | 640 | Portrait orientation |
| PLAYER_SIZE | 24 px | Green square |
| PLAYER_SPEED | 300 px/s | Max velocity |
| BULLET_SPEED | 500 px/s | Player bullet |
| BULLET_DAMAGE | 60 | Damage per hit |
| FIRE_COOLDOWN | 200 ms | Spacebar fire |
| DEBUG_PAUSE | true/false | Console logging toggle |

---

## Core Systems

### Player
- 24x24 green square
- WASD/Arrow keys (diagonal normalized)
- **Weapon system**: Multi-weapon support with auto-fire enabled
- **No player health yet**
- **Paused during game pause** (motion stopped)

### Enemies
- **3 types**, all rectangles/triangles/circles:
  - **Faller**: Blue square, falls straight down (50% spawn weight)
  - **Tapper**: Pink triangle, tracks player with oscillation (30%)
  - **Shooter**: Red circle, hovers and shoots patterns (20%)
- **Health system**: Enemies take damage, flash random color on hit
- **No stagger**: Enemies do NOT knock back when hit
- **Paused during game pause** (motion stopped)

### Bullets
- **Player**: 6x12 yellow rectangle, 500 px/s upward (configurable per weapon)
- **Enemy**: 4px red circle, 250 px/s, angle-based
- **6 enemy patterns**: SINGLE, DOUBLE, TRIPLE, CONE_5, CIRCLE_6, SPREAD_7
- **3 player weapons**: BASIC, RAPID, SPREAD (see weapons.md)
- **Paused during game pause** (motion stopped)

### Collisions
- Player bullets → Enemies: 60 damage per hit
- Enemy bullets → Player: -5 score
- Enemies → Player: -5 score
- **Bullets do NOT collide** (bullet hell standard)
- **All collisions paused during game pause**

### Scoring
- Kill Faller: +10 points
- Kill Tapper: +20 points
- Kill Shooter: +30 points
- Hit by anything: -5 points
- Score displayed top-left (24px white text)
- **Scoring pauses during game pause**

### Pause System (NEW)
- **P key** toggles pause state
- **Stack-based**: Supports multiple pause levels
- **Physics freeze**: `scene.physics.world.pause()`
- **Trajectory preservation**: Exact state saved/resumed
- **No time events**: Game uses blocked update() instead
- **Debug menu integration**: Opens/closes with pause

### Debug System (UPDATED)
- **Debug menu UI**: Full interactive menu with checkbox toggles
- **Categories**: VISUALIZERS and PLAYER_WEAPONS
- **DebugVisualizers**: Draw hitboxes on entities
- **DebugInputHandler**: Captures menu keypresses
- **DebugController**: Manages menu state/interactions
- **Weapon toggling**: Enable/disable weapons at runtime
- **Visualizer toggling**: Hitbox visualization
- **Keyboard navigation**: UP/DOWN/ENTER/BACKSPACE

---

## Known Limitations

1. **No player health** - game never ends
2. **No game over** - infinite play
3. **No power-ups** or upgrades
4. **No sound** or music
5. **Placeholder graphics** - all colored rectangles
6. **Global color-flash** on hit (not per-enemy configurable)
7. **No enemy stagger** on hit (no knockback/physics reaction)
8. **No custom hitboxes** - all enemies use full sprite as collider
9. **Game pauses but time events continue** (timers still run)
10. **Touch controls not working** (need to restore)
11. **Game is tiny on screen** (needs scaling/resolution fix)

---

## Technical Stack

- **Phaser 3.60.0**
- **Vite 5.x** (dev server + bundler)
- **ES6 modules**
- **Arcade physics**
- **Stack-based pause system** (custom implementation)
- **Multi-weapon system** (custom implementation)
