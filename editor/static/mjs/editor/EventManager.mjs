// editor/static/mjs/editor/EventManager.mjs

/**
 * Event management utility for editor functionality
 * Handles event listener registration, cleanup, and event coordination
 */
class EventManager {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
        this.registeredEvents = new Map();
        this.eventHandlers = new Map();
        this.isCleanedUp = false;
    }
    
    /**
     * Register focus event listener
     */
    registerFocusListener(element, callback) {
        if (!element || typeof callback !== 'function') {
            this.logger.warn('Cannot register focus listener: invalid element or callback');
            return false;
        }
        
        const wrappedCallback = (event) => {
            if (this.config.get('events.enableFocusLogging')) {
                this.logger.logFocus(element.id);
            }
            callback(event);
        };
        
        return this._addEventListener(element, 'focus', wrappedCallback, 'focus');
    }
    
    /**
     * Register blur event listener
     */
    registerBlurListener(element, callback) {
        if (!element || typeof callback !== 'function') {
            this.logger.warn('Cannot register blur listener: invalid element or callback');
            return false;
        }
        
        const wrappedCallback = (event) => {
            if (this.config.get('events.enableBlurLogging')) {
                this.logger.logBlur(element.id);
            }
            callback(event);
        };
        
        return this._addEventListener(element, 'blur', wrappedCallback, 'blur');
    }
    
    /**
     * Register keyup event listener with debouncing
     */
    registerKeyupListener(element, callback, debounceDelay = null) {
        if (!element || typeof callback !== 'function') {
            this.logger.warn('Cannot register keyup listener: invalid element or callback');
            return false;
        }
        
        const delay = debounceDelay || this.config.get('events.debounceDelay') || 100;
        const debouncedCallback = this._debounce(callback, delay);
        
        return this._addEventListener(element, 'keyup', debouncedCallback, 'keyup');
    }
    
    /**
     * Register mouseup event listener
     */
    registerMouseupListener(element, callback) {
        if (!element || typeof callback !== 'function') {
            this.logger.warn('Cannot register mouseup listener: invalid element or callback');
            return false;
        }
        
        return this._addEventListener(element, 'mouseup', callback, 'mouseup');
    }
    
    /**
     * Register input event listener with debouncing
     */
    registerInputListener(element, callback, debounceDelay = null) {
        if (!element || typeof callback !== 'function') {
            this.logger.warn('Cannot register input listener: invalid element or callback');
            return false;
        }
        
        const delay = debounceDelay || this.config.get('events.debounceDelay') || 100;
        const debouncedCallback = this._debounce(callback, delay);
        
        return this._addEventListener(element, 'input', debouncedCallback, 'input');
    }
    
    /**
     * Register custom event listener
     */
    registerCustomListener(element, eventType, callback, options = {}) {
        if (!element || !eventType || typeof callback !== 'function') {
            this.logger.warn('Cannot register custom listener: invalid parameters');
            return false;
        }
        
        const { debounce = false, debounceDelay = null } = options;
        let finalCallback = callback;
        
        if (debounce) {
            const delay = debounceDelay || this.config.get('events.debounceDelay') || 100;
            finalCallback = this._debounce(callback, delay);
        }
        
        return this._addEventListener(element, eventType, finalCallback, `custom-${eventType}`);
    }
    
    /**
     * Internal method to add event listener with tracking
     */
    _addEventListener(element, eventType, callback, listenerKey) {
        try {
            element.addEventListener(eventType, callback);
            
            // Track the listener for cleanup
            const elementKey = this._getElementKey(element);
            if (!this.registeredEvents.has(elementKey)) {
                this.registeredEvents.set(elementKey, new Map());
            }
            
            this.registeredEvents.get(elementKey).set(listenerKey, {
                element,
                eventType,
                callback,
                registeredAt: new Date()
            });
            
            this.logger.logEventListener('Attached', eventType, element.id);
            return true;
            
        } catch (error) {
            this.logger.error('Failed to register event listener', {
                eventType,
                elementId: element.id,
                error: error.message
            });
            return false;
        }
    }
    
    /**
     * Remove specific event listener
     */
    removeEventListener(element, listenerKey) {
        const elementKey = this._getElementKey(element);
        const elementEvents = this.registeredEvents.get(elementKey);
        
        if (!elementEvents || !elementEvents.has(listenerKey)) {
            this.logger.warn('Event listener not found for removal', { elementId: element.id, listenerKey });
            return false;
        }
        
        const listenerInfo = elementEvents.get(listenerKey);
        
        try {
            element.removeEventListener(listenerInfo.eventType, listenerInfo.callback);
            elementEvents.delete(listenerKey);
            
            // Clean up empty element entries
            if (elementEvents.size === 0) {
                this.registeredEvents.delete(elementKey);
            }
            
            this.logger.logEventListener('Removed', listenerInfo.eventType, element.id);
            return true;
            
        } catch (error) {
            this.logger.error('Failed to remove event listener', {
                elementId: element.id,
                listenerKey,
                error: error.message
            });
            return false;
        }
    }
    
    /**
     * Remove all event listeners for an element
     */
    removeAllListenersForElement(element) {
        const elementKey = this._getElementKey(element);
        const elementEvents = this.registeredEvents.get(elementKey);
        
        if (!elementEvents) {
            this.logger.debug('No event listeners found for element', { elementId: element.id });
            return;
        }
        
        const listenersToRemove = Array.from(elementEvents.keys());
        
        for (const listenerKey of listenersToRemove) {
            this.removeEventListener(element, listenerKey);
        }
        
        this.logger.debug('Removed all event listeners for element', { 
            elementId: element.id, 
            count: listenersToRemove.length 
        });
    }
    
    /**
     * Get unique key for element tracking
     */
    _getElementKey(element) {
        return element.id || `element_${element.tagName}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Debounce utility function
     */
    _debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    /**
     * Get event listeners summary
     */
    getEventListenersSummary() {
        const summary = {
            totalElements: this.registeredEvents.size,
            totalListeners: 0,
            byElement: {}
        };
        
        for (const [elementKey, elementEvents] of this.registeredEvents) {
            summary.totalListeners += elementEvents.size;
            summary.byElement[elementKey] = {
                listenerCount: elementEvents.size,
                listeners: Array.from(elementEvents.keys())
            };
        }
        
        return summary;
    }
    
    /**
     * Check if specific listener is registered
     */
    hasListener(element, listenerKey) {
        const elementKey = this._getElementKey(element);
        const elementEvents = this.registeredEvents.get(elementKey);
        return elementEvents ? elementEvents.has(listenerKey) : false;
    }
    
    /**
     * Dispatch custom event
     */
    dispatchCustomEvent(element, eventType, detail = null) {
        if (!element || !eventType) {
            this.logger.warn('Cannot dispatch event: invalid element or event type');
            return false;
        }
        
        try {
            const customEvent = new CustomEvent(eventType, {
                detail,
                bubbles: true,
                cancelable: true
            });
            
            element.dispatchEvent(customEvent);
            this.logger.debug('Dispatched custom event', { elementId: element.id, eventType, detail });
            return true;
            
        } catch (error) {
            this.logger.error('Failed to dispatch custom event', {
                elementId: element.id,
                eventType,
                error: error.message
            });
            return false;
        }
    }
    
    /**
     * Cleanup all event listeners
     */
    cleanup() {
        if (this.isCleanedUp) {
            this.logger.warn('EventManager already cleaned up');
            return;
        }
        
        const summary = this.getEventListenersSummary();
        this.logger.debug('Starting event listeners cleanup', summary);
        
        // Remove all registered event listeners
        for (const [elementKey, elementEvents] of this.registeredEvents) {
            for (const [listenerKey, listenerInfo] of elementEvents) {
                try {
                    listenerInfo.element.removeEventListener(listenerInfo.eventType, listenerInfo.callback);
                } catch (error) {
                    this.logger.warn('Error during listener cleanup', {
                        elementKey,
                        listenerKey,
                        error: error.message
                    });
                }
            }
        }
        
        // Clear all tracking data
        this.registeredEvents.clear();
        this.eventHandlers.clear();
        this.isCleanedUp = true;
        
        this.logger.logCleanup('EventManager', {
            originalListeners: summary.totalListeners,
            originalElements: summary.totalElements
        });
    }
    
    /**
     * Check if EventManager has been cleaned up
     */
    isDestroyed() {
        return this.isCleanedUp;
    }
}

export default EventManager;