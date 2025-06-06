// static/mjs/button_bar.mjs

class EditorButtonBar {
    constructor(editorElement, options = {}) {
        this.editorElement = editorElement;
        this.editorPane = editorElement.closest('.editor-pane');
        this.isVisible = false;
        
        // Configuration options
        this.options = {
            animationDuration: 300,
            fadeDelay: 100,
            ...options
        };

        // Button configurations
        this.buttons = [
            {
                id: 'insert-spellblock-btn',
                text: 'Insert SpellBlock',
                icon: '✨',
                className: 'btn-accent',
                action: () => this.handleInsertSpellBlock()
            }
        ];

        // Markdown formatting buttons
        this.markdownButtons = [
            {
                id: 'header-1-btn',
                text: 'H1',
                icon: 'H₁',
                className: 'btn-markdown',
                type: 'block',
                syntax: '# ',
                action: () => this.handleMarkdownFormat('header1')
            },
            {
                id: 'header-2-btn',
                text: 'H2',
                icon: 'H₂',
                className: 'btn-markdown',
                type: 'block',
                syntax: '## ',
                action: () => this.handleMarkdownFormat('header2')
            },
            {
                id: 'header-3-btn',
                text: 'H3',
                icon: 'H₃',
                className: 'btn-markdown',
                type: 'block',
                syntax: '### ',
                action: () => this.handleMarkdownFormat('header3')
            },
            {
                id: 'bold-btn',
                text: 'Bold',
                icon: 'B',
                className: 'btn-markdown bold',
                type: 'inline',
                syntax: '**',
                action: () => this.handleMarkdownFormat('bold')
            },
            {
                id: 'italic-btn',
                text: 'Italic',
                icon: 'I',
                className: 'btn-markdown italic',
                type: 'inline',
                syntax: '*',
                action: () => this.handleMarkdownFormat('italic')
            },
            {
                id: 'ordered-list-btn',
                text: 'Ordered List',
                icon: '1.',
                className: 'btn-markdown',
                type: 'block',
                syntax: '1. ',
                action: () => this.handleMarkdownFormat('orderedList')
            },
            {
                id: 'unordered-list-btn',
                text: 'Unordered List',
                icon: '•',
                className: 'btn-markdown',
                type: 'block',
                syntax: '- ',
                action: () => this.handleMarkdownFormat('unorderedList')
            },
            {
                id: 'link-btn',
                text: 'Link',
                icon: '🔗',
                className: 'btn-markdown',
                type: 'inline',
                syntax: '[text](url)',
                action: () => this.handleMarkdownFormat('link')
            },
            {
                id: 'image-btn',
                text: 'Image',
                icon: '🖼️',
                className: 'btn-markdown',
                type: 'inline',
                syntax: '![alt](url)',
                action: () => this.handleMarkdownFormat('image')
            },
            {
                id: 'code-btn',
                text: 'Code',
                icon: '<>',
                className: 'btn-markdown',
                type: 'inline',
                syntax: '`',
                action: () => this.handleMarkdownFormat('code')
            },
            {
                id: 'code-block-btn',
                text: 'Code Block',
                icon: '{ }',
                className: 'btn-markdown',
                type: 'block',
                syntax: '```',
                action: () => this.handleMarkdownFormat('codeBlock')
            }
        ];

        this.activeButtons = new Set();
        this.cursorUpdateTimer = null;

        this.init();
    }

    init() {
        try {
            this.createButtonBarHTML();
            this.attachEventListeners();
            console.log('[EditorButtonBar] Initialized successfully');
        } catch (error) {
            console.error('[EditorButtonBar] Initialization error:', error);
        }
    }

    createButtonBarHTML() {
        // Create the main button bar container
        this.buttonBar = document.createElement('div');
        this.buttonBar.id = 'editor-button-bar';
        this.buttonBar.className = 'editor-button-bar hidden';
        
        // Create main buttons container
        const mainButtonsContainer = document.createElement('div');
        mainButtonsContainer.className = 'button-bar-buttons main-buttons';

        // Create each main button
        this.buttons.forEach(buttonConfig => {
            const button = document.createElement('button');
            button.id = buttonConfig.id;
            button.className = `editor-btn ${buttonConfig.className}`;
            button.setAttribute('type', 'button');
            button.setAttribute('title', buttonConfig.text);
            
            // Create button content with icon and text
            const buttonContent = document.createElement('span');
            buttonContent.className = 'button-content';
            buttonContent.innerHTML = `
                <span class="button-icon">${buttonConfig.icon}</span>
                <span class="button-text">${buttonConfig.text}</span>
            `;
            
            button.appendChild(buttonContent);
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                buttonConfig.action();
            });
            
            mainButtonsContainer.appendChild(button);
        });

        // Create separator
        const separator = document.createElement('div');
        separator.className = 'button-bar-separator';

        // Create markdown buttons container
        const markdownButtonsContainer = document.createElement('div');
        markdownButtonsContainer.className = 'button-bar-buttons markdown-buttons';

        // Create each markdown button
        this.markdownButtons.forEach(buttonConfig => {
            const button = document.createElement('button');
            button.id = buttonConfig.id;
            button.className = `editor-btn ${buttonConfig.className}`;
            button.setAttribute('type', 'button');
            button.setAttribute('title', buttonConfig.text);
            button.setAttribute('data-format-type', buttonConfig.type);
            
            // Create button content with icon
            const buttonContent = document.createElement('span');
            buttonContent.className = 'button-content markdown-content';
            buttonContent.innerHTML = `
                <span class="button-icon markdown-icon">${buttonConfig.icon}</span>
            `;
            
            button.appendChild(buttonContent);
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                buttonConfig.action();
            });
            
            markdownButtonsContainer.appendChild(button);
        });

        this.buttonBar.appendChild(mainButtonsContainer);
        this.buttonBar.appendChild(separator);
        this.buttonBar.appendChild(markdownButtonsContainer);
        
        // Insert the button bar into the editor pane
        if (this.editorPane) {
            this.editorPane.appendChild(this.buttonBar);
        } else {
            console.error('[EditorButtonBar] Could not find editor pane to attach button bar');
            return;
        }
    }

    attachEventListeners() {
        // Prevent button bar from disappearing when clicking on it
        this.buttonBar.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        // Handle clicks outside to ensure proper blur behavior
        document.addEventListener('click', (e) => {
            if (!this.editorElement.contains(e.target) && !this.buttonBar.contains(e.target)) {
                this.hide();
            }
        });

        // Track cursor position changes to update button states
        this.editorElement.addEventListener('keyup', () => this.updateButtonStates());
        this.editorElement.addEventListener('mouseup', () => this.updateButtonStates());
        this.editorElement.addEventListener('input', () => this.updateButtonStates());
    }

    show() {
        if (this.isVisible) return;
        
        console.log('[EditorButtonBar] Showing button bar');
        this.isVisible = true;
        
        // Remove hidden class and add visible class
        this.buttonBar.classList.remove('hidden');
        
        // Use requestAnimationFrame to ensure the transition triggers
        requestAnimationFrame(() => {
            this.buttonBar.classList.add('visible');
        });
    }

    hide() {
        if (!this.isVisible) return;
        
        console.log('[EditorButtonBar] Hiding button bar');
        this.isVisible = false;
        
        // Remove visible class
        this.buttonBar.classList.remove('visible');
        
        // Add hidden class after transition completes
        setTimeout(() => {
            if (!this.isVisible) { // Double-check in case show() was called during timeout
                this.buttonBar.classList.add('hidden');
            }
        }, this.options.animationDuration);
    }

    // Button action handlers


    handleInsertSpellBlock() {
        console.log('[EditorButtonBar] Insert SpellBlock clicked');
        
        // Get current cursor position
        const cursorPosition = this.editorElement.selectionStart;
        const textBefore = this.editorElement.value.substring(0, cursorPosition);
        const textAfter = this.editorElement.value.substring(cursorPosition);
        
        // Insert a basic SpellBlock template
        const spellBlockTemplate = `
{% spellblock %}
# Your SpellBlock Title

Your content here...

{% endspellblock %}
`;
        
        // Insert the template at cursor position
        this.editorElement.value = textBefore + spellBlockTemplate + textAfter;
        
        // Set cursor position after the template
        const newCursorPosition = cursorPosition + spellBlockTemplate.length;
        this.editorElement.setSelectionRange(newCursorPosition, newCursorPosition);
        
        // Trigger input event to update the preview
        this.editorElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        
        this.showNotification('SpellBlock template inserted', 'success');
        
        // Focus back on the editor
        this.editorElement.focus();
    }

    // Markdown formatting handler
    handleMarkdownFormat(formatType) {
        console.log(`[EditorButtonBar] ${formatType} formatting clicked`);
        
        // Get the correct button ID
        let buttonId = formatType.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`) + '-btn';
        if (formatType === 'orderedList') {
            buttonId = 'ordered-list-btn';
        } else if (formatType === 'unorderedList') {
            buttonId = 'unordered-list-btn';
        } else if (formatType === 'codeBlock') {
            buttonId = 'code-block-btn';
        }
        
        const buttonConfig = this.markdownButtons.find(btn => btn.action.toString().includes(formatType));
        
        if (buttonConfig.type === 'block') {
            this.handleBlockFormat(formatType, buttonConfig);
        } else {
            this.handleInlineFormat(formatType, buttonConfig);
        }
        
        // Focus back on the editor
        this.editorElement.focus();
    }

    handleBlockFormat(formatType, buttonConfig) {
        if (!this.editorElement || !buttonConfig) return;
        
        const cursorPosition = this.editorElement.selectionStart;
        const text = this.editorElement.value || '';
        const textBefore = text.substring(0, cursorPosition);
        const textAfter = text.substring(cursorPosition);
        
        // Find the current line
        const lineStart = textBefore.lastIndexOf('\n') + 1;
        const lineEnd = text.indexOf('\n', cursorPosition);
        const currentLine = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);
        
        let newText = '';
        let newCursorPosition = cursorPosition;
        
        switch (formatType) {
            case 'header1':
            case 'header2':
            case 'header3':
                // Ensure we're on a new line
                if (currentLine.trim() !== '') {
                    newText = textBefore + '\n' + buttonConfig.syntax;
                    newCursorPosition = textBefore.length + 1 + buttonConfig.syntax.length;
                } else {
                    // Replace current line with header
                    const beforeLine = text.substring(0, lineStart);
                    const afterLine = text.substring(lineEnd === -1 ? text.length : lineEnd);
                    newText = beforeLine + buttonConfig.syntax + afterLine;
                    newCursorPosition = lineStart + buttonConfig.syntax.length;
                }
                break;
                
            case 'orderedList':
            case 'unorderedList':
                // Ensure we're on a new line
                if (currentLine.trim() !== '') {
                    newText = textBefore + '\n' + buttonConfig.syntax;
                    newCursorPosition = textBefore.length + 1 + buttonConfig.syntax.length;
                } else {
                    // Replace current line with list item
                    const beforeLine = text.substring(0, lineStart);
                    const afterLine = text.substring(lineEnd === -1 ? text.length : lineEnd);
                    newText = beforeLine + buttonConfig.syntax + afterLine;
                    newCursorPosition = lineStart + buttonConfig.syntax.length;
                }
                break;
                
            case 'codeBlock':
                // Ensure we're on a new line and add code block
                if (currentLine.trim() !== '') {
                    newText = textBefore + '\n```\n\n```\n' + textAfter;
                    newCursorPosition = textBefore.length + 1 + 4; // Position inside code block
                } else {
                    const beforeLine = text.substring(0, lineStart);
                    const afterLine = text.substring(lineEnd === -1 ? text.length : lineEnd);
                    newText = beforeLine + '```\n\n```\n' + afterLine;
                    newCursorPosition = lineStart + 4; // Position inside code block
                }
                break;
        }
        
        if (newText !== undefined) {
            this.editorElement.value = newText;
            this.editorElement.setSelectionRange(newCursorPosition, newCursorPosition);
            this.editorElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            
            this.toggleActiveButton(formatType);
        }
    }

    handleInlineFormat(formatType, buttonConfig) {
        if (!this.editorElement || !buttonConfig) return;
        
        const selectionStart = this.editorElement.selectionStart;
        const selectionEnd = this.editorElement.selectionEnd;
        const text = this.editorElement.value || '';
        const selectedText = text.substring(selectionStart, selectionEnd);
        const textBefore = text.substring(0, selectionStart);
        const textAfter = text.substring(selectionEnd);
        
        let newText = '';
        let newCursorStart = selectionStart;
        let newCursorEnd = selectionEnd;
        
        switch (formatType) {
            case 'bold':
                if (selectedText) {
                    newText = textBefore + '**' + selectedText + '**' + textAfter;
                    newCursorStart = selectionStart + 2;
                    newCursorEnd = selectionEnd + 2;
                } else {
                    newText = textBefore + '****' + textAfter;
                    newCursorStart = newCursorEnd = selectionStart + 2;
                }
                break;
                
            case 'italic':
                if (selectedText) {
                    newText = textBefore + '*' + selectedText + '*' + textAfter;
                    newCursorStart = selectionStart + 1;
                    newCursorEnd = selectionEnd + 1;
                } else {
                    newText = textBefore + '**' + textAfter;
                    newCursorStart = newCursorEnd = selectionStart + 1;
                }
                break;
                
            case 'code':
                if (selectedText) {
                    newText = textBefore + '`' + selectedText + '`' + textAfter;
                    newCursorStart = selectionStart + 1;
                    newCursorEnd = selectionEnd + 1;
                } else {
                    newText = textBefore + '``' + textAfter;
                    newCursorStart = newCursorEnd = selectionStart + 1;
                }
                break;
                
            case 'link':
                if (selectedText) {
                    newText = textBefore + '[' + selectedText + '](url)' + textAfter;
                    newCursorStart = selectionStart + selectedText.length + 3;
                    newCursorEnd = newCursorStart + 3; // Select 'url'
                } else {
                    newText = textBefore + '[text](url)' + textAfter;
                    newCursorStart = selectionStart + 1;
                    newCursorEnd = newCursorStart + 4; // Select 'text'
                }
                break;
                
            case 'image':
                if (selectedText) {
                    newText = textBefore + '![' + selectedText + '](url)' + textAfter;
                    newCursorStart = selectionStart + selectedText.length + 4;
                    newCursorEnd = newCursorStart + 3; // Select 'url'
                } else {
                    newText = textBefore + '![alt](url)' + textAfter;
                    newCursorStart = selectionStart + 2;
                    newCursorEnd = newCursorStart + 3; // Select 'alt'
                }
                break;
        }
        
        if (newText !== undefined) {
            this.editorElement.value = newText;
            this.editorElement.setSelectionRange(newCursorStart, newCursorEnd);
            this.editorElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            
            this.toggleActiveButton(formatType);
        }
    }

    toggleActiveButton(formatType) {
        let buttonId = formatType.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`) + '-btn';
        if (formatType === 'orderedList') {
            buttonId = 'ordered-list-btn';
        } else if (formatType === 'unorderedList') {
            buttonId = 'unordered-list-btn';
        } else if (formatType === 'codeBlock') {
            buttonId = 'code-block-btn';
        }
        
        const button = document.getElementById(buttonId);
        
        if (button) {
            button.classList.add('active');
            this.activeButtons.add(formatType);
            
            // Auto-remove active state after a short delay
            setTimeout(() => {
                button.classList.remove('active');
                this.activeButtons.delete(formatType);
            }, 1200);
        }
    }

    updateButtonStates() {
        // Debounce cursor position updates
        if (this.cursorUpdateTimer) {
            clearTimeout(this.cursorUpdateTimer);
        }
        
        this.cursorUpdateTimer = setTimeout(() => {
            this.checkCursorFormatting();
        }, 100);
    }

    checkCursorFormatting() {
        if (!this.editorElement) return;
        
        const cursorPosition = this.editorElement.selectionStart;
        const text = this.editorElement.value || '';
        const textBefore = text.substring(0, cursorPosition);
        const textAfter = text.substring(cursorPosition);
        
        // Find current line
        const lineStart = textBefore.lastIndexOf('\n') + 1;
        const lineEnd = text.indexOf('\n', cursorPosition);
        const currentLine = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);
        
        // Clear all active states first
        this.markdownButtons.forEach(btn => {
            const buttonId = btn.id;
            const button = document.getElementById(buttonId);
            if (button) {
                button.classList.remove('context-active');
            }
        });
        
        // Check for block-level formatting
        if (currentLine.startsWith('# ')) {
            document.getElementById('header-1-btn')?.classList.add('context-active');
        } else if (currentLine.startsWith('## ')) {
            document.getElementById('header-2-btn')?.classList.add('context-active');
        } else if (currentLine.startsWith('### ')) {
            document.getElementById('header-3-btn')?.classList.add('context-active');
        } else if (currentLine.match(/^\d+\. /)) {
            document.getElementById('ordered-list-btn')?.classList.add('context-active');
        } else if (currentLine.startsWith('- ') || currentLine.startsWith('* ')) {
            document.getElementById('unordered-list-btn')?.classList.add('context-active');
        }
        
        // Check for inline formatting around cursor
        const contextRange = 20; // Characters to check around cursor
        const contextStart = Math.max(0, cursorPosition - contextRange);
        const contextEnd = Math.min(text.length, cursorPosition + contextRange);
        const context = text.substring(contextStart, contextEnd);
        const relativePos = cursorPosition - contextStart;
        
        // Check if cursor is inside bold text
        if (this.isInsideMarkdown(context, relativePos, '**')) {
            document.getElementById('bold-btn')?.classList.add('context-active');
        }
        
        // Check if cursor is inside italic text
        if (this.isInsideMarkdown(context, relativePos, '*', '**')) {
            document.getElementById('italic-btn')?.classList.add('context-active');
        }
        
        // Check if cursor is inside code
        if (this.isInsideMarkdown(context, relativePos, '`', '```')) {
            document.getElementById('code-btn')?.classList.add('context-active');
        }
        
        // Check if cursor is inside code block
        if (this.isInsideCodeBlock(text, cursorPosition)) {
            document.getElementById('code-block-btn')?.classList.add('context-active');
        }
    }

    isInsideMarkdown(text, position, marker, excludeMarker = null) {
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

    isInsideCodeBlock(text, position) {
        // Find all code block markers before the cursor position
        const textBefore = text.substring(0, position);
        const lines = textBefore.split('\n');
        
        let insideCodeBlock = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check if this line starts or ends a code block
            if (line.startsWith('```')) {
                insideCodeBlock = !insideCodeBlock;
            }
        }
        
        // Also check if there's a closing ``` after the cursor
        if (insideCodeBlock) {
            const textAfter = text.substring(position);
            const hasClosing = textAfter.includes('```');
            return hasClosing;
        }
        
        return false;
    }

    showNotification(message, type = 'info') {
        // Create a simple notification system
        const notification = document.createElement('div');
        notification.className = `editor-notification notification-${type}`;
        notification.textContent = message;
        
        // Position it near the button bar
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '10000';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '4px';
        notification.style.color = 'white';
        notification.style.fontSize = '14px';
        notification.style.fontWeight = '500';
        notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        notification.style.transform = 'translateY(-10px)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease-in-out';
        
        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(-10px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Public method to get button bar element (for external access if needed)
    getElement() {
        return this.buttonBar;
    }

    // Public method to check visibility state
    isButtonBarVisible() {
        return this.isVisible;
    }

    // Public method to add custom buttons
    addButton(buttonConfig) {
        this.buttons.push(buttonConfig);
        // Recreate the button bar to include the new button
        if (this.buttonBar) {
            this.buttonBar.remove();
            this.createButtonBarHTML();
        }
    }

    // Public method to remove buttons
    removeButton(buttonId) {
        this.buttons = this.buttons.filter(btn => btn.id !== buttonId);
        // Recreate the button bar without the removed button
        if (this.buttonBar) {
            this.buttonBar.remove();
            this.createButtonBarHTML();
        }
    }
}

export default EditorButtonBar;