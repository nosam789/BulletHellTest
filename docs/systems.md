# Systems

## Graphics

- We are using graphics.generateTexture() approach for creating prototype visuals. We will be replacing the shape-drawing code with texture atlases in the future.
- Work in a way to make this transition smooth.

---

## Bullet Factory

### Player Bullets

`src/bullets/PlayerBulletFactory.js` - Pattern-based player bullet generation

### Enemy Bullets

`src/bullets/BulletFactory.js` - Enemy bullet creation

### Player Bullets (Default BASIC Weapon)

```
Shape: Rectangle (6x12 px)
Color: 0xffff00 (yellow)
Velocity: (0, -500 px/s)
Depth: 20 (DEPTH_BULLET)
Group: playerBullets
Gravity: Disabled
```

### Enemy Bullets

```
Shape: Circle (4 px radius)
Color: 0xff0000 (red)
Velocity: (cos(angle)*250, sin(angle)*250)
Depth: 20 (DEPTH_BULLET)
Group: enemyBullets
Gravity: Disabled
```

**During Pause**:
- Bullets frozen in place (physics paused)
- No new bullets spawned
- Existing bullets resume trajectory on unpause

---

## Weapon System (NEW)

`src/weapons/WeaponManager.js` + `src/weapons/WeaponRegistry.js`

### Overview

- **Multi-weapon support**: Player can equip multiple weapons simultaneously
- **Auto-fire enabled**: Weapons fire automatically at their configured rates
- **Independent cooldowns**: Each weapon tracks its own fire timing
- **Debug menu toggling**: Enable/disable weapons at runtime

### Weapon Configs (3 weapons total)

| Weapon | Fire Rate | Speed | Damage | Pattern | Description |
| ----- | ----- | ----- | ----- | ----- | ----- |
| **BASIC** | 200ms | 500 px/s | 60 | SINGLE | Standard single-shot |
| **RAPID** | 100ms | 550 px/s | 40 | ALTERNATING_POSITION | Fast alternating shots |
| **SPREAD** | 400ms | 480 px/s | 50 | SPREAD_3 | 3-bullet spread (-15°, 0°, +15°) |

### Key Features

- **Per-weapon cooldown tracking**: `lastFireTimePerWeapon` object
- **Fire sequence counter**: For ALTERNATING_POSITION patterns
- **Auto-shoot enabled**: No manual input needed once equipped
- **Independent bullet pools**: Player bullets use shared pool

### Weapon Manager Methods

```javascript
equipWeapon(weaponKey)     // Single weapon (replaces all)
toggleWeapon(weaponKey)    // Toggle on/off (multi-weapon)
update(time)               // Handle auto-fire for all weapons
firingWeapons(count)       // Fire specified weapons
getActiveWeapons()         // Return enabled weapon configs
```

### Bullet Creation

Player bullets created via `PlayerBulletFactory.js`:
- **Pattern generation**: Per weapon config (SINGLE, SPREAD_3, etc.)
- **Position offset**: For ALTERNATING_POSITION weapon
- **Shared pool**: All player bullets in same physics group

**During Pause**:
- Weapon manager blocked (no firing)
- Existing bullets frozen
- Cooldowns paused

---

## Pattern System

`src/patterns/PatternSystem.js`

### Pattern Interface

```javascript
pattern(originX, originY, targetX, targetY, scene) → Array<Bullet>
```

### Available Patterns

| Pattern | Bullets | Type | Description |
|---------|---|-|--------|
| SINGLE | 1 | Linear | Direct at player |
| DOUBLE | 2 | Spread | 5° cone |
| TRIPLE | 3 | Spread | -10°, 0°, +10° |
| CONE_5 | 5 | Cone | 60° spread |
| CIRCLE_6 | 6 | Radial | 360° circle |
| SPREAD_7 | 7 | Fan | 120° wide spread |

### Usage

```javascript
const pattern = PatternSystem.getPattern('TRIPLE');
pattern(enemyX, enemyY, playerX, playerY, scene);
```

**During Pause**:
- Pattern generation blocked
- No new pattern shots fired
- Existing bullets resume on unpause

---

## Spawner System

`src/system/spawner/spawnerSystem.js`

### Responsibilities

- Random enemy type selection (weighted)
- Spawn position calculation
- Enemy instantiation
- Spawn timing control
- **Paused during game pause**

### Configuration

- **Spawn rate**: 2000 ms (via `getSpawnRate()`)
- **X range**: 32 to BASE_WIDTH - 32
- **Y start**: -20 (top, off-screen)

### Methods

- `update(time)` → Check spawn timing, spawn if needed
- `spawnEnemy()` → Select type, create instance, spawnAt()
- `getSpawnPosition()` → Return {x, y} object
- `setSpawnRate(rate)` → Override default rate

### Pause Behavior

- Spawning continues internally but enemies have frozen update()
- **Effectively no new enemies appear during pause**
- Spawn queue cleared on unpause (next spawn from current time)

---

## Collision System

`src/system/collision/collisionSystem.js`

### Collision Pairs

**1. Player Bullet ↔ Enemy**
```
Handler: handleBulletEnemy(bullet, enemy)
Result: 
  - bullet destroyed
  - enemy.takeDamage(BULLET_DAMAGE)
  - if enemy dies: +score, enemy destroyed
```

**2. Enemy Bullet ↔ Player**
```
Handler: handleEnemyBulletPlayer(player, bullet)
Result:
  - bullet destroyed
  - score -= 5
  - flash player (visual feedback)
```

**3. Enemy ↔ Player**
```
Handler: handleEnemyPlayer(player, enemy)
Result:
  - enemy destroyed
  - score -= 5
  - flash player (visual feedback)
```

### Design Decisions

- **No bullet-bullet collision**: Intentional (bullet hell convention)
- **No player health**: Score penalty instead
- **Visual feedback**: Flash animation on player hit
- **Collision paused during game pause** (no new collisions detected)

### Setup

Called in `setupCollisions()`:
```javascript
scene.physics.add.overlap(playerBullets, enemies, handleBulletEnemy)
scene.physics.add.overlap(player, enemyBullets, handleEnemyBulletPlayer)
scene.physics.add.overlap(player, enemies, handleEnemyPlayer)
```

---

## Score System

### Configuration

| Event | Value |
|---|---|
| Kill Faller | +10 |
| Kill Tapper | +20 |
| Kill Shooter | +30 |
| Player hit (any) | -5 |

### Display

- Top-left corner (16, 16)
- 24px white text
- Updates via `updateScoreText()`
- Depth: DEPTH_TEXT (100)

### Pause Behavior

- Scoring blocked during game pause
- Score display unchanged (no updates)
- Resumes normal scoring on unpause

---

## Cleanup System

### Off-Screen Detection

**Player Bullets**:
- Destroyed when `y < -50`

**Enemy Bullets**:
- Destroyed when outside bounds ±50px:
  - `x < -50`
  - `x > BASE_WIDTH + 50`
  - `y < -50`
  - `y > BASE_HEIGHT + 50`

**Enemies**:
- Destroyed when `y > BASE_HEIGHT + 20`

### MainScene.cleanupOffScreen()

Called every frame in `update()` loop.

**During Pause**:
- Cleanup still runs (removes off-screen entities)
- Prevents memory leaks
- Safe to run on paused entities

---

## Pause Manager (NEW)

`src/system/PauseManager.js`

### Stack-Based Pause System

- **P key** toggles pause state
- **Stack maintains** pause levels (supports reentrancy)
- **Physics freeze** via `scene.physics.world.pause()`
- **Trajectory preservation**: Exact physics state saved/resumed
- **Update() blocked**: Game logic prevented from running

### Key Methods

```javascript
pause()      // Push pause to stack, freeze physics
resume()     // Pop pause from stack, unfreeze
isPaused()   // Check if currently paused
```

### Implementation Details

- Uses stack array to track pause levels
- Calls `scene.physics.world.pause()` on push
- Calls `scene.physics.world.resume()` on pop
- No time events paused (uses blocked update() instead)
- Debug menu integration (opens/closes with pause)

### Limitations

- Timers and delayed calls continue internally
- Time events not truly frozen (but game logic blocked)
- No player-facing pause menu yet

---

## Debug System (UPDATED)

`src/debug/DebugSystem.js` + related modules

### Components

1. **DebugMenu** - Interactive UI with checkbox toggles
2. **DebugVisualizers** - Draw hitboxes, bounds, etc.
3. **DebugInputHandler** - Captures keypresses during pause/menu
4. **DebugController** - Manages debug state and interactions
5. **DebugConstants** - All UI strings and icons

### Features

- **Two menu categories**:
  - **VISUALIZERS**: Toggle hitbox visualization (Player, Enemy, Bullets)
  - **PLAYER_WEAPONS**: Toggle weapons (BASIC, RAPID, SPREAD)
- **Checkbox navigation**: UP/DOWN arrows, ENTER to toggle, BACKSPACE to exit
- **Real-time toggling**: Changes apply immediately after resume
- **Stack-based pause**: Opens/closes with game pause

### Debug Menu Structure

```
Main Menu:
├── VISUALIZERS [ENTER to open]
│   ├── [ ] Player
│   ├── [ ] Enemy
│   └── [ ] Player Bullets
└── PLAYER_WEAPONS [ENTER to open]
    ├── [ ] BASIC
    ├── [ ] RAPID
    └── [ ] SPREAD
```

### Integration

- **PauseManager integration**: Opens when game paused, closes on resume
- **WeaponManager integration**: Toggle weapons via `weaponManager.toggleWeapon()`
- **Visualizer flags**: Stored in `debugVisualizers` flags
- **Input priority**: Debug input hijacks keyboard during pause/menu

### Limitations

- No player-facing pause menu (debug menu only)
- No save/load of debug settings
- Weapons must be toggled manually (no power-up system)

---

## Scoring Flow

```
1. Collision detected
2. Handler called (e.g., handleBulletEnemy)
3. Enemy.takeDamage() called
4. If enemy.health <= 0:
   - enemy.destroyed
   - scene.score += enemyConfig.score
   - scene.updateScoreText()
5. If player hit:
   - scene.score -= 5
   - scene.updateScoreText()
```

### During Pause

- No new collisions detected
- No scoring changes
- Existing score preserved
- Resumes on unpause
