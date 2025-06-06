// static/mjs/button_bar/EventCoordinator.mjs

import { KeyboardShortcutManager } from './KeyboardShortcutManager.mjs';

export class EventCoordinator {
    constructor(renderer, configManager, blockFormatter, inlineFormatter, stateManager, notificationService) {
        this.renderer = renderer;
        this.configManager = configManager;
        this.blockFormatter = blockFormatter;
        this.inlineFormatter = inlineFormatter;
        this.stateManager = stateManager;
        this.notificationService = notificationService;
        
        this.eventHandlers = new Map();
        this.isAttached = false;
        
        // Custom action handlers
        this.customActions = new Map();
        
        // Initialize keyboard shortcut manager
        this.keyboardShortcutManager = new KeyboardShortcutManager(this, {
            enableShortcuts: true,
            preventDefault: true,
            showHelp: true
        });
        
        // Bind methods
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    /**
     * Attach event listeners to button bar
     */
    attachEventListeners() {
        if (this.isAttached || !this.renderer) return;
        
        const buttonBar = this.renderer.getElement();
        if (!buttonBar) {
            console.error('[EventCoordinator] Button bar element not found');
            return;
        }
        
        // Attach click handler using event delegation
        buttonBar.addEventListener('click', this.handleButtonClick);
        
        // Attach mousedown handler to prevent focus loss
        this.handleMouseDown = this.handleMouseDown.bind(this);
        buttonBar.addEventListener('mousedown', this.handleMouseDown);
        
        // Store reference for cleanup
        this.eventHandlers.set('click', this.handleButtonClick);
        this.eventHandlers.set('mousedown', this.handleMouseDown);
        
        this.isAttached = true;
    }

    /**
     * Detach event listeners from button bar
     */
    detachEventListeners() {
        if (!this.isAttached || !this.renderer) return;
        
        const buttonBar = this.renderer.getElement();
        if (!buttonBar) return;
        
        // Remove all stored event handlers
        this.eventHandlers.forEach((handler, event) => {
            buttonBar.removeEventListener(event, handler);
        });
        
        this.eventHandlers.clear();
        this.isAttached = false;
    }

    /**
     * Handle button click events
     * @param {Event} event - Click event
     * @private
     */
    handleButtonClick(event) {
        console.log('[EventCoordinator] Button click detected:', event.target);
        
        // Prevent default behavior and stop propagation to avoid editor blur
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        const button = event.target.closest('button');
        console.log('[EventCoordinator] Found button:', button, 'ID:', button?.id);
        
        if (!button || !button.id) {
            console.warn('[EventCoordinator] No button or button ID found');
            return;
        }
        
        const buttonConfig = this.configManager.getButtonById(button.id);
        console.log('[EventCoordinator] Button config:', buttonConfig);
        
        if (!buttonConfig) {
            console.warn('[EventCoordinator] Button configuration not found:', button.id);
            return;
        }
        
        console.log('[EventCoordinator] Executing action:', buttonConfig.action);
        this.executeAction(buttonConfig);
        
        // Refocus the editor after button action to prevent blur issues
        setTimeout(() => {
            if (this.blockFormatter && this.blockFormatter.editorElement) {
                this.blockFormatter.editorElement.focus();
            }
        }, 10);
    }

    /**
     * Handle mousedown events to prevent focus loss
     * @param {Event} event - Mousedown event
     * @private
     */
    handleMouseDown(event) {
        const button = event.target.closest('button');
        if (button && button.id) {
            // Prevent mousedown from causing textarea blur
            event.preventDefault();
            event.stopPropagation();
        }
    }

    /**
     * Execute button action
     * @param {Object} buttonConfig - Button configuration
     * @private
     */
    executeAction(buttonConfig) {
        const { action, formatType, type } = buttonConfig;
        
        try {
            switch (action) {
                case 'handleInsertSpellBlock':
                    this.handleInsertSpellBlock();
                    break;
                    
                case 'handleMarkdownFormat':
                    this.handleMarkdownFormat(formatType, type);
                    break;
                    
                case 'showKeyboardHelp':
                    this.showKeyboardHelp();
                    break;
                    
                default:
                    // Check for custom actions
                    if (this.customActions.has(action)) {
                        const customHandler = this.customActions.get(action);
                        customHandler(buttonConfig);
                    } else {
                        console.warn('[EventCoordinator] Unknown action:', action);
                    }
            }
        } catch (error) {
            console.error('[EventCoordinator] Error executing action:', error);
            this.notificationService.error('An error occurred while formatting text');
        }
    }

    /**
     * Handle spell block insertion
     * @private
     */
    handleInsertSpellBlock() {
        const editorElement = this.blockFormatter.editorElement;
        if (!editorElement) return;
        
        const spellBlockTemplate = `
{% spellblock %}
# Spell Name

**Level:** 1st-level
**Casting Time:** 1 action
**Range:** Touch
**Components:** V, S
**Duration:** Instantaneous

Spell description goes here.
{% endspellblock %}
`;
        
        // Insert the spell block template
        this.blockFormatter.insertText(spellBlockTemplate.trim(), -spellBlockTemplate.trim().length + 15);
        
        this.notificationService.success('Spell block template inserted');
    }

    /**
     * Handle markdown formatting
     * @param {string} formatType - Type of formatting
     * @param {string} type - Block or inline type
     * @private
     */
    handleMarkdownFormat(formatType, type) {
        if (!formatType) return;
        
        try {
            if (type === 'block') {
                this.blockFormatter.format(formatType);
            } else if (type === 'inline') {
                this.inlineFormatter.format(formatType);
            } else {
                console.warn('[EventCoordinator] Unknown format type:', type);
                return;
            }
            
            // Update button states after formatting
            this.stateManager.forceUpdate();
            
        } catch (error) {
            console.error('[EventCoordinator] Error applying formatting:', error);
            this.notificationService.error(`Failed to apply ${formatType} formatting`);
        }
    }

    /**
     * Add custom action handler
     * @param {string} actionName - Name of the action
     * @param {Function} handler - Handler function
     */
    addCustomAction(actionName, handler) {
        if (typeof handler !== 'function') {
            console.error('[EventCoordinator] Handler must be a function');
            return false;
        }
        
        this.customActions.set(actionName, handler);
        return true;
    }

    /**
     * Get keyboard shortcut manager
     * @returns {KeyboardShortcutManager} The keyboard shortcut manager instance
     */
    getKeyboardShortcutManager() {
        return this.keyboardShortcutManager;
    }

    /**
     * Add custom keyboard shortcut
     * @param {string} keyCombo - Key combination (e.g., 'ctrl+shift+x')
     * @param {Object} config - Shortcut configuration
     */
    addKeyboardShortcut(keyCombo, config) {
        if (!this.keyboardShortcutManager) {
            console.error('[EventCoordinator] Keyboard shortcut manager not available');
            return false;
        }
        
        return this.keyboardShortcutManager.addShortcut(keyCombo, config);
    }

    /**
     * Remove keyboard shortcut
     * @param {string} keyCombo - Key combination to remove
     */
    removeKeyboardShortcut(keyCombo) {
        if (!this.keyboardShortcutManager) {
            console.error('[EventCoordinator] Keyboard shortcut manager not available');
            return false;
        }
        
        return this.keyboardShortcutManager.removeShortcut(keyCombo);
    }

    /**
     * Show keyboard shortcuts help
     */
    showKeyboardHelp() {
        if (!this.keyboardShortcutManager) {
            console.error('[EventCoordinator] Keyboard shortcut manager not available');
            return;
        }
        
        this.keyboardShortcutManager.showKeyboardHelp();
    }

    /**
     * Remove custom action handler
     * @param {string} actionName - Name of the action to remove
     * @returns {boolean} True if removed successfully
     */
    removeCustomAction(actionName) {
        return this.customActions.delete(actionName);
    }

    /**
     * Check if custom action exists
     * @param {string} actionName - Name of the action
     * @returns {boolean} True if action exists
     */
    hasCustomAction(actionName) {
        return this.customActions.has(actionName);
    }

    /**
     * Get all custom action names
     * @returns {Array} Array of custom action names
     */
    getCustomActionNames() {
        return Array.from(this.customActions.keys());
    }

    /**
     * Handle keyboard shortcuts (deprecated - now handled by KeyboardShortcutManager)
     * @param {KeyboardEvent} event - Keyboard event
     * @deprecated Use KeyboardShortcutManager instead
     */
    handleKeyDown(event) {
        // Legacy keyboard shortcuts - now handled by KeyboardShortcutManager
        // This method is kept for backward compatibility
        // The KeyboardShortcutManager provides more comprehensive shortcut handling
    }

    /**
     * Handle key up events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyUp(event) {
        // Handle enter key for list continuation
        if (event.key === 'Enter') {
            const handled = this.blockFormatter.handleEnterKey();
            if (handled) {
                event.preventDefault();
            }
        }
    }

    /**
     * Enable keyboard shortcuts
     * @param {HTMLElement} targetElement - Element to attach keyboard listeners to
     */
    enableKeyboardShortcuts(targetElement = null) {
        const target = targetElement || this.blockFormatter.editorElement;
        if (!target) {
            console.warn('[EventCoordinator] No target element for keyboard shortcuts');
            return false;
        }
        
        // Enable new comprehensive keyboard shortcut manager
        const success = this.keyboardShortcutManager.enable(target);
        if (!success) {
            console.error('[EventCoordinator] Failed to enable keyboard shortcuts');
            return false;
        }
        
        // Keep legacy keyboard handlers for backward compatibility
        target.addEventListener('keydown', this.handleKeyDown);
        target.addEventListener('keyup', this.handleKeyUp);
        
        // Store for cleanup
        this.keyboardTarget = target;
        
        return true;
    }

    /**
     * Disable keyboard shortcuts
     */
    disableKeyboardShortcuts() {
        // Disable comprehensive keyboard shortcut manager
        if (this.keyboardShortcutManager) {
            this.keyboardShortcutManager.disable();
        }
        
        // Clean up legacy keyboard handlers
        if (this.keyboardTarget) {
            this.keyboardTarget.removeEventListener('keydown', this.handleKeyDown);
            this.keyboardTarget.removeEventListener('keyup', this.handleKeyUp);
            this.keyboardTarget = null;
        }
    }

    /**
     * Execute action by name
     * @param {string} actionName - Action name to execute
     * @param {Object} options - Additional options
     */
    executeActionByName(actionName, options = {}) {
        // Find button config by action name
        const allButtons = this.configManager.getAllButtons();
        const buttonConfig = allButtons.find(btn => btn.action === actionName);
        
        if (buttonConfig) {
            this.executeAction({ ...buttonConfig, ...options });
        } else if (this.customActions.has(actionName)) {
            const handler = this.customActions.get(actionName);
            handler(options);
        } else {
            console.warn('[EventCoordinator] Action not found:', actionName);
        }
    }

    /**
     * Trigger button programmatically
     * @param {string} buttonId - Button ID to trigger
     */
    triggerButton(buttonId) {
        const buttonConfig = this.configManager.getButtonById(buttonId);
        if (buttonConfig) {
            this.executeAction(buttonConfig);
        } else {
            console.warn('[EventCoordinator] Button not found:', buttonId);
        }
    }

    /**
     * Get event listener status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            isAttached: this.isAttached,
            eventHandlerCount: this.eventHandlers.size,
            customActionCount: this.customActions.size,
            hasKeyboardShortcuts: !!this.keyboardTarget,
            keyboardShortcutManager: this.keyboardShortcutManager ? this.keyboardShortcutManager.getStatus() : null
        };
    }

    /**
     * Add event listener for specific button
     * @param {string} buttonId - Button ID
     * @param {string} eventType - Event type (e.g., 'click', 'mouseenter')
     * @param {Function} handler - Event handler
     */
    addButtonEventListener(buttonId, eventType, handler) {
        const button = this.renderer.getButtonElement(buttonId);
        if (!button) {
            console.warn('[EventCoordinator] Button element not found:', buttonId);
            return false;
        }
        
        button.addEventListener(eventType, handler);
        
        // Store for cleanup
        const key = `${buttonId}-${eventType}`;
        this.eventHandlers.set(key, { element: button, handler, eventType });
        
        return true;
    }

    /**
     * Remove event listener for specific button
     * @param {string} buttonId - Button ID
     * @param {string} eventType - Event type
     */
    removeButtonEventListener(buttonId, eventType) {
        const key = `${buttonId}-${eventType}`;
        const eventData = this.eventHandlers.get(key);
        
        if (eventData) {
            eventData.element.removeEventListener(eventData.eventType, eventData.handler);
            this.eventHandlers.delete(key);
            return true;
        }
        
        return false;
    }

    /**
     * Handle button hover effects
     * @param {string} buttonId - Button ID
     * @param {Function} onEnter - Handler for mouse enter
     * @param {Function} onLeave - Handler for mouse leave
     */
    addHoverEffects(buttonId, onEnter = null, onLeave = null) {
        if (onEnter) {
            this.addButtonEventListener(buttonId, 'mouseenter', onEnter);
        }
        
        if (onLeave) {
            this.addButtonEventListener(buttonId, 'mouseleave', onLeave);
        }
    }

    /**
     * Clean up all resources
     */
    destroy() {
        this.detachEventListeners();
        this.disableKeyboardShortcuts();
        
        // Destroy keyboard shortcut manager
        if (this.keyboardShortcutManager) {
            this.keyboardShortcutManager.destroy();
            this.keyboardShortcutManager = null;
        }
        
        // Clear custom actions
        this.customActions.clear();
        
        // Clear all references
        this.renderer = null;
        this.configManager = null;
        this.blockFormatter = null;
        this.inlineFormatter = null;
        this.stateManager = null;
        this.notificationService = null;
        this.keyboardTarget = null;
    }
}