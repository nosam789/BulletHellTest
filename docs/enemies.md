# Enemy System

## Architecture

### Base Class

`src/enemies/BaseEnemy.js`

**Responsibilities**:
- State machine framework
- Shape rendering (rectangle, triangle, circle, cross)
- Common behavior (takeDamage, destroy, spawnAt)
- Physics body management
- **Paused during game pause** (motion and update stopped)

**State Machine Pattern**:
```javascript
this.stateHandlers = {
    IDLE: (time, delta) => this.handleIdle(time, delta),
    ENTER: (time, delta) => this.handleEnter(time, delta),
    // ... more states
}
```

**Key Methods**:
- `update(time, delta)` → Calls current state handler
- `setState(newState, duration)` → Transition with timeout
- `takeDamage(amount)` → Reduces health, visual feedback, destroys if dead
- `destroy()` → Removes from scene and groups

### Enemy Types

| Type | File | Shape | States | Score | Spawns |
|------|---|-----|---|-|-|
| Faller | FallerEnemy.js | Rectangle | ENTER → FALL → EXIT | 10 | 50% |
| Tapper | TapperEnemy.js | Triangle | ENTER → TAP (track) → EXIT | 20 | 30% |
| Shooter | ShooterEnemy.js | Circle | ENTER → HOVER ↔ SHOOT → EXIT | 30 | 20% |

---

## Enemy Registry

`src/enemies/EnemyRegistry.js`

### Configuration

All enemy configs centralized:

```javascript
ENEMY_CONFIGS = {
    FALLER: { ...config },
    TAPPER: { ...config },
    SHOOTER: { ...config }
}
```

### Factory Functions

- `getRandomEnemyType()` → Weighted random selection
- `getEnemyClass(type)` → Returns class constructor
- `getEnemyConfig(type)` → Returns config object
- `createSpawnPool()` → Generates weighted array

---

## Enemy Types Detail

### Faller (Rectangle)

| Property | Value |
|----|-------|
| Size | 32 px |
| Health | 100 |
| Speed | 300 px/s downward |
| Shape | Blue rectangle |
| Color | 0x0000ff |

**Behavior**:
- Enters from top (500ms hold)
- Falls straight down at constant velocity
- Destroyed when off-screen
- **Frozen during game pause**

### Tapper (Triangle)

| Property | Value |
|----|----------|
| Size | 28 px |
| Health | 80 |
| Speed | 220 px/s downward |
| Shape | Pink triangle |
| Color | 0xff00ff |
| Tracking | Player X with smooth oscillation |
| Tracking Speed | 0.03 (3% interpolation) |
| Tracking Offset | 40 px |
| Oscillation | Sine wave (0.8 Hz, ±60px) |
| Max Horizontal Speed | 200 px/s |

**Behavior**:
- Enters from top (300ms hold)
- Begins tracking player after 100ms delay
- Falls while smoothly tracking player's X position with oscillating offset
- Horizontal movement limited to 200 px/s, clamped to screen bounds
- Destroyed when off-screen
- **Frozen during game pause**

### Shooter (Circle)

| Property | Value |
|-----|------|
| Size | 40 px |
| Health | 300 |
| Speed | 60 px/s (enter), 40 px/s (hover) |
| Shape | Red circle with white dot |
| Color | 0xff0000 |
| Shoot Cooldown | 2000 ms |
| Bullet Pattern | TRIPLE |

**Behavior**:
- Enters and hovers (1000ms)
- Shoots pattern at player (2000ms, 2000ms cooldown)
- Returns to hover (1000ms)
- Repeats hover/shoot cycle until off-screen
- **Frozen during game pause**
- **Shooting patterns paused during game pause**

---

## Health & Damage

| Enemy Type | Health | Bullet Damage | Hits to Kill |
|----|---|---|-|
| Faller | 100 | 60 | 2 |
| Tapper | 80 | 60 | 2 |
| Shooter | 300 | 60 | 5 |

**Damage Behavior**:
- Health reduced by BULLET_DAMAGE (60)
- Visual feedback: random color change on hit
- Destroyed when health ≤ 0
- Score added based on enemy type
- **Damage collisions paused during game pause**

---

## Spawning

**Spawner System** (`src/system/spawner/spawnerSystem.js`)

- Spawn rate: 2000 ms (configurable)
- Random X position (32 to BASE_WIDTH-32)
- Starts at Y = -20 (top, off-screen)
- Weighted random type selection
- **Spawning paused during game pause**

**Spawn Weights**:
- Faller: 50% (50/100)
- Tapper: 30% (30/100)
- Shooter: 20% (20/100)

---

## Shape Rendering

### Rectangle
Default shape, 32x32

### Triangle
- Created using Phaser Graphics API
- Points: top, bottom-right, bottom-left
- Filled polygon
- Used for Tapper enemy

### Circle
- Main circle shape
- Center dot (white, 30% radius)
- Visual distinction for shooter type

### Cross
- Vertical bar + horizontal bar
- Arm width: size/4
- Future use (not currently spawned)

---

## Collision

Handled by `CollisionSystem`:

- **With player bullet**: `handleBulletEnemy()` → takeDamage()
- **With player body**: `handleEnemyPlayer()` → destroy + penalty
- **All collisions paused during game pause**

---

## Cleanup

- Destroyed when `y > BASE_HEIGHT + 20`
- Removed from `enemies` physics group
- All references nulled
- **Cleanup continues during pause** (off-screen enemies still removed)
