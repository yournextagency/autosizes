# Changelog

All notable changes to this project will be documented in this file.

## [1.0.4] - 2025-12-03

### 🐛 Fixed
- **Critical bug**: Resize events now work correctly. The library was not recalculating `sizes` attribute on window resize after initial load.
- Root cause: `hasSizesAuto()` check in `sizeElement()` prevented updates after first calculation when `sizes` changed from `"auto"` to a pixel value.

### 🔧 Changed
- Removed unnecessary `hasSizesAuto()` check from `sizeElement()` function
- Elements with `autosizes` class are now always updated on resize events
- Removed unused `hasSizesAuto()` function

### 📦 Size
- Source: 7.8 KB / 335 lines (-11 lines)
- Minified: 2.1 KB (was 2.2 KB)
- Gzipped: 995 bytes (< 1 KB!)

### ✅ Verified
- Window resize events trigger size recalculation
- Container width changes update sizes correctly
- Mobile orientation changes work properly
- Debounced updates prevent performance issues

## [1.0.3] - 2025-12-03

### 🎯 Fixed
- **Picture element handling**: Removed unnecessary `sizes` attribute on `<source>` elements to comply with HTML specification
- According to HTML spec, only `<img>` element needs the `sizes` attribute within `<picture>`

### 🔧 Changed
- Removed `regPicture` variable (no longer needed)
- Simplified `sizeElement()` function by removing source element processing
- Browser automatically applies `sizes` from `<img>` to all `srcset` (including in `<source>` elements)

### 📚 Documentation
- Updated README with correct `<picture>` usage examples
- Removed misleading examples showing `sizes` on `<source>` elements
- Added explanation of how browser handles `sizes` in picture elements

### 📦 Size
- Source: 8.0 KB / 346 lines
- Minified: 2.2 KB (was ~3.3 KB) - **33% reduction**
- Gzipped: ~1.0 KB (was ~1.5 KB) - **33% reduction**

## [1.0.2] - 2025-12-03

### Initial public release

### Features
- 🎯 Automatic calculation of `sizes` attribute from element width
- 📦 Tiny size (~3.3KB minified, ~1.5KB gzipped)
- 🚀 High performance with RAF batching and debounced resize
- 🖼️ Smart `<picture>` support
- 🔄 Auto-updates on window resize
- 🎨 Customizable via events and CSS classes
- 📱 Works with any responsive image setup
- ✨ Modern ES6 code for current browsers

### Differences from lazysizes
- Removed lazy loading functionality
- Removed IntersectionObserver
- Removed MutationObserver
- Removed scroll events
- Removed IE11 support
- Removed plugin system
- Focus only on automatic `sizes` calculation
- **`sizes="auto"` requirement** - Explicit opt-in per element
- **Prefix support** - `data-sizes="auto"` sets both attributes
- **Modern ES6** - Cleaner, more maintainable code
- **Simplified API** - `updateAll()` and `updateElem()`

### Credits
Extracted from [lazysizes](https://github.com/aFarkas/lazysizes) by Alexander Farkas

---

## Version History Summary

| Version | Date | Key Changes | Bundle Size |
|---------|------|-------------|-------------|
| 1.0.4 | 2025-12-03 | Fix resize bug | 2.1 KB / 995 B gzip |
| 1.0.3 | 2025-12-03 | Fix picture elements | 2.2 KB / 1.0 KB gzip |
| 1.0.2 | 2025-12-03 | Initial release | 3.3 KB / 1.5 KB gzip |
