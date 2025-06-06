// static/mjs/button_bar/ButtonBarRenderer.mjs

import { CSS_CLASSES } from '../config/button_configs.mjs';

export class ButtonBarRenderer {
    constructor(editorElement, configManager) {
        this.editorElement = editorElement;
        this.editorPane = editorElement.closest('.editor-pane');
        this.configManager = configManager;
        this.buttonBar = null;
        this.buttonElements = new Map();
    }

    /**
     * Create the complete button bar HTML structure
     * @returns {HTMLElement} The button bar element
     */
    createButtonBar() {
        if (this.buttonBar) {
            return this.buttonBar;
        }

        // Create the main button bar container
        this.buttonBar = document.createElement('div');
        this.buttonBar.id = 'editor-button-bar';
        this.buttonBar.className = `${CSS_CLASSES.buttonBar} ${CSS_CLASSES.buttonBarHidden}`;

        // Create main buttons container
        const mainButtonsContainer = this.createMainButtonsContainer();
        
        // Create separator
        const separator = this.createSeparator();
        
        // Create markdown buttons container
        const markdownButtonsContainer = this.createMarkdownButtonsContainer();

        // Assemble the button bar
        this.buttonBar.appendChild(mainButtonsContainer);
        this.buttonBar.appendChild(separator);
        this.buttonBar.appendChild(markdownButtonsContainer);

        return this.buttonBar;
    }

    /**
     * Create main buttons container
     * @returns {HTMLElement} Container element with main buttons
     * @private
     */
    createMainButtonsContainer() {
        const container = document.createElement('div');
        container.className = CSS_CLASSES.mainButtons;

        const mainButtons = this.configManager.getMainButtons();
        mainButtons.forEach(buttonConfig => {
            const button = this.createMainButton(buttonConfig);
            container.appendChild(button);
            this.buttonElements.set(buttonConfig.id, button);
        });

        return container;
    }

    /**
     * Create markdown buttons container
     * @returns {HTMLElement} Container element with markdown buttons
     * @private
     */
    createMarkdownButtonsContainer() {
        const container = document.createElement('div');
        container.className = CSS_CLASSES.markdownButtons;

        const markdownButtons = this.configManager.getMarkdownButtons();
        markdownButtons.forEach(buttonConfig => {
            const button = this.createMarkdownButton(buttonConfig);
            container.appendChild(button);
            this.buttonElements.set(buttonConfig.id, button);
        });

        return container;
    }

    /**
     * Create separator element
     * @returns {HTMLElement} Separator element
     * @private
     */
    createSeparator() {
        const separator = document.createElement('div');
        separator.className = CSS_CLASSES.separator;
        return separator;
    }

    /**
     * Create a main button element
     * @param {Object} buttonConfig - Button configuration
     * @returns {HTMLElement} Button element
     * @private
     */
    createMainButton(buttonConfig) {
        const button = document.createElement('button');
        button.id = buttonConfig.id;
        button.className = `${CSS_CLASSES.editorBtn} ${buttonConfig.className}`;
        button.setAttribute('type', 'button');
        button.setAttribute('tabindex', '-1');
        
        // Create tooltip with keyboard shortcut if available
        const tooltipText = this.createTooltipText(buttonConfig);
        button.setAttribute('title', tooltipText);
        
        // Create button content with icon and text
        const buttonContent = document.createElement('span');
        buttonContent.className = CSS_CLASSES.buttonContent;
        buttonContent.innerHTML = `
            <span class="${CSS_CLASSES.buttonIcon}">${buttonConfig.icon}</span>
            <span class="${CSS_CLASSES.buttonText}">${buttonConfig.text}</span>
        `;
        
        button.appendChild(buttonContent);
        return button;
    }

    /**
     * Create a markdown button element
     * @param {Object} buttonConfig - Button configuration
     * @returns {HTMLElement} Button element
     * @private
     */
    createMarkdownButton(buttonConfig) {
        const button = document.createElement('button');
        button.id = buttonConfig.id;
        button.className = `${CSS_CLASSES.editorBtn} ${buttonConfig.className}`;
        button.setAttribute('type', 'button');
        button.setAttribute('tabindex', '-1');
        
        // Create tooltip with keyboard shortcut if available
        const tooltipText = this.createTooltipText(buttonConfig);
        button.setAttribute('title', tooltipText);
        button.setAttribute('data-format-type', buttonConfig.type);
        
        // Create button content with icon
        const buttonContent = document.createElement('span');
        buttonContent.className = `${CSS_CLASSES.buttonContent} ${CSS_CLASSES.markdownContent}`;
        buttonContent.innerHTML = `
            <span class="${CSS_CLASSES.buttonIcon} ${CSS_CLASSES.markdownIcon}">${buttonConfig.icon}</span>
        `;
        
        button.appendChild(buttonContent);
        return button;
    }

    /**
     * Insert the button bar into the DOM
     * @returns {boolean} True if successful, false otherwise
     */
    insertIntoDOM() {
        if (!this.buttonBar) {
            console.error('[ButtonBarRenderer] Button bar not created yet');
            return false;
        }

        if (!this.editorPane) {
            console.error('[ButtonBarRenderer] Could not find editor pane to attach button bar');
            return false;
        }

        this.editorPane.appendChild(this.buttonBar);
        return true;
    }

    /**
     * Show the button bar with animation
     */
    show() {
        if (!this.buttonBar) return;

        const options = this.configManager.getOptions();
        
        // Immediately remove hidden class and add visible class
        this.buttonBar.classList.remove(CSS_CLASSES.buttonBarHidden);
        this.buttonBar.classList.add('visible');
        this.buttonBar.style.opacity = '0';
        this.buttonBar.style.transform = 'translateY(-10px)';
        
        // Trigger animation
        requestAnimationFrame(() => {
            this.buttonBar.style.transition = `opacity ${options.animationDuration}ms ease-out, transform ${options.animationDuration}ms ease-out`;
            this.buttonBar.style.opacity = '1';
            this.buttonBar.style.transform = 'translateY(0)';
        });
    }

    /**
     * Hide the button bar with animation
     */
    hide() {
        if (!this.buttonBar) return;

        const options = this.configManager.getOptions();
        
        // Remove visible class to start fade-out animation
        this.buttonBar.classList.remove('visible');
        
        this.buttonBar.style.transition = `opacity ${options.animationDuration}ms ease-out, transform ${options.animationDuration}ms ease-out`;
        this.buttonBar.style.opacity = '0';
        this.buttonBar.style.transform = 'translateY(-10px)';
        
        // Add hidden class after animation completes to maintain proper visibility state
        setTimeout(() => {
            if (this.buttonBar && !this.buttonBar.classList.contains('visible')) {
                this.buttonBar.classList.add(CSS_CLASSES.buttonBarHidden);
            }
        }, options.animationDuration);
    }

    /**
     * Add a new button to the button bar
     * @param {Object} buttonConfig - Button configuration
     * @param {string} category - Button category ('main', 'markdown', 'custom')
     * @returns {boolean} True if successful, false otherwise
     */
    addButton(buttonConfig, category = 'custom') {
        if (!this.buttonBar) {
            console.error('[ButtonBarRenderer] Button bar not created yet');
            return false;
        }

        let container;
        let button;

        switch (category) {
            case 'main':
                // Convert space-separated classes to proper CSS selector
                const mainSelector = '.' + CSS_CLASSES.mainButtons.split(' ').join('.');
                container = this.buttonBar.querySelector(mainSelector);
                button = this.createMainButton(buttonConfig);
                break;
            case 'markdown':
            case 'custom':
                // Convert space-separated classes to proper CSS selector
                const markdownSelector = '.' + CSS_CLASSES.markdownButtons.split(' ').join('.');
                container = this.buttonBar.querySelector(markdownSelector);
                button = this.createMarkdownButton(buttonConfig);
                break;
            default:
                console.error('[ButtonBarRenderer] Invalid button category:', category);
                return false;
        }

        if (!container) {
            console.error('[ButtonBarRenderer] Could not find container for category:', category);
            return false;
        }

        container.appendChild(button);
        this.buttonElements.set(buttonConfig.id, button);
        return true;
    }

    /**
     * Remove a button from the button bar
     * @param {string} buttonId - Button ID to remove
     * @returns {boolean} True if successful, false otherwise
     */
    removeButton(buttonId) {
        const button = this.buttonElements.get(buttonId);
        if (!button) {
            console.warn('[ButtonBarRenderer] Button not found:', buttonId);
            return false;
        }

        button.remove();
        this.buttonElements.delete(buttonId);
        return true;
    }

    /**
     * Get button element by ID
     * @param {string} buttonId - Button ID
     * @returns {HTMLElement|null} Button element or null if not found
     */
    getButtonElement(buttonId) {
        return this.buttonElements.get(buttonId) || null;
    }

    /**
     * Update button active state
     * @param {string} buttonId - Button ID
     * @param {boolean} isActive - Whether button should be active
     */
    setButtonActive(buttonId, isActive) {
        const button = this.getButtonElement(buttonId);
        if (!button) return;

        if (isActive) {
            button.classList.add(CSS_CLASSES.contextActive);
        } else {
            button.classList.remove(CSS_CLASSES.contextActive);
        }
    }

    /**
     * Clear all button active states
     */
    clearAllActiveStates() {
        this.buttonElements.forEach(button => {
            button.classList.remove(CSS_CLASSES.contextActive);
        });
    }

    /**
     * Create tooltip text with keyboard shortcut
     * @param {Object} buttonConfig - Button configuration
     * @returns {string} Tooltip text
     * @private
     */
    createTooltipText(buttonConfig) {
        // Use custom tooltip if available, otherwise use button text
        let tooltip = buttonConfig.tooltip || buttonConfig.text;
        
        if (buttonConfig.keyboardShortcut) {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const shortcut = isMac ? buttonConfig.keyboardShortcut.keyMac : buttonConfig.keyboardShortcut.key;
            tooltip += ` (${shortcut})`;
        }
        
        return tooltip;
    }

    /**
     * Get the button bar element
     * @returns {HTMLElement|null} Button bar element
     */
    getElement() {
        return this.buttonBar;
    }

    /**
     * Check if button bar is visible
     * @returns {boolean} True if visible, false otherwise
     */
    isVisible() {
        if (!this.buttonBar) return false;
        return this.buttonBar.classList.contains('visible');
    }

    /**
     * Destroy the button bar and clean up references
     */
    destroy() {
        if (this.buttonBar && this.buttonBar.parentNode) {
            this.buttonBar.parentNode.removeChild(this.buttonBar);
        }
        
        this.buttonBar = null;
        this.buttonElements.clear();
    }

    /**
     * Refresh the button bar with current configuration
     */
    refresh() {
        if (!this.buttonBar) return;

        const wasVisible = this.isVisible();
        this.destroy();
        this.createButtonBar();
        this.insertIntoDOM();
        
        if (wasVisible) {
            this.show();
        }
    }
}