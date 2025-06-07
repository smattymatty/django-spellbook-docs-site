// editor/static/mjs/editor/ButtonBarController.mjs

/**
 * Button bar controller for managing button bar lifecycle
 * Handles show/hide operations, state management, and integration coordination
 */
class ButtonBarController {
  constructor(config, logger, editorElement) {
    this.config = config;
    this.logger = logger;
    this.editorElement = editorElement;
    this.buttonBar = null;
    this.isVisible = false;
    this.isInitialized = false;
    this.showTimeout = null;
    this.hideTimeout = null;
  }

  /**
   * Initialize button bar if enabled in configuration
   */
  async initialize() {
    if (!this.config.get("buttonBar.enabled")) {
      this.logger.debug("Button bar disabled in configuration");
      return false;
    }

    if (!this.editorElement) {
      this.logger.error("Cannot initialize button bar: editor element is null");
      return false;
    }

    try {
      // Dynamically import EditorButtonBar to avoid circular dependencies
      const { EditorButtonBar } = await import("../button_bar.mjs");
      this.buttonBar = new EditorButtonBar(this.editorElement);
      this.isInitialized = true;

      this.logger.logInitialization("ButtonBarController", "completed");
      return true;
    } catch (error) {
      this.logger.error("Failed to initialize button bar", {
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Show button bar if configured to show on focus
   */
  show() {
    if (!this._canShow()) {
      return false;
    }

    // Clear any pending hide timeout
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (this.isVisible) {
      return true;
    }

    try {
      this.buttonBar.show();
      this.isVisible = true;
      return true;
    } catch (error) {
      this.logger.error("Failed to show button bar", { error: error.message });
      return false;
    }
  }

  /**
   * Hide button bar if configured to hide on blur
   */
  hide() {
    if (!this._canHide()) {
      return false;
    }

    // Clear any pending show timeout
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    if (!this.isVisible) {
      return true;
    }

    try {
      this.buttonBar.hide();
      this.isVisible = false;
      return true;
    } catch (error) {
      this.logger.error("Failed to hide button bar", { error: error.message });
      return false;
    }
  }

  /**
   * Show button bar with delay
   */
  showWithDelay(delay = 100) {
    if (!this._canShow()) {
      return false;
    }

    this.showTimeout = setTimeout(() => {
      this.show();
      this.showTimeout = null;
    }, delay);

    return true;
  }

  /**
   * Hide button bar with delay
   */
  hideWithDelay(delay = 100) {
    if (!this._canHide()) {
      return false;
    }

    this.hideTimeout = setTimeout(() => {
      this.hide();
      this.hideTimeout = null;
    }, delay);

    return true;
  }

  /**
   * Toggle button bar visibility
   */
  toggle() {
    return this.isVisible ? this.hide() : this.show();
  }

  /**
   * Check if button bar can be shown
   */
  _canShow() {
    if (!this.isInitialized) {
      this.logger.warn("Cannot show button bar: not initialized");
      return false;
    }

    if (!this.config.get("buttonBar.showOnFocus")) {
      return false;
    }

    if (!this.buttonBar) {
      this.logger.warn("Cannot show button bar: button bar instance is null");
      return false;
    }

    return true;
  }

  /**
   * Check if button bar can be hidden
   */
  _canHide() {
    if (!this.isInitialized) {
      this.logger.warn("Cannot hide button bar: not initialized");
      return false;
    }

    if (!this.config.get("buttonBar.hideOnBlur")) {
      return false;
    }

    if (!this.buttonBar) {
      this.logger.warn("Cannot hide button bar: button bar instance is null");
      return false;
    }

    return true;
  }

  /**
   * Force show button bar regardless of configuration
   */
  forceShow() {
    if (!this.isInitialized || !this.buttonBar) {
      this.logger.warn("Cannot force show: button bar not available");
      return false;
    }

    try {
      this.buttonBar.show();
      this.isVisible = true;
      return true;
    } catch (error) {
      this.logger.error("Failed to force show button bar", {
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Force hide button bar regardless of configuration
   */
  forceHide() {
    if (!this.isInitialized || !this.buttonBar) {
      this.logger.warn("Cannot force hide: button bar not available");
      return false;
    }

    try {
      this.buttonBar.hide();
      this.isVisible = false;
      return true;
    } catch (error) {
      this.logger.error("Failed to force hide button bar", {
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Get button bar instance (for advanced operations)
   */
  getButtonBar() {
    return this.buttonBar;
  }

  /**
   * Check if button bar is currently visible
   */
  isButtonBarVisible() {
    return this.isVisible;
  }

  /**
   * Check if button bar is initialized
   */
  isButtonBarInitialized() {
    return this.isInitialized;
  }

  /**
   * Get button bar status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isVisible: this.isVisible,
      isEnabled: this.config.get("buttonBar.enabled"),
      showOnFocus: this.config.get("buttonBar.showOnFocus"),
      hideOnBlur: this.config.get("buttonBar.hideOnBlur"),
      hasPendingShow: this.showTimeout !== null,
      hasPendingHide: this.hideTimeout !== null,
    };
  }

  /**
   * Update configuration at runtime
   */
  updateConfig(newConfig) {
    // Update specific button bar configuration
    if (newConfig.hasOwnProperty("enabled")) {
      this.config.set("buttonBar.enabled", newConfig.enabled);
    }
    if (newConfig.hasOwnProperty("showOnFocus")) {
      this.config.set("buttonBar.showOnFocus", newConfig.showOnFocus);
    }
    if (newConfig.hasOwnProperty("hideOnBlur")) {
      this.config.set("buttonBar.hideOnBlur", newConfig.hideOnBlur);
    }
  }

  /**
   * Clear any pending timeouts
   */
  clearPendingOperations() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  /**
   * Cleanup button bar controller
   */
  cleanup() {
    // Clear pending operations
    this.clearPendingOperations();

    // Hide button bar if visible
    if (this.isVisible && this.buttonBar) {
      try {
        this.buttonBar.hide();
      } catch (error) {
        this.logger.warn("Error hiding button bar during cleanup", {
          error: error.message,
        });
      }
    }

    // Reset state
    this.buttonBar = null;
    this.isVisible = false;
    this.isInitialized = false;

    this.logger.logCleanup("ButtonBarController");
  }

  /**
   * Reinitialize button bar (useful for dynamic configuration changes)
   */
  async reinitialize() {
    this.cleanup();
    return await this.initialize();
  }
}

export default ButtonBarController;
