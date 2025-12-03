# auto-sizes

Automatic `sizes` attribute calculation for responsive images.

> **Note:** Extracted from [lazysizes](https://github.com/aFarkas/lazysizes) by Alexander Farkas. This is a lightweight, focused version containing only the automatic `sizes` calculation feature (~3.3KB minified vs 7.8KB for full lazysizes).

## Features

- 🎯 Automatic calculation of `sizes` attribute from element width
- 📦 Tiny size (~2.2KB minified, ~1KB gzipped)
- 🚀 High performance with RAF batching and debounced resize
- 🖼️ Smart `<picture>` support - only `<img>` needs `sizes` attribute
- 🔄 Auto-updates on window resize
- 🎨 Customizable via events and CSS classes
- 📱 Works with any responsive image setup
- ✨ Modern ES6 code for current browsers

## Quick Start

**Recommended:** Load the script in `<head>` or before your images for optimal performance.

```html
<script type="module">
    import 'auto-sizes';
    // That's it! The library auto-initializes and calculates sizes.
</script>

<img
  class="autosizes"
  sizes="auto"
  srcset="image-300.jpg 300w, image-600.jpg 600w, image-900.jpg 900w"
  src="image-300.jpg"
  alt="Responsive image"
/>
```

Result:
```html
<img
  class="autosizes autosized"
  sizes="450px"
  srcset="..."
  alt="..."
/>
```

## Installation

### npm

```bash
npm install auto-sizes
```

### CDN

```html
<!-- unpkg (recommended) -->
<script type="module" src="https://unpkg.com/auto-sizes"></script>

<!-- jsDelivr -->
<script type="module" src="https://cdn.jsdelivr.net/npm/auto-sizes"></script>

<!-- Minified version -->
<script src="https://unpkg.com/auto-sizes/autosizes.min.js"></script>
```

### Import Methods

```javascript
// ES modules (auto-executes)
import 'auto-sizes';

// CommonJS
require('auto-sizes');

// With explicit import for manual control
import autoSizes from 'auto-sizes';
autoSizes.init();
autoSizes.updateAll();
```

## Usage

### Basic Image

```html
<img
  class="autosizes"
  sizes="auto"
  srcset="image-300.jpg 300w, image-600.jpg 600w, image-900.jpg 900w"
  src="image-300.jpg"
  alt="Responsive image"
/>
```

The library will:
1. Find elements with `class="autosizes"` and `sizes="auto"`
2. Calculate width based on rendered size
3. Set `sizes="450px"` (actual calculated value)
4. Add `autosized` class for styling hooks

### Picture Element

Add `autosizes` class and `sizes="auto"` only to the `<img>` element. The `<source>` elements don't need the `sizes` attribute:

```html
<picture>
  <source srcset="desktop-800.jpg 800w, desktop-1200.jpg 1200w" media="(min-width: 768px)" />
  <source srcset="mobile-400.jpg 400w, mobile-600.jpg 600w" />
  <img class="autosizes" sizes="auto" srcset="fallback-600.jpg 600w" src="fallback-600.jpg" alt="..." />
</picture>
```

**How it works:** The browser first selects the appropriate `<source>` based on `media` queries, then uses the `sizes` attribute from the `<img>` element to determine which image from the selected `srcset` to load.

### Styling with `autosized` Class

```css
/* Fade in after calculation */
img.autosizes:not(.autosized) {
  opacity: 0.3;
}

img.autosized {
  opacity: 1;
  transition: opacity 0.3s;
}
```

## Configuration

Set `window.autoSizesConfig` **before** loading the library:

```javascript
window.autoSizesConfig = {
  minSize: 40,                        // Traverse up DOM if element < 40px
  targetElementClass: 'autosizes',    // Class to identify elements
  processedElementClass: 'autosized', // Class added after processing
  sizesAttr: 'sizes',                 // Attribute to check for "auto"
  init: true,                         // Auto-initialize
  resizeDebounce: 99                  // Resize debounce delay (ms)
};
```

### Attribute Prefix Support

Use prefixed attributes like `data-sizes`. Both the prefixed and base attributes will be set:

```javascript
window.autoSizesConfig = {
  sizesAttr: 'data-sizes'
};
```

```html
<!-- Input -->
<img class="autosizes" data-sizes="auto" srcset="..." />

<!-- Output - both attributes set -->
<img class="autosizes autosized" data-sizes="450px" sizes="450px" srcset="..." />
```

Useful for:
- Framework compatibility (Vue, React data attributes)
- Preserving original attribute for debugging
- Tools that expect both attributes

## Events

### beforeSizesUpdate

Fired before `sizes` is set. Modify width or prevent update:

```javascript
image.addEventListener('beforeSizesUpdate', (e) => {
  // Round to nearest 100px
  e.detail.width = Math.ceil(e.detail.width / 100) * 100;

  // Or prevent update
  // e.preventDefault();
});
```

**Event detail:**
- `width` (number) - Calculated width in pixels (modifiable)
- `dataAttr` (boolean) - Whether triggered by data attribute

### afterSizesUpdate

Fired after `sizes` is set:

```javascript
image.addEventListener('afterSizesUpdate', (e) => {
  console.log('Sizes set to:', e.detail.sizes); // "450px"
});
```

**Event detail:**
- `width` (number) - Final width value
- `sizes` (string) - The sizes value that was set

## API

```javascript
// Update all elements
autoSizes.updateAll();

// Update specific element
autoSizes.updateElem(imageElement);

// Initialize manually (if auto-init disabled)
autoSizes.init();

// Access config
autoSizes.cfg.minSize = 50;
```

## Browser Support

Modern browsers with:
- `srcset` and `sizes` attributes
- `classList` API
- `requestAnimationFrame`

Tested: Chrome/Edge 90+, Firefox 88+, Safari 14+, iOS Safari, Chrome Mobile

## Differences from lazysizes

This is a **focused extraction** of only the `sizes` calculation feature from lazysizes.

### What's Removed ❌

| Removed | Why |
|---------|-----|
| Lazy loading | Use native `loading="lazy"` or your own solution |
| Intersection Observer | Only needed for lazy loading |
| MutationObserver | Reduced overhead; use `updateAll()` for dynamic content |
| Scroll events | Only resize monitored |
| IE11 support | Modern browsers only |
| Plugin system | Simplified to core functionality |

### What's Kept ✅

- ✅ Auto `sizes` calculation algorithm
- ✅ Picture element support
- ✅ Smart width detection with DOM traversal
- ✅ RAF batching for performance
- ✅ Debounced resize handling
- ✅ Customization events

### New Features 🆕

- **`sizes="auto"` requirement** - Explicit opt-in per element
- **Prefix support** - `data-sizes="auto"` sets both attributes
- **Correct `<picture>` handling** - Only `<img>` gets `sizes` attribute (per HTML spec)
- **Modern ES6** - Cleaner, more maintainable code
- **Simplified API** - `updateAll()` and `updateElem()`

### Size Comparison

| Metric | lazysizes | auto-sizes | Savings |
|--------|-----------|-----------|---------|
| Source code | 19.9 KB / 813 lines | 8.0 KB / 328 lines | **60%** |
| Minified | 7.8 KB | ~2.2 KB | **72%** |
| Gzipped | ~3.5 KB | ~1.0 KB | **71%** |

### When to Use Each

**Use lazysizes if:**
- Need lazy loading (images, iframes, scripts)
- Need LQIP or progressive loading
- Need IE11 support
- Want extensive plugin ecosystem

**Use auto-sizes if:**
- Only need `sizes` calculation
- Already have lazy loading solution
- Use native `loading="lazy"`
- Want minimal bundle size
- Target modern browsers only

### Code Example

```html
<!-- lazysizes: uses data-sizes with lazy loading -->
<img class="lazyload" data-sizes="auto" data-srcset="..." data-src="..." />

<!-- auto-sizes: uses sizes="auto" without lazy loading -->
<img class="autosizes" sizes="auto" srcset="..." src="..." />
```

Both share the same core algorithm, originally developed by Alexander Farkas for lazysizes.

## Credits

This library extracts the automatic `sizes` calculation feature from [lazysizes](https://github.com/aFarkas/lazysizes) by **Alexander Farkas**.

If you need full lazy loading features, we highly recommend using lazysizes. It provides:
- Lazy loading for images, iframes, and scripts
- LQIP and progressive loading
- Responsive image polyfills
- Extensive plugin ecosystem
- Battle-tested performance optimizations

## License

MIT
