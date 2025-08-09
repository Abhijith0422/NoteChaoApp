# 🔀 Chaotic Keyboard Remapper

A web-based simulation of a chaotic keyboard remapper that shuffles key mappings every minute without warning, creating a truly chaotic typing experience.

## Features

### Core Chaos Features
- **🔄 Auto-Shuffle**: Keys randomly remap every 60 seconds with no warning
- **🎯 Complete Remapping**: All letters, numbers, and symbols get shuffled
- **⚠️ Silent Operation**: No warnings when layouts change (pure chaos!)
- **🔙 Special Key Chaos**: Backspace, Enter, and Space occasionally remapped
- **🔠 Inverted Caps Lock**: Always ON unless explicitly turned on (then it turns OFF)

### Interactive Elements
- **⌨️ Virtual Keyboard**: Visual representation of current key mappings
- **📝 Live Text Input**: Type to experience the chaos in real-time
- **⏰ Countdown Timer**: Shows time until next shuffle
- **🎛️ Chaos Control**: Toggle chaos mode on/off
- **📊 Mapping Display**: Shows sample current key mappings

## How It Works

### The Chaos Algorithm
1. **Initialization**: Creates a mapping of all printable characters
2. **Fisher-Yates Shuffle**: Randomly shuffles character assignments
3. **Special Key Integration**: Occasionally includes Backspace, Enter, Space in remapping
4. **Real-time Interception**: Captures keyboard events and applies remapping
5. **Silent Rotation**: Changes mapping every 60 seconds without notification

### Key Remapping Logic
```javascript
// Example mapping transformation
Original: a → b → c → d → e
Chaotic:  a → $, b → 9, c → z, d → !, e → m
```

### Inverted Caps Lock Behavior
- **Default State**: Caps Lock is ON (letters appear uppercase)
- **When Activated**: Turns OFF (letters appear lowercase)
- **Visual Indicator**: Shows current state in status bar

## Usage

### Getting Started
1. Open `index.html` in a web browser
2. Start typing in the text area
3. Watch as your keys produce unexpected characters
4. Observe the virtual keyboard showing current mappings
5. Experience chaos as mappings shuffle every minute

### Controls
- **Stop/Start Chaos**: Toggle button to pause/resume remapping
- **Virtual Keyboard**: Click keys to see their current mapping
- **Caps Lock**: Press to toggle inverted caps behavior

## Technical Implementation

### Cross-Platform Compatibility
- **Web-Based**: Works on Windows, macOS, and Linux
- **Browser Support**: Modern browsers with ES6+ support
- **Responsive Design**: Adapts to different screen sizes

### Real-Time Key Interception
```javascript
// Simplified interception logic
textInput.addEventListener('keypress', (e) => {
    const originalKey = e.key.toLowerCase();
    if (keyMapping.has(originalKey)) {
        e.preventDefault();
        insertRemappedCharacter(keyMapping.get(originalKey));
    }
});
```

### Chaos Timer System
```javascript
// 60-second shuffle cycle
setInterval(() => {
    shuffleKeys();  // No warning given!
    updateDisplay();
}, 60000);
```

## File Structure

```
📁 Chaotic Keyboard Remapper/
├── 📄 index.html          # Main HTML structure
├── 🎨 styles.css          # Styling and animations
├── ⚙️ script.js           # Core chaos logic
└── 📖 README.md           # This documentation
```

## Code Architecture

### ChaoticKeyboardRemapper Class
- **Constructor**: Initializes key arrays and state
- **shuffleKeys()**: Implements Fisher-Yates shuffle algorithm
- **handleKeyPress()**: Intercepts and remaps keyboard input
- **createVirtualKeyboard()**: Generates visual keyboard representation
- **startChaosTimer()**: Manages 60-second shuffle intervals

### Key Features Implementation

#### Silent Shuffling
```javascript
// No user notification when chaos strikes
shuffleKeys(); // Instant chaos!
updateVirtualKeyboard();
// User discovers remapping by typing
```

#### Special Key Chaos
```javascript
// 30% chance special keys get remapped
if (Math.random() < 0.3) {
    keyMapping.set('Backspace', getRandomChar());
    keyMapping.set(' ', getRandomChar());
    keyMapping.set('Enter', getRandomChar());
}
```

## Demo Features

### Visual Feedback
- **🔴 Remapped Keys**: Highlighted in red with pulse animation
- **🔵 Special Keys**: Blue gradient for system keys
- **⏰ Countdown**: Shows seconds until chaos strikes
- **📊 Live Mappings**: Grid showing current key transformations

### Chaos Indicators
- **Pulsing Effects**: Visual cues when keys are remapped
- **Color Coding**: Different colors for different types of chaos
- **Status Bar**: Real-time information about chaos state

## Browser Limitations

Since this is a web-based simulation, it has some limitations compared to system-level keyboard hooks:

- **Scope**: Only affects typing within the web page
- **System Keys**: Cannot intercept system-level shortcuts
- **Background Operation**: Requires browser tab to be active

For true system-wide chaos, you would need a native application with appropriate permissions.

## Safety Note

This is a demonstration/simulation. The chaotic remapping only affects the textarea within this webpage. Your system keyboard remains unaffected when you leave this page.

## Future Enhancements

- **🎮 Gaming Mode**: Special chaos for gaming scenarios
- **📱 Mobile Support**: Touch keyboard remapping
- **🔊 Audio Feedback**: Sound effects for chaos events
- **📈 Chaos Analytics**: Statistics on typing confusion
- **🎨 Themes**: Different visual styles for chaos
- **💾 Save/Load**: Preserve specific chaotic configurations

## Contributing

Feel free to enhance the chaos! Some ideas:
- Add more special characters to the remapping pool
- Implement different shuffle algorithms
- Create chaos patterns (e.g., vowels swap with consonants)
- Add visual effects for shuffle moments
- Implement chaos intensity levels

## License

This project is open source. Use it to spread chaos responsibly! 😈

---

**⚠️ Warning**: May cause temporary typing confusion, laughter, and appreciation for standard keyboard layouts. Use responsibly!
