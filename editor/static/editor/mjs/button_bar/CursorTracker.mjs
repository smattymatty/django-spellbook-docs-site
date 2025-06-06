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
     * Check if cursor is inside a SpellBlock
     * @returns {Object|null} SpellBlock information if inside, null otherwise
     */
    isInsideSpellBlock() {
        if (!this.editorElement) return null;
        
        const text = this.editorElement.value || '';
        const cursorPosition = this.getCursorPosition();
        
        return this.getSpellBlockAtPosition(text, cursorPosition);
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
     * Get SpellBlock information at cursor position
     * @param {string} text - Text to analyze
     * @param {number} position - Position to check
     * @returns {Object|null} SpellBlock info if inside, null otherwise
     * @private
     */
    getSpellBlockAtPosition(text, position) {
        const textBefore = text.substring(0, position);
        const textAfter = text.substring(position);
        
        // First check if cursor is within opening tag parameters
        const withinOpeningTag = this.checkWithinOpeningTag(text, position);
        if (withinOpeningTag) {
            return withinOpeningTag;
        }
        
        // Regex to match SpellBlock opening tags: {~ blockname ~} (supports multi-line attributes)
        const openingRegex = /\{~\s*([^~]+?)\s*~\}/gs;
        // Regex to match SpellBlock closing tags: {~~}
        const closingRegex = /\{~~\}/g;
        
        let openings = [];
        let closings = [];
        let match;
        
        // Find all opening tags before cursor
        while ((match = openingRegex.exec(textBefore)) !== null) {
            // Extract block name (first word before any attributes)
            const fullContent = match[1].trim();
            const blockName = fullContent.split(/\s/)[0] || 'SpellBlock';
            
            openings.push({
                blockName: blockName,
                fullContent: fullContent,
                start: match.index,
                end: match.index + match[0].length,
                fullMatch: match[0]
            });
        }
        
        // Find all closing tags before cursor
        while ((match = closingRegex.exec(textBefore)) !== null) {
            closings.push({
                position: match.index,
                end: match.index + match[0].length
            });
        }
        
        // Check if we have more openings than closings (cursor is inside a block)
        if (openings.length > closings.length) {
            const lastOpening = openings[openings.length - 1];
            
            // Verify there's a closing tag after cursor position
            const hasClosingAfter = closingRegex.test(textAfter);
            
            if (hasClosingAfter) {
                // Find the exact closing tag position
                closingRegex.lastIndex = 0; // Reset regex
                const closingMatch = closingRegex.exec(textAfter);
                const closingPosition = position + closingMatch.index;
                
                return {
                    isInside: true,
                    blockName: lastOpening.blockName,
                    openingTag: {
                        start: lastOpening.start,
                        end: lastOpening.end,
                        text: lastOpening.fullMatch
                    },
                    closingTag: {
                        start: closingPosition,
                        end: closingPosition + closingMatch[0].length,
                        text: closingMatch[0]
                    },
                    content: {
                        start: lastOpening.end,
                        end: closingPosition,
                        text: text.substring(lastOpening.end, closingPosition)
                    },
                    cursorOffset: position - lastOpening.end
                };
            }
        }
        
        return null;
    }

    /**
     * Check if cursor is within SpellBlock opening tag parameters
     * @param {string} text - Text to analyze
     * @param {number} position - Position to check
     * @returns {Object|null} SpellBlock info if within opening tag, null otherwise
     * @private
     */
    checkWithinOpeningTag(text, position) {
        // Look backwards and forwards to find potential opening tag boundaries
        const textBefore = text.substring(0, position);
        const textAfter = text.substring(position);
        
        // Find the most recent {~ before cursor
        const lastOpenStart = textBefore.lastIndexOf('{~');
        if (lastOpenStart === -1) return null;
        
        // Find the next ~} after the {~ (could be after cursor)
        const remainingText = text.substring(lastOpenStart);
        const closeMatch = remainingText.match(/~\}/);
        if (!closeMatch) return null;
        
        const closeEnd = lastOpenStart + closeMatch.index + 2; // +2 for ~}
        
        // Check if cursor is between {~ and ~}
        if (position >= lastOpenStart + 2 && position <= closeEnd) {
            // Extract the content between {~ and ~}
            const tagContent = text.substring(lastOpenStart + 2, closeEnd - 2).trim();
            const blockName = tagContent.split(/\s/)[0] || 'SpellBlock';
            
            // Check if there's a corresponding closing tag after this opening tag
            const afterClosingTag = text.substring(closeEnd);
            const hasClosingTag = /\{~~\}/.test(afterClosingTag);
            
            if (hasClosingTag) {
                const closingMatch = afterClosingTag.match(/\{~~\}/);
                const closingPosition = closeEnd + closingMatch.index;
                
                return {
                    isInside: true,
                    isWithinOpeningTag: true,
                    blockName: blockName,
                    openingTag: {
                        start: lastOpenStart,
                        end: closeEnd,
                        text: text.substring(lastOpenStart, closeEnd)
                    },
                    closingTag: {
                        start: closingPosition,
                        end: closingPosition + 4, // {~~} is 4 characters
                        text: '{~~}'
                    },
                    content: {
                        start: closeEnd,
                        end: closingPosition,
                        text: text.substring(closeEnd, closingPosition)
                    },
                    cursorOffset: position - lastOpenStart
                };
            }
        }
        
        return null;
    }

    /**
     * Get formatting context at cursor position
     * @returns {Object} Formatting context information
     */
    getFormattingContext() {
        const line = this.getCurrentLine();
        const context = this.getCursorContext();
        const spellBlock = this.isInsideSpellBlock();
        
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
            
            // SpellBlock formatting
            isSpellBlock: !!spellBlock,
            spellBlock: spellBlock,
            
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