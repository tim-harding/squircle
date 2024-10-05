# Squircle [![Version](https://img.shields.io/npm/v/superellipse-squircle)](https://www.npmjs.com/package/superellipse-squircle)

The smoothest CSS squircles south of Saskatchewan.
Powered by superellipses and CSS Houdini 🪄.

## Usage

### CSS

First, initialize the library.

```js
import { register } from "superellipse-squircle/index.mjs";
register("superellipse-squircle/worklet.min.js");
```

Optionally, also import the provided `squircle` CSS class or link it in your
CSS. This provides a fallback to ordinary rounded rectangles on unsupported
browsers.

```jsx
import "superellipse-squircle/index.css";
```

Note that the worklet is not a JavaScript module and your bundler won't know to
include it automatically. Make sure it's included in your build and that the
worklet path matches the route it is served from.

Elements with the `squircle` class will draw as squircles or fall back to
ordinary rounded rectangles on browsers that don't support the Paint API. At
the time of writing, only Chromium-based browsers work.

```html
<div
  class="squircle"
  style="
    --squircle-radius: 1rem;
    --squircle-fill: black;"
></div>
```

These properties control the squircle drawing.

| Property                  | Equivalent         |
| ------------------------- | ------------------ |
| `--squircle-radius`       | `border-radius`    |
| `--squircle-fill`         | `background-color` |
| `--squircle-border-width` | `border-width`     |
| `--squircle-border-color` | `border-color`     |

To reduce the verbosity, you can alias the property names in your CSS. For
example, to use `--radius` instead of `--squircle-radius`:

```css
.squircle {
  --squircle-radius: var(--radius);
}
```

### Canvas

You can also use the squircle drawing code directly in an HTML canvas. Import
the `paint` function to draw into a canvas context.

```js
import { paint } from "superellipse-squircle";
paint(canvasContext, posX, posY, width, height, borderRadius);
```
