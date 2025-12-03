/**
 * AutoSizes - Automatic sizes attribute calculator for responsive images
 *
 * Extracted from lazysizes (https://github.com/aFarkas/lazysizes)
 * Original work Copyright (c) 2015 Alexander Farkas
 * Modified work Copyright (c) 2025 Oleg Tishkin
 * Code assistance Copyright (c) 2025 Anthropic, PBC (Claude Code)
 *
 * @version 1.0.3
 * @license MIT
 * @author Oleg Tishkin
 * @contributors Claude (Anthropic)
 * @based-on lazysizes by Alexander Farkas
 */

/**
 * Default configuration
 */
const defaults = {
  // CSS class to identify elements that need sizes calculation
  targetElementClass: 'autosizes',
  // CSS class added after sizes calculation is complete
  processedElementClass: 'autosized',
  // Attribute name for sizes (supports prefixes like 'data-sizes')
  sizesAttr: 'sizes',
  // Minimum size threshold - traverse up DOM if element is smaller
  minSize: 40,
  // Enable/disable automatic initialization
  init: true,
  // Debounce delay for resize events (ms)
  resizeDebounce: 99,
};

/**
 * Global configuration
 * Can be set before library initialization: window.autoSizesConfig = {...}
 */
let config = { ...defaults };

/**
 * Merge user config with defaults
 */
function initConfig() {
  const userConfig = window.autoSizesConfig || {};
  config = { ...defaults, ...userConfig };
}

/**
 * Calculate width of element, traversing up DOM tree if needed
 * @param {Element} elem - The image element
 * @param {Element} parent - Parent element
 * @param {number} [width] - Initial width
 * @returns {number} Calculated width
 */
function getWidth(elem, parent, width) {
  width = width || elem.offsetWidth;

  // If width is too small, traverse up the DOM tree
  while (width < config.minSize && parent && !elem._autosizesWidth) {
    width = parent.offsetWidth;
    parent = parent.parentNode;
  }

  return width;
}

/**
 * Debounce function for resize events
 * @param {Function} func - Function to debounce
 * @returns {Function} Debounced function
 */
function debounce(func) {
  let timeout;
  let timestamp;
  const wait = config.resizeDebounce;

  const run = () => {
    timeout = null;
    func();
  };

  const later = () => {
    const last = Date.now() - timestamp;

    if (last < wait) {
      timeout = setTimeout(later, wait - last);
    } else {
      if (window.requestIdleCallback) {
        requestIdleCallback(run);
      } else {
        run();
      }
    }
  };

  return () => {
    timestamp = Date.now();

    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
  };
}

/**
 * RequestAnimationFrame batch executor
 * Batches multiple calls into single RAF for performance
 */
const rAF = (() => {
  let running = false;
  let waiting = false;
  const queue = [];

  const run = () => {
    running = true;
    waiting = false;

    while (queue.length) {
      const fn = queue.shift();
      fn();
    }

    running = false;
  };

  return (fn) => {
    if (running) {
      fn();
    } else {
      queue.push(fn);

      if (!waiting) {
        waiting = true;
        requestAnimationFrame(run);
      }
    }
  };
})();

/**
 * Wrap function to execute in requestAnimationFrame
 * @param {Function} fn - Function to wrap
 * @returns {Function} Wrapped function
 */
function rAFIt(fn) {
  return function (...args) {
    rAF(() => {
      fn.apply(this, args);
    });
  };
}

/**
 * Trigger custom event on element
 * @param {Element} elem - Target element
 * @param {string} name - Event name
 * @param {Object} detail - Event detail data
 * @returns {CustomEvent} The dispatched event
 */
function triggerEvent(elem, name, detail = {}) {
  const event = new CustomEvent(name, {
    detail,
    bubbles: true,
    cancelable: true,
  });

  elem.dispatchEvent(event);
  return event;
}

/**
 * Check if attribute has a prefix (e.g., 'data-sizes')
 * @param {string} attr - Attribute name
 * @returns {boolean}
 */
function hasPrefix(attr) {
  return attr.includes('-') && attr !== 'sizes';
}

/**
 * Get base attribute name (e.g., 'data-sizes' -> 'sizes')
 * @param {string} attr - Attribute name
 * @returns {string}
 */
function getBaseAttr(attr) {
  if (hasPrefix(attr)) {
    const parts = attr.split('-');
    return parts[parts.length - 1];
  }
  return attr;
}

/**
 * AutoSizer module - calculates and sets sizes attribute
 */
const autoSizer = (() => {
  let elements;

  /**
   * Check if element has sizes="auto" attribute
   * @param {Element} elem - Element to check
   * @returns {boolean}
   */
  const hasSizesAuto = (elem) => {
    const value = elem.getAttribute(config.sizesAttr);
    return value === 'auto';
  };

  /**
   * Set sizes attribute on element
   * @param {Element} elem - The element
   * @param {string} sizesValue - The sizes value (e.g., "450px")
   */
  const setSizesAttr = (elem, sizesValue) => {
    // Set the configured attribute
    elem.setAttribute(config.sizesAttr, sizesValue);

    // If using a prefixed attribute (e.g., data-sizes), also set the base attribute
    if (hasPrefix(config.sizesAttr)) {
      const baseAttr = getBaseAttr(config.sizesAttr);
      elem.setAttribute(baseAttr, sizesValue);
    }
  };

  /**
   * Set sizes attribute on element
   * @param {Element} elem - The image element
   * @param {Element} parent - Parent element (unused, kept for compatibility)
   * @param {CustomEvent} event - The event object
   * @param {number} width - Calculated width
   */
  const sizeElement = rAFIt((elem, parent, event, width) => {
    // Store calculated width on element
    elem._autosizesWidth = width;
    const widthPx = `${width}px`;

    // Set sizes attribute on img element (only if it has sizes="auto")
    if (hasSizesAuto(elem)) {
      setSizesAttr(elem, widthPx);
    }

    // Add processed class to mark element as complete
    if (config.processedElementClass) {
      elem.classList.add(config.processedElementClass);
    }

    // Trigger afterSizesUpdate event
    triggerEvent(elem, 'afterSizesUpdate', {
      width,
      sizes: widthPx,
    });
  });

  /**
   * Calculate size for single element
   * @param {Element} elem - The element to calculate
   * @param {boolean} [dataAttr] - Whether called from data attribute
   * @param {number} [width] - Initial width
   */
  const getSizeElement = (elem, dataAttr, width) => {
    const parent = elem.parentNode;

    if (!parent) return;

    // Calculate width
    width = getWidth(elem, parent, width);

    // Trigger beforeSizesUpdate event - allows modification of width
    const event = triggerEvent(elem, 'beforeSizesUpdate', {
      width,
      dataAttr: !!dataAttr,
    });

    // If event was prevented, skip setting sizes
    if (event.defaultPrevented) return;

    // Use potentially modified width from event
    width = event.detail.width;

    // Only update if width changed
    if (width && width !== elem._autosizesWidth) {
      sizeElement(elem, parent, event, width);
    }
  };

  /**
   * Update sizes for all elements
   */
  const updateElementsSizes = () => {
    if (!elements || !elements.length) return;

    for (let i = 0; i < elements.length; i++) {
      getSizeElement(elements[i]);
    }
  };

  const debouncedUpdate = debounce(updateElementsSizes);

  /**
   * Initialize autoSizer
   */
  const init = () => {
    // Get all elements with target class
    elements = document.getElementsByClassName(config.targetElementClass);

    // Listen to resize events
    window.addEventListener('resize', debouncedUpdate);

    // Initial calculation
    updateElementsSizes();
  };

  /**
   * Public API
   */
  return {
    init,
    updateAll: debouncedUpdate,
    updateElem: getSizeElement,
  };
})();

/**
 * Initialize library
 */
function init() {
  if (init.initialized) return;
  init.initialized = true;

  initConfig();
  autoSizer.init();
}

/**
 * Public API
 */
const autoSizes = {
  cfg: config,
  autoSizer,
  init,
  // Convenience methods
  updateAll: () => autoSizer.updateAll(),
  updateElem: (elem) => autoSizer.updateElem(elem),
};

export default autoSizes;
