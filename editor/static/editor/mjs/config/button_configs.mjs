// static/mjs/config/button_configs.mjs

export const MAIN_BUTTONS = [
    {
        id: 'insert-spellblock-btn',
        text: 'Insert SpellBlock',
        icon: '✨',
        className: 'btn-accent',
        action: 'handleInsertSpellBlock'
    }
];

export const MARKDOWN_BUTTONS = [
    {
        id: 'header-1-btn',
        text: 'H1',
        icon: 'H₁',
        className: 'btn-markdown',
        type: 'block',
        syntax: '# ',
        action: 'handleMarkdownFormat',
        formatType: 'header1'
    },
    {
        id: 'header-2-btn',
        text: 'H2',
        icon: 'H₂',
        className: 'btn-markdown',
        type: 'block',
        syntax: '## ',
        action: 'handleMarkdownFormat',
        formatType: 'header2'
    },
    {
        id: 'header-3-btn',
        text: 'H3',
        icon: 'H₃',
        className: 'btn-markdown',
        type: 'block',
        syntax: '### ',
        action: 'handleMarkdownFormat',
        formatType: 'header3'
    },
    {
        id: 'bold-btn',
        text: 'Bold',
        icon: 'B',
        className: 'btn-markdown bold',
        type: 'inline',
        syntax: '**',
        action: 'handleMarkdownFormat',
        formatType: 'bold'
    },
    {
        id: 'italic-btn',
        text: 'Italic',
        icon: 'I',
        className: 'btn-markdown italic',
        type: 'inline',
        syntax: '*',
        action: 'handleMarkdownFormat',
        formatType: 'italic'
    },
    {
        id: 'ordered-list-btn',
        text: 'Ordered List',
        icon: '1.',
        className: 'btn-markdown',
        type: 'block',
        syntax: '1. ',
        action: 'handleMarkdownFormat',
        formatType: 'orderedList'
    },
    {
        id: 'unordered-list-btn',
        text: 'Unordered List',
        icon: '•',
        className: 'btn-markdown',
        type: 'block',
        syntax: '- ',
        action: 'handleMarkdownFormat',
        formatType: 'unorderedList'
    },
    {
        id: 'link-btn',
        text: 'Link',
        icon: '🔗',
        className: 'btn-markdown',
        type: 'inline',
        syntax: '[text](url)',
        action: 'handleMarkdownFormat',
        formatType: 'link'
    },
    {
        id: 'image-btn',
        text: 'Image',
        icon: '🖼️',
        className: 'btn-markdown',
        type: 'inline',
        syntax: '![alt](url)',
        action: 'handleMarkdownFormat',
        formatType: 'image'
    },
    {
        id: 'code-btn',
        text: 'Code',
        icon: '<>',
        className: 'btn-markdown',
        type: 'inline',
        syntax: '`',
        action: 'handleMarkdownFormat',
        formatType: 'code'
    },
    {
        id: 'code-block-btn',
        text: 'Code Block',
        icon: '{ }',
        className: 'btn-markdown',
        type: 'block',
        syntax: '```',
        action: 'handleMarkdownFormat',
        formatType: 'codeBlock'
    }
];

export const BUTTON_CONFIG_DEFAULTS = {
    animationDuration: 300,
    fadeDelay: 100,
    contextRange: 20,
    notificationDuration: 3000
};

export const NOTIFICATION_STYLES = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
};

export const CSS_CLASSES = {
    buttonBar: 'editor-button-bar',
    buttonBarHidden: 'hidden',
    mainButtons: 'button-bar-buttons main-buttons',
    markdownButtons: 'button-bar-buttons markdown-buttons',
    separator: 'button-bar-separator',
    editorBtn: 'editor-btn',
    buttonContent: 'button-content',
    buttonIcon: 'button-icon',
    buttonText: 'button-text',
    markdownContent: 'markdown-content',
    markdownIcon: 'markdown-icon',
    contextActive: 'context-active',
    notification: 'editor-notification'
};