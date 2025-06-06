// editor/static/editor/mjs/editor/SyntaxHighlighter.mjs

import EditorLogger from "../utils/EditorLogger.mjs";

/**
 * SyntaxHighlighter for SpellBlock markdown syntax
 * Provides real-time highlighting of SpellBlock opening and closing tags
 */
class SyntaxHighlighter {
  constructor(config, logger, editorElement) {
    this.config = config;
    this.logger = logger || new EditorLogger();
    this.editorElement = editorElement;
    this.isInitialized = false;
    this.isDestroyed = false;

    // Highlighting elements
    this.highlightContainer = null;
    this.highlightLayer = null;

    // Performance optimization
    this.updateTimeout = null;
    this.debounceDelay = 50; // Reduced for more responsive highlighting

    // Cache for performance
    this.lastProcessedContent = "";
    this.lastHighlightHtml = "";

    // Event handlers (bound for cleanup)
    this.boundUpdateHandler = this.updateHighlighting.bind(this);
    this.boundScrollHandler = this.syncScroll.bind(this);
    this.boundResizeHandler = this.syncDimensions.bind(this);
    this.boundFocusHandler = this.handleFocus.bind(this);
    this.boundBlurHandler = this.handleBlur.bind(this);

    this.logger.debug("SyntaxHighlighter initialized");
  }

  /**
   * Initialize the syntax highlighter
   */
  async initialize() {
    if (this.isInitialized) {
      this.logger.warn("SyntaxHighlighter already initialized");
      return true;
    }

    if (this.isDestroyed) {
      this.logger.error("Cannot initialize destroyed SyntaxHighlighter");
      return false;
    }

    if (!this.editorElement) {
      this.logger.error("Cannot initialize: editor element is null");
      return false;
    }

    try {
      // Create highlighting overlay
      this.createHighlightOverlay();

      // Set up event listeners
      this.setupEventListeners();

      // Initial highlighting
      this.updateHighlighting();

      this.isInitialized = true;
      this.logger.debug("SyntaxHighlighter initialization completed");

      return true;
    } catch (error) {
      this.logger.error("Failed to initialize SyntaxHighlighter", {
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Create the highlighting overlay structure
   */
  createHighlightOverlay() {
    // Create container that will hold the highlight layer
    this.highlightContainer = document.createElement("div");
    this.highlightContainer.className = "syntax-highlight-container";

    // Create the actual highlight layer
    this.highlightLayer = document.createElement("div");
    this.highlightLayer.className = "syntax-highlight-layer";

    this.highlightContainer.appendChild(this.highlightLayer);

    // Insert overlay before the textarea
    this.editorElement.parentNode.insertBefore(
      this.highlightContainer,
      this.editorElement,
    );

    // Apply initial styles
    this.applyOverlayStyles();

    this.logger.debug("Highlight overlay created");
  }

  /**
   * Apply CSS styles to position overlay correctly
   */
  applyOverlayStyles() {
    if (!this.highlightContainer || !this.highlightLayer) return;

    const editorStyles = getComputedStyle(this.editorElement);

    // Container styles - positioned to match textarea exactly
    Object.assign(this.highlightContainer.style, {
      position: "absolute",
      top: `${this.editorElement.offsetTop}px`,
      left: `${this.editorElement.offsetLeft}px`,
      width: `${this.editorElement.offsetWidth}px`,
      height: `${this.editorElement.offsetHeight}px`,
      pointerEvents: "none",
      zIndex: "10",
      overflow: "hidden",
      borderRadius: editorStyles.borderRadius,
    });

    // Layer styles - matches textarea exactly
    Object.assign(this.highlightLayer.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      padding: editorStyles.padding,
      margin: "0",
      border: editorStyles.border,
      borderColor: "transparent",
      font: editorStyles.font,
      fontSize: editorStyles.fontSize,
      fontFamily: editorStyles.fontFamily,
      lineHeight: editorStyles.lineHeight,
      letterSpacing: editorStyles.letterSpacing,
      wordSpacing: editorStyles.wordSpacing,
      textIndent: editorStyles.textIndent,
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
      overflow: "auto",
      color: "transparent",
      background: "transparent",
      textAlign: editorStyles.textAlign,
      direction: editorStyles.direction,
      tabSize: editorStyles.tabSize,
      textTransform: editorStyles.textTransform,
      boxSizing: editorStyles.boxSizing,
    });

    // Make editor parent position relative if not already
    const parent = this.editorElement.parentNode;
    if (getComputedStyle(parent).position === "static") {
      parent.style.position = "relative";
    }

    // Sync initial dimensions and scroll
    this.syncDimensions();
    this.syncScroll();
  }

  /**
   * Set up event listeners for real-time updates
   */
  setupEventListeners() {
    if (!this.editorElement) return;

    // Text change events
    this.editorElement.addEventListener("input", this.boundUpdateHandler);
    this.editorElement.addEventListener("keyup", this.boundUpdateHandler);
    this.editorElement.addEventListener("paste", this.boundUpdateHandler);
    this.editorElement.addEventListener("cut", this.boundUpdateHandler);

    // Scroll synchronization
    this.editorElement.addEventListener("scroll", this.boundScrollHandler);

    // Dimension synchronization
    window.addEventListener("resize", this.boundResizeHandler);

    // Focus/blur events for transforms
    this.editorElement.addEventListener("focus", this.boundFocusHandler);
    this.editorElement.addEventListener("blur", this.boundBlurHandler);

    // Handle textarea resizing (ResizeObserver for better performance)
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => {
        this.syncDimensions();
      });
      this.resizeObserver.observe(this.editorElement);
    }

    // Fallback for older browsers
    if (this.editorElement.style.resize !== "none") {
      this.editorElement.addEventListener("mouseup", () => {
        setTimeout(() => this.syncDimensions(), 10);
      });
    }

    this.logger.debug("Event listeners set up");
  }

  /**
   * Handle focus event
   */
  handleFocus() {
    console.log("[SyntaxHighlighter] Focus event detected");
    // Use the same perfect method that works on resize
    setTimeout(() => {
      this.syncDimensions(); // This is what makes it perfect on resize!
      this.updateHighlighting();
    }, 100);
  }

  /**
   * Handle blur event
   */
  handleBlur() {
    console.log("[SyntaxHighlighter] Blur event detected");
    // LITERALLY trigger the same resize event that always works perfectly!
    setTimeout(() => {
      console.log(
        "[SyntaxHighlighter] Triggering resize event to snap into perfect position",
      );
      window.dispatchEvent(new Event("resize"));
    }, 300);
  }

  /**
   * Update syntax highlighting (debounced)
   */
  updateHighlighting() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = setTimeout(() => {
      this.performHighlighting();
    }, this.debounceDelay);
  }

  /**
   * Perform the actual highlighting
   */
  performHighlighting() {
    if (!this.isInitialized || this.isDestroyed || !this.highlightLayer) {
      return;
    }

    const content = this.editorElement.value;

    // Skip if content hasn't changed (performance optimization)
    if (content === this.lastProcessedContent) {
      return;
    }

    try {
      // Generate highlighted HTML
      const highlightedHtml = this.generateHighlightedHtml(content);

      // Update display if changed
      if (highlightedHtml !== this.lastHighlightHtml) {
        this.highlightLayer.innerHTML = highlightedHtml;
        this.lastHighlightHtml = highlightedHtml;
      }

      this.lastProcessedContent = content;
    } catch (error) {
      this.logger.error("Error during highlighting", { error: error.message });
    }
  }

  /**
   * Generate highlighted HTML from markdown content
   */
  generateHighlightedHtml(content) {
    if (!content) return "";

    // Create spans only for SpellBlock syntax, leave everything else transparent
    return this.createHighlightSpans(content);
  }

  /**
   * Create highlight spans only for SpellBlock syntax
   */
  createHighlightSpans(content) {
    let result = "";
    let lastIndex = 0;

    // Find all SpellBlock patterns and create spans only for them
    const allMatches = [];

    // Find opening tags: {~ blockname parameters ~}
    const openingRegex = /(\{~\s*)([^~]*?)(\s*~\})/g;
    let match;
    while ((match = openingRegex.exec(content)) !== null) {
      allMatches.push({
        index: match.index,
        length: match[0].length,
        type: "opening",
        openBrace: match[1],
        content: match[2],
        closeBrace: match[3],
      });
    }

    // Find closing tags: {~~}
    const closingRegex = /(\{~~\})/g;
    while ((match = closingRegex.exec(content)) !== null) {
      allMatches.push({
        index: match.index,
        length: match[0].length,
        type: "closing",
        text: match[1],
      });
    }

    // Sort matches by position
    allMatches.sort((a, b) => a.index - b.index);

    // Remove overlapping matches to prevent double highlighting
    const filteredMatches = [];
    for (let i = 0; i < allMatches.length; i++) {
      const current = allMatches[i];
      const isOverlapping = filteredMatches.some(existing => 
        current.index < existing.index + existing.length &&
        current.index + current.length > existing.index
      );
      if (!isOverlapping) {
        filteredMatches.push(current);
      }
    }

    // Process each match
    lastIndex = 0;
    filteredMatches.forEach((item) => {
      // Add transparent text before this match
      result += this.createTransparentText(
        content.substring(lastIndex, item.index),
      );

      // Add the highlighted match
      if (item.type === "opening") {
        const trimmedContent = item.content.trim();
        if (!trimmedContent) {
          // Empty SpellBlock
          result += `<span class="spellblock-syntax-open">${this.escapeHtml(item.openBrace)}</span>`;
          result += `<span class="spellblock-syntax-open">${this.escapeHtml(item.closeBrace)}</span>`;
        } else {
          // Split content into name and parameters
          const spaceIndex = trimmedContent.search(/\s/);
          let blockName, params;

          if (spaceIndex === -1) {
            blockName = trimmedContent;
            params = "";
          } else {
            blockName = trimmedContent.substring(0, spaceIndex);
            params = trimmedContent.substring(spaceIndex);
          }

          result += `<span class="spellblock-syntax-open">${this.escapeHtml(item.openBrace)}</span>`;
          if (blockName) {
            result += `<span class="spellblock-name">${this.escapeHtml(blockName)}</span>`;
          }
          if (params) {
            result += `<span class="spellblock-params">${this.escapeHtml(params)}</span>`;
          }
          result += `<span class="spellblock-syntax-open">${this.escapeHtml(item.closeBrace)}</span>`;
        }
      } else if (item.type === "closing") {
        result += `<span class="spellblock-syntax-close">${this.escapeHtml(item.text)}</span>`;
      }

      lastIndex = item.index + item.length;
    });

    // Add remaining transparent text
    result += this.createTransparentText(content.substring(lastIndex));

    return result;
  }

  /**
   * Create transparent text that takes up space but is invisible
   */
  createTransparentText(text) {
    if (!text) return "";
    return `<span style="color: transparent;">${this.escapeHtml(text)}</span>`;
  }

  /**
   * Escape HTML characters
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Synchronize scroll position with editor
   */
  syncScroll() {
    if (!this.highlightLayer || !this.editorElement) return;

    // Synchronize scroll positions
    if (this.highlightLayer.scrollTop !== this.editorElement.scrollTop) {
      this.highlightLayer.scrollTop = this.editorElement.scrollTop;
    }
    if (this.highlightLayer.scrollLeft !== this.editorElement.scrollLeft) {
      this.highlightLayer.scrollLeft = this.editorElement.scrollLeft;
    }
  }

  /**
   * Synchronize dimensions with editor
   */
  syncDimensions() {
    if (!this.highlightContainer || !this.highlightLayer || !this.editorElement)
      return;

    // Get fresh computed styles
    const editorStyles = getComputedStyle(this.editorElement);

    // Update container position and size to match textarea exactly
    Object.assign(this.highlightContainer.style, {
      top: `${this.editorElement.offsetTop}px`,
      left: `${this.editorElement.offsetLeft}px`,
      width: `${this.editorElement.offsetWidth}px`,
      height: `${this.editorElement.offsetHeight}px`,
      borderRadius: editorStyles.borderRadius,
      // Reset transforms for unfocused state
      marginLeft: "0px",
      transform: "none",
      minHeight: "auto",
    });

    // Update layer to match textarea dimensions and styling
    Object.assign(this.highlightLayer.style, {
      width: "100%",
      height: "100%",
      padding: editorStyles.padding,
      fontSize: editorStyles.fontSize,
      lineHeight: editorStyles.lineHeight,
      fontFamily: editorStyles.fontFamily,
      letterSpacing: editorStyles.letterSpacing,
      wordSpacing: editorStyles.wordSpacing,
      left: "0.3rem", // This gets overridden in syncDimensions anyway
    });

    // Re-sync scroll position after dimension changes
    setTimeout(() => this.syncScroll(), 10);
  }

  /**
   * Force sync that mimics the perfect window resize behavior
   * This ensures the highlighting snaps to exactly the right position
   */
  forceSync() {
    console.log(
      "[SyntaxHighlighter] Force sync - mimicking window resize behavior",
    );

    // Step 1: Clear any existing transforms to reset state
    if (this.highlightContainer) {
      Object.assign(this.highlightContainer.style, {
        marginLeft: "",
        transform: "",
        minHeight: "",
      });
    }

    // Step 2: Wait for CSS to settle, then sync like window resize does
    setTimeout(() => {
      this.syncDimensions();
      console.log(
        "[SyntaxHighlighter] Force sync completed - should be perfectly positioned now",
      );
    }, 50);
  }

  /**
   * Synchronize dimensions with editor (this method works perfectly on resize!)
   * Now enhanced to handle focus transforms automatically
   */
  syncDimensions() {
    if (!this.highlightContainer || !this.highlightLayer || !this.editorElement)
      return;

    // Get fresh computed styles from the textarea
    const editorStyles = getComputedStyle(this.editorElement);

    // ** THIS IS WHERE THE MAGIC HAPPENS **
    // Copy ALL transforms directly from the textarea's computed styles
    // When focused, the textarea has: margin-left: -2rem, transform: translateY(-8.5rem), etc.
    // When unfocused, these are all reset to normal values
    const marginLeft = editorStyles.marginLeft;
    const transform = editorStyles.transform;
    const minHeight = editorStyles.minHeight;

    console.log("[SyntaxHighlighter] Copying textarea transforms:", {
      marginLeft,
      transform,
      minHeight,
      isFocused: document.activeElement === this.editorElement,
    });

    // Update container position and size to match textarea exactly
    Object.assign(this.highlightContainer.style, {
      top: `${this.editorElement.offsetTop}px`,
      left: `${this.editorElement.offsetLeft}px`,
      width: `${this.editorElement.offsetWidth}px`,
      height: `${this.editorElement.offsetHeight}px`,
      borderRadius: editorStyles.borderRadius,
      // ** COPY THE TEXTAREA'S EXACT TRANSFORMS **
      marginLeft: marginLeft,
      transform: transform,
      minHeight: minHeight,
    });

    // Update layer to match textarea dimensions and styling
    Object.assign(this.highlightLayer.style, {
      width: "100%",
      height: "100%",
      padding: editorStyles.padding,
      fontSize: editorStyles.fontSize,
      lineHeight: editorStyles.lineHeight,
      fontFamily: editorStyles.fontFamily,
      letterSpacing: editorStyles.letterSpacing,
      wordSpacing: editorStyles.wordSpacing,
      // Adjust left offset: 0.3rem when unfocused, 0.5rem when focused for perfect alignment
      left:
        document.activeElement === this.editorElement ? "1.7rem" : "-0.3rem",
    });

    // Re-sync scroll position after dimension changes
    setTimeout(() => this.syncScroll(), 10);
  }

  /**
   * Enable syntax highlighting
   */
  enable() {
    if (this.highlightContainer) {
      this.highlightContainer.style.display = "block";
      this.updateHighlighting();
    }
    this.logger.debug("Syntax highlighting enabled");
  }

  /**
   * Disable syntax highlighting
   */
  disable() {
    if (this.highlightContainer) {
      this.highlightContainer.style.display = "none";
    }
    this.logger.debug("Syntax highlighting disabled");
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    if (newConfig.syntaxHighlighting) {
      Object.assign(this.config, newConfig.syntaxHighlighting);

      // Update debounce delay if changed
      if (newConfig.syntaxHighlighting.debounceDelay !== undefined) {
        this.debounceDelay = newConfig.syntaxHighlighting.debounceDelay;
      }

      // Re-highlight with new config
      this.updateHighlighting();
    }
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isDestroyed: this.isDestroyed,
      hasHighlightContainer: !!this.highlightContainer,
      hasHighlightLayer: !!this.highlightLayer,
      isEnabled: this.highlightContainer
        ? this.highlightContainer.style.display !== "none"
        : false,
      lastContentLength: this.lastProcessedContent.length,
      debounceDelay: this.debounceDelay,
    };
  }

  /**
   * Clean up resources
   */
  cleanup() {
    if (this.isDestroyed) {
      this.logger.warn("SyntaxHighlighter already destroyed");
      return;
    }

    this.logger.debug("Starting SyntaxHighlighter cleanup");

    try {
      // Clear timeouts
      if (this.updateTimeout) {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = null;
      }

      // Remove event listeners
      if (this.editorElement) {
        this.editorElement.removeEventListener(
          "input",
          this.boundUpdateHandler,
        );
        this.editorElement.removeEventListener(
          "keyup",
          this.boundUpdateHandler,
        );
        this.editorElement.removeEventListener(
          "paste",
          this.boundUpdateHandler,
        );
        this.editorElement.removeEventListener("cut", this.boundUpdateHandler);
        this.editorElement.removeEventListener(
          "scroll",
          this.boundScrollHandler,
        );
        this.editorElement.removeEventListener("focus", this.boundFocusHandler);
        this.editorElement.removeEventListener("blur", this.boundBlurHandler);
      }

      window.removeEventListener("resize", this.boundResizeHandler);

      // Clean up resize observer
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }

      // Remove highlight overlay
      if (this.highlightContainer && this.highlightContainer.parentNode) {
        this.highlightContainer.parentNode.removeChild(this.highlightContainer);
      }

      // Clear references
      this.highlightContainer = null;
      this.highlightLayer = null;
      this.editorElement = null;

      // Clear cache
      this.lastProcessedContent = "";
      this.lastHighlightHtml = "";

      this.isDestroyed = true;
      this.isInitialized = false;

      this.logger.debug("SyntaxHighlighter cleanup completed");
    } catch (error) {
      this.logger.error("Error during SyntaxHighlighter cleanup", {
        error: error.message,
      });
    }
  }

  /**
   * Static factory method
   */
  static async create(config, logger, editorElement) {
    const highlighter = new SyntaxHighlighter(config, logger, editorElement);
    const success = await highlighter.initialize();

    if (!success) {
      highlighter.cleanup();
      throw new Error("Failed to initialize SyntaxHighlighter");
    }

    return highlighter;
  }
}

export default SyntaxHighlighter;
