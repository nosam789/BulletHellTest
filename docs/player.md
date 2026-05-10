# Player System

## Visual Configuration

| Property | Value |
|---------|-------|
| PLAYER_SIZE | 24 px (square) |
| PLAYER_SPEED | 300 px/s |
| COLOR_PLAYER | 0x00ff00 (green) |
| Start Position | (BASE_WIDTH/2, 560) |
| Depth | 10 |
| Shape | Rectangle (Procedural) |

## File Location

`src/enemies/BaseEnemy.js` - Shape rendering  
`src/scenes/MainScene.js` - Movement & input handling

## Movement

### Keyboard Controls

| Input | Direction |
|------|----------|
| WASD | 4-directional |
| Arrow Keys | 4-directional |

**Behavior**:
- Diagonal movement normalized (prevents speed boost)
- Max velocity: 300 px/s all directions
- World bounds collision enabled
- Velocity set via `player.body.setVelocity(vx, vy)`
- - Movement frozen during game pause (P key)
- **Weapon system**: Active weapons auto-shoot

### Shooting Weapons

**Weapon System**:
- **WeaponManager** handles all player weapons
- Multi-weapon support (can equip multiple weapons at once)
- Each weapon has independent cooldown and fire rate
- **Weapons managed via debug menu** (currently)

| Key | Action |
|-----|-- ------|
| Auto-fire | Automatic firing (weapons enabled) |

**Behavior**:
- **Weapon system**: Multi-weapon support via `WeaponManager`
- Weapons auto-shoot when active (no manual firing)
- Each weapon has independent fire rate and cooldown
- Bullets spawn at player position (adjusted per weapon config)
- **Weapons disabled during game pause**

## Physics Body

```javascript
this.player.body.setCollideWorldBounds(true)
this.player.body.setMaxVelocity(300, 300)
```

**During Pause**:
- Physics body paused via `scene.physics.world.pause()`
- Velocity set to (0, 0) effectively
- **Trajectory preserved** - resumes exactly where stopped

## Visual Feedback

- Flash animation when hit (alpha toggle)
- No damage states (no health system)
- **Visuals frozen during pause** (no rendering updates)

## Pause System Integration

When game is paused (P key):
1. **Movement blocked**: Physics world paused
2. **Shooting blocked**: Spacebar input ignored
3. **State preserved**: Exact position/velocity saved
4. **Debug menu open**: Can inspect game state
5. **Resume seamless**: No trajectory loss on unpause

## Limitations

- No player health
- No invincibility frames
- No sound effects
- Placeholder graphics (green rectangle)
- **No touch controls** (currently broken, see Plan.md)
- **No pause menu UI** (only debug menu, no player-facing pause screen)
