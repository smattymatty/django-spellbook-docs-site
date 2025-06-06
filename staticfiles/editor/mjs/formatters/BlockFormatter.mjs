// static/mjs/formatters/BlockFormatter.mjs

import { MarkdownFormatter } from './MarkdownFormatter.mjs';

export class BlockFormatter extends MarkdownFormatter {
    constructor(editorElement) {
        super(editorElement);
        
        this.supportedFormats = [
            'header1',
            'header2', 
            'header3',
            'orderedList',
            'unorderedList',
            'codeBlock'
        ];
        
        this.formatConfig = {
            header1: { syntax: '# ', pattern: /^# / },
            header2: { syntax: '## ', pattern: /^## / },
            header3: { syntax: '### ', pattern: /^### / },
            orderedList: { syntax: '1. ', pattern: /^\d+\. / },
            unorderedList: { syntax: '- ', pattern: /^- |^\* / },
            codeBlock: { syntax: '```', pattern: /^```/ }
        };
    }

    /**
     * Format text with block-level markdown
     * @param {string} formatType - Type of formatting to apply
     * @param {Object} options - Additional options
     */
    format(formatType, options = {}) {
        if (!this.validateFormatType(formatType)) {
            console.warn(`[BlockFormatter] Unsupported format type: ${formatType}`);
            return;
        }

        const config = this.formatConfig[formatType];
        if (!config) return;

        switch (formatType) {
            case 'header1':
            case 'header2':
            case 'header3':
                this.formatHeader(config, options);
                break;
            case 'orderedList':
            case 'unorderedList':
                this.formatList(config, options);
                break;
            case 'codeBlock':
                this.formatCodeBlock(config, options);
                break;
            default:
                console.warn(`[BlockFormatter] No handler for format type: ${formatType}`);
        }
    }

    /**
     * Format header
     * @param {Object} config - Format configuration
     * @param {Object} options - Additional options
     * @private
     */
    formatHeader(config, options = {}) {
        const lineInfo = this.getCurrentLineInfo();
        if (!lineInfo) return;

        const { syntax } = config;
        
        if (this.isCurrentLineEmpty()) {
            // Insert header syntax on empty line
            this.replaceCurrentLine(syntax, syntax.length);
        } else {
            // Check if line already has any header syntax
            const hasExistingHeader = /^#{1,6} /.test(lineInfo.text);
            
            if (hasExistingHeader) {
                // Replace existing header syntax
                const contentWithoutHeader = lineInfo.text.replace(/^#{1,6} /, '');
                this.replaceCurrentLine(syntax + contentWithoutHeader, syntax.length);
            } else {
                // Add header syntax to existing content
                this.replaceCurrentLine(syntax + lineInfo.text, syntax.length);
            }
        }
    }

    /**
     * Format list
     * @param {Object} config - Format configuration
     * @param {Object} options - Additional options
     * @private
     */
    formatList(config, options = {}) {
        const lineInfo = this.getCurrentLineInfo();
        if (!lineInfo) return;

        const { syntax } = config;
        
        if (this.isCurrentLineEmpty()) {
            // Insert list syntax on empty line
            this.replaceCurrentLine(syntax, syntax.length);
        } else {
            // Check if line already has list syntax
            const hasExistingList = /^(\d+\. |- |\* )/.test(lineInfo.text);
            
            if (hasExistingList) {
                // Replace existing list syntax
                const contentWithoutList = lineInfo.text.replace(/^(\d+\. |- |\* )/, '');
                this.replaceCurrentLine(syntax + contentWithoutList, syntax.length);
            } else {
                // Add list syntax to existing content
                this.replaceCurrentLine(syntax + lineInfo.text, syntax.length);
            }
        }
    }

    /**
     * Format code block
     * @param {Object} config - Format configuration
     * @param {Object} options - Additional options
     * @private
     */
    formatCodeBlock(config, options = {}) {
        const textInfo = this.getTextInfo();
        const lineInfo = this.getCurrentLineInfo();
        if (!textInfo || !lineInfo) return;

        const { hasSelection, selectedText } = textInfo;
        
        if (hasSelection) {
            // Wrap selection in code block
            this.wrapSelection('```\n', '\n```', '');
        } else if (this.isCurrentLineEmpty()) {
            // Insert code block template on empty line
            const beforeLine = textInfo.text.substring(0, lineInfo.start);
            const afterLine = textInfo.text.substring(lineInfo.end);
            const newText = beforeLine + '```\n\n```\n' + afterLine;
            const newCursorPosition = lineInfo.start + 4; // Position inside code block
            
            this.applyChanges(newText, newCursorPosition);
        } else {
            // Wrap current line content in code block
            const beforeLine = textInfo.text.substring(0, lineInfo.start);
            const afterLine = textInfo.text.substring(lineInfo.end);
            const newText = beforeLine + '```\n' + lineInfo.text + '\n```\n' + afterLine;
            const newCursorPosition = lineInfo.start + 4; // Position at start of content
            
            this.applyChanges(newText, newCursorPosition);
        }
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

        if (formatType === 'codeBlock') {
            return this.isInsideCodeBlock();
        }

        const lineInfo = this.getCurrentLineInfo();
        if (!lineInfo) return false;

        return config.pattern.test(lineInfo.text);
    }

    /**
     * Check if cursor is inside a code block
     * @returns {boolean} True if inside code block
     * @private
     */
    isInsideCodeBlock() {
        const textInfo = this.getTextInfo();
        if (!textInfo) return false;

        const { text, selectionStart } = textInfo;
        const textBefore = text.substring(0, selectionStart);
        const lines = textBefore.split('\n');
        
        let insideCodeBlock = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.startsWith('```')) {
                insideCodeBlock = !insideCodeBlock;
            }
        }
        
        if (insideCodeBlock) {
            const textAfter = text.substring(selectionStart);
            const hasClosing = textAfter.includes('```');
            return hasClosing;
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
            console.warn(`[BlockFormatter] Format type already exists: ${formatType}`);
            return false;
        }

        if (!config.syntax || !config.pattern) {
            console.error('[BlockFormatter] Invalid format config - missing syntax or pattern');
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
     * Get line prefix for list continuation
     * @param {string} currentLine - Current line text
     * @returns {string|null} Prefix for next line or null
     */
    getListContinuationPrefix(currentLine) {
        if (!currentLine) return null;

        const orderedMatch = currentLine.match(/^(\d+)\. /);
        if (orderedMatch) {
            const nextNumber = parseInt(orderedMatch[1]) + 1;
            return `${nextNumber}. `;
        }

        if (currentLine.match(/^- |^\* /)) {
            return currentLine.match(/^- /) ? '- ' : '* ';
        }

        return null;
    }

    /**
     * Handle enter key for list continuation
     * @returns {boolean} True if handled, false otherwise
     */
    handleEnterKey() {
        const lineInfo = this.getCurrentLineInfo();
        if (!lineInfo) return false;

        const prefix = this.getListContinuationPrefix(lineInfo.text);
        if (!prefix) return false;

        // Check if current line only contains the list prefix
        if (lineInfo.text.trim() === prefix.trim()) {
            // Remove the list prefix and don't continue
            this.replaceCurrentLine('');
            return true;
        }

        // Continue the list on next line
        this.insertText('\n' + prefix, 0);
        return true;
    }
}