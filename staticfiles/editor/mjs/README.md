# Django Spellbook Editor Architecture

## Overview

This directory contains a modular, testable editor system built for the Django Spellbook project. The architecture emphasizes clean separation of concerns, comprehensive testing, and maintainable code through focused components that follow SOLID principles.

## Key Components

### 🎯 Core Editor System

#### `EditorManager.mjs`
**Main orchestrator** that coordinates all editor functionality. This is the entry point for the entire editor system.

**Responsibilities:**
- Initialize and coordinate all components
- Manage configuration and dependency injection
- Handle editor focus/blur events and styling
- Coordinate with button bar controller
- Provide cleanup and status reporting

**Usage:**
```javascript
import EditorManager from './editor/EditorManager.mjs';
const editor = await EditorManager.create('markdown-input');
```

#### Supporting Components
- **`EditorConfig.mjs`** - Configuration management with validation
- **`ElementValidator.mjs`** - DOM element discovery and validation
- **`StyleManager.mjs`** - CSS class application and transitions
- **`EventManager.mjs`** - Event listener lifecycle management
- **`ButtonBarController.mjs`** - Button bar integration and coordination

### 🎨 Button Bar System (Refactored)

The button bar has been completely refactored from a monolithic 720-line class into a modular, testable architecture.

#### Core Components

##### `button_bar.mjs` - Main Orchestrator
**Simplified main class** (467 lines vs original 720) that coordinates all button bar functionality.

**Key Features:**
- Delegates to specialized components instead of doing everything
- Maintains backward compatibility with existing APIs
- Provides clean public interface for button management
- Handles component lifecycle and cleanup

##### `button_bar/ButtonConfigManager.mjs` - Configuration Management
**Manages all button definitions and validation.**

**Features:**
- Externalized button configurations from code
- Runtime button addition/removal
- Configuration validation and error handling
- Support for custom button types

##### `button_bar/ButtonBarRenderer.mjs` - UI Generation
**Handles all HTML generation and DOM manipulation.**

**Features:**
- Creates button bar HTML structure
- Manages show/hide animations
- Handles button element creation and management
- Provides clean separation between UI and business logic

##### `button_bar/CursorTracker.mjs` - Position Detection
**Tracks cursor position and detects formatting context.**

**Features:**
- Real-time cursor position tracking
- Context-aware formatting detection (bold, italic, headers, etc.)
- Efficient throttled updates
- Support for complex markdown detection

##### `button_bar/ButtonStateManager.mjs` - State Management
**Manages active button states based on cursor context.**

**Features:**
- Automatic state updates based on cursor position
- Manual state control for custom scenarios
- Efficient state tracking and updates
- Integration with cursor tracker

##### `button_bar/EventCoordinator.mjs` - Event Handling
**Coordinates all button interactions and events.**

**Features:**
- Button click handling and action dispatch
- Integration with comprehensive keyboard shortcut system
- Custom action registration system
- Event delegation for performance

##### `button_bar/KeyboardShortcutManager.mjs` - Comprehensive Keyboard Shortcuts
**Manages all keyboard shortcuts with cross-platform support.**

**Features:**
- 26+ keyboard shortcuts for all formatting operations
- Cross-platform compatibility (Ctrl on Windows/Linux, Cmd on Mac)
- Visual feedback with button flash effects
- Interactive help modal (Ctrl+Shift+H)
- Custom shortcut registration and management
- Event prevention and proper key handling

##### `button_bar/NotificationService.mjs` - User Feedback
**Provides user notifications and feedback.**

**Features:**
- Multiple notification types (success, error, warning, info)
- Configurable positioning and duration
- Animation support
- Queue management for multiple notifications

#### Formatting System

##### `formatters/MarkdownFormatter.mjs` - Base Formatter
**Abstract base class for all markdown formatting operations.**

##### `formatters/BlockFormatter.mjs` - Block-level Formatting
**Handles headers, lists, code blocks, and other block-level elements.**

**Supported Formats:**
- Headers (H1, H2, H3)
- Ordered and unordered lists
- Code blocks
- Custom block formats

##### `formatters/InlineFormatter.mjs` - Inline Formatting
**Handles bold, italic, links, and other inline elements.**

**Supported Formats:**
- Bold (`**text**`)
- Italic (`*text*`)
- Inline code (`` `code` ``)
- Links (`[text](url)`)
- Images (`![alt](url)`)

#### Configuration System

##### `config/button_configs.mjs` - Button Definitions
**Externalized configuration for all buttons with keyboard shortcuts.**

**Example Button Configuration:**
```javascript
{
    id: 'bold-btn',
    text: 'Bold',
    icon: 'B',
    className: 'btn-markdown bold',
    type: 'inline',
    syntax: '**',
    action: 'handleMarkdownFormat',
    formatType: 'bold',
    keyboardShortcut: {
        key: 'Ctrl+B',
        keyMac: '⌘B'
    }
}
```

## Architecture Benefits

### ✅ Before vs After Refactoring

| Aspect | Before (Monolithic) | After (Modular) |
|--------|-------------------|-----------------|
| **Lines of Code** | 720 lines in one file | Distributed across 8+ focused files |
| **Method Length** | 130+ line constructor, 80+ line methods | No method exceeds 30 lines |
| **Responsibilities** | 8+ responsibilities in one class | Single responsibility per class |
| **Testing** | Impossible to unit test | 100% unit testable |
| **Configuration** | Hard-coded in constructor | External, validated configuration |
| **Extensibility** | Difficult to extend | Easy plugin system |
| **Memory Management** | Potential leaks | Proper cleanup |
| **Performance** | Inefficient DOM queries | Optimized with caching |

### 🏗️ Design Patterns Used

- **Factory Pattern** - Button and component creation
- **Observer Pattern** - Cursor tracking and state updates
- **Command Pattern** - Formatting operations
- **Strategy Pattern** - Different formatting approaches
- **Dependency Injection** - Component coordination

## Usage Examples

### Basic Editor Setup
```javascript
import EditorManager from './editor/EditorManager.mjs';

// Initialize with default configuration (includes keyboard shortcuts)
const editor = await EditorManager.create('markdown-input');

// Custom configuration
const editor = await EditorManager.create('markdown-input', {
    buttonBar: { enabled: true, showOnFocus: true },
    logging: { enabled: true, logLevel: 'debug' }
});
```

### Keyboard Shortcuts Usage
```javascript
// All shortcuts work automatically once editor is initialized
// Focus the editor and use:
// Ctrl/⌘ + B: Bold text
// Ctrl/⌘ + I: Italic text  
// Ctrl/⌘ + K: Insert link
// Ctrl/⌘ + Shift + C: Inline code
// Ctrl/⌘ + Shift + K: Code block
// Ctrl/⌘ + 1/2/3: Headers H1/H2/H3
// Ctrl/⌘ + Shift + L: Unordered list
// Ctrl/⌘ + Shift + O: Ordered list
// Ctrl/⌘ + Shift + I: Insert image
// Ctrl/⌘ + Shift + S: Insert SpellBlock
// Ctrl/⌘ + Shift + H: Show keyboard help

// Get keyboard shortcut manager for customization
const buttonBar = editor.getButtonBarController().getButtonBar();
const shortcutManager = buttonBar.eventCoordinator.getKeyboardShortcutManager();

// Add custom keyboard shortcut
shortcutManager.addShortcut('ctrl+shift+x', {
    id: 'custom-action',
    description: 'Custom formatting',
    action: 'myCustomAction'
});
```

### Button Bar Operations
```javascript
// Get button bar instance
const buttonBar = editor.getButtonBarController().getButtonBar();

// Add custom button
buttonBar.addButton({
    id: 'custom-btn',
    text: 'Custom',
    icon: '⭐',
    className: 'btn-custom',
    action: 'myCustomAction'
});

// Register custom action
buttonBar.addCustomAction('myCustomAction', (config) => {
    console.log('Custom action executed!');
});

// Trigger formatting programmatically
buttonBar.handleMarkdownFormat('bold', 'inline');
```

### Extending with Custom Formatters
```javascript
import { MarkdownFormatter } from './formatters/MarkdownFormatter.mjs';

class CustomFormatter extends MarkdownFormatter {
    getSupportedFormats() {
        return ['spoiler', 'highlight'];
    }
    
    format(formatType, options = {}) {
        if (formatType === 'spoiler') {
            this.wrapSelection('||', '||', 'spoiler text');
        }
    }
}
```

## Testing

### Running Tests

Use the interactive test runner for comprehensive testing:

**📁 File:** `editor/static/editor/test_runner.html`

**Features:**
- Real-time test execution with visual feedback
- Separate test suites for different components
- Console output with color coding and timestamps
- Test editor environment for manual verification

**Test Suites:**
- **ButtonBar Tests** - All button bar components (88 tests)
- **EditorManager Tests** - Core editor functionality (8 tests)
- **Performance Tests** - Memory and speed benchmarks
- **Integration Tests** - End-to-end functionality

### Test Coverage

```
ButtonConfigManager       ✅ 100% (20 tests)
CursorTracker            ✅ 100% (16 tests)
BlockFormatter           ✅ 100% (16 tests)
InlineFormatter          ✅ 100% (16 tests)
NotificationService      ✅ 100% (16 tests)
ButtonBarRenderer        ✅ 100% (24 tests)
ButtonStateManager       ✅ 100% (12 tests)
EventCoordinator         ✅ 100% (16 tests)
KeyboardShortcutManager  ✅ 100% (28 tests)
EditorButtonBar          ✅ 100% (24 tests)
Performance Tests        ✅ 100% (8 tests)
```

### Writing New Tests

```javascript
// Add test to button_bar_test.mjs
async testNewFeature() {
    // Setup
    const component = new SomeComponent();
    
    // Test
    const result = component.doSomething();
    
    // Assert
    this.addResult('ComponentName', 'testName', 
        result === expectedValue,
        'Should do something correctly'
    );
}
```

## Configuration Options

### Editor Configuration
```javascript
{
    selectors: {
        editor: 'markdown-input',    // Textarea ID
        preview: 'live-preview-area' // Preview div ID
    },
    buttonBar: {
        enabled: true,               // Enable button bar
        showOnFocus: true,           // Show on editor focus
        hideOnBlur: true,           // Hide on editor blur
        keyboardShortcuts: {
            enabled: true,           // Enable keyboard shortcuts
            preventDefault: true,    // Prevent default browser behavior
            showHelp: true          // Enable help modal (Ctrl+Shift+H)
        }
    },
    logging: {
        enabled: false,              // Enable console logging
        logLevel: 'info'            // Log level (debug, info, warn, error)
    }
}
```

### Button Bar Configuration
```javascript
{
    animationDuration: 300,          // Animation timing (ms)
    notificationDuration: 3000,      // Notification duration (ms)
    contextRange: 20,               // Cursor context range
    maxNotifications: 5             // Max concurrent notifications
}
```

## Performance Optimizations

- **Throttled Updates** - Cursor tracking limited to 100ms intervals
- **Event Delegation** - Single click handler for all buttons
- **Keyboard Event Handling** - Optimized shortcut detection and execution
- **Lazy Initialization** - Components created only when needed
- **Memory Management** - Automatic cleanup prevents leaks
- **DOM Caching** - Button elements cached for efficiency
- **Cross-Platform Detection** - Efficient platform-specific key handling

## Browser Compatibility

- **ES6 Modules** - Required for import/export
- **Modern JavaScript** - async/await, Map, Set, classes
- **KeyboardEvent API** - Modern keyboard event handling
- **DOM APIs** - Modern event handling and element manipulation
- **Cross-Platform** - Automatic Ctrl/Cmd key detection
- **No External Dependencies** - Pure JavaScript implementation

## Migration Guide

### For Existing Code
The refactored button bar maintains full backward compatibility:

```javascript
// Old usage still works
const buttonBar = new EditorButtonBar(editorElement);
buttonBar.show();
buttonBar.handleMarkdownFormat('bold');

// New features available
buttonBar.addCustomAction('myAction', handler);
buttonBar.triggerButton('bold-btn');
```

### For New Development
Use the new modular approach:

```javascript
// Import specific components
import { ButtonConfigManager } from './button_bar/ButtonConfigManager.mjs';
import { BlockFormatter } from './formatters/BlockFormatter.mjs';

// Create focused, testable components
const configManager = new ButtonConfigManager(customConfig);
const formatter = new BlockFormatter(editorElement);
```

## Debugging

### Enable Debug Logging
```javascript
const editor = await EditorManager.create('markdown-input', {
    logging: { enabled: true, logLevel: 'debug' }
});
```

### Component Status
```javascript
// Get comprehensive status
const status = editor.getStatus();
console.log('Editor Status:', status);

// Get button bar status
const buttonBarStatus = buttonBar.getStatus();
console.log('Button Bar Status:', buttonBarStatus);

// Get keyboard shortcut status
const shortcutManager = buttonBar.eventCoordinator.getKeyboardShortcutManager();
console.log('Keyboard Shortcuts:', shortcutManager.getStatus());
```

### Testing Keyboard Shortcuts
```javascript
// Use the interactive test page
// Open: editor/static/editor/test_keyboard_shortcuts.html

// Or run automated tests
import('./mjs/tests/KeyboardShortcutManager.test.mjs')
    .then(module => new module.default().runAllTests())
    .then(results => console.log(results));
```

### Performance Monitoring
```javascript
// Built-in performance timing
buttonBar.getOptions().enablePerformanceMonitoring = true;
```

## Future Enhancements

The modular architecture enables easy extension:

- **Custom Formatting Plugins** - New formatter classes
- **Theme System** - Configurable button styling
- **Collaborative Editing** - Real-time state synchronization
- **Enhanced Accessibility** - Screen reader optimizations
- **Mobile Support** - Touch gesture equivalents for shortcuts
- **Undo/Redo** - Command history management with Ctrl+Z/Y
- **Vim Mode** - Optional Vim-style key bindings
- **Custom Shortcut Themes** - User-configurable shortcut sets

## Contributing

### Adding New Features

1. **Create focused component** following single responsibility principle
2. **Add comprehensive tests** with >90% coverage requirement
3. **Update configuration** in appropriate config files
4. **Document usage** with examples and API reference
5. **Ensure backward compatibility** for existing integrations

### Code Standards

- **No method exceeds 30 lines**
- **Each class has single responsibility**
- **All public methods documented with JSDoc**
- **Error handling with user-friendly messages**
- **Performance considerations documented**

## SpellBlock Context-Aware Detection

The editor includes sophisticated context-aware detection for SpellBlock syntax, providing users with intelligent editing capabilities based on cursor position.

### SpellBlock Syntax Support

The system recognizes SpellBlock syntax in the format:
```markdown
{~ blockname
    attribute="value"
    another="parameter"
~}
Content goes here
{~~}
```

### Context-Aware Button Behavior

The "Insert SpellBlock" button dynamically changes its behavior based on cursor context:

#### **Outside SpellBlock (Insert Mode)**
- **Button Text**: "Insert SpellBlock"
- **Icon**: ✨ (sparkles)
- **Action**: Inserts new card template with proper spacing
- **Template**:
  ```markdown
  {~ card
      title="My Title"
      footer="My Footer"
  ~}
  My Card Content
  {~~}
  ```

#### **Inside SpellBlock (Edit Mode)**
- **Button Text**: "Edit [blockname]" (e.g., "Edit card")
- **Icon**: ✏️ (pencil)
- **Style**: Blue edit mode styling
- **Action**: Selects content area for immediate editing

### Smart Positioning Features

#### **Automatic Line Spacing**
When inserting a SpellBlock, the system ensures proper markdown spacing:
- Moves cursor to an empty line if needed
- Ensures the line above is also empty
- Automatically adds newlines (`\n\n`) as required

#### **Content Selection**
- **New SpellBlocks**: Automatically selects "My Card Content" for immediate editing
- **Existing SpellBlocks**: Selects content between `~}` and `{~~}` tags
- **Parameter Detection**: Detects cursor within opening tag parameters and still selects content

#### **HTMX Integration**
- Automatically triggers live preview updates after insertion/editing
- Dispatches `input` events to maintain HTMX synchronization
- Seamless integration with existing preview functionality

### Detection Logic

#### **Opening Tag Detection**
Recognizes when cursor is within SpellBlock parameters:
```markdown
{~ card title="My Title" |cursor here| ~}
```

#### **Content Area Detection**
Identifies cursor within SpellBlock content:
```markdown
{~ card ~}
|cursor here| - content area
{~~}
```

#### **Multi-line Parameter Support**
Handles complex multi-line parameter definitions:
```markdown
{~ card
    title="Complex Title"
    description="Long description"
    |cursor here|
~}
```

### Implementation Architecture

The SpellBlock detection system consists of:

1. **CursorTracker.mjs**: Advanced regex-based detection for both opening tags and content areas
2. **ButtonStateManager.mjs**: Dynamic button appearance and text management
3. **EventCoordinator.mjs**: Context-aware insertion and editing logic
4. **CSS Styling**: Visual feedback for edit vs insert modes

### Usage Examples

```javascript
// Get current SpellBlock context
const context = cursorTracker.getFormattingContext();
if (context.isSpellBlock) {
    console.log(`Editing: ${context.spellBlock.blockName}`);
    console.log(`Within params: ${context.spellBlock.isWithinOpeningTag}`);
}

// Programmatically trigger SpellBlock insertion
buttonBar.triggerButton('insert-spellblock-btn');
```

### Testing SpellBlock Features

Test scenarios include:
- Insertion at various cursor positions
- Detection within parameters vs content
- Multi-line parameter handling
- Proper spacing and line management
- HTMX preview integration
- Button state changes and notifications

This context-aware system significantly enhances the user experience by providing intelligent, location-based functionality that adapts to the user's current editing context.

This architecture provides a solid foundation for editor functionality while maintaining flexibility for future enhancements and excellent developer experience through comprehensive testing and clear documentation.