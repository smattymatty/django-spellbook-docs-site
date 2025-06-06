// editor/static/mjs/utils/EditorLogger.mjs

/**
 * Centralized logging utility for editor functionality
 * Provides consistent logging with configurable levels and formatting
 */
class EditorLogger {
    constructor(config = {}) {
        this.enabled = config.enabled !== undefined ? config.enabled : true;
        this.prefix = config.prefix || 'EditorLogger';
        this.logLevel = config.logLevel || 'info';
        
        // Log level hierarchy
        this.levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        };
        
        this.currentLevel = this.levels[this.logLevel] || this.levels.info;
    }
    
    /**
     * Format log message with timestamp and prefix
     */
    _formatMessage(level, message, context = null) {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${this.prefix}]`;
        const levelStr = level.toUpperCase();
        
        let formattedMessage = `${prefix} ${levelStr} ${timestamp} - ${message}`;
        
        if (context) {
            formattedMessage += ` | Context: ${JSON.stringify(context)}`;
        }
        
        return formattedMessage;
    }
    
    /**
     * Check if log level should be output
     */
    _shouldLog(level) {
        return this.enabled && this.levels[level] >= this.currentLevel;
    }
    
    /**
     * Debug level logging
     */
    debug(message, context = null) {
        if (this._shouldLog('debug')) {
            console.debug(this._formatMessage('debug', message, context));
        }
    }
    
    /**
     * Info level logging
     */
    info(message, context = null) {
        if (this._shouldLog('info')) {
            console.log(this._formatMessage('info', message, context));
        }
    }
    
    /**
     * Warning level logging
     */
    warn(message, context = null) {
        if (this._shouldLog('warn')) {
            console.warn(this._formatMessage('warn', message, context));
        }
    }
    
    /**
     * Error level logging
     */
    error(message, context = null) {
        if (this._shouldLog('error')) {
            console.error(this._formatMessage('error', message, context));
        }
    }
    
    /**
     * Log editor focus events
     */
    logFocus(elementId) {
        this.info(`Editor "${elementId}" GAINED focus`);
    }
    
    /**
     * Log editor blur events
     */
    logBlur(elementId) {
        this.info(`Editor "${elementId}" LOST focus (blurred)`);
    }
    
    /**
     * Log element discovery
     */
    logElementFound(elementId, elementType) {
        this.debug(`${elementType} element found`, { elementId });
    }
    
    /**
     * Log element not found
     */
    logElementNotFound(elementId, elementType, severity = 'warn') {
        const message = `${elementType} element with ID "${elementId}" was not found`;
        if (severity === 'error') {
            this.error(message);
        } else {
            this.warn(message);
        }
    }
    
    /**
     * Log initialization events
     */
    logInitialization(componentName, status = 'started') {
        this.info(`${componentName} initialization ${status}`);
    }
    
    /**
     * Log cleanup events
     */
    logCleanup(componentName, details = null) {
        this.info(`${componentName} cleanup completed`, details);
    }
    
    /**
     * Log event listener registration
     */
    logEventListener(action, eventType, elementId) {
        this.debug(`${action} ${eventType} listener`, { elementId });
    }
    
    /**
     * Log style operations
     */
    logStyleOperation(operation, elementId, className) {
        this.debug(`Style operation: ${operation}`, { elementId, className });
    }
    
    /**
     * Change log level at runtime
     */
    setLogLevel(level) {
        if (this.levels.hasOwnProperty(level)) {
            this.logLevel = level;
            this.currentLevel = this.levels[level];
            this.info(`Log level changed to: ${level}`);
        } else {
            this.warn(`Invalid log level: ${level}`);
        }
    }
    
    /**
     * Enable or disable logging
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        if (enabled) {
            this.info('Logging enabled');
        }
    }
    
    /**
     * Create a child logger with different prefix
     */
    createChild(childPrefix) {
        return new EditorLogger({
            enabled: this.enabled,
            prefix: `${this.prefix}:${childPrefix}`,
            logLevel: this.logLevel
        });
    }
    
    /**
     * Performance timing utility
     */
    time(label) {
        if (this._shouldLog('debug')) {
            console.time(`${this.prefix}:${label}`);
        }
    }
    
    /**
     * End performance timing
     */
    timeEnd(label) {
        if (this._shouldLog('debug')) {
            console.timeEnd(`${this.prefix}:${label}`);
        }
    }
}

export default EditorLogger;