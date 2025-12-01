/**
 * AutoSizes - Entry point with auto-initialization
 *
 * Based on lazysizes by Alexander Farkas
 * Copyright (c) 2015 Alexander Farkas (original work)
 * Copyright (c) 2025 Oleg Tishkin (modified work)
 * Copyright (c) 2025 Anthropic, PBC (Claude Code - code assistance)
 *
 * @license MIT
 */

import autoSizes from './autosizes.js';

// Make autoSizes available globally (like lazysizes)
window.autoSizes = autoSizes;

// Auto-initialize when imported
// You can disable this by setting window.autoSizesConfig.init = false before import
if (autoSizes.cfg.init !== false) {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      autoSizes.init();
    });
  } else {
    // DOM is already ready
    autoSizes.init();
  }
}

// Export for manual control if needed
export default autoSizes;
