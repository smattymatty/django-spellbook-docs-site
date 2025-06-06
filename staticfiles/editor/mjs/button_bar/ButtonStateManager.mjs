// static/mjs/button_bar/ButtonStateManager.mjs

export class ButtonStateManager {
    constructor(renderer, cursorTracker) {
        this.renderer = renderer;
        this.cursorTracker = cursorTracker;
        this.activeButtons = new Set();
        this.stateUpdateTimer = null;
        this.isTracking = false;
        
        // Bind methods
        this.handleCursorChange = this.handleCursorChange.bind(this);
    }

    /**
     * Start tracking button states
     */
    startTracking() {
        if (this.isTracking) return;
        
        this.isTracking = true;
        this.cursorTracker.addChangeCallback(this.handleCursorChange);
        
        // Initial state update
        this.updateButtonStates();
    }

    /**
     * Stop tracking button states
     */
    stopTracking() {
        if (!this.isTracking) return;
        
        this.isTracking = false;
        this.cursorTracker.removeChangeCallback(this.handleCursorChange);
        
        if (this.stateUpdateTimer) {
            clearTimeout(this.stateUpdateTimer);
            this.stateUpdateTimer = null;
        }
    }

    /**
     * Handle cursor position change
     * @param {Object} context - Formatting context from cursor tracker
     * @private
     */
    handleCursorChange(context) {
        if (!context) return;
        
        // Throttle state updates
        if (this.stateUpdateTimer) {
            clearTimeout(this.stateUpdateTimer);
        }
        
        this.stateUpdateTimer = setTimeout(() => {
            this.updateButtonStates(context);
        }, 50);
    }

    /**
     * Update all button states based on cursor context
     * @param {Object} context - Formatting context (optional)
     */
    updateButtonStates(context = null) {
        if (!this.renderer) return;
        
        // Get context if not provided
        if (!context) {
            context = this.cursorTracker.getFormattingContext();
        }
        
        if (!context) return;
        
        // Clear all active states first
        this.clearAllActiveStates();
        
        // Update block-level formatting states
        this.updateBlockStates(context);
        
        // Update inline formatting states
        this.updateInlineStates(context);
        
        // Update SpellBlock context
        this.updateSpellBlockContext(context);
    }

    /**
     * Update block-level formatting states
     * @param {Object} context - Formatting context
     * @private
     */
    updateBlockStates(context) {
        const blockStates = {
            'header-1-btn': context.isHeader1,
            'header-2-btn': context.isHeader2,
            'header-3-btn': context.isHeader3,
            'ordered-list-btn': context.isOrderedList,
            'unordered-list-btn': context.isUnorderedList,
            'code-block-btn': context.isCodeBlock
        };

        Object.entries(blockStates).forEach(([buttonId, isActive]) => {
            this.setButtonActive(buttonId, isActive);
        });
    }

    /**
     * Update inline formatting states
     * @param {Object} context - Formatting context
     * @private
     */
    updateInlineStates(context) {
        const inlineStates = {
            'bold-btn': context.isBold,
            'italic-btn': context.isItalic,
            'code-btn': context.isCode
        };

        Object.entries(inlineStates).forEach(([buttonId, isActive]) => {
            this.setButtonActive(buttonId, isActive);
        });
    }

    /**
     * Update SpellBlock context and button appearance
     * @param {Object} context - Formatting context
     * @private
     */
    updateSpellBlockContext(context) {
        const spellBlockBtn = this.renderer.getButtonElement('insert-spellblock-btn');
        if (!spellBlockBtn) return;

        if (context.isSpellBlock && context.spellBlock) {
            // User is inside a SpellBlock - change to edit mode
            this.setSpellBlockEditMode(spellBlockBtn, context.spellBlock.blockName);
        } else {
            // User is not inside a SpellBlock - change to insert mode
            this.setSpellBlockInsertMode(spellBlockBtn);
        }
    }

    /**
     * Set SpellBlock button to edit mode
     * @param {HTMLElement} button - Button element
     * @param {string} blockName - Name of the SpellBlock being edited
     * @private
     */
    setSpellBlockEditMode(button, blockName) {
        // Update button text
        const buttonText = button.querySelector('.button-text');
        if (buttonText) {
            buttonText.textContent = `Edit ${blockName}`;
        }

        // Update button icon to indicate edit mode
        const buttonIcon = button.querySelector('.button-icon');
        if (buttonIcon) {
            buttonIcon.textContent = '✏️';
        }

        // Add edit mode class for styling
        button.classList.add('spellblock-edit-mode');
        button.classList.remove('spellblock-insert-mode');

        // Update tooltip
        button.setAttribute('title', `Edit SpellBlock: ${blockName}`);

        // Store the block name for potential use
        button.setAttribute('data-spellblock-name', blockName);
    }

    /**
     * Set SpellBlock button to insert mode
     * @param {HTMLElement} button - Button element
     * @private
     */
    setSpellBlockInsertMode(button) {
        // Update button text
        const buttonText = button.querySelector('.button-text');
        if (buttonText) {
            buttonText.textContent = 'Insert SpellBlock';
        }

        // Update button icon to indicate insert mode
        const buttonIcon = button.querySelector('.button-icon');
        if (buttonIcon) {
            buttonIcon.textContent = '✨';
        }

        // Add insert mode class for styling
        button.classList.add('spellblock-insert-mode');
        button.classList.remove('spellblock-edit-mode');

        // Update tooltip
        button.setAttribute('title', 'Insert SpellBlock (Ctrl+Shift+S)');

        // Remove block name data
        button.removeAttribute('data-spellblock-name');
    }

    /**
     * Set button active state
     * @param {string} buttonId - Button ID
     * @param {boolean} isActive - Whether button should be active
     */
    setButtonActive(buttonId, isActive) {
        if (!this.renderer) return;
        
        if (isActive) {
            this.activeButtons.add(buttonId);
        } else {
            this.activeButtons.delete(buttonId);
        }
        
        this.renderer.setButtonActive(buttonId, isActive);
    }

    /**
     * Toggle button active state
     * @param {string} buttonId - Button ID
     * @returns {boolean} New active state
     */
    toggleButtonActive(buttonId) {
        const isCurrentlyActive = this.isButtonActive(buttonId);
        const newState = !isCurrentlyActive;
        
        this.setButtonActive(buttonId, newState);
        return newState;
    }

    /**
     * Check if button is active
     * @param {string} buttonId - Button ID
     * @returns {boolean} True if button is active
     */
    isButtonActive(buttonId) {
        return this.activeButtons.has(buttonId);
    }

    /**
     * Clear all active button states
     */
    clearAllActiveStates() {
        if (!this.renderer) return;
        
        this.renderer.clearAllActiveStates();
        this.activeButtons.clear();
    }

    /**
     * Get all active button IDs
     * @returns {Array} Array of active button IDs
     */
    getActiveButtons() {
        return Array.from(this.activeButtons);
    }

    /**
     * Get count of active buttons
     * @returns {number} Number of active buttons
     */
    getActiveButtonCount() {
        return this.activeButtons.size;
    }

    /**
     * Set multiple button states at once
     * @param {Object} states - Object mapping button IDs to active states
     */
    setMultipleStates(states) {
        Object.entries(states).forEach(([buttonId, isActive]) => {
            this.setButtonActive(buttonId, isActive);
        });
    }

    /**
     * Save current button states
     * @returns {Object} Current button states
     */
    saveStates() {
        const states = {};
        this.activeButtons.forEach(buttonId => {
            states[buttonId] = true;
        });
        return states;
    }

    /**
     * Restore button states
     * @param {Object} states - Button states to restore
     */
    restoreStates(states) {
        this.clearAllActiveStates();
        this.setMultipleStates(states);
    }

    /**
     * Add custom state checker
     * @param {string} buttonId - Button ID
     * @param {Function} checker - Function that returns boolean for active state
     */
    addCustomStateChecker(buttonId, checker) {
        if (typeof checker !== 'function') {
            console.error('[ButtonStateManager] State checker must be a function');
            return;
        }
        
        // Store custom checker for future use
        if (!this.customCheckers) {
            this.customCheckers = new Map();
        }
        
        this.customCheckers.set(buttonId, checker);
    }

    /**
     * Remove custom state checker
     * @param {string} buttonId - Button ID
     */
    removeCustomStateChecker(buttonId) {
        if (this.customCheckers) {
            this.customCheckers.delete(buttonId);
        }
    }

    /**
     * Update states using custom checkers
     * @param {Object} context - Formatting context
     * @private
     */
    updateCustomStates(context) {
        if (!this.customCheckers) return;
        
        this.customCheckers.forEach((checker, buttonId) => {
            try {
                const isActive = checker(context);
                this.setButtonActive(buttonId, isActive);
            } catch (error) {
                console.error(`[ButtonStateManager] Error in custom checker for ${buttonId}:`, error);
            }
        });
    }

    /**
     * Enable or disable state tracking
     * @param {boolean} enabled - Whether to enable tracking
     */
    setTrackingEnabled(enabled) {
        if (enabled && !this.isTracking) {
            this.startTracking();
        } else if (!enabled && this.isTracking) {
            this.stopTracking();
        }
    }

    /**
     * Check if state tracking is enabled
     * @returns {boolean} True if tracking is enabled
     */
    isTrackingEnabled() {
        return this.isTracking;
    }

    /**
     * Force update button states
     */
    forceUpdate() {
        this.updateButtonStates();
    }

    /**
     * Reset all states
     */
    reset() {
        this.clearAllActiveStates();
        if (this.customCheckers) {
            this.customCheckers.clear();
        }
    }

    /**
     * Get state summary for debugging
     * @returns {Object} State summary
     */
    getStateSummary() {
        return {
            isTracking: this.isTracking,
            activeButtonCount: this.activeButtons.size,
            activeButtons: this.getActiveButtons(),
            hasCustomCheckers: this.customCheckers && this.customCheckers.size > 0,
            customCheckerCount: this.customCheckers ? this.customCheckers.size : 0
        };
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stopTracking();
        this.clearAllActiveStates();
        
        if (this.customCheckers) {
            this.customCheckers.clear();
        }
        
        this.renderer = null;
        this.cursorTracker = null;
        this.activeButtons.clear();
    }
}