import { setup_logger } from "./LoggingUtils.mjs";
import { validateConfig } from "./ConfigValidator.mjs";
import { initialActiveStrategies, VALID_STRATEGIES } from "./strategies.mjs";

const MODULE_NAME = "ActionInvoker";
const DEBUG = true;
const logger = setup_logger(MODULE_NAME, DEBUG);

export class ActionInvoker {
  constructor(config) {
    // Validate config schema
    const configSchema = {
      event: { required: true, type: "string" },
      action: { required: true, type: "string" },
      targetId: { required: true, type: "string" },
      strategy: {
        required: false,
        type: "string",
        validator: (val) => VALID_STRATEGIES.includes(val),
      },
      bindedId: { required: false, type: "string" },
      fireOnce: { required: false, type: "boolean" },
    };

    try {
      validateConfig(config, configSchema);
    } catch (error) {
      logger.error(`Config validation failed: ${error.message}`, "constructor");
      // Provide additional context for the user
      throw new Error(
        `ActionInvoker configuration error: ${error.message}. Please ensure the configuration is correct based on the expected schema.`
      );
    }
    this.config = config;
    this.event = config.event;
    this.action = config.action;
    this.targetId = config.targetId;
    this.strategy = config.strategy || "this";

    this.bindedId = config.bindedId;
    this.fireOnce = config.fireOnce || false;
    this.hasBeenFired = false;

    logger.info(
      `ActionInvoker instance created with configuration: ${JSON.stringify(
        config
      )}`,
      "constructor"
    );
    // Use setTimeout to ensure this runs after the current execution context
    setTimeout(() => this.init(), 0);
  }

  init() {
    logger.info("Init method called", "init");
    if (document.readyState === "loading") {
      logger.info("Document still loading, adding event listener", "init");
      document.addEventListener("DOMContentLoaded", () => this.onDOMReady());
    } else {
      logger.info("Document already loaded, executing immediately", "init");
      this.onDOMReady();
    }
  }

  nDOMReady() {
    logger.info("DOM is ready", "onDOMReady");
    const target = document.getElementById(this.targetId);
    if (target) {
      logger.info(`Target element found: ${this.targetId}`, "onDOMReady");
      if (this.event === "on-load") {
        this.handleOnLoad(target);
      } else if (this.event === "click") {
        this.handleClick(target);
      }
    } else {
      logger.error(
        `Target element with id "${this.targetId}" not found.`,
        "onDOMReady"
      );
    }
  }

  handleClick(target) {
    logger.info(
      `Setting up click event for target "${this.targetId}"`,
      "handleClick"
    );
    const bindedElement = this.bindedId
      ? document.getElementById(this.bindedId)
      : target;
    if (bindedElement) {
      bindedElement.addEventListener("click", (event) => {
        if (this.fireOnce && this.hasBeenFired) {
          logger.info(
            "Action already fired once, ignoring click",
            "handleClick"
          );
          return;
        }
        this.handleEffect(target);
        this.hasBeenFired = true;
      });
      logger.info(
        `Click event listener added to element with id "${bindedElement.id}"`,
        "handleClick"
      );
    } else {
      logger.error(
        `Binded element with id "${this.bindedId}" not found.`,
        "handleClick"
      );
    }
  }

  handleOnLoad(target) {
    logger.info(
      `Handling on-load event for target "${this.targetId}"`,
      "handleOnLoad"
    );
    this.handleEffect(target);
  }

  handleEffect(target) {
    logger.info(
      `Handling effect: ${this.action} for target "${this.targetId}"`,
      "handleEffect"
    );
    switch (this.action) {
      case "click":
        this.clickButtons(target);
        break;
      case "add-class":
        this.addClass(target);
        break;
      case "remove-class":
        this.removeClass(target);
        break;
      // TODO: Implement additional action types such as 'hide', 'show', 'toggleClass', etc.
      default:
        logger.warning(`Unknown action: ${this.action}`, "handleEffect");
    }
  }

  addClass(target) {
    const className = this.config.class;
    if (!className) {
      logger.error("No class specified for add-class action", "addClass");
      return;
    }

    logger.info(`Adding class "${className}" to elements`, "addClass");
    const elements = this.getElementsToAct(target);
    logger.info(`Found ${elements.length} elements to act upon`, "addClass");
    const delay = this.config.delay ? parseInt(this.config.delay) : 0;
    const sequential = this.config.sequential === "true";

    if (sequential) {
      logger.info(
        `Applying class sequentially with ${delay}ms delay`,
        "addClass"
      );
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add(className);
          logger.info(
            `Added class "${className}" to element ${index}`,
            "addClass"
          );
        }, index * delay);
      });
    } else {
      elements.forEach((element, index) => {
        element.classList.add(className);
        logger.info(
          `Added class "${className}" to element ${index}`,
          "addClass"
        );
      });
    }
  }

  removeClass(target) {
    const className = this.config.class;
    if (!className) {
      logger.error("No class specified for remove-class action", "removeClass");
      return;
    }

    const elements = this.getElementsToAct(target);
    const delay = this.config.delay ? parseInt(this.config.delay) : 0;
    const sequential = this.config.sequential === "true";

    if (sequential) {
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.remove(className);
          logger.info(
            `Removed class "${className}" from element`,
            "removeClass"
          );
        }, index * delay);
      });
    } else {
      elements.forEach((element) => {
        element.classList.remove(className);
        logger.info(`Removed class "${className}" from element`, "removeClass");
      });
    }
  }

  clickButtons(target) {
    logger.info(
      `Clicking buttons for target "${this.targetId}" with strategy "${this.strategy}"`,
      "clickButtons"
    );
    const buttons = this.getElementsToAct(target);
    buttons.forEach((button) => button.click());
    // TODO: Add support for delayed or sequential button clicking based on configuration
  }

  getElementsToAct(target) {
    logger.info(
      `Getting elements to act upon with strategy: ${this.strategy}`,
      "getElementsToAct"
    );
    if (this.strategy === "all") {
      const elements = Array.from(target.children);
      logger.info(
        `Found ${elements.length} child elements`,
        "getElementsToAct"
      );
      return elements;
    } else if (this.strategy === "this") {
      logger.info(
        'Using "this" strategy, returning the target element itself',
        "getElementsToAct"
      );
      return [target];
    } else if (initialActiveStrategies.hasOwnProperty(this.strategy)) {
      const element = initialActiveStrategies[this.strategy](
        Array.from(target.children)
      );
      return element ? [element] : [];
    } else {
      const errorMessage = `Unknown strategy: ${
        this.strategy
      }. Please use one of the valid strategies: ${VALID_STRATEGIES.join(
        ", "
      )}.`;
      logger.error(errorMessage, "getElementsToAct");
      return [];
    }
  }

  static initAll(configs) {
    logger.info(
      `Initializing ${configs.length} ActionInvoker instances`,
      "initAll"
    );
    configs.forEach((config) => new ActionInvoker(config));
  }
}
