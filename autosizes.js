/**
 * AutoSizes - Automatic sizes attribute calculator for responsive images
 * Simplified version extracted from lazysizes
 * @version 1.0.0
 * @license MIT
 */

/**
 * Default configuration
 */
const defaults = {
  // CSS class to identify elements
  className: 'autosizes',
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
 * Regular expression to test for picture elements
 */
const regPicture = /^picture$/i;

/**
 * AutoSizer module - calculates and sets sizes attribute
 */
const autoSizer = (() => {
  let elements;

  /**
   * Set sizes attribute on element and source children
   * @param {Element} elem - The image element
   * @param {Element} parent - Parent element
   * @param {CustomEvent} event - The event object
   * @param {number} width - Calculated width
   */
  const sizeElement = rAFIt((elem, parent, event, width) => {
    // Store calculated width on element
    elem._autosizesWidth = width;
    const widthPx = `${width}px`;

    // Set sizes attribute on img element
    elem.setAttribute('sizes', widthPx);

    // If parent is picture element, update source elements too
    if (regPicture.test(parent.nodeName || '')) {
      const sources = parent.getElementsByTagName('source');
      for (let i = 0; i < sources.length; i++) {
        sources[i].setAttribute('sizes', widthPx);
      }
    }

    // Trigger afterCalculateSizes event
    triggerEvent(elem, 'afterCalculateSizes', {
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

    // Trigger beforeCalculateSizes event - allows modification of width
    const event = triggerEvent(elem, 'beforeCalculateSizes', {
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
    // Get all elements with autosizes class
    elements = document.getElementsByClassName(config.className);

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
    checkElems: debouncedUpdate,
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
};

export default autoSizes;
