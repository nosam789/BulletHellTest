# Vertical Bullet Hell Game - Mobile-First Edition

A vertical bullet hell game built with Phaser.js, optimized for mobile (iPhone first) with PC support.

## Mobile Controls

**Touch Controls (Default: ON)**

- **D-Pad** (lower right): Move player in 4 directions (up/down/left/right)
- **Fire Button** (left side): Tap to shoot, hold 2 seconds to toggle autofire
- **Mouse**: Works as touch control stand-in for PC testing

**Keyboard (Still Works)**

- **Arrow Keys or WASD**: Move player (all 4 directions)
- **Space or W**: Fire projectile

## Configuration

Access settings menu to customize:
- D-Pad position (left or right side)
- Touch controls visibility
- Autofire default state

All settings saved automatically.

## Technical Details

- **Engine**: Phaser.js 3.60.0
- **Target Device**: iPhone (portrait mode only)
- **Base Resolution**: 360x640 (scales dynamically)
- **No build step required** - runs directly in browser
- No external assets - all graphics generated programmatically

## Features

### Core Gameplay
- 4-directional player movement
- Projectile shooting with autofire option
- Enemy spawning system
- Collision detection
- Score tracking (+10 kill, -5 damage)
- Game over at score below -50

### Mobile Optimization
- Dynamic resolution scaling for all devices
- Translucent touch controls (see-through UI)
- Multi-touch support for diagonal movement
- Anti-zoom and scroll prevention
- Retina display support

### Settings
- D-Pad left/right toggle
- Touch controls enable/disable
- Autofire starting state
- LocalStorage persistence

## Game Specs

- **Orientation**: Vertical only (portrait)
- **Player**: 24x24 green square
- **Bullets**: 6x6 yellow squares, 500px/s speed
- **Enemies**: 32x32 red squares, 100px/s falling
- **Fire Cooldown**: 200ms
- **Enemy Spawn Rate**: Every 2000ms
- **Autofire Toggle**: 2-second hold on fire button

## Quick Start

1. Open `index.html` in web browser (or mobile Safari)
2. Tap fire button + use D-pad to play
3. Tap 2x on screen for settings (future: pause button)
4. For PC testing, keyboard controls also work

## Known Limitations

- Portrait orientation only
- No sound effects yet
- Placeholder graphics (squares only)
- Game over restarts entire page

## Future Plans

- Particle effects on explosions
- Multiple enemy types with patterns
- Boss encounters
- Lives/continue system
- High score tracking
- Sound effects and music
- Better graphics (pixel art sprites)
