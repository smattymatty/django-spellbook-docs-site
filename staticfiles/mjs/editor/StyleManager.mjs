// editor/static/mjs/editor/StyleManager.mjs

/**
 * Style management utility for editor functionality
 * Handles CSS class application, transitions, and style-related operations
 */
class StyleManager {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
        this.appliedStyles = new Map();
        this.transitionTimeouts = new Map();
    }
    
    /**
     * Apply focused styles to editor and preview elements
     */
    applyFocusedStyles(editorElement, previewElement) {
        if (!editorElement) {
            this.logger.warn('Cannot apply focused styles: editor element is null');
            return false;
        }
        
        const editorClass = this.config.get('cssClasses.editorFocused');
        const previewClass = this.config.get('cssClasses.previewSquashed');
        
        try {
            // Apply editor focused class
            this._addClass(editorElement, editorClass);
            this.appliedStyles.set('editor', editorClass);
            
            // Apply preview squashed class if preview element exists
            if (previewElement) {
                this._addClass(previewElement, previewClass);
                this.appliedStyles.set('preview', previewClass);
            }
            
            this.logger.logStyleOperation('Applied focused styles', editorElement.id, `${editorClass}, ${previewClass}`);
            return true;
            
        } catch (error) {
            this.logger.error('Failed to apply focused styles', { error: error.message });
            return false;
        }
    }
    
    /**
     * Remove focused styles from editor and preview elements
     */
    removeFocusedStyles(editorElement, previewElement) {
        if (!editorElement) {
            this.logger.warn('Cannot remove focused styles: editor element is null');
            return false;
        }
        
        const editorClass = this.config.get('cssClasses.editorFocused');
        const previewClass = this.config.get('cssClasses.previewSquashed');
        
        try {
            // Remove editor focused class
            this._removeClass(editorElement, editorClass);
            this.appliedStyles.delete('editor');
            
            // Remove preview squashed class if preview element exists
            if (previewElement) {
                this._removeClass(previewElement, previewClass);
                this.appliedStyles.delete('preview');
            }
            
            this.logger.logStyleOperation('Removed focused styles', editorElement.id, `${editorClass}, ${previewClass}`);
            return true;
            
        } catch (error) {
            this.logger.error('Failed to remove focused styles', { error: error.message });
            return false;
        }
    }
    
    /**
     * Add CSS class to element with validation
     */
    _addClass(element, className) {
        if (!element || !className) {
            throw new Error('Element and className are required');
        }
        
        if (!element.classList.contains(className)) {
            element.classList.add(className);
            this.logger.debug(`Added class "${className}" to element`, { elementId: element.id });
        }
    }
    
    /**
     * Remove CSS class from element with validation
     */
    _removeClass(element, className) {
        if (!element || !className) {
            throw new Error('Element and className are required');
        }
        
        if (element.classList.contains(className)) {
            element.classList.remove(className);
            this.logger.debug(`Removed class "${className}" from element`, { elementId: element.id });
        }
    }
    
    /**
     * Toggle CSS class on element
     */
    toggleClass(element, className) {
        if (!element || !className) {
            this.logger.warn('Cannot toggle class: element or className is missing');
            return false;
        }
        
        try {
            const wasPresent = element.classList.contains(className);
            element.classList.toggle(className);
            
            const action = wasPresent ? 'Removed' : 'Added';
            this.logger.debug(`${action} class "${className}" on element`, { elementId: element.id });
            
            return !wasPresent; // Returns true if class was added
        } catch (error) {
            this.logger.error('Failed to toggle class', { error: error.message, className });
            return false;
        }
    }
    
    /**
     * Apply multiple classes to an element
     */
    applyClasses(element, classNames = []) {
        if (!element) {
            this.logger.warn('Cannot apply classes: element is null');
            return false;
        }
        
        const applied = [];
        const failed = [];
        
        for (const className of classNames) {
            try {
                this._addClass(element, className);
                applied.push(className);
            } catch (error) {
                failed.push(className);
                this.logger.warn(`Failed to apply class "${className}"`, { error: error.message });
            }
        }
        
        this.logger.debug('Applied multiple classes', {
            elementId: element.id,
            applied,
            failed: failed.length > 0 ? failed : undefined
        });
        
        return failed.length === 0;
    }
    
    /**
     * Remove multiple classes from an element
     */
    removeClasses(element, classNames = []) {
        if (!element) {
            this.logger.warn('Cannot remove classes: element is null');
            return false;
        }
        
        const removed = [];
        const failed = [];
        
        for (const className of classNames) {
            try {
                this._removeClass(element, className);
                removed.push(className);
            } catch (error) {
                failed.push(className);
                this.logger.warn(`Failed to remove class "${className}"`, { error: error.message });
            }
        }
        
        this.logger.debug('Removed multiple classes', {
            elementId: element.id,
            removed,
            failed: failed.length > 0 ? failed : undefined
        });
        
        return failed.length === 0;
    }
    
    /**
     * Check if element has specific class
     */
    hasClass(element, className) {
        if (!element || !className) {
            return false;
        }
        
        return element.classList.contains(className);
    }
    
    /**
     * Apply styles with transition delay
     */
    applyStylesWithDelay(element, classNames, delay = 0) {
        if (delay === 0) {
            return this.applyClasses(element, classNames);
        }
        
        const timeoutId = setTimeout(() => {
            this.applyClasses(element, classNames);
            this.transitionTimeouts.delete(element);
        }, delay);
        
        // Store timeout for cleanup
        this.transitionTimeouts.set(element, timeoutId);
        
        this.logger.debug('Scheduled style application', {
            elementId: element.id,
            classNames,
            delay
        });
        
        return true;
    }
    
    /**
     * Remove styles with transition delay
     */
    removeStylesWithDelay(element, classNames, delay = 0) {
        if (delay === 0) {
            return this.removeClasses(element, classNames);
        }
        
        const timeoutId = setTimeout(() => {
            this.removeClasses(element, classNames);
            this.transitionTimeouts.delete(element);
        }, delay);
        
        // Store timeout for cleanup
        this.transitionTimeouts.set(element, timeoutId);
        
        this.logger.debug('Scheduled style removal', {
            elementId: element.id,
            classNames,
            delay
        });
        
        return true;
    }
    
    /**
     * Get current applied styles summary
     */
    getAppliedStylesSummary() {
        const summary = {
            totalApplied: this.appliedStyles.size,
            styles: Object.fromEntries(this.appliedStyles),
            pendingTransitions: this.transitionTimeouts.size
        };
        
        return summary;
    }
    
    /**
     * Clear all pending transitions
     */
    clearPendingTransitions() {
        for (const [element, timeoutId] of this.transitionTimeouts) {
            clearTimeout(timeoutId);
        }
        this.transitionTimeouts.clear();
        this.logger.debug('Cleared all pending style transitions');
    }
    
    /**
     * Cleanup method for memory management
     */
    cleanup() {
        this.clearPendingTransitions();
        this.appliedStyles.clear();
        this.logger.logCleanup('StyleManager');
    }
    
    /**
     * Reset all applied styles to their default state
     */
    resetAllStyles(editorElement, previewElement) {
        this.logger.debug('Resetting all applied styles');
        
        // Clear any pending transitions first
        this.clearPendingTransitions();
        
        // Remove all tracked styles
        for (const [elementType, className] of this.appliedStyles) {
            const element = elementType === 'editor' ? editorElement : previewElement;
            if (element && className) {
                this._removeClass(element, className);
            }
        }
        
        this.appliedStyles.clear();
        this.logger.debug('All styles reset to default state');
    }
}

export default StyleManager;