// static/mjs/button_bar/ButtonConfigManager.mjs

import { MAIN_BUTTONS, MARKDOWN_BUTTONS, BUTTON_CONFIG_DEFAULTS } from '../config/button_configs.mjs';

export class ButtonConfigManager {
    constructor(options = {}) {
        this.options = { ...BUTTON_CONFIG_DEFAULTS, ...options };
        this.mainButtons = [...MAIN_BUTTONS];
        this.markdownButtons = [...MARKDOWN_BUTTONS];
        this.customButtons = [];
    }

    /**
     * Get all main buttons
     * @returns {Array} Array of main button configurations
     */
    getMainButtons() {
        return this.mainButtons;
    }

    /**
     * Get all markdown buttons
     * @returns {Array} Array of markdown button configurations
     */
    getMarkdownButtons() {
        return this.markdownButtons;
    }

    /**
     * Get all custom buttons
     * @returns {Array} Array of custom button configurations
     */
    getCustomButtons() {
        return this.customButtons;
    }

    /**
     * Get button configuration by ID
     * @param {string} buttonId - The button ID to find
     * @returns {Object|null} Button configuration or null if not found
     */
    getButtonById(buttonId) {
        const allButtons = [...this.mainButtons, ...this.markdownButtons, ...this.customButtons];
        return allButtons.find(button => button.id === buttonId) || null;
    }

    /**
     * Get buttons by type
     * @param {string} type - Button type ('block' or 'inline')
     * @returns {Array} Array of buttons matching the type
     */
    getButtonsByType(type) {
        return this.markdownButtons.filter(button => button.type === type);
    }

    /**
     * Get buttons by format type
     * @param {string} formatType - Format type (e.g., 'bold', 'italic', 'header1')
     * @returns {Array} Array of buttons matching the format type
     */
    getButtonsByFormatType(formatType) {
        return this.markdownButtons.filter(button => button.formatType === formatType);
    }

    /**
     * Add a custom button
     * @param {Object} buttonConfig - Button configuration object
     * @returns {boolean} True if added successfully, false otherwise
     */
    addButton(buttonConfig) {
        if (!this.validateButtonConfig(buttonConfig)) {
            console.error('[ButtonConfigManager] Invalid button configuration:', buttonConfig);
            return false;
        }

        // Check if button with same ID already exists
        if (this.getButtonById(buttonConfig.id)) {
            console.warn('[ButtonConfigManager] Button with ID already exists:', buttonConfig.id);
            return false;
        }

        this.customButtons.push(buttonConfig);
        return true;
    }

    /**
     * Remove a button by ID
     * @param {string} buttonId - The button ID to remove
     * @returns {boolean} True if removed successfully, false otherwise
     */
    removeButton(buttonId) {
        const initialLength = this.customButtons.length;
        this.customButtons = this.customButtons.filter(button => button.id !== buttonId);
        return this.customButtons.length < initialLength;
    }

    /**
     * Update button configuration
     * @param {string} buttonId - The button ID to update
     * @param {Object} updates - Properties to update
     * @returns {boolean} True if updated successfully, false otherwise
     */
    updateButton(buttonId, updates) {
        const button = this.getButtonById(buttonId);
        if (!button) {
            console.warn('[ButtonConfigManager] Button not found:', buttonId);
            return false;
        }

        Object.assign(button, updates);
        return true;
    }

    /**
     * Get configuration options
     * @returns {Object} Configuration options
     */
    getOptions() {
        return this.options;
    }

    /**
     * Update configuration options
     * @param {Object} newOptions - New options to merge
     */
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
    }

    /**
     * Validate button configuration
     * @param {Object} buttonConfig - Button configuration to validate
     * @returns {boolean} True if valid, false otherwise
     * @private
     */
    validateButtonConfig(buttonConfig) {
        const requiredFields = ['id', 'text', 'icon', 'className', 'action'];
        
        for (const field of requiredFields) {
            if (!buttonConfig[field]) {
                console.error(`[ButtonConfigManager] Missing required field: ${field}`);
                return false;
            }
        }

        // Validate ID format
        if (typeof buttonConfig.id !== 'string' || buttonConfig.id.trim() === '') {
            console.error('[ButtonConfigManager] Invalid button ID');
            return false;
        }

        // Validate action
        if (typeof buttonConfig.action !== 'string') {
            console.error('[ButtonConfigManager] Invalid action type');
            return false;
        }

        // Validate markdown button specific fields
        if (buttonConfig.type && !['block', 'inline'].includes(buttonConfig.type)) {
            console.error('[ButtonConfigManager] Invalid button type, must be "block" or "inline"');
            return false;
        }

        return true;
    }

    /**
     * Reset to default configuration
     */
    reset() {
        this.mainButtons = [...MAIN_BUTTONS];
        this.markdownButtons = [...MARKDOWN_BUTTONS];
        this.customButtons = [];
        this.options = { ...BUTTON_CONFIG_DEFAULTS };
    }

    /**
     * Get all buttons grouped by category
     * @returns {Object} Object with main, markdown, and custom button arrays
     */
    getAllButtonsGrouped() {
        return {
            main: this.mainButtons,
            markdown: this.markdownButtons,
            custom: this.customButtons
        };
    }

    /**
     * Get flat array of all buttons
     * @returns {Array} Array of all button configurations
     */
    getAllButtons() {
        return [...this.mainButtons, ...this.markdownButtons, ...this.customButtons];
    }

    /**
     * Check if a button exists
     * @param {string} buttonId - The button ID to check
     * @returns {boolean} True if button exists, false otherwise
     */
    hasButton(buttonId) {
        return this.getButtonById(buttonId) !== null;
    }

    /**
     * Get button count by category
     * @returns {Object} Object with counts for each category
     */
    getButtonCounts() {
        return {
            main: this.mainButtons.length,
            markdown: this.markdownButtons.length,
            custom: this.customButtons.length,
            total: this.mainButtons.length + this.markdownButtons.length + this.customButtons.length
        };
    }
}