// static/mjs/button_bar/CursorTracker.mjs

export class CursorTracker {
    constructor(editorElement, options = {}) {
        this.editorElement = editorElement;
        this.options = {
            contextRange: 20,
            updateThrottle: 100,
            ...options
        };
        
        this.lastCursorPosition = -1;
        this.lastSelectionStart = -1;
        this.lastSelectionEnd = -1;
        this.updateTimer = null;
        this.callbacks = new Set();
    }

    /**
     * Get current cursor position
     * @returns {number} Current cursor position
     */
    getCursorPosition() {
        if (!this.editorElement) return -1;
        return this.editorElement.selectionStart || 0;
    }

    /**
     * Get current selection range
     * @returns {Object} Selection range with start and end positions
     */
    getSelectionRange() {
        if (!this.editorElement) return { start: -1, end: -1 };
        
        return {
            start: this.editorElement.selectionStart || 0,
            end: this.editorElement.selectionEnd || 0
        };
    }

    /**
     * Get text around cursor position
     * @param {number} range - Number of characters to include around cursor
     * @returns {Object} Context object with text and relative position
     */
    getCursorContext(range = this.options.contextRange) {
        if (!this.editorElement) return null;
        
        const text = this.editorElement.value || '';
        const cursorPosition = this.getCursorPosition();
        
        const contextStart = Math.max(0, cursorPosition - range);
        const contextEnd = Math.min(text.length, cursorPosition + range);
        const contextText = text.substring(contextStart, contextEnd);
        const relativePosition = cursorPosition - contextStart;
        
        return {
            text: contextText,
            position: relativePosition,
            absoluteStart: contextStart,
            absoluteEnd: contextEnd,
            cursorPosition: cursorPosition
        };
    }

    /**
     * Get current line information
     * @returns {Object} Line information object
     */
    getCurrentLine() {
        if (!this.editorElement) return null;
        
        const text = this.editorElement.value || '';
        const cursorPosition = this.getCursorPosition();
        const textBefore = text.substring(0, cursorPosition);
        
        const lineStart = textBefore.lastIndexOf('\n') + 1;
        const lineEnd = text.indexOf('\n', cursorPosition);
        const currentLine = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);
        
        return {
            text: currentLine,
            start: lineStart,
            end: lineEnd === -1 ? text.length : lineEnd,
            cursorOffset: cursorPosition - lineStart
        };
    }

    /**
     * Check if cursor is inside markdown formatting
     * @param {string} marker - Markdown marker to check for
     * @param {string} excludeMarker - Marker to exclude from counting
     * @returns {boolean} True if cursor is inside markdown formatting
     */
    isInsideMarkdown(marker, excludeMarker = null) {
        const context = this.getCursorContext();
        if (!context) return false;
        
        return this.isPositionInsideMarkdown(context.text, context.position, marker, excludeMarker);
    }

    /**
     * Check if a position is inside markdown formatting
     * @param {string} text - Text to analyze
     * @param {number} position - Position to check
     * @param {string} marker - Markdown marker
     * @param {string} excludeMarker - Marker to exclude
     * @returns {boolean} True if position is inside markdown
     * @private
     */
    isPositionInsideMarkdown(text, position, marker, excludeMarker = null) {
        let count = 0;
        let i = 0;
        
        while (i < position) {
            if (excludeMarker && text.substring(i, i + excludeMarker.length) === excludeMarker) {
                i += excludeMarker.length;
                continue;
            }
            
            if (text.substring(i, i + marker.length) === marker) {
                count++;
                i += marker.length;
            } else {
                i++;
            }
        }
        
        return count % 2 === 1;
    }

    /**
     * Check if cursor is inside a code block
     * @returns {boolean} True if cursor is inside code block
     */
    isInsideCodeBlock() {
        if (!this.editorElement) return false;
        
        const text = this.editorElement.value || '';
        const cursorPosition = this.getCursorPosition();
        
        return this.isPositionInsideCodeBlock(text, cursorPosition);
    }

    /**
     * Check if a position is inside a code block
     * @param {string} text - Text to analyze
     * @param {number} position - Position to check
     * @returns {boolean} True if position is inside code block
     * @private
     */
    isPositionInsideCodeBlock(text, position) {
        const textBefore = text.substring(0, position);
        const lines = textBefore.split('\n');
        
        let insideCodeBlock = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.startsWith('```')) {
                insideCodeBlock = !insideCodeBlock;
            }
        }
        
        if (insideCodeBlock) {
            const textAfter = text.substring(position);
            const hasClosing = textAfter.includes('```');
            return hasClosing;
        }
        
        return false;
    }

    /**
     * Get formatting context at cursor position
     * @returns {Object} Formatting context information
     */
    getFormattingContext() {
        const line = this.getCurrentLine();
        const context = this.getCursorContext();
        
        if (!line || !context) return null;
        
        const formatting = {
            // Block-level formatting
            isHeader1: line.text.startsWith('# '),
            isHeader2: line.text.startsWith('## '),
            isHeader3: line.text.startsWith('### '),
            isOrderedList: /^\d+\. /.test(line.text),
            isUnorderedList: line.text.startsWith('- ') || line.text.startsWith('* '),
            
            // Inline formatting
            isBold: this.isPositionInsideMarkdown(context.text, context.position, '**'),
            isItalic: this.isPositionInsideMarkdown(context.text, context.position, '*', '**'),
            isCode: this.isPositionInsideMarkdown(context.text, context.position, '`', '```'),
            isCodeBlock: this.isInsideCodeBlock(),
            
            // Context information
            line: line,
            context: context
        };
        
        return formatting;
    }

    /**
     * Check if cursor position has changed
     * @returns {boolean} True if position changed since last check
     */
    hasPositionChanged() {
        const currentPosition = this.getCursorPosition();
        const selection = this.getSelectionRange();
        
        const changed = currentPosition !== this.lastCursorPosition ||
                       selection.start !== this.lastSelectionStart ||
                       selection.end !== this.lastSelectionEnd;
        
        if (changed) {
            this.lastCursorPosition = currentPosition;
            this.lastSelectionStart = selection.start;
            this.lastSelectionEnd = selection.end;
        }
        
        return changed;
    }

    /**
     * Add callback for cursor position changes
     * @param {Function} callback - Callback function to call on position change
     */
    addChangeCallback(callback) {
        if (typeof callback === 'function') {
            this.callbacks.add(callback);
        }
    }

    /**
     * Remove callback for cursor position changes
     * @param {Function} callback - Callback function to remove
     */
    removeChangeCallback(callback) {
        this.callbacks.delete(callback);
    }

    /**
     * Start tracking cursor position changes
     */
    startTracking() {
        if (!this.editorElement) return;
        
        const handleChange = () => {
            if (this.hasPositionChanged()) {
                const context = this.getFormattingContext();
                this.callbacks.forEach(callback => {
                    try {
                        callback(context);
                    } catch (error) {
                        console.error('[CursorTracker] Error in callback:', error);
                    }
                });
            }
        };
        
        const throttledHandler = this.throttle(handleChange, this.options.updateThrottle);
        
        // Listen for various events that might change cursor position
        this.editorElement.addEventListener('input', throttledHandler);
        this.editorElement.addEventListener('keyup', throttledHandler);
        this.editorElement.addEventListener('mouseup', throttledHandler);
        this.editorElement.addEventListener('focus', throttledHandler);
        this.editorElement.addEventListener('selectionchange', throttledHandler);
        
        // Store handlers for cleanup
        this.handlers = {
            input: throttledHandler,
            keyup: throttledHandler,
            mouseup: throttledHandler,
            focus: throttledHandler,
            selectionchange: throttledHandler
        };
    }

    /**
     * Stop tracking cursor position changes
     */
    stopTracking() {
        if (!this.editorElement || !this.handlers) return;
        
        Object.entries(this.handlers).forEach(([event, handler]) => {
            this.editorElement.removeEventListener(event, handler);
        });
        
        this.handlers = null;
        
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
            this.updateTimer = null;
        }
    }

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} Throttled function
     * @private
     */
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return (...args) => {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    /**
     * Get word at cursor position
     * @returns {Object|null} Word information object
     */
    getWordAtCursor() {
        if (!this.editorElement) return null;
        
        const text = this.editorElement.value || '';
        const cursorPosition = this.getCursorPosition();
        
        // Find word boundaries
        let start = cursorPosition;
        let end = cursorPosition;
        
        // Move start backwards to find word beginning
        while (start > 0 && /\w/.test(text[start - 1])) {
            start--;
        }
        
        // Move end forwards to find word ending
        while (end < text.length && /\w/.test(text[end])) {
            end++;
        }
        
        if (start === end) return null;
        
        return {
            text: text.substring(start, end),
            start: start,
            end: end,
            cursorOffset: cursorPosition - start
        };
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stopTracking();
        this.callbacks.clear();
        this.editorElement = null;
    }
}