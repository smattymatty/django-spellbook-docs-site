// editor/static/mjs/editor/ElementValidator.mjs

/**
 * Element validation utility for editor functionality
 * Handles DOM element discovery, validation, and error reporting
 */
class ElementValidator {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
        this.validatedElements = new Map();
    }
    
    /**
     * Validate and get editor element
     */
    validateEditor() {
        const editorId = this.config.get('selectors.editor');
        const element = document.getElementById(editorId);
        
        if (!element) {
            this.logger.logElementNotFound(editorId, 'Editor', 'error');
            throw new Error(`Editor element with ID "${editorId}" was not found`);
        }
        
        // Validate element type
        if (element.tagName.toLowerCase() !== 'textarea') {
            this.logger.error(`Editor element must be a textarea, found: ${element.tagName}`);
            throw new Error(`Editor element must be a textarea`);
        }
        
        this.logger.logElementFound(editorId, 'Editor');
        this.validatedElements.set('editor', element);
        return element;
    }
    
    /**
     * Validate and get preview element
     */
    validatePreview() {
        const previewId = this.config.get('selectors.preview');
        const element = document.getElementById(previewId);
        
        if (!element) {
            this.logger.logElementNotFound(previewId, 'Preview', 'warn');
            this.validatedElements.set('preview', null);
            return null;
        }
        
        this.logger.logElementFound(previewId, 'Preview');
        this.validatedElements.set('preview', element);
        return element;
    }
    
    /**
     * Validate all required elements
     */
    validateAll() {
        const results = {
            editor: null,
            preview: null,
            errors: [],
            warnings: []
        };
        
        try {
            results.editor = this.validateEditor();
        } catch (error) {
            results.errors.push(error.message);
        }
        
        try {
            results.preview = this.validatePreview();
            if (!results.preview) {
                results.warnings.push('Preview element not found - some features may not work');
            }
        } catch (error) {
            results.warnings.push(error.message);
        }
        
        return results;
    }
    
    /**
     * Get previously validated element
     */
    getValidatedElement(elementType) {
        return this.validatedElements.get(elementType);
    }
    
    /**
     * Check if element exists in DOM
     */
    elementExists(elementId) {
        return document.getElementById(elementId) !== null;
    }
    
    /**
     * Validate element has required attributes
     */
    validateElementAttributes(element, requiredAttributes = []) {
        const missing = [];
        
        for (const attr of requiredAttributes) {
            if (!element.hasAttribute(attr)) {
                missing.push(attr);
            }
        }
        
        if (missing.length > 0) {
            this.logger.warn(`Element missing required attributes: ${missing.join(', ')}`);
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate element is visible and interactable
     */
    validateElementAccessibility(element) {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        const isInViewport = rect.top >= 0 && rect.left >= 0 && 
                           rect.bottom <= window.innerHeight && 
                           rect.right <= window.innerWidth;
        
        const results = {
            isVisible,
            isInViewport,
            isDisabled: element.disabled,
            hasDisplay: getComputedStyle(element).display !== 'none',
            hasVisibility: getComputedStyle(element).visibility !== 'hidden'
        };
        
        if (!isVisible) {
            this.logger.warn('Element is not visible', { elementId: element.id });
        }
        
        if (!isInViewport) {
            this.logger.debug('Element is not in viewport', { elementId: element.id });
        }
        
        return results;
    }
    
    /**
     * Wait for element to appear in DOM
     */
    async waitForElement(elementId, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.getElementById(elementId);
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver((mutations) => {
                const element = document.getElementById(elementId);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${elementId} not found within ${timeout}ms`));
            }, timeout);
        });
    }
    
    /**
     * Clear validation cache
     */
    clearCache() {
        this.validatedElements.clear();
        this.logger.debug('Element validation cache cleared');
    }
    
    /**
     * Get validation summary
     */
    getValidationSummary() {
        const summary = {
            validatedElements: Array.from(this.validatedElements.keys()),
            totalValidated: this.validatedElements.size,
            hasEditor: this.validatedElements.has('editor'),
            hasPreview: this.validatedElements.has('preview')
        };
        
        return summary;
    }
}

export default ElementValidator;