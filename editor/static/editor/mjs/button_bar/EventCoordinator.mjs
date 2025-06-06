// static/mjs/button_bar/EventCoordinator.mjs

import { KeyboardShortcutManager } from './KeyboardShortcutManager.mjs';
import { SpellBlockDropdown } from './SpellBlockDropdown.mjs';
import { spellBlockRegistry } from './SpellBlockRegistry.mjs';

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
        
        // Track last keyboard event for modifier key detection
        this.lastKeyEvent = null;
        this.lastClickEvent = null;
        
        // Initialize keyboard shortcut manager
        this.keyboardShortcutManager = new KeyboardShortcutManager(this, {
            enableShortcuts: true,
            preventDefault: true,
            showHelp: true
        });
        
        // Initialize SpellBlock dropdown
        this.spellBlockDropdown = null;
        
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
        
        // Track the click event for modifier key detection
        this.lastClickEvent = event;
        
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
        
        // Handle dropdown button specially since it's not in main configs
        if (button.id === 'spellblock-dropdown-btn') {
            console.log('[EventCoordinator] Handling dropdown button directly');
            this.handleSpellBlockDropdown();
            
            // Clear the click event tracking
            this.lastClickEvent = null;
            
            // Don't refocus editor after dropdown button - dropdown handles focus management
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
        
        // Clear the click event tracking
        this.lastClickEvent = null;
        
        // Refocus the editor after button action to prevent blur issues
        // (Skip for dropdown button as it manages focus itself)
        if (button.id !== 'spellblock-dropdown-btn') {
            setTimeout(() => {
                if (this.blockFormatter && this.blockFormatter.editorElement) {
                    this.blockFormatter.editorElement.focus();
                }
            }, 100);
        }
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
                    
                case 'handleSpellBlockDropdown':
                    this.handleSpellBlockDropdown();
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
     * Handle insert spell block action (context-aware)
     * @private
     */
    handleInsertSpellBlock() {
        const editorElement = this.blockFormatter.editorElement;
        if (!editorElement) return;
        
        // Get current cursor context to check if we're inside a SpellBlock
        const context = this.getFormattingContext();
        
        if (context && context.isSpellBlock && context.spellBlock) {
            // We're inside a SpellBlock - handle edit mode
            this.handleEditSpellBlock(context.spellBlock);
        } else {
            // Check if we're in Quick Insert mode (have a last used block)
            const lastUsed = this.stateManager.getLastUsedSpellBlock();
            if (lastUsed) {
                // Quick Insert: insert the last used SpellBlock directly
                this.insertLastUsedSpellBlock();
            } else {
                // No last used block - insert default SpellBlock
                this.insertNewSpellBlock();
            }
        }
    }

    /**
     * Insert a new SpellBlock template
     * @private
     */
    insertNewSpellBlock() {
        // Always insert default card template with hardcoded placeholders
        this.insertDefaultSpellBlock();
    }

    /**
     * Insert the last used SpellBlock (Quick Insert functionality)
     * @private
     */
    async insertLastUsedSpellBlock() {
        const lastUsed = this.stateManager.getLastUsedSpellBlock();
        if (!lastUsed) {
            console.warn('[EventCoordinator] No last used SpellBlock available for Quick Insert');
            return;
        }

        try {
            const template = await spellBlockRegistry.generateTemplate(lastUsed.blockName);
            
            // Create a block object for compatibility with existing methods
            const blockObj = {
                name: lastUsed.blockName,
                displayName: lastUsed.displayName
            };
            
            this.insertSpellBlockTemplate(template, blockObj);
            this.notificationService.success(`${lastUsed.displayName} SpellBlock inserted (Quick Insert)`);
        } catch (error) {
            console.error('[EventCoordinator] Error in Quick Insert:', error);
            this.notificationService.error(`Failed to insert ${lastUsed.displayName}: ${error.message}`);
        }
    }

    /**
     * Handle SpellBlock dropdown toggle
     * @private
     */
    handleSpellBlockDropdown() {
        if (!this.spellBlockDropdown) {
            this.initializeSpellBlockDropdown();
        }
        
        this.spellBlockDropdown.toggle();
    }

    /**
     * Initialize SpellBlock dropdown
     * @private
     */
    initializeSpellBlockDropdown() {
        console.log('[EventCoordinator] Initializing SpellBlock dropdown...');
        
        // First check if renderer exists
        if (!this.renderer) {
            console.error('[EventCoordinator] Renderer not available for dropdown initialization');
            return;
        }
        
        const dropdownButton = this.renderer.getButtonElement('spellblock-dropdown-btn');
        console.log('[EventCoordinator] Dropdown button element:', dropdownButton);
        
        if (!dropdownButton) {
            console.error('[EventCoordinator] SpellBlock dropdown button not found - checking if button was created');
            
            // Try to find button by direct DOM query as fallback
            const fallbackButton = document.getElementById('spellblock-dropdown-btn');
            console.log('[EventCoordinator] Fallback button search:', fallbackButton);
            
            if (!fallbackButton) {
                console.error('[EventCoordinator] Dropdown button not found in DOM either');
                return;
            }
            
            console.log('[EventCoordinator] Using fallback button element');
            this.spellBlockDropdown = new SpellBlockDropdown(fallbackButton, this.notificationService);
        } else {
            this.spellBlockDropdown = new SpellBlockDropdown(dropdownButton, this.notificationService);
        }
        
        // Set callback for block selection
        this.spellBlockDropdown.setOnBlockSelect((block) => {
            console.log('[EventCoordinator] Block selected from dropdown:', block.name);
            this.insertSelectedSpellBlock(block);
        });
        
        console.log('[EventCoordinator] SpellBlock dropdown initialized successfully');
    }

    /**
     * Insert selected SpellBlock from dropdown
     * @param {Object} block - Selected SpellBlock definition
     * @private
     */
    async insertSelectedSpellBlock(block) {
        try {
            const template = await spellBlockRegistry.generateTemplate(block.name);
            this.insertSpellBlockTemplate(template, block);
            
            // Track this block as the last used for Quick Insert functionality
            this.stateManager.setLastUsedSpellBlock(block.name, block.displayName);
            
            this.notificationService.success(`${block.displayName} SpellBlock inserted`);
        } catch (error) {
            console.error('[EventCoordinator] Error inserting SpellBlock:', error);
            this.notificationService.error(`Failed to insert SpellBlock: ${error.message}`);
        }
    }

    /**
     * Insert SpellBlock template into editor
     * @param {string} template - SpellBlock template string
     * @param {Object} block - SpellBlock definition
     * @private
     */
    insertSpellBlockTemplate(template, block) {
        const editorElement = this.blockFormatter.editorElement;
        if (!editorElement) return;
        
        // Store current focus state
        const hadFocus = document.activeElement === editorElement;
        
        // Ensure proper line spacing before insertion
        const adjustedPosition = this.ensureProperLineSpacing(editorElement);
        
        const textBefore = editorElement.value.substring(0, adjustedPosition);
        const textAfter = editorElement.value.substring(adjustedPosition);
        
        // Insert the template
        editorElement.value = textBefore + template + textAfter;
        
        // Find the content area for selection
        const insertionStart = adjustedPosition;
        const insertedText = textBefore + template;
        
        // Search for ~} starting from the insertion point
        const openingTagEnd = insertedText.indexOf('~}', insertionStart) + 2;
        
        // Find the start and end of the content area
        const contentStart = insertedText.indexOf('\n', openingTagEnd) + 1;
        const closingTagStart = insertedText.indexOf('\n{~~}', contentStart);
        const contentEnd = closingTagStart !== -1 ? closingTagStart : insertedText.length;
        
        // Always focus the editor and select content area
        editorElement.focus();
        editorElement.setSelectionRange(contentStart, contentEnd);
        
        // Trigger HTMX update for live preview
        editorElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    }

    /**
     * Insert default card SpellBlock
     * @private
     */
    insertDefaultSpellBlock() {
        const editorElement = this.blockFormatter.editorElement;
        if (!editorElement) return;
        
        const spellBlockTemplate = `{~ card
    title="My Title"
    footer="My Footer"
~}
My Card Content
{~~}`;
        
        // Ensure proper line spacing before insertion
        const adjustedPosition = this.ensureProperLineSpacing(editorElement);
        
        const textBefore = editorElement.value.substring(0, adjustedPosition);
        const textAfter = editorElement.value.substring(adjustedPosition);
        
        // Insert the template
        editorElement.value = textBefore + spellBlockTemplate + textAfter;
        
        // Find the opening and closing tags in the newly inserted template only
        const insertionStart = adjustedPosition;
        const insertedText = textBefore + spellBlockTemplate;
        
        // Search for ~} starting from the insertion point
        const openingTagEnd = insertedText.indexOf('~}', insertionStart) + 2; // +2 for ~}
        
        // Find the start and end of the content area within the newly inserted block
        const contentStart = insertedText.indexOf('\n', openingTagEnd) + 1; // First newline after ~}
        const closingTagStart = insertedText.indexOf('\n{~~}', contentStart); // Line before closing tag
        const contentEnd = closingTagStart !== -1 ? closingTagStart : insertedText.length;
        
        // Select the content area for easy editing
        editorElement.setSelectionRange(contentStart, contentEnd);
        editorElement.focus();
        
        // Trigger HTMX update for live preview
        editorElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        
        // Track the default card as the last used SpellBlock for Quick Insert
        this.stateManager.setLastUsedSpellBlock('card', 'Card');
        
        this.notificationService.success('Card SpellBlock template inserted - content selected');
    }

    /**
     * Ensure cursor is on an empty line with an empty line above
     * @param {HTMLElement} editorElement - The textarea element
     * @returns {number} Adjusted cursor position
     * @private
     */
    ensureProperLineSpacing(editorElement) {
        const text = editorElement.value;
        const cursorPosition = editorElement.selectionStart;
        
        // Find the current line start and end
        const textBefore = text.substring(0, cursorPosition);
        const textAfter = text.substring(cursorPosition);
        
        const lastNewlineIndex = textBefore.lastIndexOf('\n');
        const nextNewlineIndex = textAfter.indexOf('\n');
        
        const currentLineStart = lastNewlineIndex + 1;
        const currentLineEnd = nextNewlineIndex === -1 ? text.length : cursorPosition + nextNewlineIndex;
        const currentLine = text.substring(currentLineStart, currentLineEnd);
        
        // Check if current line is empty
        const isCurrentLineEmpty = currentLine.trim() === '';
        
        // Find the previous line
        let previousLineEmpty = false;
        if (lastNewlineIndex > 0) {
            const beforeLastNewline = textBefore.substring(0, lastNewlineIndex);
            const prevLineStart = beforeLastNewline.lastIndexOf('\n') + 1;
            const previousLine = beforeLastNewline.substring(prevLineStart);
            previousLineEmpty = previousLine.trim() === '';
        } else if (lastNewlineIndex === -1) {
            // We're on the first line
            previousLineEmpty = currentLineStart === 0;
        }
        
        let adjustedPosition = cursorPosition;
        let newContent = '';
        
        if (!isCurrentLineEmpty || !previousLineEmpty) {
            // We need to add newlines to get proper spacing
            if (!isCurrentLineEmpty) {
                // Move to end of current line and add newlines
                adjustedPosition = currentLineEnd;
                newContent = '\n\n';
            } else if (!previousLineEmpty) {
                // Current line is empty but previous isn't, add one more newline
                adjustedPosition = currentLineStart;
                newContent = '\n';
            }
            
            // Insert the newlines
            if (newContent) {
                const beforeInsert = text.substring(0, adjustedPosition);
                const afterInsert = text.substring(adjustedPosition);
                editorElement.value = beforeInsert + newContent + afterInsert;
                adjustedPosition += newContent.length;
            }
        }
        
        return adjustedPosition;
    }



    /**
     * Handle editing an existing SpellBlock
     * @param {Object} spellBlock - SpellBlock information from cursor tracker
     * @private
     */
    handleEditSpellBlock(spellBlock) {
        const editorElement = this.blockFormatter.editorElement;
        if (!editorElement) return;
        
        const blockName = spellBlock.blockName || 'SpellBlock';
        
        // Always select the content area for editing
        const contentStart = spellBlock.content.start;
        const contentEnd = spellBlock.content.end;
        
        // Set selection to the content area
        editorElement.setSelectionRange(contentStart, contentEnd);
        
        // Focus the editor
        editorElement.focus();
        
        // Trigger HTMX update for live preview
        editorElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        
        this.notificationService.info(`Editing SpellBlock "${blockName}" - content selected`);
    }

    /**
     * Get current formatting context
     * @returns {Object|null} Current formatting context
     * @private
     */
    getFormattingContext() {
        // Use the cursor tracker from state manager to get current context
        if (this.stateManager && this.stateManager.cursorTracker) {
            return this.stateManager.cursorTracker.getFormattingContext();
        }
        return null;
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
     * Handle key down events
     * @param {KeyboardEvent} event - Keyboard event
     * @deprecated Use KeyboardShortcutManager instead
     */
    handleKeyDown(event) {
        // Track last key event for modifier key detection
        this.lastKeyEvent = event;
        
        // Legacy keyboard shortcuts - now handled by KeyboardShortcutManager
        // This method is kept for backward compatibility
        // The KeyboardShortcutManager provides more comprehensive shortcut handling
    }

    /**
     * Handle key up events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyUp(event) {
        // Clear last key event when key is released
        this.lastKeyEvent = null;
        
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