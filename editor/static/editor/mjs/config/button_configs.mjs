// static/mjs/config/button_configs.mjs

export const MAIN_BUTTONS = [
  {
    id: "help-btn",
    text: "",
    icon: "?",
    className: "btn-help",
    action: "showKeyboardHelp",
    keyboardShortcut: {
      key: "Ctrl+Shift+H (or Alt+Shift+H)",
      keyMac: "⌘⇧H (or Alt+Shift+H)",
    },
  },
  {
    id: "insert-spellblock-btn",
    text: "Insert SpellBlock",
    icon: "✨",
    className: "btn-accent",
    action: "handleInsertSpellBlock",
    keyboardShortcut: {
      key: "Ctrl+Shift+S (or Alt+Shift+S)",
      keyMac: "⌘⇧S (or Alt+Shift+S)",
    },
  },
];

export const MARKDOWN_BUTTONS = [
  {
    id: "header-1-btn",
    text: "H1",
    icon: "H₁",
    className: "btn-markdown",
    type: "block",
    syntax: "# ",
    action: "handleMarkdownFormat",
    formatType: "header1",
    keyboardShortcut: {
      key: "Ctrl+1 (or Alt+Shift+1)",
      keyMac: "⌘1 (or Alt+Shift+1)",
    },
  },
  {
    id: "header-2-btn",
    text: "H2",
    icon: "H₂",
    className: "btn-markdown",
    type: "block",
    syntax: "## ",
    action: "handleMarkdownFormat",
    formatType: "header2",
    keyboardShortcut: {
      key: "Ctrl+2 (or Alt+Shift+2)",
      keyMac: "⌘2 (or Alt+Shift+2)",
    },
  },
  {
    id: "header-3-btn",
    text: "H3",
    icon: "H₃",
    className: "btn-markdown",
    type: "block",
    syntax: "### ",
    action: "handleMarkdownFormat",
    formatType: "header3",
    keyboardShortcut: {
      key: "Ctrl+3 (or Alt+Shift+3)",
      keyMac: "⌘3 (or Alt+Shift+3)",
    },
  },
  {
    id: "bold-btn",
    text: "Bold",
    icon: "B",
    className: "btn-markdown bold",
    type: "inline",
    syntax: "**",
    action: "handleMarkdownFormat",
    formatType: "bold",
    keyboardShortcut: {
      key: "Ctrl+B (or Alt+Shift+B)",
      keyMac: "⌘B (or Alt+Shift+B)",
    },
  },
  {
    id: "italic-btn",
    text: "Italic",
    icon: "I",
    className: "btn-markdown italic",
    type: "inline",
    syntax: "*",
    action: "handleMarkdownFormat",
    formatType: "italic",
    keyboardShortcut: {
      key: "Ctrl+I (or Alt+Shift+I)",
      keyMac: "⌘I (or Alt+Shift+I)",
    },
  },
  {
    id: "ordered-list-btn",
    text: "Ordered List",
    icon: "1.",
    className: "btn-markdown",
    type: "block",
    syntax: "1. ",
    action: "handleMarkdownFormat",
    formatType: "orderedList",
    keyboardShortcut: {
      key: "Ctrl+Shift+O (or Alt+Shift+O)",
      keyMac: "⌘⇧O (or Alt+Shift+O)",
    },
  },
  {
    id: "unordered-list-btn",
    text: "Unordered List",
    icon: "•",
    className: "btn-markdown",
    type: "block",
    syntax: "- ",
    action: "handleMarkdownFormat",
    formatType: "unorderedList",
    keyboardShortcut: {
      key: "Ctrl+Shift+L (or Alt+Shift+U)",
      keyMac: "⌘⇧L (or Alt+Shift+U)",
    },
  },
  {
    id: "link-btn",
    text: "Link",
    icon: "🔗",
    className: "btn-markdown",
    type: "inline",
    syntax: "[text](url)",
    action: "handleMarkdownFormat",
    formatType: "link",
    keyboardShortcut: {
      key: "Ctrl+K (or Alt+Shift+L)",
      keyMac: "⌘K (or Alt+Shift+L)",
    },
  },
  {
    id: "image-btn",
    text: "Image",
    icon: "🖼️",
    className: "btn-markdown",
    type: "inline",
    syntax: "![alt](url)",
    action: "handleMarkdownFormat",
    formatType: "image",
    keyboardShortcut: {
      key: "Ctrl+Shift+I (or Alt+Shift+G)",
      keyMac: "⌘⇧I (or Alt+Shift+G)",
    },
  },
  {
    id: "code-btn",
    text: "Code",
    icon: "<>",
    className: "btn-markdown",
    type: "inline",
    syntax: "`",
    action: "handleMarkdownFormat",
    formatType: "code",
    keyboardShortcut: {
      key: "Ctrl+Shift+C (or Alt+Shift+C)",
      keyMac: "⌘⇧C (or Alt+Shift+C)",
    },
  },
  {
    id: "code-block-btn",
    text: "Code Block",
    icon: "{ }",
    className: "btn-markdown",
    type: "block",
    syntax: "```",
    action: "handleMarkdownFormat",
    formatType: "codeBlock",
    keyboardShortcut: {
      key: "Ctrl+Shift+K (or Alt+Shift+K)",
      keyMac: "⌘⇧K (or Alt+Shift+K)",
    },
  },
];

export const BUTTON_CONFIG_DEFAULTS = {
  animationDuration: 300,
  fadeDelay: 100,
  contextRange: 20,
  notificationDuration: 3000,
};

export const NOTIFICATION_STYLES = {
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
};

export const CSS_CLASSES = {
  buttonBar: "editor-button-bar",
  buttonBarHidden: "hidden",
  mainButtons: "button-bar-buttons main-buttons",
  markdownButtons: "button-bar-buttons markdown-buttons",
  separator: "button-bar-separator",
  editorBtn: "editor-btn",
  buttonContent: "button-content",
  buttonIcon: "button-icon",
  buttonText: "button-text",
  markdownContent: "markdown-content",
  markdownIcon: "markdown-icon",
  contextActive: "context-active",
  notification: "editor-notification",
};
