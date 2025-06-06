// static/mjs/button_bar/KeyboardShortcutManager.mjs

/**
 * Manages keyboard shortcuts for the editor button bar
 * Provides comprehensive shortcut handling with cross-platform support
 */
export class KeyboardShortcutManager {
    constructor(eventCoordinator, options = {}) {
        this.eventCoordinator = eventCoordinator;
        this.options = {
            enableShortcuts: true,
            preventDefault: true,
            showHelp: true,
            ...options
        };
        
        // Track active shortcuts
        this.activeShortcuts = new Map();
        this.isEnabled = true;
        this.targetElement = null;
        
        // Bind methods
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        
        // Initialize shortcut definitions
        this.initializeShortcuts();
    }

    /**
     * Initialize all keyboard shortcut definitions
     */
    initializeShortcuts() {
        this.shortcuts = new Map([
            // Basic formatting shortcuts - original (may conflict with browser)
            ['ctrl+b', {
                id: 'bold',
                description: 'Bold text',
                action: 'handleMarkdownFormat',
                formatType: 'bold',
                type: 'inline',
                buttonId: 'bold-btn'
            }],
            ['meta+b', {
                id: 'bold-mac',
                description: 'Bold text (Mac)',
                action: 'handleMarkdownFormat',
                formatType: 'bold',
                type: 'inline',
                buttonId: 'bold-btn'
            }],
            // Alternative shortcuts to avoid browser conflicts
            ['alt+shift+b', {
                id: 'bold-alt',
                description: 'Bold text (alternative)',
                action: 'handleMarkdownFormat',
                formatType: 'bold',
                type: 'inline',
                buttonId: 'bold-btn'
            }],
            
            ['ctrl+i', {
                id: 'italic',
                description: 'Italic text',
                action: 'handleMarkdownFormat',
                formatType: 'italic',
                type: 'inline',
                buttonId: 'italic-btn'
            }],
            ['meta+i', {
                id: 'italic-mac',
                description: 'Italic text (Mac)',
                action: 'handleMarkdownFormat',
                formatType: 'italic',
                type: 'inline',
                buttonId: 'italic-btn'
            }],
            ['alt+shift+i', {
                id: 'italic-alt',
                description: 'Italic text (alternative)',
                action: 'handleMarkdownFormat',
                formatType: 'italic',
                type: 'inline',
                buttonId: 'italic-btn'
            }],
            
            // Link shortcuts
            ['ctrl+k', {
                id: 'link',
                description: 'Insert link',
                action: 'handleMarkdownFormat',
                formatType: 'link',
                type: 'inline',
                buttonId: 'link-btn'
            }],
            ['meta+k', {
                id: 'link-mac',
                description: 'Insert link (Mac)',
                action: 'handleMarkdownFormat',
                formatType: 'link',
                type: 'inline',
                buttonId: 'link-btn'
            }],
            ['alt+shift+l', {
                id: 'link-alt',
                description: 'Insert link (alternative)',
                action: 'handleMarkdownFormat',
                formatType: 'link',
                type: 'inline',
                buttonId: 'link-btn'
            }],
            
            // Code shortcuts
            ['ctrl+shift+c', {
                id: 'inline-code',
                description: 'Inline code',
                action: 'handleMarkdownFormat',
                formatType: 'code',
                type: 'inline',
                buttonId: 'code-btn'
            }],
            ['meta+shift+c', {
                id: 'inline-code-mac',
                description: 'Inline code (Mac)',
                action: 'handleMarkdownFormat',
                formatType: 'code',
                type: 'inline',
                buttonId: 'code-btn'
            }],
            ['alt+shift+c', {
                id: 'inline-code-alt',
                description: 'Inline code (alternative)',
                action: 'handleMarkdownFormat',
                formatType: 'code',
                type: 'inline',
                buttonId: 'code-btn'
            }],
            
            ['ctrl+shift+k', {
                id: 'code-block',
                description: 'Code block',
                action: 'handleMarkdownFormat',
                formatType: 'codeBlock',
                type: 'block',
                buttonId: 'code-block-btn'
            }],
            ['meta+shift+k', {
                id: 'code-block-mac',
                description: 'Code block (Mac)',
                action: 'handleMarkdownFormat',
                formatType: 'codeBlock',
                type: 'block',
                buttonId: 'code-block-btn'
            }],
            ['alt+shift+k', {
                id: 'code-block-alt',
                description: 'Code block (alternative)',
                action: 'handleMarkdownFormat',
                formatType: 'codeBlock',
                type: 'block',
                buttonId: 'code-block-btn'
            }],
            
            // Header shortcuts
            ['ctrl+1', {
                id: 'header1',
                description: 'Header 1',
                action: 'handleMarkdownFormat',
                formatType: 'header1',
                type: 'block',
                buttonId: 'header-1-btn'
            }],
            ['meta+1', {
                id: 'header1-mac',
                description: 'Header 1 (Mac)',
                action: 'handleMarkdownFormat',
                formatType: 'header1',
                type: 'block',
                buttonId: 'header-1-btn'
            }],
            ['alt+shift+1', {
                id: 'header1-alt',
                description: 'Header 1 (alternative)',
                action: 'handleMarkdownFormat',
                formatType: 'header1',
                type: 'block',
                buttonId: 'header-1-btn'
            }],
            
            ['ctrl+2', {
                id: 'header2',
                description: 'Header 2',
                action: 'handleMarkdownFormat',
                formatType: 'header2',
                type: 'block',
                buttonId: 'header-2-btn'
            }],
            ['meta+2', {
                id: 'header2-mac',
                description: 'Header 2 (Mac)',
                action: 'handleMarkdownFormat',
                formatType: 'header2',
                type: 'block',
                buttonId: 'header-2-btn'
            }],
            ['alt+shift+2', {
                id: 'header2-alt',
                description: 'Header 2 (alternative)',
                action: 'handleMarkdownFormat',
                formatType: 'header2',
                type: 'block',
                buttonId: 'header-2-btn'
            }],
            
            ['ctrl+3', {
                id: 'header3',
                description: 'Header 3',
                action: 'handleMarkdownFormat',
                formatType: 'header3',
                type: 'block',
                buttonId: 'header-3-btn'
            }],
            ['meta+3', {
                id: 'header3-mac',
                description: 'Header 3 (Mac)',
                action: 'handleMarkdownFormat',
                formatType: 'header3',
                type: 'block',
                buttonId: 'header-3-btn'
            }],
            ['alt+shift+3', {
                id: 'header3-alt',
                description: 'Header 3 (alternative)',
                action: 'handleMarkdownFormat',
                formatType: 'header3',
                type: 'block',
                buttonId: 'header-3-btn'
            }],
            
            // List shortcuts
            ['ctrl+shift+l', {
                id: 'unordered-list',
                description: 'Unordered list',
                action: 'handleMarkdownFormat',
                formatType: 'unorderedList',
                type: 'block',
                buttonId: 'unordered-list-btn'
            }],
            ['meta+shift+l', {
                id: 'unordered-list-mac',
                description: 'Unordered list (Mac)',
                action: 'handleMarkdownFormat',
                formatType: 'unorderedList',
                type: 'block',
                buttonId: 'unordered-list-btn'
            }],
            ['alt+shift+u', {
                id: 'unordered-list-alt',
                description: 'Unordered list (alternative)',
                action: 'handleMarkdownFormat',
                formatType: 'unorderedList',
                type: 'block',
                buttonId: 'unordered-list-btn'
            }],
            
            ['ctrl+shift+o', {
                id: 'ordered-list',
                description: 'Ordered list',
                action: 'handleMarkdownFormat',
                formatType: 'orderedList',
                type: 'block',
                buttonId: 'ordered-list-btn'
            }],
            ['meta+shift+o', {
                id: 'ordered-list-mac',
                description: 'Ordered list (Mac)',
                action: 'handleMarkdownFormat',
                formatType: 'orderedList',
                type: 'block',
                buttonId: 'ordered-list-btn'
            }],
            ['alt+shift+o', {
                id: 'ordered-list-alt',
                description: 'Ordered list (alternative)',
                action: 'handleMarkdownFormat',
                formatType: 'orderedList',
                type: 'block',
                buttonId: 'ordered-list-btn'
            }],
            
            // Image shortcuts
            ['ctrl+shift+i', {
                id: 'image',
                description: 'Insert image',
                action: 'handleMarkdownFormat',
                formatType: 'image',
                type: 'inline',
                buttonId: 'image-btn'
            }],
            ['meta+shift+i', {
                id: 'image-mac',
                description: 'Insert image (Mac)',
                action: 'handleMarkdownFormat',
                formatType: 'image',
                type: 'inline',
                buttonId: 'image-btn'
            }],
            ['alt+shift+g', {
                id: 'image-alt',
                description: 'Insert image (alternative)',
                action: 'handleMarkdownFormat',
                formatType: 'image',
                type: 'inline',
                buttonId: 'image-btn'
            }],
            
            // SpellBlock shortcuts
            ['ctrl+shift+s', {
                id: 'spellblock',
                description: 'Insert SpellBlock',
                action: 'handleInsertSpellBlock',
                buttonId: 'insert-spellblock-btn'
            }],
            ['meta+shift+s', {
                id: 'spellblock-mac',
                description: 'Insert SpellBlock (Mac)',
                action: 'handleInsertSpellBlock',
                buttonId: 'insert-spellblock-btn'
            }],
            ['alt+shift+s', {
                id: 'spellblock-alt',
                description: 'Insert SpellBlock (alternative)',
                action: 'handleInsertSpellBlock',
                buttonId: 'insert-spellblock-btn'
            }],
            
            // Help shortcuts
            ['ctrl+shift+h', {
                id: 'help',
                description: 'Show keyboard shortcuts help',
                action: 'showKeyboardHelp'
            }],
            ['meta+shift+h', {
                id: 'help-mac',
                description: 'Show keyboard shortcuts help (Mac)',
                action: 'showKeyboardHelp'
            }],
            ['alt+shift+h', {
                id: 'help-alt',
                description: 'Show keyboard shortcuts help (alternative)',
                action: 'showKeyboardHelp'
            }]
        ]);
    }

    /**
     * Enable keyboard shortcuts on target element
     * @param {HTMLElement} targetElement - Element to attach shortcuts to
     */
    enable(targetElement) {
        if (!targetElement) {
            console.error('[KeyboardShortcutManager] Target element is required');
            return false;
        }
        
        this.disable(); // Clean up existing listeners
        
        this.targetElement = targetElement;
        this.isEnabled = true;
        
        targetElement.addEventListener('keydown', this.handleKeyDown);
        targetElement.addEventListener('keyup', this.handleKeyUp);
        
        return true;
    }

    /**
     * Disable keyboard shortcuts
     */
    disable() {
        if (this.targetElement) {
            this.targetElement.removeEventListener('keydown', this.handleKeyDown);
            this.targetElement.removeEventListener('keyup', this.handleKeyUp);
            this.targetElement = null;
        }
        
        this.isEnabled = false;
        this.activeShortcuts.clear();
    }

    /**
     * Handle keydown events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyDown(event) {
        if (!this.isEnabled || !this.options.enableShortcuts) {
            return;
        }
        
        const shortcutKey = this.getShortcutKey(event);
        const shortcut = this.shortcuts.get(shortcutKey);
        
        if (shortcut) {
            // Only prevent default for keyboard shortcuts, not mouse events
            if (this.options.preventDefault) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            this.executeShortcut(shortcut, event);
        }
    }

    /**
     * Handle keyup events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyUp(event) {
        // Handle any keyup-specific logic if needed
        // Currently used for cleaning up active shortcuts
        const shortcutKey = this.getShortcutKey(event);
        this.activeShortcuts.delete(shortcutKey);
    }

    /**
     * Generate shortcut key string from event
     * @param {KeyboardEvent} event - Keyboard event
     * @returns {string} Shortcut key string
     */
    getShortcutKey(event) {
        const parts = [];
        
        // Add modifier keys in consistent order
        if (event.ctrlKey) parts.push('ctrl');
        if (event.metaKey) parts.push('meta');
        if (event.altKey) parts.push('alt');
        if (event.shiftKey) parts.push('shift');
        
        // Add main key (normalize key names)
        let key = event.key.toLowerCase();
        
        // Handle special keys
        if (key === ' ') key = 'space';
        if (key === 'arrowup') key = 'up';
        if (key === 'arrowdown') key = 'down';
        if (key === 'arrowleft') key = 'left';
        if (key === 'arrowright') key = 'right';
        
        parts.push(key);
        
        return parts.join('+');
    }

    /**
     * Execute a keyboard shortcut
     * @param {Object} shortcut - Shortcut configuration
     * @param {KeyboardEvent} event - Original keyboard event
     */
    executeShortcut(shortcut, event) {
        if (!this.eventCoordinator) {
            console.error('[KeyboardShortcutManager] EventCoordinator not available');
            return;
        }
        
        // Track active shortcut
        this.activeShortcuts.set(shortcut.id, {
            shortcut,
            timestamp: Date.now(),
            event
        });
        
        try {
            switch (shortcut.action) {
                case 'handleMarkdownFormat':
                    this.eventCoordinator.handleMarkdownFormat(shortcut.formatType, shortcut.type);
                    break;
                    
                case 'handleInsertSpellBlock':
                    this.eventCoordinator.handleInsertSpellBlock();
                    break;
                    
                case 'showKeyboardHelp':
                    this.showKeyboardHelp();
                    break;
                    
                default:
                    // Try to execute as custom action
                    if (this.eventCoordinator.hasCustomAction(shortcut.action)) {
                        this.eventCoordinator.executeActionByName(shortcut.action, { shortcut, event });
                    } else {
                        console.warn('[KeyboardShortcutManager] Unknown action:', shortcut.action);
                    }
            }
            
            // Flash button if available
            if (shortcut.buttonId) {
                this.flashButton(shortcut.buttonId);
            }
            
        } catch (error) {
            console.error('[KeyboardShortcutManager] Error executing shortcut:', error);
        }
    }

    /**
     * Flash button to provide visual feedback
     * @param {string} buttonId - Button ID to flash
     */
    flashButton(buttonId) {
        if (!this.eventCoordinator.renderer) return;
        
        const button = this.eventCoordinator.renderer.getButtonElement(buttonId);
        if (!button) return;
        
        // Add flash class
        button.classList.add('keyboard-flash');
        
        // Remove flash class after animation
        setTimeout(() => {
            button.classList.remove('keyboard-flash');
        }, 200);
    }

    /**
     * Show keyboard shortcuts help modal/tooltip
     */
    showKeyboardHelp() {
        if (!this.options.showHelp) return;
        
        const helpContent = this.generateHelpContent();
        
        // Use notification service if available
        if (this.eventCoordinator.notificationService) {
            this.eventCoordinator.notificationService.info(
                'Press Ctrl+Shift+H again to close this help',
                { duration: 5000 }
            );
        }
        
        // Create help modal
        this.createHelpModal(helpContent);
    }

    /**
     * Generate help content HTML
     * @returns {string} HTML content for help
     */
    generateHelpContent() {
        const shortcuts = Array.from(this.shortcuts.values())
            .filter(shortcut => !shortcut.id.endsWith('-mac')) // Only show one version per shortcut
            .sort((a, b) => a.description.localeCompare(b.description));
        
        let html = '<div class="keyboard-shortcuts-help">';
        html += '<h3>Keyboard Shortcuts</h3>';
        html += '<div class="shortcuts-grid">';
        
        shortcuts.forEach(shortcut => {
            const key = this.getShortcutDisplayKey(shortcut);
            html += `
                <div class="shortcut-item">
                    <span class="shortcut-key">${key}</span>
                    <span class="shortcut-description">${shortcut.description}</span>
                </div>
            `;
        });
        
        html += '</div>';
        html += '</div>';
        
        return html;
    }

    /**
     * Get display key for shortcut (handles Mac/PC differences)
     * @param {Object} shortcut - Shortcut configuration
     * @returns {string} Display key string
     */
    getShortcutDisplayKey(shortcut) {
        // Find the shortcut key by looking for it in the shortcuts map
        for (const [key, config] of this.shortcuts) {
            if (config === shortcut) {
                return this.formatKeyForDisplay(key);
            }
        }
        return '';
    }

    /**
     * Format shortcut key for display
     * @param {string} key - Raw shortcut key
     * @returns {string} Formatted display key
     */
    formatKeyForDisplay(key) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        
        return key
            .replace('ctrl', isMac ? '⌘' : 'Ctrl')
            .replace('meta', '⌘')
            .replace('shift', isMac ? '⇧' : 'Shift')
            .replace('alt', isMac ? '⌥' : 'Alt')
            .replace(/\+/g, isMac ? '' : '+')
            .replace(/([a-z0-9])/g, (match) => match.toUpperCase());
    }

    /**
     * Create help modal
     * @param {string} content - HTML content for modal
     */
    createHelpModal(content) {
        // Remove existing modal
        const existing = document.querySelector('.keyboard-shortcuts-modal');
        if (existing) {
            existing.remove();
            return; // Toggle behavior
        }
        
        const modal = document.createElement('div');
        modal.className = 'keyboard-shortcuts-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close">&times;</button>
                ${content}
            </div>
        `;
        
        // Store reference to currently focused element (editor)
        const previouslyFocused = document.activeElement;
        
        // Close modal function
        const closeModal = () => {
            modal.remove();
            document.removeEventListener('keydown', handleModalKeydown);
            // Restore focus to editor
            if (previouslyFocused && previouslyFocused.focus) {
                setTimeout(() => {
                    previouslyFocused.focus();
                }, 50);
            }
        };
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        
        modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        
        // Enhanced keyboard handler for modal
        const handleModalKeydown = (event) => {
            // Close on Escape
            if (event.key === 'Escape') {
                event.preventDefault();
                closeModal();
                return;
            }
            
            // Close on Ctrl+Shift+H or Alt+Shift+H (same shortcuts that open it)
            if ((event.ctrlKey || event.metaKey || event.altKey) && event.shiftKey && event.key.toLowerCase() === 'h') {
                event.preventDefault();
                closeModal();
                return;
            }
        };
        
        document.addEventListener('keydown', handleModalKeydown);
        
        // Append to body
        document.body.appendChild(modal);
        
        // Don't steal focus from editor - modal should be accessible but not focused
        // This allows keyboard shortcuts to still work while modal is open
        if (previouslyFocused && previouslyFocused.focus) {
            setTimeout(() => {
                previouslyFocused.focus();
            }, 100);
        }
    }

    /**
     * Add custom shortcut
     * @param {string} keyCombo - Key combination (e.g., 'ctrl+shift+x')
     * @param {Object} config - Shortcut configuration
     */
    addShortcut(keyCombo, config) {
        if (!keyCombo || !config) {
            console.error('[KeyboardShortcutManager] Invalid shortcut configuration');
            return false;
        }
        
        this.shortcuts.set(keyCombo, {
            id: config.id || keyCombo,
            description: config.description || 'Custom shortcut',
            action: config.action,
            ...config
        });
        
        return true;
    }

    /**
     * Remove shortcut
     * @param {string} keyCombo - Key combination to remove
     * @returns {boolean} True if removed successfully
     */
    removeShortcut(keyCombo) {
        return this.shortcuts.delete(keyCombo);
    }

    /**
     * Check if shortcut exists
     * @param {string} keyCombo - Key combination to check
     * @returns {boolean} True if shortcut exists
     */
    hasShortcut(keyCombo) {
        return this.shortcuts.has(keyCombo);
    }

    /**
     * Get all shortcuts
     * @returns {Map} Map of all shortcuts
     */
    getAllShortcuts() {
        return new Map(this.shortcuts);
    }

    /**
     * Get shortcuts by action
     * @param {string} action - Action name
     * @returns {Array} Array of shortcuts with the specified action
     */
    getShortcutsByAction(action) {
        return Array.from(this.shortcuts.values())
            .filter(shortcut => shortcut.action === action);
    }

    /**
     * Get manager status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            isEnabled: this.isEnabled,
            hasTarget: !!this.targetElement,
            shortcutCount: this.shortcuts.size,
            activeShortcuts: this.activeShortcuts.size,
            options: { ...this.options }
        };
    }

    /**
     * Update options
     * @param {Object} newOptions - New options to merge
     */
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
    }

    /**
     * Destroy the manager and clean up resources
     */
    destroy() {
        this.disable();
        this.shortcuts.clear();
        this.activeShortcuts.clear();
        this.eventCoordinator = null;
        this.targetElement = null;
    }
}