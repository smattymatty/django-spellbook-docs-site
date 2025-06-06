// static/mjs/formatters/MarkdownFormatter.mjs

export class MarkdownFormatter {
    constructor(editorElement) {
        this.editorElement = editorElement;
    }

    /**
     * Get current text and cursor information
     * @returns {Object} Text and cursor information
     * @protected
     */
    getTextInfo() {
        if (!this.editorElement) return null;
        
        const text = this.editorElement.value || '';
        const selectionStart = this.editorElement.selectionStart || 0;
        const selectionEnd = this.editorElement.selectionEnd || 0;
        const selectedText = text.substring(selectionStart, selectionEnd);
        const textBefore = text.substring(0, selectionStart);
        const textAfter = text.substring(selectionEnd);
        
        return {
            text,
            selectionStart,
            selectionEnd,
            selectedText,
            textBefore,
            textAfter,
            hasSelection: selectionStart !== selectionEnd
        };
    }

    /**
     * Get current line information
     * @returns {Object} Line information
     * @protected
     */
    getCurrentLineInfo() {
        const textInfo = this.getTextInfo();
        if (!textInfo) return null;
        
        const { text, selectionStart } = textInfo;
        const textBefore = text.substring(0, selectionStart);
        
        const lineStart = textBefore.lastIndexOf('\n') + 1;
        const lineEnd = text.indexOf('\n', selectionStart);
        const currentLine = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);
        
        return {
            text: currentLine,
            start: lineStart,
            end: lineEnd === -1 ? text.length : lineEnd,
            cursorOffset: selectionStart - lineStart
        };
    }

    /**
     * Apply text changes to the editor
     * @param {string} newText - New text content
     * @param {number} newCursorStart - New cursor start position
     * @param {number} newCursorEnd - New cursor end position
     * @protected
     */
    applyChanges(newText, newCursorStart, newCursorEnd = null) {
        if (!this.editorElement) return;
        
        this.editorElement.value = newText;
        this.editorElement.setSelectionRange(newCursorStart, newCursorEnd || newCursorStart);
        this.editorElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    }

    /**
     * Check if cursor is at start of line
     * @returns {boolean} True if at start of line
     * @protected
     */
    isAtStartOfLine() {
        const lineInfo = this.getCurrentLineInfo();
        return lineInfo ? lineInfo.cursorOffset === 0 : false;
    }

    /**
     * Check if current line is empty
     * @returns {boolean} True if line is empty
     * @protected
     */
    isCurrentLineEmpty() {
        const lineInfo = this.getCurrentLineInfo();
        return lineInfo ? lineInfo.text.trim() === '' : true;
    }

    /**
     * Insert text at cursor position
     * @param {string} textToInsert - Text to insert
     * @param {number} cursorOffset - Offset for cursor position after insertion
     * @protected
     */
    insertText(textToInsert, cursorOffset = 0) {
        const textInfo = this.getTextInfo();
        if (!textInfo) return;
        
        const { textBefore, textAfter, selectionStart } = textInfo;
        const newText = textBefore + textToInsert + textAfter;
        const newCursorPosition = selectionStart + textToInsert.length + cursorOffset;
        
        this.applyChanges(newText, newCursorPosition);
    }

    /**
     * Replace selected text or insert at cursor
     * @param {string} replacement - Text to replace with
     * @param {number} cursorOffset - Offset for cursor position
     * @protected
     */
    replaceSelection(replacement, cursorOffset = 0) {
        const textInfo = this.getTextInfo();
        if (!textInfo) return;
        
        const { textBefore, textAfter, selectionStart } = textInfo;
        const newText = textBefore + replacement + textAfter;
        const newCursorPosition = selectionStart + replacement.length + cursorOffset;
        
        this.applyChanges(newText, newCursorPosition);
    }

    /**
     * Wrap selected text with markers
     * @param {string} startMarker - Starting marker
     * @param {string} endMarker - Ending marker (defaults to startMarker)
     * @param {string} placeholder - Placeholder text if no selection
     * @protected
     */
    wrapSelection(startMarker, endMarker = null, placeholder = '') {
        const textInfo = this.getTextInfo();
        if (!textInfo) return;
        
        const { textBefore, textAfter, selectedText, selectionStart, hasSelection } = textInfo;
        const endMarkerText = endMarker || startMarker;
        
        let newText, newCursorStart, newCursorEnd;
        
        if (hasSelection) {
            newText = textBefore + startMarker + selectedText + endMarkerText + textAfter;
            newCursorStart = selectionStart + startMarker.length;
            newCursorEnd = newCursorStart + selectedText.length;
        } else {
            const content = placeholder || '';
            newText = textBefore + startMarker + content + endMarkerText + textAfter;
            newCursorStart = selectionStart + startMarker.length;
            newCursorEnd = newCursorStart + content.length;
        }
        
        this.applyChanges(newText, newCursorStart, newCursorEnd);
    }

    /**
     * Replace current line with new content
     * @param {string} newLineContent - New line content
     * @param {number} cursorOffset - Cursor offset within new line
     * @protected
     */
    replaceCurrentLine(newLineContent, cursorOffset = null) {
        const textInfo = this.getTextInfo();
        const lineInfo = this.getCurrentLineInfo();
        if (!textInfo || !lineInfo) return;
        
        const { text } = textInfo;
        const beforeLine = text.substring(0, lineInfo.start);
        const afterLine = text.substring(lineInfo.end);
        
        const newText = beforeLine + newLineContent + afterLine;
        const newCursorPosition = lineInfo.start + (cursorOffset !== null ? cursorOffset : newLineContent.length);
        
        this.applyChanges(newText, newCursorPosition);
    }

    /**
     * Ensure cursor is on a new line and insert content
     * @param {string} content - Content to insert
     * @param {number} cursorOffset - Cursor offset after insertion
     * @protected
     */
    insertOnNewLine(content, cursorOffset = 0) {
        const lineInfo = this.getCurrentLineInfo();
        if (!lineInfo) return;
        
        if (lineInfo.text.trim() !== '') {
            this.insertText('\n' + content, cursorOffset);
        } else {
            this.replaceCurrentLine(content, content.length + cursorOffset);
        }
    }

    /**
     * Format text - to be implemented by subclasses
     * @param {string} formatType - Type of formatting to apply
     * @param {Object} options - Additional options
     * @abstract
     */
    format(formatType, options = {}) {
        throw new Error('format method must be implemented by subclass');
    }

    /**
     * Check if formatting is active at cursor position
     * @param {string} formatType - Type of formatting to check
     * @returns {boolean} True if formatting is active
     * @abstract
     */
    isActive(formatType) {
        throw new Error('isActive method must be implemented by subclass');
    }

    /**
     * Get available format types for this formatter
     * @returns {Array} Array of format type strings
     * @abstract
     */
    getSupportedFormats() {
        throw new Error('getSupportedFormats method must be implemented by subclass');
    }

    /**
     * Validate format type
     * @param {string} formatType - Format type to validate
     * @returns {boolean} True if valid
     * @protected
     */
    validateFormatType(formatType) {
        return this.getSupportedFormats().includes(formatType);
    }

    /**
     * Get cursor position after formatting
     * @param {string} formatType - Format type
     * @param {Object} options - Format options
     * @returns {number} Cursor position
     * @protected
     */
    getCursorPositionAfterFormat(formatType, options = {}) {
        // Default implementation - can be overridden
        return this.editorElement ? this.editorElement.selectionStart : 0;
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.editorElement = null;
    }
}