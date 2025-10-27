# 🎮 Controls Guide - FOOTBALL MANIA

## Overview
FOOTBALL MANIA now supports multiple control methods for both desktop and mobile devices, making it accessible to players on any platform.

---

## 🖥️ Desktop Controls

### Keyboard Shortcuts

#### Quick Match Mode
| Key | Action | Description |
|-----|--------|-------------|
| **SPACE** | Kick Ball | Moves the ball to a random location on the field |
| **P** | Pass | Passes the ball to a nearby teammate |
| **S** | Shoot | Attempts to score a goal |
| **ESC** | Menu | Returns to main menu |

#### Penalty Shootout Mode
| Key | Action | Description |
|-----|--------|-------------|
| **SPACE** | Shoot | Takes the penalty shot |
| **ESC** | Menu | Returns to main menu |

---

## 📱 Mobile Controls

### Touch Gestures

#### Quick Match Mode
| Gesture | Action | Description |
|---------|--------|-------------|
| **Swipe Right ↔️** | Kick Ball | Swipe horizontally to kick |
| **Swipe Up ⬆️** | Shoot | Swipe upward to shoot at goal |
| **Swipe Down ⬇️** | Pass | Swipe downward to pass to teammate |

#### Touch Requirements
- **Minimum swipe distance**: 50 pixels
- **Direction detection**: Primary direction (horizontal or vertical) determines action
- **Touch target size**: Optimized for 44x44px minimum on mobile devices

---

## 🖱️ Button Controls

### Mouse/Touch Click Controls

All game functions are also accessible via on-screen buttons:

- **⚽ KICK BALL**: Initiate ball movement
- **📤 PASS**: Pass to teammates
- **🥅 SHOOT**: Attempt to score
- **← MENU**: Return to main menu
- **SHOOT!**: Take penalty shot (Penalty mode only)

---

## 🎯 Visual Controls Display

When you enter Quick Match mode, you'll see a controls info panel showing:

```
🎮 Controls
💻 Keyboard: SPACE = Kick | P = Pass | S = Shoot | ESC = Menu
📱 Touch: Swipe ↔️ = Kick | Swipe ⬆️ = Shoot | Swipe ⬇️ = Pass
```

This information helps you learn the controls quickly!

---

## 🔧 Technical Details

### Keyboard Implementation
- Uses `keydown` event listeners
- Prevents default browser behavior for game keys
- Context-aware: only active when in game screens
- ESC key works globally to exit to menu

### Touch Implementation
- Uses `touchstart` and `touchend` events
- Calculates swipe distance and direction
- Delta threshold: 50px minimum
- Primary direction (X or Y axis) determines action
- Touch targets optimized for mobile accessibility

### Mobile Optimization
- Minimum touch target size: 44x44px (WCAG compliant)
- Touch-action CSS property for better responsiveness
- Tap highlight feedback
- Larger buttons on mobile devices
- Full-width controls on small screens (480px and below)

---

## 🚀 Tips for Best Experience

### Desktop Players
- Use keyboard for faster gameplay
- Keep hands on WASD/arrow key area for quick access
- ESC is always available to pause/exit

### Mobile Players
- Make deliberate swipes (not tiny flicks)
- Swipe with 50px+ movement for reliable detection
- Longer swipe doesn't matter, just the direction
- Use landscape mode for better field visibility

### Button Players
- On-screen buttons work on all devices
- Larger buttons on mobile for easy tapping
- Visual feedback on button press

---

## 📊 Control Priority

1. **Keyboard controls** - Fastest for desktop play
2. **Touch gestures** - Natural for mobile
3. **Button controls** - Universal fallback

All control methods work simultaneously - use whichever is most comfortable!

---

## 🎮 Try It Now!

1. Open the game in your browser
2. Click "QUICK MATCH"
3. Try both keyboard and touch controls
4. See which method feels best for you!

Enjoy playing FOOTBALL MANIA! ⚽🎮
