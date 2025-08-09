/**
 * NotePad - Simple Text Editor
 * A clean, professional text editor for writing
 */

class SimpleTextEditor {
    constructor() {
        // Editor functionality
        this.textInput = null;
        this.charCount = null;
        this.wordCount = null;
        this.clearButton = null;
        this.undoButton = null;
        this.bubbleContainer = null;
        
        // Hidden remapping functionality (completely disguised)
        this.allKeys = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
            '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '+',
            '[', ']', '{', '}', '\\', '|', ';', ':', "'", '"', ',', '.', '<',
            '>', '/', '?', '`', '~'
        ];
        // Special keys (space is excluded from remapping to maintain normal typing)
        this.specialKeys = [' ', 'Backspace', 'Enter'];
        this.keyMapping = new Map();
        
        // Word replacement system
        this.randomWords = [
            'banana', 'elephant', 'mystery', 'rainbow', 'adventure', 'whisper', 'thunder', 'butterfly',
            'dragon', 'castle', 'ocean', 'mountain', 'forest', 'wizard', 'treasure', 'magic',
            'rocket', 'galaxy', 'planet', 'star', 'comet', 'universe', 'nebula', 'asteroid',
            'pizza', 'chocolate', 'cookie', 'sandwich', 'pancake', 'ice cream', 'burger', 'pasta',
            'computer', 'keyboard', 'monitor', 'mouse', 'software', 'internet', 'website', 'coding',
            'happiness', 'friendship', 'laughter', 'sunshine', 'rainbow', 'smile', 'joy', 'peace',
            'telephone', 'bicycle', 'airplane', 'submarine', 'helicopter', 'motorcycle', 'spaceship', 'train',
            'library', 'bookstore', 'museum', 'theater', 'cinema', 'restaurant', 'hospital', 'school',
            'guitar', 'piano', 'violin', 'drums', 'saxophone', 'trumpet', 'flute', 'harmonica',
            'superhero', 'villain', 'sidekick', 'costume', 'cape', 'mask', 'powers', 'justice'
        ];
        this.wordReplacementEnabled = true;
        this.capsLockInverted = true;
        this.remappingActive = true;
        this.shuffleInterval = null;
        this.typingTimeout = null;
        
        // Text aging system
        this.wordTimestamps = new Map(); // Track when each word was typed
        this.agingInterval = null;
        this.AGING_THRESHOLD = 5120000000; // 5 seconds in milliseconds
        
        // Scroll chaos system
        this.scrollInverted = false;
        this.scrollInvertNext = false;
        this.SCROLL_CHAOS_CHANCE = 0.15; // 15% chance per scroll
        
        // Auto-typing gibberish system
        this.autoTypeTimeout = null;
        this.AUTO_TYPE_DELAY = 5000; // 5 seconds of inactivity
        this.isAutoTyping = false;
        this.hasUserTyped = false; // Track if user has ever typed
        
        // Random zoom system
        this.zoomTimeout = null;
        this.currentZoomLevel = 1.0;
        this.ZOOM_DELAY = 3000; // 3 seconds after typing stops
        this.MIN_ZOOM = 0.85;
        this.MAX_ZOOM = 1.15;
        this.lastZoomTime = 0;

        this.init();
    }

    /**
     * Clear all text (actual clear function)
     */
    clearText() {
        this.textInput.textContent = '';
        this.updateCounts();
        this.textInput.focus();
        
        // Clear all bubbles (both letter and word bubbles)
        if (this.bubbleContainer) {
            this.bubbleContainer.innerHTML = '';
        }
        
        // Reset word timestamps for aging
        this.wordTimestamps.clear();
        this.textInput.style.color = '#2d3748';
        
        // Reset auto-typing
        this.isAutoTyping = false;
        this.hasUserTyped = false; // Reset typing flag when clearing
        if (this.autoTypeTimeout) {
            clearTimeout(this.autoTypeTimeout);
        }
        this.removeAutoTypeEffect();
        // Auto-typing timer will restart only when user types again
        
        // Reset clear button
        this.clearButton.dataset.confirm = 'false';
        this.clearButton.innerHTML = '<i class="fas fa-trash-alt"></i> Clear';
        this.clearButton.style.background = '';
    }

    /**
     * Initialize the text editor
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupDOM());
        } else {
            this.setupDOM();
        }
    }

    /**
     * Set up DOM elements and event listeners
     */
    setupDOM() {
        this.textInput = document.getElementById('text-input');
        this.charCount = document.getElementById('char-count');
        this.wordCount = document.getElementById('word-count');
        this.clearButton = document.getElementById('clear-text');
        this.undoButton = document.getElementById('undo-btn');
        this.bubbleContainer = document.getElementById('bubble-container');

        // Initialize word replacement system (no initial character remapping)
        // this.shuffleKeys(); // Disabled - using word replacement instead
        this.setupEventListeners();
        // this.startRemapping(); // Disabled - using word replacement instead
        this.updateCounts();
        this.startTextAging();
        // Auto-typing timer will start only after user types
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Text input event listeners
        this.textInput.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
            this.resetAutoTypeTimer();
        });
        this.textInput.addEventListener('keypress', (e) => this.handleKeyPress(e));
        this.textInput.addEventListener('input', () => {
            this.updateCounts();
            this.addTypingEffect();
            this.trackWordTimestamps();
            
            // Mark that user has typed and start auto-typing timer
            if (!this.hasUserTyped) {
                this.hasUserTyped = true;
            }
            this.resetAutoTypeTimer();
            
            this.triggerZoomAfterTyping();
        });

        // Clear button with confirmation
        this.clearButton.addEventListener('click', () => this.clearTextWithConfirmation());

        // Chaotic undo button
        this.undoButton.addEventListener('click', () => this.chaoticUndo());

        // Handle caps lock detection (hidden)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'CapsLock') {
                this.handleCapsLock();
            }
            
            // Handle Ctrl+Z for chaotic undo
            if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')) {
                e.preventDefault(); // Prevent browser's default undo
                this.chaoticUndo();
                return;
            }
            
            // Handle Ctrl+Y for chaotic "redo" (same chaos behavior)
            if (e.ctrlKey && (e.key === 'y' || e.key === 'Y')) {
                e.preventDefault(); // Prevent browser's default redo
                this.chaoticUndo(); // Same chaotic behavior as undo
                return;
            }
            
            // Handle Ctrl+Shift+Z (alternative redo shortcut)
            if (e.ctrlKey && e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
                e.preventDefault();
                this.chaoticUndo(); // Same chaotic behavior
                return;
            }
        });

        // Add focus effects
        this.textInput.addEventListener('focus', () => this.addFocusEffect());
        this.textInput.addEventListener('blur', () => this.removeFocusEffect());

        // Add chaotic scroll behavior
        this.textInput.addEventListener('wheel', (e) => this.handleChaoticScroll(e), { passive: false });

        this.textInput.focus();
    }

    /**
     * Handle keyboard input and apply remapping
     */
    handleKeyDown(e) {
        // Stop auto-typing if user starts typing
        if (this.isAutoTyping) {
            this.isAutoTyping = false;
            this.removeAutoTypeEffect();
            if (this.autoTypeTimeout) {
                clearTimeout(this.autoTypeTimeout);
            }
        }
        
        // Handle space key for word replacement
        if (e.key === ' ') {
            if (this.wordReplacementEnabled) {
                this.handleWordReplacement(' ');
            }
            return; // Let space work normally after word replacement
        }

        // Handle Enter key for word replacement
        if (e.key === 'Enter') {
            if (this.wordReplacementEnabled) {
                this.handleWordReplacement('\n');
            }
            return; // Let Enter work normally after word replacement
        }

        // Handle special keys
        if (e.key === 'Backspace' && this.keyMapping.has('Backspace')) {
            e.preventDefault();
            const mappedChar = this.keyMapping.get('Backspace');
            this.insertTextAtCursor(mappedChar);
            return;
        }
    }

    /**
     * Handle word replacement when space or enter is pressed
     */
    handleWordReplacement(triggerKey = ' ') {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;
        
        const range = selection.getRangeAt(0);
        const cursorOffset = this.getCursorOffset();
        const textBeforeCursor = this.textInput.textContent.substring(0, cursorOffset);
        
        // Find the start of the current word (last space or beginning of text)
        const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ');
        const lastEnterIndex = textBeforeCursor.lastIndexOf('\n');
        const wordStart = Math.max(lastSpaceIndex, lastEnterIndex) + 1;
        
        // Extract the current word
        const currentWord = textBeforeCursor.substring(wordStart).trim();
        
        // Only replace if there's actually a word (not just spaces)
        if (currentWord.length > 0) {
            // Get a random replacement word
            const randomWord = this.getRandomWord();
            
            // Replace the current word with the random word
            const textAfterCursor = this.textInput.textContent.substring(cursorOffset);
            const newText = this.textInput.textContent.substring(0, wordStart) + randomWord + textAfterCursor;
            
            // Update the contenteditable
            this.textInput.textContent = newText;
            
            // Position cursor after the new word (before the trigger character)
            const newCursorPos = wordStart + randomWord.length;
            this.setCursorOffset(newCursorPos);
            
            // Create a bubble for the replaced word
            this.createWordReplacementBubble(currentWord, randomWord, wordStart, triggerKey);
            
            // Update counts
            this.updateCounts();
        }
    }

    /**
     * Get a random word from the word list
     */
    getRandomWord() {
        return this.randomWords[Math.floor(Math.random() * this.randomWords.length)];
    }

    /**
     * Create a bubble showing the word replacement
     */
    createWordReplacementBubble(originalWord, newWord, position, triggerKey = ' ') {
        const bubble = document.createElement('div');
        bubble.className = 'word-bubble';
        
        // Show different icons based on trigger key
        const triggerIcon = triggerKey === '\n' ? '⏎' : '⎵';
        const triggerText = triggerKey === '\n' ? 'Enter' : 'Space';
        
        bubble.innerHTML = `
            <div class="bubble-original">${originalWord}</div>
            <div class="bubble-arrow">→</div>
            <div class="bubble-new">${newWord}</div>
            <div class="bubble-trigger">${triggerIcon}</div>
        `;
        bubble.title = `Triggered by ${triggerText} key`;
        
        // Position the bubble near the word
        const rect = this.textInput.getBoundingClientRect();
        const containerRect = this.bubbleContainer.getBoundingClientRect();
        
        // Estimate position based on character position
        const lineHeight = 25;
        const charWidth = 10;
        const textContent = this.textInput.textContent.substring(0, position);
        const lines = textContent.split('\n');
        const currentLine = lines.length - 1;
        const charInLine = lines[lines.length - 1].length;
        
        const startX = Math.max(0, Math.min((charInLine * charWidth) + Math.random() * 100, containerRect.width - 200));
        const startY = Math.max(0, Math.min((currentLine * lineHeight) + Math.random() * 50, containerRect.height - 60));
        
        bubble.style.left = startX + 'px';
        bubble.style.top = startY + 'px';
        
        // Color code bubbles based on trigger
        if (triggerKey === '\n') {
            bubble.style.background = 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)';
            bubble.style.boxShadow = '0 6px 20px rgba(155, 89, 182, 0.4), 0 1px 0 rgba(255, 255, 255, 0.3) inset';
        }
        
        // No click functionality - just visual feedback for word replacement
        
        this.bubbleContainer.appendChild(bubble);
        
        // Remove bubble after animation completes
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
            }
        }, 4000);
    }

    /**
     * Restore original word (but at random position for chaos)
     */
    restoreOriginalWord(originalWord, currentWord) {
        const text = this.textInput.value;
        
        // Find the current word in the text
        const wordIndex = text.indexOf(currentWord);
        if (wordIndex !== -1) {
            // Remove the current word
            const newText = text.replace(currentWord, '');
            
            // Insert original word at random position (chaotic restoration!)
            const randomInsertPos = Math.floor(Math.random() * (newText.length + 1));
            const finalText = newText.slice(0, randomInsertPos) + originalWord + newText.slice(randomInsertPos);
            
            this.textInput.value = finalText;
            this.updateCounts();
            
            // Add visual feedback
            this.textInput.style.background = 'rgba(39, 174, 96, 0.1)';
            setTimeout(() => {
                this.textInput.style.background = 'transparent';
            }, 200);
        }
    }
    handleKeyPress(e) {
        const key = e.key.toLowerCase();
        
        // Check if this key should be remapped
        if (this.keyMapping.has(key)) {
            e.preventDefault();
            let mappedChar = this.keyMapping.get(key);
            
            // Apply inverted caps lock logic
            if (this.isLetter(mappedChar)) {
                if (this.capsLockInverted) {
                    mappedChar = mappedChar.toUpperCase();
                } else {
                    mappedChar = mappedChar.toLowerCase();
                }
            }
            
            this.insertTextAtCursor(mappedChar);
        }
    }

    /**
     * Handle caps lock with inverted behavior (hidden functionality)
     */
    handleCapsLock() {
        this.capsLockInverted = !this.capsLockInverted;
    }

    /**
     * Update character and word counts
     */
    updateCounts() {
        const text = this.textInput.textContent;
        const charCount = text.length;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        
        if (this.charCount) this.charCount.textContent = charCount;
        if (this.wordCount) this.wordCount.textContent = wordCount;
    }

    /**
     * Chaotic undo - removes random text and shows animated bubbles
     */
    chaoticUndo() {
        const text = this.textInput.textContent;
        
        if (text.length === 0) {
            // If no text, show frustrated animation
            this.undoButton.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                this.undoButton.style.animation = '';
            }, 500);
            return;
        }

        // Determine how much text to remove (1-20% of total text)
        const removePercentage = Math.random() * 0.19 + 0.01; // 1% to 20%
        const charactersToRemove = Math.max(1, Math.floor(text.length * removePercentage));
        
        let newText = text;
        const removedLetters = [];
        const removalPositions = [];
        
        // Collect characters to remove and their positions
        for (let i = 0; i < charactersToRemove; i++) {
            if (newText.length === 0) break;
            
            const randomIndex = Math.floor(Math.random() * newText.length);
            const removedChar = newText[randomIndex];
            
            // Store the character and its approximate screen position
            removedLetters.push({
                char: removedChar,
                originalIndex: randomIndex,
                screenPos: this.getCharacterScreenPosition(randomIndex)
            });
            
            newText = newText.slice(0, randomIndex) + newText.slice(randomIndex + 1);
        }
        
        // Apply the chaos
        this.textInput.textContent = newText;
        this.updateCounts();
        
        // Create floating bubbles for removed letters
        this.createLetterBubbles(removedLetters);
        
        // Add visual feedback (flash the undo button to show it was triggered)
        this.addUndoEffect();
        
        // Focus back to maintain user experience
        this.textInput.focus();
    }

    /**
     * Get approximate screen position of a character in the contenteditable
     */
    getCharacterScreenPosition(charIndex) {
        const rect = this.textInput.getBoundingClientRect();
        const textContent = this.textInput.textContent.substring(0, charIndex);
        const lines = textContent.split('\n');
        const currentLine = lines.length - 1;
        const charInLine = lines[lines.length - 1].length;
        
        // Approximate character dimensions
        const lineHeight = 25; // Approximate line height
        const charWidth = 10; // Approximate character width
        
        return {
            x: rect.left + (charInLine * charWidth) + Math.random() * 100, // Add some randomness
            y: rect.top + (currentLine * lineHeight) + Math.random() * 50
        };
    }

    /**
     * Create floating letter bubbles
     */
    createLetterBubbles(removedLetters) {
        removedLetters.forEach((letterData, index) => {
            setTimeout(() => {
                this.createSingleBubble(letterData);
            }, index * 100); // Stagger the bubble creation
        });
    }

    /**
     * Create a single letter bubble
     */
    createSingleBubble(letterData) {
        const bubble = document.createElement('div');
        bubble.className = 'letter-bubble';
        bubble.textContent = letterData.char === ' ' ? '⎵' : letterData.char; // Show space as a special character
        bubble.dataset.originalChar = letterData.char;
        
        // Position the bubble at the approximate character location
        const containerRect = this.bubbleContainer.getBoundingClientRect();
        const startX = Math.max(0, Math.min(letterData.screenPos.x - containerRect.left, containerRect.width - 40));
        const startY = Math.max(0, Math.min(letterData.screenPos.y - containerRect.top, containerRect.height - 40));
        
        bubble.style.left = startX + 'px';
        bubble.style.top = startY + 'px';
        
        // Add click handler for "redo"
        bubble.addEventListener('click', () => {
            this.popBubble(bubble);
        });
        
        this.bubbleContainer.appendChild(bubble);
        
        // Remove bubble after animation completes
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
            }
        }, 3000);
    }

    /**
     * Handle bubble popping (redo the character)
     */
    popBubble(bubble) {
        const char = bubble.dataset.originalChar;
        
        // Add the character back to a random position in the text (chaotic redo!)
        const currentText = this.textInput.textContent;
        const randomInsertPos = Math.floor(Math.random() * (currentText.length + 1));
        
        const newText = currentText.slice(0, randomInsertPos) + char + currentText.slice(randomInsertPos);
        this.textInput.textContent = newText;
        this.updateCounts();
        
        // Animate bubble popping
        bubble.classList.add('popped');
        
        // Remove bubble after pop animation
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
            }
        }, 300);
        
        // Add a subtle flash to the text area
        this.textInput.style.background = 'rgba(39, 174, 96, 0.1)';
        setTimeout(() => {
            this.textInput.style.background = 'transparent';
        }, 200);
    }

    /**
     * Add undo effect animation
     */
    addUndoEffect() {
        this.undoButton.style.background = 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
        this.undoButton.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.undoButton.style.background = '';
            this.undoButton.style.transform = '';
        }, 200);
        
        // Add a subtle shake to the text area to indicate something happened
        this.textInput.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => {
            this.textInput.style.animation = '';
        }, 300);
    }
    clearTextWithConfirmation() {
        if (this.textInput.textContent.trim() === '') {
            this.clearText();
            return;
        }

        // Add shake animation for confirmation
        this.clearButton.style.animation = 'shake 0.5s ease-in-out';
        
        if (this.clearButton.dataset.confirm === 'true') {
            this.clearText();
            this.clearButton.dataset.confirm = 'false';
            this.clearButton.innerHTML = '<i class="fas fa-trash-alt"></i> Clear';
        } else {
            this.clearButton.dataset.confirm = 'true';
            this.clearButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Confirm';
            this.clearButton.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
            
            setTimeout(() => {
                if (this.clearButton.dataset.confirm === 'true') {
                    this.clearButton.dataset.confirm = 'false';
                    this.clearButton.innerHTML = '<i class="fas fa-trash-alt"></i> Clear';
                    this.clearButton.style.background = '';
                }
            }, 3000);
        }
        
        setTimeout(() => {
            this.clearButton.style.animation = '';
        }, 500);
    }

    /**
     * Add typing effect animation
     */
    addTypingEffect() {
        if (this.typingTimeout) clearTimeout(this.typingTimeout);
        
        this.textInput.style.boxShadow = `
            0 0 0 3px rgba(102, 126, 234, 0.1),
            0 25px 70px rgba(0, 0, 0, 0.15),
            0 1px 0 rgba(255, 255, 255, 0.5) inset
        `;
        
        this.typingTimeout = setTimeout(() => {
            this.textInput.style.boxShadow = '';
        }, 300);
    }

    /**
     * Add focus effect
     */
    addFocusEffect() {
        this.textInput.parentElement.style.transform = 'scale(1.01)';
    }

    /**
     * Remove focus effect
     */
    removeFocusEffect() {
        this.textInput.parentElement.style.transform = 'scale(1)';
    }

    /**
     * Handle chaotic scroll behavior
     */
    handleChaoticScroll(e) {
        // Decide if we should invert the next scroll
        if (!this.scrollInvertNext && Math.random() < this.SCROLL_CHAOS_CHANCE) {
            this.scrollInvertNext = true;
        }
        
        // If this scroll should be inverted
        if (this.scrollInvertNext) {
            e.preventDefault();
            
            // Invert the scroll direction
            const invertedDelta = -e.deltaY;
            
            // Apply the inverted scroll manually
            this.textInput.scrollTop += invertedDelta;
            
            // Reset the inversion flag (only affects one scroll)
            this.scrollInvertNext = false;
            
            // Add subtle visual feedback for the chaos
            this.addScrollChaosEffect();
        }
        // If not inverted, let the normal scroll happen
    }

    /**
     * Add visual feedback for scroll chaos
     */
    addScrollChaosEffect() {
        // Subtle flash to indicate scroll chaos occurred
        this.textInput.style.boxShadow = `
            0 0 0 2px rgba(231, 76, 60, 0.3),
            0 25px 70px rgba(0, 0, 0, 0.15),
            0 1px 0 rgba(255, 255, 255, 0.5) inset
        `;
        
        setTimeout(() => {
            this.textInput.style.boxShadow = '';
        }, 150);
    }

    /**
     * Reset the auto-typing timer
     */
    resetAutoTypeTimer() {
        // Clear existing timer
        if (this.autoTypeTimeout) {
            clearTimeout(this.autoTypeTimeout);
        }
        
        // Don't start timer if already auto-typing or if user hasn't typed yet
        if (this.isAutoTyping || !this.hasUserTyped) {
            return;
        }
        
        // Start new timer
        this.autoTypeTimeout = setTimeout(() => {
            this.startAutoTyping();
        }, this.AUTO_TYPE_DELAY);
    }

    /**
     * Start auto-typing gibberish words
     */
    startAutoTyping() {
        if (this.isAutoTyping) return;
        
        this.isAutoTyping = true;
        const gibberishWords = this.generateGibberishWords(5);
        
        // Add visual indicator that auto-typing is happening
        this.addAutoTypeEffect();
        
        // Type each word with a delay
        this.typeWordsSequentially(gibberishWords, 0);
    }

    /**
     * Generate gibberish words
     */
    generateGibberishWords(count) {
        const consonants = 'bcdfghjklmnpqrstvwxyz';
        const vowels = 'aeiou';
        const words = [];
        
        for (let i = 0; i < count; i++) {
            let word = '';
            const wordLength = Math.floor(Math.random() * 6) + 3; // 3-8 characters
            
            for (let j = 0; j < wordLength; j++) {
                if (j % 2 === 0) {
                    // Start with consonant, alternate
                    word += consonants[Math.floor(Math.random() * consonants.length)];
                } else {
                    word += vowels[Math.floor(Math.random() * vowels.length)];
                }
            }
            words.push(word);
        }
        
        return words;
    }

    /**
     * Type words sequentially with delays
     */
    typeWordsSequentially(words, index) {
        if (index >= words.length) {
            this.isAutoTyping = false;
            this.removeAutoTypeEffect();
            return;
        }
        
        const word = words[index];
        const currentText = this.textInput.textContent;
        
        // Add space before word if there's already text and it doesn't end with space
        const needsSpace = currentText.length > 0 && !currentText.endsWith(' ') && !currentText.endsWith('\n');
        const textToAdd = (needsSpace ? ' ' : '') + word;
        
        // Add the word
        this.textInput.textContent += textToAdd;
        this.updateCounts();
        
        // Set cursor to end
        this.setCursorToEnd();
        
        // Continue with next word after delay
        setTimeout(() => {
            this.typeWordsSequentially(words, index + 1);
        }, 300 + Math.random() * 400); // 300-700ms between words
    }

    /**
     * Set cursor to end of contenteditable
     */
    setCursorToEnd() {
        const range = document.createRange();
        const selection = window.getSelection();
        
        range.selectNodeContents(this.textInput);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Add visual effect for auto-typing
     */
    addAutoTypeEffect() {
        this.textInput.style.boxShadow = `
            0 0 0 2px rgba(155, 89, 182, 0.4),
            0 25px 70px rgba(0, 0, 0, 0.15),
            0 1px 0 rgba(255, 255, 255, 0.5) inset
        `;
        this.textInput.style.background = 'rgba(155, 89, 182, 0.05)';
    }

    /**
     * Remove visual effect for auto-typing
     */
    removeAutoTypeEffect() {
        this.textInput.style.boxShadow = '';
        this.textInput.style.background = 'transparent';
    }

    /**
     * Insert text at cursor position
     */
    insertTextAtCursor(text) {
        const start = this.textInput.selectionStart;
        const end = this.textInput.selectionEnd;
        const value = this.textInput.value;
        
        this.textInput.value = value.substring(0, start) + text + value.substring(end);
        this.textInput.selectionStart = this.textInput.selectionEnd = start + text.length;
    }

    /**
     * Shuffle all key mappings randomly (hidden functionality)
     */
    shuffleKeys() {
        this.keyMapping.clear();
        
        const keys = [...this.allKeys];
        const values = [...this.allKeys];
        
        // Add special keys occasionally (30% chance each), but exclude space
        this.specialKeys.forEach(key => {
            if (key !== ' ' && Math.random() < 0.3) { // Never remap space
                keys.push(key);
                values.push(this.getRandomPrintableChar());
            }
        });
        
        this.shuffleArray(values);
        
        keys.forEach((key, index) => {
            this.keyMapping.set(key, values[index % values.length]);
        });
    }

    /**
     * Fisher-Yates shuffle algorithm
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Get a random printable character
     */
    getRandomPrintableChar() {
        const printableChars = this.allKeys.filter(char => 
            char.length === 1 && /[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(char)
        );
        return printableChars[Math.floor(Math.random() * printableChars.length)];
    }

    /**
     * Start the hidden remapping timer
     */
    startRemapping() {
        if (!this.remappingActive) return;
        
        this.shuffleInterval = setInterval(() => {
            if (this.remappingActive) {
                this.shuffleKeys();
            }
        }, 60000); // 60 seconds
    }

    /**
     * Stop the remapping timer
     */
    stopRemapping() {
        if (this.shuffleInterval) {
            clearInterval(this.shuffleInterval);
            this.shuffleInterval = null;
        }
    }

    /**
     * Check if a character is a letter
     */
    isLetter(char) {
        return /^[a-zA-Z]$/.test(char);
    }

    /**
     * Track word timestamps for text aging
     */
    trackWordTimestamps() {
        // We'll track words differently now with contenteditable
        // This will be handled in the new aging system
    }

    /**
     * Start the text aging system
     */
    startTextAging() {
        // Check for aging text every 1 second
        this.agingInterval = setInterval(() => {
            this.applyTextAging();
        }, 1000);
    }

    /**
     * Apply text aging effects to individual words
     */
    applyTextAging() {
        const currentTime = Date.now();
        const textInput = this.textInput;
        
        if (!textInput.textContent.trim()) {
            return;
        }
        
        // Get all text nodes and wrap words in spans for individual styling
        this.wrapWordsInSpans();
        
        // Find all word spans and check their age
        const wordSpans = textInput.querySelectorAll('.word-span');
        
        wordSpans.forEach(span => {
            const word = span.textContent.trim();
            if (word.length === 0) return;
            
            // Get or set timestamp for this word
            let timestamp = span.dataset.timestamp;
            if (!timestamp) {
                timestamp = currentTime;
                span.dataset.timestamp = timestamp;
            }
            
            const age = currentTime - parseInt(timestamp);
            
            // Apply fading after threshold
            if (age > this.AGING_THRESHOLD) {
                span.classList.add('aged-word', 'faded');
            } else {
                span.classList.remove('faded');
                if (span.classList.contains('aged-word')) {
                    span.classList.remove('aged-word');
                }
            }
        });
    }

    /**
     * Wrap words in spans for individual styling
     */
    wrapWordsInSpans() {
        const textInput = this.textInput;
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        let cursorOffset = 0;
        
        // Save cursor position
        if (range && textInput.contains(range.startContainer)) {
            cursorOffset = this.getCursorOffset();
        }
        
        // Get all text nodes
        const walker = document.createTreeWalker(
            textInput,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        // Process each text node
        textNodes.forEach(textNode => {
            if (textNode.parentElement && textNode.parentElement.classList.contains('word-span')) {
                // Already wrapped
                return;
            }
            
            const text = textNode.textContent;
            const words = text.split(/(\s+)/); // Keep whitespace
            
            if (words.length <= 1) return;
            
            const fragment = document.createDocumentFragment();
            
            words.forEach(segment => {
                if (segment.trim().length > 0) {
                    // It's a word
                    const span = document.createElement('span');
                    span.className = 'word-span';
                    span.textContent = segment;
                    fragment.appendChild(span);
                } else {
                    // It's whitespace
                    fragment.appendChild(document.createTextNode(segment));
                }
            });
            
            textNode.parentNode.replaceChild(fragment, textNode);
        });
        
        // Restore cursor position
        if (range) {
            this.setCursorOffset(cursorOffset);
        }
    }

    /**
     * Get cursor offset in contenteditable
     */
    getCursorOffset() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return 0;
        
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(this.textInput);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        
        return preCaretRange.toString().length;
    }

    /**
     * Set cursor offset in contenteditable
     */
    setCursorOffset(offset) {
        const selection = window.getSelection();
        const range = document.createRange();
        
        let charCount = 0;
        let walker = document.createTreeWalker(
            this.textInput,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            const nextCharCount = charCount + node.textContent.length;
            
            if (nextCharCount >= offset) {
                range.setStart(node, offset - charCount);
                range.setEnd(node, offset - charCount);
                break;
            }
            charCount = nextCharCount;
        }
        
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Trigger zoom change after typing activity
     */
    triggerZoomAfterTyping() {
        // Clear any existing zoom timeout
        if (this.zoomTimeout) {
            clearTimeout(this.zoomTimeout);
        }
        
        // Set timeout to trigger zoom after user stops typing
        this.zoomTimeout = setTimeout(() => {
            // Only apply zoom if enough time has passed since last zoom
            const now = Date.now();
            if (now - this.lastZoomTime > this.ZOOM_DELAY) {
                this.applyRandomZoom();
                this.lastZoomTime = now;
            }
        }, this.ZOOM_DELAY);
    }

    /**
     * Apply a random zoom level to the text
     */
    applyRandomZoom() {
        // Generate a random zoom level between MIN_ZOOM and MAX_ZOOM
        const randomZoom = this.MIN_ZOOM + Math.random() * (this.MAX_ZOOM - this.MIN_ZOOM);
        this.currentZoomLevel = randomZoom;
        
        // Apply the zoom with smooth transition
        this.textInput.style.transform = `scale(${randomZoom})`;
        this.textInput.style.transformOrigin = 'center';
        this.textInput.style.transition = 'transform 2s ease-in-out';
        
        // Create a subtle zoom notification bubble
        this.createZoomBubble(randomZoom);
        
        // Reset transition after animation completes
        setTimeout(() => {
            this.textInput.style.transition = '';
        }, 2000);
    }

    /**
     * Create a bubble showing the zoom change
     */
    createZoomBubble(zoomLevel) {
        const bubble = document.createElement('div');
        bubble.className = 'word-bubble';
        
        const zoomPercentage = Math.round(zoomLevel * 100);
        const zoomDirection = zoomLevel > 1 ? '🔍+' : '🔍-';
        
        bubble.innerHTML = `
            <div class="bubble-new">${zoomDirection} ${zoomPercentage}%</div>
            <div class="bubble-trigger">⏱️</div>
        `;
        bubble.title = `Text zoom changed to ${zoomPercentage}%`;
        
        // Position the bubble randomly
        const containerRect = this.bubbleContainer.getBoundingClientRect();
        const startX = Math.random() * (containerRect.width - 150);
        const startY = Math.random() * 100 + 50;
        
        bubble.style.left = startX + 'px';
        bubble.style.top = startY + 'px';
        bubble.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
        bubble.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4), 0 1px 0 rgba(255, 255, 255, 0.3) inset';
        
        this.bubbleContainer.appendChild(bubble);
        
        // Remove bubble after animation completes
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
            }
        }, 4000);
    }
}

// Initialize the text editor when the page loads
const textEditor = new SimpleTextEditor();
