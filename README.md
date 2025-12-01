# AutoSizes

Automatic `sizes` attribute calculator for responsive images. Simplified and modernized version extracted from [lazysizes](https://github.com/aFarkas/lazysizes).

## Features

- ✅ Automatic calculation of `sizes` attribute for responsive images
- ✅ Support for `<picture>` elements with multiple `<source>` tags
- ✅ Custom event for modifying calculated width before setting
- ✅ Automatic re-calculation on window resize (debounced)
- ✅ Lightweight and modern ES6 code
- ✅ Zero dependencies
- ✅ Auto-initialization on import

## Installation

Place the library in your project and import it:

```javascript
import 'autosizes';
```

That's it! The library will automatically initialize and start calculating sizes.

## Usage

### Basic Usage

Add the `autosizes` class to your images with `srcset` attribute:

```html
<img
  class="autosizes"
  srcset="
    image-300.jpg 300w,
    image-600.jpg 600w,
    image-900.jpg 900w,
    image-1200.jpg 1200w
  "
  src="image-600.jpg"
  alt="Responsive image"
/>
```

The library will automatically calculate and set the `sizes` attribute based on the image's display width.

### With Picture Element

```html
<picture>
  <source
    class="autosizes"
    media="(min-width: 768px)"
    srcset="
      image-large-600.jpg 600w,
      image-large-1200.jpg 1200w
    "
  />
  <source
    class="autosizes"
    srcset="
      image-small-300.jpg 300w,
      image-small-600.jpg 600w
    "
  />
  <img
    class="autosizes"
    srcset="
      image-300.jpg 300w,
      image-600.jpg 600w
    "
    src="image-300.jpg"
    alt="Art direction example"
  />
</picture>
```

The library will update `sizes` on both `<source>` and `<img>` elements.

## Configuration

You can configure the library before importing it:

```javascript
// Set configuration before import
window.autoSizesConfig = {
  className: 'autosizes',      // CSS class to identify elements (default: 'autosizes')
  minSize: 40,                 // Minimum size threshold (default: 40)
  init: true,                  // Auto-initialize on import (default: true)
  resizeDebounce: 99,          // Resize debounce delay in ms (default: 99)
};

import 'autosizes';
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `className` | string | `'autosizes'` | CSS class to identify elements that need auto-sizing |
| `minSize` | number | `40` | Minimum element width. If element is smaller, traverses up DOM tree |
| `init` | boolean | `true` | Auto-initialize on import |
| `resizeDebounce` | number | `99` | Debounce delay for resize events (milliseconds) |

## Events

### beforeCalculateSizes

Fired before the `sizes` attribute is set. Allows you to modify the calculated width or prevent the update.

```javascript
document.addEventListener('beforeCalculateSizes', (event) => {
  console.log('Original width:', event.detail.width);

  // Modify the width
  event.detail.width = event.detail.width * 0.8;

  // Or prevent setting sizes entirely
  // event.preventDefault();
});
```

**Event detail properties:**
- `width` (number) - Calculated width in pixels (can be modified)
- `dataAttr` (boolean) - Whether calculation was triggered by data attribute

### afterCalculateSizes

Fired after the `sizes` attribute has been set. Useful for tracking or logging size calculations.

```javascript
document.addEventListener('afterCalculateSizes', (event) => {
  console.log('Size set:', event.detail.sizes);
  console.log('Width:', event.detail.width);

  // Can't modify anymore, but useful for:
  // - Analytics tracking
  // - Debugging
  // - Triggering other updates
});
```

**Event detail properties:**
- `width` (number) - Calculated width in pixels (read-only)
- `sizes` (string) - The sizes value that was set (e.g., "450px")

## API

### Manual Control

If you disable auto-initialization, you can control the library manually:

```javascript
window.autoSizesConfig = { init: false };

import autoSizes from 'autosizes';

// Initialize manually
autoSizes.init();

// Update all elements
autoSizes.autoSizer.checkElems();

// Update specific element
const img = document.querySelector('.my-image');
autoSizes.autoSizer.updateElem(img);
```

### API Methods

| Method | Description |
|--------|-------------|
| `autoSizes.init()` | Initialize the library (called automatically by default) |
| `autoSizes.autoSizer.checkElems()` | Recalculate sizes for all elements |
| `autoSizes.autoSizer.updateElem(element)` | Update sizes for specific element |

## How It Works

1. The library finds all elements with the configured class (default: `.autosizes`)
2. For each element, it calculates the display width using `offsetWidth`
3. If the width is below `minSize`, it traverses up the DOM tree to find a larger parent
4. Triggers `beforeCalculateSizes` event (allows modification)
5. Sets the `sizes` attribute to the calculated width (e.g., `"450px"`)
6. For `<picture>` elements, also updates all child `<source>` elements
7. Listens to window `resize` events and recalculates (debounced)

## Browser Support

Modern browsers with ES6 support:
- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 15+

## Performance

- Uses `requestAnimationFrame` batching for smooth performance
- Debounces resize events (configurable)
- Uses `requestIdleCallback` when available for non-critical updates
- Minimal DOM operations

## Differences from lazysizes

This library is a **simplified, focused version** that only handles automatic `sizes` calculation. It removes:

- Lazy loading functionality
- Image unveiling/loading logic
- Intersection observer logic
- Plugin system
- Legacy browser support (IE11 and below)

## License

MIT

## Credits

Based on the `autoSizer` module from [lazysizes](https://github.com/aFarkas/lazysizes) by Alexander Farkas.
