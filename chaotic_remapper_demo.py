#!/usr/bin/env python3
"""
Chaotic Keyboard Remapper - System Level Implementation
WARNING: This is for educational purposes only!

This script demonstrates how a system-level keyboard remapper would work.
Due to security restrictions, actual implementation requires:
- Administrative privileges
- Platform-specific keyboard hook libraries
- Proper security permissions

Requirements for full implementation:
- Windows: pynput, keyboard, or ctypes with Windows API
- macOS: pynput with accessibility permissions
- Linux: evdev, xlib, or similar low-level access

IMPORTANT: This demonstration version only works in the terminal where it's run.
"""

import random
import time
import threading
import sys
from typing import Dict, List, Any
import signal

class ChaoticKeyboardRemapper:
    """
    Demonstration of chaotic keyboard remapping logic.
    In a real implementation, this would hook into system keyboard events.
    """
    
    def __init__(self):
        # All remappable characters
        self.all_keys = [
            # Letters
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            # Numbers  
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
            # Symbols
            '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '+',
            '[', ']', '{', '}', '\\', '|', ';', ':', "'", '"', ',', '.', '<',
            '>', '/', '?', '`', '~'
        ]
        
        # Special keys that can be remapped occasionally
        self.special_keys = ['space', 'backspace', 'enter']
        
        # Current key mapping
        self.key_mapping: Dict[str, str] = {}
        
        # Chaos state
        self.chaos_active = True
        self.caps_lock_inverted = True  # Always on unless explicitly turned on
        
        # Threading
        self.shuffle_thread = None
        self.running = False
        
        print("🔀 Chaotic Keyboard Remapper - System Level Demo")
        print("⚠️  WARNING: This would remap ALL keyboard input system-wide!")
        print("📝 This demo only shows the remapping logic.\n")
    
    def shuffle_keys(self) -> None:
        """
        Randomly shuffle all key mappings.
        In a real implementation, this would update system keyboard hooks.
        """
        print("\n🔄 SHUFFLING KEYS (No warning given to user!)")
        
        # Clear existing mappings
        self.key_mapping.clear()
        
        # Create shuffled mapping
        keys = self.all_keys.copy()
        values = self.all_keys.copy()
        
        # Occasionally include special keys (30% chance each)
        for special_key in self.special_keys:
            if random.random() < 0.3:
                keys.append(special_key)
                values.append(random.choice(self.all_keys))
        
        # Fisher-Yates shuffle
        random.shuffle(values)
        
        # Create mapping
        for i, key in enumerate(keys):
            if i < len(values):
                self.key_mapping[key] = values[i]
        
        print(f"✅ Remapped {len(self.key_mapping)} keys")
        self.display_sample_mappings()
    
    def display_sample_mappings(self) -> None:
        """Display a sample of current key mappings."""
        print("\n📊 Sample Key Mappings:")
        sample_keys = list(self.key_mapping.keys())[:15]  # Show first 15
        
        for key in sample_keys:
            mapped = self.key_mapping[key]
            print(f"  {key} → {mapped}")
        
        if len(self.key_mapping) > 15:
            print(f"  ... and {len(self.key_mapping) - 15} more mappings")
        print()
    
    def simulate_key_press(self, key: str) -> str:
        """
        Simulate what would happen when a key is pressed.
        In a real implementation, this would intercept actual key events.
        """
        # Apply remapping if key exists in mapping
        if key.lower() in self.key_mapping:
            mapped_char = self.key_mapping[key.lower()]
            
            # Apply inverted caps lock behavior
            if mapped_char.isalpha():
                if self.caps_lock_inverted:
                    mapped_char = mapped_char.upper()
                else:
                    mapped_char = mapped_char.lower()
            
            return mapped_char
        
        # Return original key if not remapped
        return key
    
    def toggle_caps_lock(self) -> None:
        """
        Handle caps lock with inverted behavior.
        In a real implementation, this would hook caps lock events.
        """
        self.caps_lock_inverted = not self.caps_lock_inverted
        status = "OFF" if self.caps_lock_inverted else "ON"
        print(f"🔠 Caps Lock toggled: {status} (inverted behavior)")
    
    def start_chaos_timer(self) -> None:
        """Start the 60-second chaos timer."""
        def chaos_loop():
            while self.running:
                if self.chaos_active:
                    # Countdown
                    for seconds in range(60, 0, -1):
                        if not self.running or not self.chaos_active:
                            break
                        
                        if seconds <= 10:
                            print(f"⏰ Next shuffle in {seconds}s", end='\r')
                        
                        time.sleep(1)
                    
                    if self.running and self.chaos_active:
                        self.shuffle_keys()
                else:
                    time.sleep(1)
        
        self.running = True
        self.shuffle_thread = threading.Thread(target=chaos_loop, daemon=True)
        self.shuffle_thread.start()
    
    def stop_chaos(self) -> None:
        """Stop the chaos timer."""
        self.running = False
        self.chaos_active = False
        print("\n⏸️  Chaos stopped!")
    
    def demo_typing_simulation(self) -> None:
        """
        Demonstrate what typing would look like with chaotic remapping.
        """
        print("\n🎮 TYPING SIMULATION DEMO")
        print("Type 'quit' to exit, 'shuffle' to force reshuffle, 'caps' to toggle caps lock")
        print("Watch how your input gets chaotically remapped!\n")
        
        while self.running:
            try:
                user_input = input("Type something: ")
                
                if user_input.lower() == 'quit':
                    break
                elif user_input.lower() == 'shuffle':
                    self.shuffle_keys()
                    continue
                elif user_input.lower() == 'caps':
                    self.toggle_caps_lock()
                    continue
                
                # Simulate chaotic remapping
                remapped_output = ""
                for char in user_input:
                    remapped_char = self.simulate_key_press(char)
                    remapped_output += remapped_char
                
                print(f"Original:  {user_input}")
                print(f"Remapped:  {remapped_output}")
                print(f"Chaos Level: {len([c for c in user_input if c.lower() in self.key_mapping])}/{len(user_input)} keys affected\n")
                
            except KeyboardInterrupt:
                break
    
    def display_implementation_info(self) -> None:
        """Display information about real implementation requirements."""
        print("\n" + "="*60)
        print("🔧 REAL IMPLEMENTATION REQUIREMENTS")
        print("="*60)
        print("""
For actual system-wide keyboard remapping, you would need:

WINDOWS:
  - pynput library: pip install pynput
  - keyboard library: pip install keyboard  
  - Or ctypes with Windows API hooks
  - Run as Administrator
  
MACOS:
  - pynput with accessibility permissions
  - System Preferences → Security & Privacy → Accessibility
  - Add Python/Terminal to allowed apps
  
LINUX:
  - evdev library: pip install evdev
  - python-xlib: pip install python-xlib
  - Root privileges or udev rules
  - May require X11 or Wayland specific implementations

SECURITY CONSIDERATIONS:
  - Requires elevated privileges
  - Could be flagged by antivirus software  
  - Should include escape mechanisms
  - User consent and warnings essential
  
ETHICAL USAGE:
  - Only on your own systems
  - Clear user consent required
  - Provide easy way to disable
  - Consider accessibility implications
""")
        print("="*60)
    
    def run(self) -> None:
        """Main execution loop."""
        try:
            # Initial shuffle
            self.shuffle_keys()
            
            # Start chaos timer
            self.start_chaos_timer()
            
            # Show implementation info
            self.display_implementation_info()
            
            # Run typing simulation
            self.demo_typing_simulation()
            
        except KeyboardInterrupt:
            pass
        finally:
            self.stop_chaos()
            print("\n👋 Chaos ended. Your keyboard is safe... for now! 😈")

def signal_handler(signum, frame):
    """Handle Ctrl+C gracefully."""
    print("\n\n🛑 Chaos interrupted by user!")
    sys.exit(0)

if __name__ == "__main__":
    # Set up signal handler for graceful exit
    signal.signal(signal.SIGINT, signal_handler)
    
    # Create and run the chaotic remapper
    remapper = ChaoticKeyboardRemapper()
    remapper.run()
