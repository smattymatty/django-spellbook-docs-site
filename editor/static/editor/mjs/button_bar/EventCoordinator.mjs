// static/mjs/button_bar/EventCoordinator.mjs

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
        
        // Store reference for cleanup
        this.eventHandlers.set('click', this.handleButtonClick);
        
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
        // Prevent default behavior and stop propagation
        event.preventDefault();
        event.stopPropagation();
        
        const button = event.target.closest('button');
        if (!button || !button.id) return;
        
        const buttonConfig = this.configManager.getButtonById(button.id);
        if (!buttonConfig) {
            console.warn('[EventCoordinator] Button configuration not found:', button.id);
            return;
        }
        
        this.executeAction(buttonConfig);
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
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyDown(event) {
        // Common keyboard shortcuts for formatting
        if (event.ctrlKey || event.metaKey) {
            switch (event.key.toLowerCase()) {
                case 'b':
                    event.preventDefault();
                    this.handleMarkdownFormat('bold', 'inline');
                    break;
                    
                case 'i':
                    event.preventDefault();
                    this.handleMarkdownFormat('italic', 'inline');
                    break;
                    
                case '`':
                    event.preventDefault();
                    this.handleMarkdownFormat('code', 'inline');
                    break;
                    
                case 'k':
                    event.preventDefault();
                    this.handleMarkdownFormat('link', 'inline');
                    break;
            }
        }
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
        if (!target) return;
        
        target.addEventListener('keydown', this.handleKeyDown);
        target.addEventListener('keyup', this.handleKeyUp);
        
        // Store for cleanup
        this.keyboardTarget = target;
    }

    /**
     * Disable keyboard shortcuts
     */
    disableKeyboardShortcuts() {
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
            hasKeyboardShortcuts: !!this.keyboardTarget
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