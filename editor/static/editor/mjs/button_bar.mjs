// static/mjs/button_bar.mjs

import { ButtonConfigManager } from './button_bar/ButtonConfigManager.mjs';
import { ButtonBarRenderer } from './button_bar/ButtonBarRenderer.mjs';
import { CursorTracker } from './button_bar/CursorTracker.mjs';
import { NotificationService } from './button_bar/NotificationService.mjs';
import { ButtonStateManager } from './button_bar/ButtonStateManager.mjs';
import { EventCoordinator } from './button_bar/EventCoordinator.mjs';
import { BlockFormatter } from './formatters/BlockFormatter.mjs';
import { InlineFormatter } from './formatters/InlineFormatter.mjs';

export class EditorButtonBar {
    constructor(editorElement, options = {}) {
        this.editorElement = editorElement;
        this.editorPane = editorElement.closest('.editor-pane');
        this.isVisible = false;
        
        // Initialize configuration manager
        this.configManager = new ButtonConfigManager(options);
        
        // Initialize cursor tracker
        this.cursorTracker = new CursorTracker(editorElement, {
            contextRange: this.configManager.getOptions().contextRange,
            updateThrottle: 100
        });
        
        // Initialize formatters
        this.blockFormatter = new BlockFormatter(editorElement);
        this.inlineFormatter = new InlineFormatter(editorElement);
        
        // Initialize notification service
        this.notificationService = new NotificationService({
            duration: this.configManager.getOptions().notificationDuration,
            position: 'top-right'
        });
        
        // Initialize renderer
        this.renderer = new ButtonBarRenderer(editorElement, this.configManager);
        
        // Initialize state manager
        this.stateManager = new ButtonStateManager(this.renderer, this.cursorTracker);
        
        // Initialize event coordinator
        this.eventCoordinator = new EventCoordinator(
            this.renderer,
            this.configManager,
            this.blockFormatter,
            this.inlineFormatter,
            this.stateManager,
            this.notificationService
        );
        
        // Initialize the button bar
        this.init();
    }

    /**
     * Initialize the button bar
     */
    init() {
        try {
            // Create and insert button bar HTML
            this.renderer.createButtonBar();
            const success = this.renderer.insertIntoDOM();
            
            if (!success) {
                console.error('[EditorButtonBar] Failed to insert button bar into DOM');
                return;
            }
            
            // Attach event listeners
            this.eventCoordinator.attachEventListeners();
            this.eventCoordinator.enableKeyboardShortcuts();
            
            // Start cursor tracking and state management
            this.cursorTracker.startTracking();
            this.stateManager.startTracking();
            
        } catch (error) {
            console.error('[EditorButtonBar] Error during initialization:', error);
            this.notificationService.error('Failed to initialize editor button bar');
        }
    }

    /**
     * Show the button bar
     */
    show() {
        if (!this.renderer.getElement()) {
            console.warn('[EditorButtonBar] Button bar not initialized');
            return;
        }
        
        this.renderer.show();
        this.isVisible = true;
        
        // Update button states when shown
        this.stateManager.forceUpdate();
    }

    /**
     * Hide the button bar
     */
    hide() {
        if (!this.renderer.getElement()) return;
        
        this.renderer.hide();
        this.isVisible = false;
    }

    /**
     * Check if button bar is visible
     * @returns {boolean} True if visible
     */
    isButtonBarVisible() {
        return this.isVisible && this.renderer.isVisible();
    }

    /**
     * Get the button bar element
     * @returns {HTMLElement|null} Button bar element
     */
    getElement() {
        return this.renderer.getElement();
    }

    /**
     * Add a custom button to the button bar
     * @param {Object} buttonConfig - Button configuration
     * @param {string} category - Button category ('main', 'markdown', 'custom')
     * @returns {boolean} True if successful
     */
    addButton(buttonConfig, category = 'custom') {
        const configAdded = this.configManager.addButton(buttonConfig);
        if (!configAdded) return false;
        
        const renderAdded = this.renderer.addButton(buttonConfig, category);
        if (!renderAdded) {
            // Rollback config change
            this.configManager.removeButton(buttonConfig.id);
            return false;
        }
        
        // Reattach event listeners to include new button
        this.eventCoordinator.detachEventListeners();
        this.eventCoordinator.attachEventListeners();
        
        return true;
    }

    /**
     * Remove a button from the button bar
     * @param {string} buttonId - Button ID to remove
     * @returns {boolean} True if successful
     */
    removeButton(buttonId) {
        const configRemoved = this.configManager.removeButton(buttonId);
        const renderRemoved = this.renderer.removeButton(buttonId);
        
        return configRemoved || renderRemoved;
    }

    /**
     * Update button configuration
     * @param {string} buttonId - Button ID
     * @param {Object} updates - Properties to update
     * @returns {boolean} True if successful
     */
    updateButton(buttonId, updates) {
        return this.configManager.updateButton(buttonId, updates);
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type ('success', 'error', 'warning', 'info')
     * @param {Object} options - Additional options
     * @returns {string} Notification ID
     */
    showNotification(message, type = 'info', options = {}) {
        return this.notificationService.show(message, type, options);
    }

    /**
     * Hide notification
     * @param {string} notificationId - Notification ID
     */
    hideNotification(notificationId) {
        return this.notificationService.hide(notificationId);
    }

    /**
     * Trigger button programmatically
     * @param {string} buttonId - Button ID to trigger
     */
    triggerButton(buttonId) {
        this.eventCoordinator.triggerButton(buttonId);
    }

    /**
     * Execute action by name
     * @param {string} actionName - Action name
     * @param {Object} options - Additional options
     */
    executeAction(actionName, options = {}) {
        this.eventCoordinator.executeActionByName(actionName, options);
    }

    /**
     * Add custom action handler
     * @param {string} actionName - Action name
     * @param {Function} handler - Handler function
     * @returns {boolean} True if successful
     */
    addCustomAction(actionName, handler) {
        return this.eventCoordinator.addCustomAction(actionName, handler);
    }

    /**
     * Remove custom action handler
     * @param {string} actionName - Action name
     * @returns {boolean} True if successful
     */
    removeCustomAction(actionName) {
        return this.eventCoordinator.removeCustomAction(actionName);
    }

    /**
     * Get button configuration
     * @param {string} buttonId - Button ID
     * @returns {Object|null} Button configuration
     */
    getButtonConfig(buttonId) {
        return this.configManager.getButtonById(buttonId);
    }

    /**
     * Get all button configurations
     * @returns {Object} Grouped button configurations
     */
    getAllButtons() {
        return this.configManager.getAllButtonsGrouped();
    }

    /**
     * Check if button is active
     * @param {string} buttonId - Button ID
     * @returns {boolean} True if active
     */
    isButtonActive(buttonId) {
        return this.stateManager.isButtonActive(buttonId);
    }

    /**
     * Set button active state
     * @param {string} buttonId - Button ID
     * @param {boolean} isActive - Active state
     */
    setButtonActive(buttonId, isActive) {
        this.stateManager.setButtonActive(buttonId, isActive);
    }

    /**
     * Toggle button active state
     * @param {string} buttonId - Button ID
     * @returns {boolean} New active state
     */
    toggleActiveButton(buttonId) {
        return this.stateManager.toggleButtonActive(buttonId);
    }

    /**
     * Update button states
     */
    updateButtonStates() {
        this.stateManager.forceUpdate();
    }

    /**
     * Check cursor formatting context
     * @returns {Object|null} Formatting context
     */
    checkCursorFormatting() {
        return this.cursorTracker.getFormattingContext();
    }

    /**
     * Apply markdown formatting
     * @param {string} formatType - Format type
     * @param {string} type - 'block' or 'inline'
     */
    handleMarkdownFormat(formatType, type = 'inline') {
        this.eventCoordinator.handleMarkdownFormat(formatType, type);
    }

    /**
     * Insert spell block template
     */
    handleInsertSpellBlock() {
        this.eventCoordinator.handleInsertSpellBlock();
    }

    /**
     * Get configuration options
     * @returns {Object} Configuration options
     */
    getOptions() {
        return this.configManager.getOptions();
    }

    /**
     * Update configuration options
     * @param {Object} newOptions - New options
     */
    updateOptions(newOptions) {
        this.configManager.updateOptions(newOptions);
        
        // Update dependent services
        if (newOptions.notificationDuration) {
            this.notificationService.options.duration = newOptions.notificationDuration;
        }
        
        if (newOptions.contextRange) {
            this.cursorTracker.options.contextRange = newOptions.contextRange;
        }
    }

    /**
     * Enable or disable button bar
     * @param {boolean} enabled - Whether to enable
     */
    setEnabled(enabled) {
        if (enabled) {
            this.cursorTracker.startTracking();
            this.stateManager.startTracking();
            this.eventCoordinator.attachEventListeners();
        } else {
            this.cursorTracker.stopTracking();
            this.stateManager.stopTracking();
            this.eventCoordinator.detachEventListeners();
        }
    }

    /**
     * Refresh the button bar
     */
    refresh() {
        this.renderer.refresh();
        this.eventCoordinator.detachEventListeners();
        this.eventCoordinator.attachEventListeners();
        this.stateManager.forceUpdate();
    }

    /**
     * Reset to default configuration
     */
    reset() {
        this.configManager.reset();
        this.stateManager.reset();
        this.refresh();
    }

    /**
     * Get status information for debugging
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            isVisible: this.isVisible,
            isInitialized: !!this.renderer.getElement(),
            buttonCount: this.configManager.getButtonCounts(),
            activeButtons: this.stateManager.getActiveButtons(),
            isTracking: this.stateManager.isTrackingEnabled(),
            eventStatus: this.eventCoordinator.getStatus(),
            notifications: this.notificationService.getCount()
        };
    }

    /**
     * Destroy the button bar and clean up resources
     */
    destroy() {
        try {
            // Stop tracking
            this.cursorTracker.stopTracking();
            this.stateManager.stopTracking();
            
            // Detach event listeners
            this.eventCoordinator.detachEventListeners();
            this.eventCoordinator.disableKeyboardShortcuts();
            
            // Destroy components
            this.renderer.destroy();
            this.cursorTracker.destroy();
            this.stateManager.destroy();
            this.eventCoordinator.destroy();
            this.notificationService.destroy();
            this.blockFormatter.destroy();
            this.inlineFormatter.destroy();
            
            // Clear references
            this.configManager = null;
            this.renderer = null;
            this.cursorTracker = null;
            this.notificationService = null;
            this.stateManager = null;
            this.eventCoordinator = null;
            this.blockFormatter = null;
            this.inlineFormatter = null;
            this.editorElement = null;
            this.editorPane = null;
            
        } catch (error) {
            console.error('[EditorButtonBar] Error during destruction:', error);
        }
    }

    // Legacy method compatibility - deprecated but maintained for backward compatibility
    
    /**
     * @deprecated Use addButton instead
     */
    attachEventListeners() {
        console.warn('[EditorButtonBar] attachEventListeners is deprecated');
        this.eventCoordinator.attachEventListeners();
    }

    /**
     * @deprecated Use isInsideMarkdown method on formatters instead
     */
    isInsideMarkdown(text, position, marker, excludeMarker = null) {
        console.warn('[EditorButtonBar] isInsideMarkdown is deprecated');
        return this.cursorTracker.isPositionInsideMarkdown ?
            this.cursorTracker.isPositionInsideMarkdown(text, position, marker, excludeMarker) :
            false;
    }

    /**
     * @deprecated Use isInsideCodeBlock method on cursor tracker instead
     */
    isInsideCodeBlock(text, position) {
        console.warn('[EditorButtonBar] isInsideCodeBlock is deprecated');
        return this.cursorTracker.isPositionInsideCodeBlock ?
            this.cursorTracker.isPositionInsideCodeBlock(text, position) :
            false;
    }

    /**
     * @deprecated Use blockFormatter.format or inlineFormatter.format instead
     */
    handleBlockFormat(formatType, buttonConfig) {
        console.warn('[EditorButtonBar] handleBlockFormat is deprecated');
        if (this.blockFormatter && buttonConfig) {
            this.blockFormatter.format(formatType);
        }
    }

    /**
     * @deprecated Use blockFormatter.format or inlineFormatter.format instead
     */
    handleInlineFormat(formatType, buttonConfig) {
        console.warn('[EditorButtonBar] handleInlineFormat is deprecated');
        if (this.inlineFormatter && buttonConfig) {
            this.inlineFormatter.format(formatType);
        }
    }
}