// editor/static/mjs/editor/EditorConfig.mjs

/**
 * Configuration object for editor functionality
 * Contains all configurable values that were previously hard-coded
 */
class EditorConfig {
    constructor(customConfig = {}) {
        // Default configuration
        this.defaults = {
            // Element selectors
            selectors: {
                editor: 'markdown-input',
                preview: 'live-preview-area'
            },
            
            // CSS classes for styling
            cssClasses: {
                editorFocused: 'editor-pane-focused',
                previewSquashed: 'preview-pane-squashed'
            },
            
            // Logging configuration
            logging: {
                enabled: true,
                prefix: 'EditorManager',
                logLevel: 'info' // debug, info, warn, error
            },
            
            // Button bar configuration
            buttonBar: {
                enabled: true,
                showOnFocus: true,
                hideOnBlur: true
            },
            
            // Event configuration
            events: {
                debounceDelay: 100,
                enableFocusLogging: true,
                enableBlurLogging: true
            },
            
            // Performance settings
            performance: {
                enableCleanup: true,
                memoryLeakPrevention: true
            }
        };
        
        // Merge custom configuration with defaults
        this.config = this._mergeConfig(this.defaults, customConfig);
    }
    
    /**
     * Deep merge configuration objects
     */
    _mergeConfig(defaults, custom) {
        const result = { ...defaults };
        
        for (const key in custom) {
            if (custom[key] && typeof custom[key] === 'object' && !Array.isArray(custom[key])) {
                result[key] = this._mergeConfig(defaults[key] || {}, custom[key]);
            } else {
                result[key] = custom[key];
            }
        }
        
        return result;
    }
    
    /**
     * Get configuration value by path (e.g., 'selectors.editor')
     */
    get(path) {
        return path.split('.').reduce((obj, key) => obj && obj[key], this.config);
    }
    
    /**
     * Set configuration value by path
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => {
            if (!obj[key]) obj[key] = {};
            return obj[key];
        }, this.config);
        
        target[lastKey] = value;
    }
    
    /**
     * Get all configuration
     */
    getAll() {
        return { ...this.config };
    }
    
    /**
     * Validate configuration
     */
    validate() {
        const errors = [];
        
        // Validate required selectors
        if (!this.get('selectors.editor')) {
            errors.push('selectors.editor is required');
        }
        
        if (!this.get('selectors.preview')) {
            errors.push('selectors.preview is required');
        }
        
        // Validate CSS classes
        if (!this.get('cssClasses.editorFocused')) {
            errors.push('cssClasses.editorFocused is required');
        }
        
        if (!this.get('cssClasses.previewSquashed')) {
            errors.push('cssClasses.previewSquashed is required');
        }
        
        // Validate log level
        const validLogLevels = ['debug', 'info', 'warn', 'error'];
        const logLevel = this.get('logging.logLevel');
        if (logLevel && !validLogLevels.includes(logLevel)) {
            errors.push(`Invalid log level: ${logLevel}. Must be one of: ${validLogLevels.join(', ')}`);
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    /**
     * Create configuration from environment or defaults
     */
    static createDefault(customConfig = {}) {
        return new EditorConfig(customConfig);
    }
    
    /**
     * Create configuration for testing
     */
    static createForTesting() {
        return new EditorConfig({
            logging: {
                enabled: false
            },
            events: {
                enableFocusLogging: false,
                enableBlurLogging: false
            }
        });
    }
}

export default EditorConfig;