// editor/static/mjs/editor/EditorManager.mjs

import EditorConfig from "./EditorConfig.mjs";
import EditorLogger from "../utils/EditorLogger.mjs";
import ElementValidator from "./ElementValidator.mjs";
import StyleManager from "./StyleManager.mjs";
import EventManager from "./EventManager.mjs";
import ButtonBarController from "./ButtonBarController.mjs";
import SyntaxHighlighter from "./SyntaxHighlighter.mjs";

/**
 * Main orchestrator for editor functionality
 * Coordinates all editor components and manages their lifecycle
 */
class EditorManager {
  constructor(editorId, customConfig = {}) {
    this.editorId = editorId;
    this.isInitialized = false;
    this.isDestroyed = false;

    // Initialize configuration
    this.config = EditorConfig.createDefault(customConfig);

    // Validate configuration
    const validation = this.config.validate();
    if (!validation.isValid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(", ")}`);
    }

    // Initialize logger
    this.logger = new EditorLogger(this.config.get("logging"));

    // Initialize component managers
    this.elementValidator = new ElementValidator(this.config, this.logger);
    this.styleManager = new StyleManager(this.config, this.logger);
    this.eventManager = new EventManager(this.config, this.logger);

    // Component state
    this.elements = {
      editor: null,
      preview: null,
    };

    this.buttonBarController = null;
    this.syntaxHighlighter = null;

    this.logger.logInitialization("EditorManager", "started");
  }

  /**
   * Initialize the editor manager and all its components
   */
  async initialize() {
    if (this.isInitialized) {
      this.logger.warn("EditorManager already initialized");
      return true;
    }

    if (this.isDestroyed) {
      this.logger.error("Cannot initialize destroyed EditorManager");
      return false;
    }

    try {
      this.logger.time("EditorManager:Initialize");

      // Phase 1: Validate and get DOM elements
      const elementValidation = this.elementValidator.validateAll();

      if (elementValidation.errors.length > 0) {
        this.logger.error("Element validation failed", {
          errors: elementValidation.errors,
        });
        return false;
      }

      if (elementValidation.warnings.length > 0) {
        this.logger.warn("Element validation warnings", {
          warnings: elementValidation.warnings,
        });
      }

      this.elements.editor = elementValidation.editor;
      this.elements.preview = elementValidation.preview;

      // Phase 2: Initialize button bar controller
      this.buttonBarController = new ButtonBarController(
        this.config,
        this.logger.createChild("ButtonBar"),
        this.elements.editor,
      );

      const buttonBarInitialized = await this.buttonBarController.initialize();
      if (!buttonBarInitialized) {
        this.logger.warn(
          "Button bar initialization failed, continuing without it",
        );
      }

      // Phase 3: Initialize syntax highlighter
      if (this.config.get("syntaxHighlighting")?.enabled !== false) {
        try {
          this.syntaxHighlighter = await SyntaxHighlighter.create(
            this.config.get("syntaxHighlighting") || {},
            this.logger.createChild("SyntaxHighlighter"),
            this.elements.editor,
          );
        } catch (error) {
          this.logger.warn("Syntax highlighter initialization failed", {
            error: error.message,
          });
        }
      }

      // Phase 4: Register event listeners
      this._registerEventListeners();

      // Mark as initialized
      this.isInitialized = true;

      this.logger.timeEnd("EditorManager:Initialize");
      this.logger.logInitialization("EditorManager", "completed");

      return true;
    } catch (error) {
      this.logger.error("Failed to initialize EditorManager", {
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Register all event listeners
   */
  _registerEventListeners() {
    if (!this.elements.editor) {
      this.logger.warn(
        "Cannot register event listeners: editor element is null",
      );
      return;
    }

    // Register focus listener
    this.eventManager.registerFocusListener(this.elements.editor, (event) =>
      this._handleFocus(event),
    );

    // Register blur listener
    this.eventManager.registerBlurListener(this.elements.editor, (event) =>
      this._handleBlur(event),
    );
  }

  /**
   * Handle editor focus event
   */
  _handleFocus(event) {
    try {
      // Apply focused styles
      const styleSuccess = this.styleManager.applyFocusedStyles(
        this.elements.editor,
        this.elements.preview,
      );

      if (!styleSuccess) {
        this.logger.warn("Failed to apply focused styles");
      }

      // Show button bar
      if (this.buttonBarController) {
        const buttonBarSuccess = this.buttonBarController.show();
        if (!buttonBarSuccess) {
          this.logger.warn("Failed to show button bar");
        }
      }

      // Dispatch custom focus event
      this.eventManager.dispatchCustomEvent(
        this.elements.editor,
        "editor:focus",
        { timestamp: new Date().toISOString() },
      );
    } catch (error) {
      this.logger.error("Error handling focus event", { error: error.message });
    }
  }

  /**
   * Handle editor blur event
   */
  _handleBlur(event) {
    try {
      // Remove focused styles
      const styleSuccess = this.styleManager.removeFocusedStyles(
        this.elements.editor,
        this.elements.preview,
      );

      if (!styleSuccess) {
        this.logger.warn("Failed to remove focused styles");
      }

      // Hide button bar
      if (this.buttonBarController) {
        const buttonBarSuccess = this.buttonBarController.hide();
        if (!buttonBarSuccess) {
          this.logger.warn("Failed to hide button bar");
        }
      }

      // Dispatch custom blur event
      this.eventManager.dispatchCustomEvent(
        this.elements.editor,
        "editor:blur",
        { timestamp: new Date().toISOString() },
      );
    } catch (error) {
      this.logger.error("Error handling blur event", { error: error.message });
    }
  }

  /**
   * Get editor element
   */
  getEditorElement() {
    return this.elements.editor;
  }

  /**
   * Get preview element
   */
  getPreviewElement() {
    return this.elements.preview;
  }

  /**
   * Get button bar controller
   */
  getButtonBarController() {
    return this.buttonBarController;
  }

  /**
   * Get syntax highlighter
   */
  getSyntaxHighlighter() {
    return this.syntaxHighlighter;
  }

  /**
   * Get current configuration
   */
  getConfiguration() {
    return this.config.getAll();
  }

  /**
   * Update configuration at runtime
   */
  updateConfiguration(newConfig) {
    // Update main config
    for (const [key, value] of Object.entries(newConfig)) {
      this.config.set(key, value);
    }

    // Update button bar config if present
    if (newConfig.buttonBar && this.buttonBarController) {
      this.buttonBarController.updateConfig(newConfig.buttonBar);
    }

    // Update syntax highlighter config if present
    if (newConfig.syntaxHighlighting && this.syntaxHighlighter) {
      this.syntaxHighlighter.updateConfig(newConfig);
    }

    // Update logger if logging config changed
    if (newConfig.logging) {
      this.logger.setLogLevel(
        newConfig.logging.logLevel || this.logger.logLevel,
      );
      this.logger.setEnabled(
        newConfig.logging.enabled !== undefined
          ? newConfig.logging.enabled
          : true,
      );
    }
  }

  /**
   * Get comprehensive status of all components
   */
  getStatus() {
    const status = {
      isInitialized: this.isInitialized,
      isDestroyed: this.isDestroyed,
      editorId: this.editorId,
      elements: {
        hasEditor: !!this.elements.editor,
        hasPreview: !!this.elements.preview,
      },
      components: {
        elementValidator: !!this.elementValidator,
        styleManager: !!this.styleManager,
        eventManager: !!this.eventManager && !this.eventManager.isDestroyed(),
        buttonBarController: this.buttonBarController
          ? this.buttonBarController.getStatus()
          : null,
        syntaxHighlighter: this.syntaxHighlighter
          ? this.syntaxHighlighter.getStatus()
          : null,
      },
      events: this.eventManager
        ? this.eventManager.getEventListenersSummary()
        : null,
      styles: this.styleManager
        ? this.styleManager.getAppliedStylesSummary()
        : null,
    };

    return status;
  }

  /**
   * Focus the editor programmatically
   */
  focus() {
    if (this.elements.editor) {
      this.elements.editor.focus();
      return true;
    }
    this.logger.warn("Cannot focus: editor element not available");
    return false;
  }

  /**
   * Blur the editor programmatically
   */
  blur() {
    if (this.elements.editor) {
      this.elements.editor.blur();
      return true;
    }
    this.logger.warn("Cannot blur: editor element not available");
    return false;
  }

  /**
   * Reset editor to default state
   */
  reset() {
    try {
      // Reset styles
      if (this.styleManager) {
        this.styleManager.resetAllStyles(
          this.elements.editor,
          this.elements.preview,
        );
      }

      // Hide button bar
      if (this.buttonBarController) {
        this.buttonBarController.forceHide();
      }

      // Reset syntax highlighter
      if (this.syntaxHighlighter) {
        this.syntaxHighlighter.updateHighlighting();
      }

      // Clear any pending operations
      if (this.styleManager) {
        this.styleManager.clearPendingTransitions();
      }

      if (this.buttonBarController) {
        this.buttonBarController.clearPendingOperations();
      }
      return true;
    } catch (error) {
      this.logger.error("Error during editor reset", { error: error.message });
      return false;
    }
  }

  /**
   * Cleanup all resources and event listeners
   */
  cleanup() {
    if (this.isDestroyed) {
      this.logger.warn("EditorManager already destroyed");
      return;
    }

    try {
      // Cleanup components in reverse order of initialization
      if (this.syntaxHighlighter) {
        this.syntaxHighlighter.cleanup();
      }

      if (this.buttonBarController) {
        this.buttonBarController.cleanup();
      }

      if (this.eventManager) {
        this.eventManager.cleanup();
      }

      if (this.styleManager) {
        this.styleManager.cleanup();
      }

      if (this.elementValidator) {
        this.elementValidator.clearCache();
      }

      // Clear references
      this.elements.editor = null;
      this.elements.preview = null;
      this.buttonBarController = null;
      this.syntaxHighlighter = null;

      // Mark as destroyed
      this.isDestroyed = true;
      this.isInitialized = false;

      this.logger.logCleanup("EditorManager");
    } catch (error) {
      this.logger.error("Error during cleanup", { error: error.message });
    }
  }

  /**
   * Check if EditorManager is ready for use
   */
  isReady() {
    return this.isInitialized && !this.isDestroyed && !!this.elements.editor;
  }

  /**
   * Static factory method to create and initialize EditorManager
   */
  static async create(editorId, customConfig = {}) {
    const manager = new EditorManager(editorId, customConfig);
    const success = await manager.initialize();

    if (!success) {
      manager.cleanup();
      throw new Error("Failed to initialize EditorManager");
    }

    return manager;
  }

  /**
   * Static factory method for testing
   */
  static createForTesting(editorId, customConfig = {}) {
    const testConfig = EditorConfig.createForTesting();
    const mergedConfig = { ...testConfig.getAll(), ...customConfig };
    return new EditorManager(editorId, mergedConfig);
  }
}

export default EditorManager;
