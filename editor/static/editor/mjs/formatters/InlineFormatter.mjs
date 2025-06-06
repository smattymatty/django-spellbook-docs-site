// static/mjs/formatters/InlineFormatter.mjs

import { MarkdownFormatter } from './MarkdownFormatter.mjs';

export class InlineFormatter extends MarkdownFormatter {
    constructor(editorElement) {
        super(editorElement);
        
        this.supportedFormats = [
            'bold',
            'italic',
            'code',
            'link',
            'image'
        ];
        
        this.formatConfig = {
            bold: { 
                syntax: '**', 
                pattern: /\*\*.*?\*\*/,
                placeholder: 'bold text'
            },
            italic: { 
                syntax: '*', 
                pattern: /(?<!\*)\*(?!\*).*?(?<!\*)\*(?!\*)/,
                placeholder: 'italic text'
            },
            code: { 
                syntax: '`', 
                pattern: /`.*?`/,
                placeholder: 'code'
            },
            link: { 
                syntax: '[text](url)', 
                pattern: /\[.*?\]\(.*?\)/,
                placeholder: 'link text'
            },
            image: { 
                syntax: '![alt](url)', 
                pattern: /!\[.*?\]\(.*?\)/,
                placeholder: 'alt text'
            }
        };
    }

    /**
     * Format text with inline markdown
     * @param {string} formatType - Type of formatting to apply
     * @param {Object} options - Additional options
     */
    format(formatType, options = {}) {
        if (!this.validateFormatType(formatType)) {
            console.warn(`[InlineFormatter] Unsupported format type: ${formatType}`);
            return;
        }

        const config = this.formatConfig[formatType];
        if (!config) return;

        switch (formatType) {
            case 'bold':
            case 'italic':
            case 'code':
                this.formatSimpleWrapper(config, options);
                break;
            case 'link':
                this.formatLink(config, options);
                break;
            case 'image':
                this.formatImage(config, options);
                break;
            default:
                console.warn(`[InlineFormatter] No handler for format type: ${formatType}`);
        }
    }

    /**
     * Format simple wrapper (bold, italic, code)
     * @param {Object} config - Format configuration
     * @param {Object} options - Additional options
     * @private
     */
    formatSimpleWrapper(config, options = {}) {
        const textInfo = this.getTextInfo();
        if (!textInfo) return;

        const { textBefore, textAfter, selectedText, selectionStart, selectionEnd, hasSelection } = textInfo;
        const { syntax, placeholder } = config;
        
        let newText, newCursorStart, newCursorEnd;
        
        if (hasSelection) {
            // Wrap selected text
            newText = textBefore + syntax + selectedText + syntax + textAfter;
            newCursorStart = selectionStart + syntax.length;
            newCursorEnd = selectionEnd + syntax.length;
        } else {
            // Insert wrapper with placeholder
            const content = placeholder || '';
            newText = textBefore + syntax + content + syntax + textAfter;
            newCursorStart = selectionStart + syntax.length;
            newCursorEnd = newCursorStart + content.length;
        }
        
        this.applyChanges(newText, newCursorStart, newCursorEnd);
    }

    /**
     * Format link
     * @param {Object} config - Format configuration
     * @param {Object} options - Additional options
     * @private
     */
    formatLink(config, options = {}) {
        const textInfo = this.getTextInfo();
        if (!textInfo) return;

        const { textBefore, textAfter, selectedText, selectionStart, selectionEnd, hasSelection } = textInfo;
        
        let newText, newCursorStart, newCursorEnd;
        
        if (hasSelection) {
            // Use selected text as link text
            newText = textBefore + '[' + selectedText + '](url)' + textAfter;
            newCursorStart = selectionStart + selectedText.length + 3;
            newCursorEnd = newCursorStart + 3; // Select 'url'
        } else {
            // Insert link template
            newText = textBefore + '[text](url)' + textAfter;
            newCursorStart = selectionStart + 1;
            newCursorEnd = newCursorStart + 4; // Select 'text'
        }
        
        this.applyChanges(newText, newCursorStart, newCursorEnd);
    }

    /**
     * Format image
     * @param {Object} config - Format configuration
     * @param {Object} options - Additional options
     * @private
     */
    formatImage(config, options = {}) {
        const textInfo = this.getTextInfo();
        if (!textInfo) return;

        const { textBefore, textAfter, selectedText, selectionStart, selectionEnd, hasSelection } = textInfo;
        
        let newText, newCursorStart, newCursorEnd;
        
        if (hasSelection) {
            // Use selected text as alt text
            newText = textBefore + '![' + selectedText + '](url)' + textAfter;
            newCursorStart = selectionStart + selectedText.length + 4;
            newCursorEnd = newCursorStart + 3; // Select 'url'
        } else {
            // Insert image template
            newText = textBefore + '![alt](url)' + textAfter;
            newCursorStart = selectionStart + 2;
            newCursorEnd = newCursorStart + 3; // Select 'alt'
        }
        
        this.applyChanges(newText, newCursorStart, newCursorEnd);
    }

    /**
     * Check if formatting is active at cursor position
     * @param {string} formatType - Type of formatting to check
     * @returns {boolean} True if formatting is active
     */
    isActive(formatType) {
        if (!this.validateFormatType(formatType)) return false;

        const config = this.formatConfig[formatType];
        if (!config) return false;

        switch (formatType) {
            case 'bold':
                return this.isInsideMarkdown('**');
            case 'italic':
                return this.isInsideMarkdown('*', '**');
            case 'code':
                return this.isInsideMarkdown('`', '```');
            case 'link':
            case 'image':
                return this.isInsideLinkOrImage(formatType);
            default:
                return false;
        }
    }

    /**
     * Check if cursor is inside markdown formatting
     * @param {string} marker - Markdown marker
     * @param {string} excludeMarker - Marker to exclude
     * @returns {boolean} True if inside markdown
     * @private
     */
    isInsideMarkdown(marker, excludeMarker = null) {
        const textInfo = this.getTextInfo();
        if (!textInfo) return false;

        const contextRange = 20;
        const { text, selectionStart } = textInfo;
        const contextStart = Math.max(0, selectionStart - contextRange);
        const contextEnd = Math.min(text.length, selectionStart + contextRange);
        const context = text.substring(contextStart, contextEnd);
        const relativePos = selectionStart - contextStart;

        return this.isPositionInsideMarkdown(context, relativePos, marker, excludeMarker);
    }

    /**
     * Check if position is inside markdown formatting
     * @param {string} text - Text to analyze
     * @param {number} position - Position to check
     * @param {string} marker - Markdown marker
     * @param {string} excludeMarker - Marker to exclude
     * @returns {boolean} True if inside markdown
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
     * Check if cursor is inside link or image
     * @param {string} formatType - 'link' or 'image'
     * @returns {boolean} True if inside link/image
     * @private
     */
    isInsideLinkOrImage(formatType) {
        const textInfo = this.getTextInfo();
        if (!textInfo) return false;

        const { text, selectionStart } = textInfo;
        const contextRange = 100; // Larger range for links/images
        const contextStart = Math.max(0, selectionStart - contextRange);
        const contextEnd = Math.min(text.length, selectionStart + contextRange);
        const context = text.substring(contextStart, contextEnd);
        const relativePos = selectionStart - contextStart;

        const pattern = formatType === 'image' ? /!\[.*?\]\(.*?\)/g : /(?<!!)(?!\[[^\]]*\]\([^)]*\))\[.*?\]\(.*?\)/g;
        
        let match;
        while ((match = pattern.exec(context)) !== null) {
            if (relativePos >= match.index && relativePos <= match.index + match[0].length) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get available format types for this formatter
     * @returns {Array} Array of format type strings
     */
    getSupportedFormats() {
        return [...this.supportedFormats];
    }

    /**
     * Get format configuration
     * @param {string} formatType - Format type
     * @returns {Object|null} Format configuration
     */
    getFormatConfig(formatType) {
        return this.formatConfig[formatType] || null;
    }

    /**
     * Add custom format type
     * @param {string} formatType - Format type name
     * @param {Object} config - Format configuration
     * @returns {boolean} True if added successfully
     */
    addCustomFormat(formatType, config) {
        if (this.supportedFormats.includes(formatType)) {
            console.warn(`[InlineFormatter] Format type already exists: ${formatType}`);
            return false;
        }

        if (!config.syntax || !config.pattern) {
            console.error('[InlineFormatter] Invalid format config - missing syntax or pattern');
            return false;
        }

        this.supportedFormats.push(formatType);
        this.formatConfig[formatType] = config;
        return true;
    }

    /**
     * Remove custom format type
     * @param {string} formatType - Format type to remove
     * @returns {boolean} True if removed successfully
     */
    removeCustomFormat(formatType) {
        const index = this.supportedFormats.indexOf(formatType);
        if (index === -1) return false;

        this.supportedFormats.splice(index, 1);
        delete this.formatConfig[formatType];
        return true;
    }

    /**
     * Toggle formatting at cursor position
     * @param {string} formatType - Format type to toggle
     * @returns {boolean} True if formatting was applied, false if removed
     */
    toggle(formatType) {
        if (!this.validateFormatType(formatType)) return false;

        if (this.isActive(formatType)) {
            this.removeFormatting(formatType);
            return false;
        } else {
            this.format(formatType);
            return true;
        }
    }

    /**
     * Remove formatting around cursor
     * @param {string} formatType - Format type to remove
     * @private
     */
    removeFormatting(formatType) {
        const textInfo = this.getTextInfo();
        if (!textInfo) return;

        const config = this.formatConfig[formatType];
        if (!config) return;

        // This is a simplified implementation
        // In a full implementation, you would need to find and remove the specific markers
        console.log(`[InlineFormatter] Remove formatting not fully implemented for: ${formatType}`);
    }

    /**
     * Get text selection info for formatting
     * @returns {Object|null} Selection information
     */
    getSelectionInfo() {
        const textInfo = this.getTextInfo();
        if (!textInfo) return null;

        const { selectionStart, selectionEnd, selectedText } = textInfo;
        
        return {
            hasSelection: selectionStart !== selectionEnd,
            isEmpty: selectedText.trim() === '',
            isMultiline: selectedText.includes('\n'),
            length: selectedText.length,
            start: selectionStart,
            end: selectionEnd
        };
    }

    /**
     * Check if selection is valid for formatting
     * @param {string} formatType - Format type to check
     * @returns {boolean} True if selection is valid
     */
    isValidSelection(formatType) {
        const selectionInfo = this.getSelectionInfo();
        if (!selectionInfo) return false;

        // Inline formatting generally shouldn't span multiple lines
        if (selectionInfo.isMultiline && formatType !== 'link' && formatType !== 'image') {
            return false;
        }

        return true;
    }
}