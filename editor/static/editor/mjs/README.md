# Editor Architecture Documentation

## Overview

This directory contains the refactored editor functionality, organized into focused, testable modules following Single Responsibility Principle and dependency injection patterns.

## Architecture

### Core Components

#### `EditorManager.mjs`
The main orchestrator that coordinates all editor functionality. Handles initialization, configuration management, and component lifecycle.

**Key Features:**
- Configuration-driven initialization
- Component coordination and dependency injection
- Event handling orchestration
- Cleanup and memory management
- Status reporting and debugging

#### `EditorConfig.mjs`
Centralized configuration management with validation and runtime updates.

**Features:**
- Default configuration with override support
- Configuration validation
- Runtime configuration updates
- Environment-specific configurations (testing, production)

#### `ElementValidator.mjs`
DOM element discovery, validation, and accessibility checking.

**Features:**
- Required element validation
- Element accessibility checks
- Async element waiting
- Validation caching and error reporting

#### `StyleManager.mjs`
CSS class application, transitions, and style-related operations.

**Features:**
- Focus/blur style management
- Transition timing and cleanup
- Multiple class operations
- Style state tracking

#### `EventManager.mjs`
Event listener registration, cleanup, and coordination with debouncing support.

**Features:**
- Event listener lifecycle management
- Automatic cleanup prevention of memory leaks
- Debounced event handling
- Custom event dispatching

#### `ButtonBarController.mjs`
Button bar lifecycle management and integration coordination.

**Features:**
- Lazy button bar initialization
- Show/hide operations with configuration respect
- Timeout management
- Status reporting

### Utilities

#### `utils/EditorLogger.mjs`
Centralized logging with configurable levels and formatting.

**Features:**
- Configurable log levels (debug, info, warn, error)
- Structured logging with context
- Component-specific child loggers
- Performance timing utilities

## Usage

### Basic Usage

```javascript
import EditorManager from './editor/EditorManager.mjs';

// Create and initialize with default configuration
const editor = await EditorManager.create('markdown-input');

// Get editor status
const status = editor.getStatus();

// Cleanup when done
editor.cleanup();
```

### Custom Configuration

```javascript
const customConfig = {
    selectors: {
        editor: 'my-editor',
        preview: 'my-preview'
    },
    logging: {
        enabled: true,
        logLevel: 'debug'
    },
    buttonBar: {
        enabled: true,
        showOnFocus: true
    }
};

const editor = await EditorManager.create('my-editor', customConfig);
```

### Testing Configuration

```javascript
// Create editor with testing configuration (logging disabled)
const editor = EditorManager.createForTesting('test-editor');
```

## Configuration Options

### Selectors
- `selectors.editor`: ID of the textarea element
- `selectors.preview`: ID of the preview element

### CSS Classes
- `cssClasses.editorFocused`: Class applied to editor on focus
- `cssClasses.previewSquashed`: Class applied to preview on focus

### Logging
- `logging.enabled`: Enable/disable logging
- `logging.prefix`: Log message prefix
- `logging.logLevel`: Minimum log level (debug, info, warn, error)

### Button Bar
- `buttonBar.enabled`: Enable/disable button bar
- `buttonBar.showOnFocus`: Show button bar on editor focus
- `buttonBar.hideOnBlur`: Hide button bar on editor blur

### Events
- `events.debounceDelay`: Delay for debounced events (ms)
- `events.enableFocusLogging`: Log focus events
- `events.enableBlurLogging`: Log blur events

## Testing

### Running Tests

Use the interactive test runner for easy testing:

1. Open the test runner page: `editor/static/editor/test_runner.html`
2. Click the test buttons to run specific test suites:
   - **Run ButtonBar Tests** - Tests the refactored button bar components
   - **Run EditorManager Tests** - Tests the main editor orchestrator
   - **Run All Tests** - Comprehensive test suite for all components

The test runner provides:
- Real-time console output with color coding
- Visual status indicators for each test suite
- Detailed test results and failure information
- A test editor environment for manual verification

### Test Structure

```
tests/
├── EditorManager.test.mjs    # Main component tests
├── button_bar_test.mjs       # Comprehensive button bar tests
└── (future test files)       # Additional component tests
```

### Writing Tests

```javascript
import EditorManagerTests from './tests/EditorManager.test.mjs';

const tests = new EditorManagerTests();
const results = await tests.runAllTests();
```

## Migration from Legacy Code

### Before (TextEditorFocusLogger)
```javascript
// Old monolithic approach
const logger = new TextEditorFocusLogger('markdown-input');
```

### After (EditorManager)
```javascript
// New modular approach
const editor = await EditorManager.create('markdown-input');
```

### Benefits of Refactoring

1. **Single Responsibility**: Each class has one clear purpose
2. **Testability**: Components can be unit tested in isolation
3. **Configuration**: Behavior driven by configuration, not hard-coded
4. **Memory Management**: Proper cleanup prevents memory leaks
5. **Extensibility**: Easy to add new features without modifying existing code
6. **Error Handling**: Consistent error handling and logging
7. **Debugging**: Comprehensive status reporting and logging

## Extending the Architecture

### Adding New Components

1. Create new component in `editor/` directory
2. Follow dependency injection pattern
3. Add configuration options to `EditorConfig.mjs`
4. Integrate with `EditorManager.mjs`
5. Add tests in `tests/` directory

### Example New Component

```javascript
// editor/NewComponent.mjs
class NewComponent {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
    }
    
    initialize() {
        // Component initialization
    }
    
    cleanup() {
        // Component cleanup
    }
}
```

## Performance Considerations

- **Lazy Loading**: Button bar loaded only when needed
- **Event Debouncing**: Prevents excessive event handling
- **Memory Management**: Automatic cleanup of event listeners and timeouts
- **Configuration Caching**: Config validation performed once at startup

## Browser Compatibility

- ES6 modules support required
- Modern browser features used (async/await, Map, Set)
- No external dependencies beyond existing button bar

## Debugging

### Enable Debug Logging

```javascript
const config = {
    logging: {
        enabled: true,
        logLevel: 'debug'
    }
};

const editor = await EditorManager.create('markdown-input', config);
```

### Get Component Status

```javascript
const status = editor.getStatus();
console.log('Editor Status:', status);
```

### Performance Timing

```javascript
// Enable performance timing in debug mode
editor.logger.time('operation');
// ... perform operation ...
editor.logger.timeEnd('operation');
```
