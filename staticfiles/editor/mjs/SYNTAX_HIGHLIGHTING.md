# SpellBlock Syntax Highlighting

## Overview

The SpellBlock Syntax Highlighting feature provides real-time visual highlighting of SpellBlock markdown syntax in the editor. It uses an overlay system to highlight opening tags (`{~ blockname ~}`), closing tags (`{~~}`), block names, and parameters with different colors while maintaining the original text editing experience.

## Features

- **Real-time highlighting**: Updates as you type with minimal performance impact
- **Multi-line support**: Handles SpellBlock tags that span multiple lines
- **Tag-only highlighting**: Only highlights syntax tags, not content between them
- **Responsive design**: Works across different screen sizes and zoom levels
- **Focus transforms**: Highlighting overlay follows the editor when it transforms on focus
- **Theme support**: Multiple color themes available
- **Accessibility**: High contrast and reduced motion support

## Architecture

### Core Components

1. **SyntaxHighlighter.mjs** - Main highlighting engine
2. **highlighting.css** - Styling and color definitions
3. **EditorManager.mjs** - Integration with existing editor system

### Highlighting System

The system uses an absolutely positioned overlay that matches the textarea exactly:

```
┌─────────────────────────┐
│ Textarea (z-index: 2)   │ ← User types here
│ ┌─────────────────────┐ │
│ │ Overlay (z-index: 1)│ │ ← Highlighting shows here
│ └─────────────────────┘ │
└─────────────────────────┘
```

## Usage

### Basic Integration

The syntax highlighter is automatically initialized when the EditorManager starts:

```javascript
import EditorManager from './editor/EditorManager.mjs';

const editorManager = await EditorManager.create('markdown-input');
// Syntax highlighting is now active
```

### Manual Control

```javascript
const syntaxHighlighter = editorManager.getSyntaxHighlighter();

// Enable/disable highlighting
syntaxHighlighter.enable();
syntaxHighlighter.disable();

// Update configuration
syntaxHighlighter.updateConfig({
  syntaxHighlighting: {
    debounceDelay: 100,
    highlightSpellBlocks: true
  }
});

// Get status
const status = syntaxHighlighter.getStatus();
console.log('Highlighting enabled:', status.isEnabled);
```

## Configuration

### Editor Configuration

Add syntax highlighting options to your editor config:

```javascript
const config = {
  syntaxHighlighting: {
    enabled: true,
    debounceDelay: 50,
    highlightSpellBlocks: true,
    colorScheme: {
      spellBlockSyntax: {
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        color: '#312e81'
      },
      spellBlockName: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        color: '#064e3b'
      },
      spellBlockParams: {
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        color: '#92400e'
      }
    }
  }
};
```

### CSS Themes

Switch between different color themes:

```css
/* Default theme */
.editor-container { /* uses CSS variables */ }

/* Blue theme */
.editor-container.theme-blue { /* override variables */ }

/* Purple theme */
.editor-container.theme-purple { /* override variables */ }

/* Monochrome theme */
.editor-container.theme-mono { /* override variables */ }
```

## Highlighted Elements

### Opening Tags: `{~ blockname param="value" ~}`

- `{~` and `~}` - Syntax brackets (blue background)
- `blockname` - Block name (green background)
- `param="value"` - Parameters (orange background)

### Closing Tags: `{~~}`

- `{~~}` - Closing syntax (blue background)

## CSS Variables

The highlighting system uses CSS custom properties for easy theming:

```css
:root {
  /* Syntax brackets */
  --highlight-spellblock-open-bg: rgba(99, 102, 241, 0.2);
  --highlight-spellblock-open-text: #312e81;
  --highlight-spellblock-close-bg: rgba(99, 102, 241, 0.2);
  --highlight-spellblock-close-text: #312e81;
  
  /* Block names */
  --highlight-spellblock-name-bg: rgba(16, 185, 129, 0.2);
  --highlight-spellblock-name-text: #064e3b;
  
  /* Parameters */
  --highlight-spellblock-params-bg: rgba(245, 158, 11, 0.2);
  --highlight-spellblock-params-text: #92400e;
  
  /* Appearance */
  --highlight-border-radius: 2px;
  --highlight-padding: 1px 3px;
  --highlight-font-weight: 600;
}
```

## Performance Optimizations

- **Debounced updates**: Prevents excessive DOM manipulation during typing
- **Content caching**: Skips processing when content hasn't changed
- **Hardware acceleration**: Uses CSS transforms for better performance
- **Efficient parsing**: Optimized regex patterns for SpellBlock detection

## Browser Support

- **Modern browsers**: Full support with ResizeObserver
- **Older browsers**: Graceful degradation with fallback event listeners
- **Mobile devices**: Responsive design with touch-friendly interactions

## Accessibility

- **High contrast mode**: Enhanced colors for better visibility
- **Reduced motion**: Respects user's motion preferences
- **Screen readers**: Overlay doesn't interfere with text reading
- **Color blind support**: Uses distinguishable color combinations

## Technical Details

### Event Handling

The highlighter listens to several events:

- `input`, `keyup`, `paste`, `cut` - Text changes
- `scroll` - Synchronize overlay position
- `focus`, `blur` - Handle editor transforms
- `resize` - Update dimensions

### Focus Transforms

When the editor is focused, it applies CSS transforms:

```css
@media (min-width: 768px) {
  .editor-pane textarea:focus {
    margin-left: -2rem;
    transform: translateY(-8.5rem);
    min-height: 97vh;
  }
}
```

The highlighting overlay automatically follows these transforms.

### Regex Patterns

SpellBlock syntax detection uses these patterns:

```javascript
// Opening tags: {~ blockname param="value" ~}
/(\{~\s*)([^~]*?)(\s*~\})/g

// Closing tags: {~~}
/(\{~~\})/g
```

## Testing

### Test Files

- `test_syntax_highlighter.mjs` - Unit tests for the highlighter
- `syntax_highlighting_test.html` - Interactive demo page

### Running Tests

```javascript
import SyntaxHighlighterTests from './tests/test_syntax_highlighter.mjs';

const tests = new SyntaxHighlighterTests();
await tests.runAllTests();
```

### Debug Mode

Enable debug mode to see overlay boundaries:

```javascript
document.querySelector('.editor-container').classList.add('syntax-highlighting-debug');
```

## Troubleshooting

### Common Issues

1. **Highlighting appears offset**
   - Check CSS `position: relative` on editor parent
   - Verify overlay dimensions match textarea

2. **Colors don't show**
   - Ensure `highlighting.css` is loaded
   - Check CSS variable definitions

3. **Performance issues**
   - Increase `debounceDelay` in configuration
   - Check for JavaScript errors in console

4. **Focus transforms not working**
   - Verify focus event handlers are attached
   - Check CSS media queries for responsiveness

### Debug Information

Get debugging information:

```javascript
const syntaxHighlighter = editorManager.getSyntaxHighlighter();
const status = syntaxHighlighter.getStatus();

console.log('Highlighter Status:', {
  isInitialized: status.isInitialized,
  isEnabled: status.isEnabled,
  hasOverlay: status.hasHighlightContainer,
  contentLength: status.lastContentLength,
  debounceDelay: status.debounceDelay
});
```

## Future Enhancements

- **Parameter validation**: Color-coded feedback for parameter values
- **Type-specific highlighting**: Different colors for different SpellBlock types
- **Error highlighting**: Visual indicators for malformed syntax
- **Custom themes**: User-configurable color schemes
- **Performance monitoring**: Built-in metrics for large documents

## Contributing

When modifying the syntax highlighting system:

1. Update unit tests in `test_syntax_highlighter.mjs`
2. Test across different browsers and screen sizes
3. Verify accessibility compliance
4. Update CSS variables for theme consistency
5. Document any new configuration options