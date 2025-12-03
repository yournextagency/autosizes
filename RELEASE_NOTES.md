# Release Notes v1.0.3

## 🎯 What's Changed

### Fixed `<picture>` Element Handling

- **Removed unnecessary `sizes` attribute on `<source>` elements** - Now complies with HTML specification
- According to HTML spec, only `<img>` element needs the `sizes` attribute within `<picture>`
- Browser automatically applies `sizes` from `<img>` to all `srcset` (including in `<source>` elements)

### Code Improvements

- Removed `regPicture` variable (no longer needed)
- Simplified `sizeElement()` function
- Cleaner, more standards-compliant implementation

## 📦 Size Reduction

Even smaller bundle size after code cleanup:

| Metric | v1.0.2 | v1.0.3 | Improvement |
|--------|--------|--------|-------------|
| Source code | 353 lines | 346 lines | **-2%** |
| Minified | ~3.3 KB | ~2.2 KB | **-33%** |
| Gzipped | ~1.5 KB | ~1.0 KB | **-33%** |

## 📚 Documentation Updates

- Updated README with correct `<picture>` usage examples
- Removed misleading examples showing `sizes` on `<source>` elements
- Added explanation of how browser handles `sizes` in picture elements

## Breaking Changes

None - this is a patch release that improves standards compliance without breaking existing functionality.

## Migration Guide

If you were using the library with `<picture>` elements:

### Before (still works, but unnecessary):
```html
<picture>
  <source sizes="auto" srcset="..." media="(min-width: 768px)" />
  <img class="autosizes" sizes="auto" srcset="..." />
</picture>
```

### After (recommended, HTML spec compliant):
```html
<picture>
  <source srcset="..." media="(min-width: 768px)" />
  <img class="autosizes" sizes="auto" srcset="..." />
</picture>
```

Simply remove `sizes="auto"` from `<source>` elements - only keep it on `<img>`.

## Credits

Thanks to the HTML specification analysis that revealed the redundancy in `<source>` sizes handling inherited from lazysizes.
