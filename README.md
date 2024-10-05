# Squircle [![Version](https://img.shields.io/npm/v/superellipse-squircle)](https://www.npmjs.com/package/superellipse-squircle)

The smoothest CSS squircles south of Saskatchewan.
Powered by superellipses and CSS Houdini 🪄.
Visit the project site and [experience the
magic](https://tim-harding.github.io/squircle/).

## Usage

### CSS

First, initialize the library. Unlike most JavaScript, the worklet cannot be
imported as a module, so the worklet file must be served at the provided URL.
You can either use the minified files from [unpkg](https://unpkg.com/) or use
your bundler to get a URL.

```js
import url from "superellipse-squircle/worklet.min.js?url"; // Vite
import url from "url:superellipse-squircle/worklet.min.js"; // Parcel & WMR
import url from "omt:superellipse-squircle/worklet.min.js"; // Rollup
import url from "url-loader!:superellipse-squircle/worklet.min.js"; // WebPack 4 & 5
const url = "https://unpkg.com/superellipse-squircle@0.1.2/worklet.min.js"; // unpkg

import { register } from "superellipse-squircle";
register(url);

import "superellipse-squircle/index.css"; // Optional
<div
  class="squircle"
  style="
    --squircle-radius: 1rem;
    --squircle-fill: black;"
></div>;
```

Linking or importing the provided CSS creates a `squircle` class with fallbacks
for unsupported browsers. Alternatively, use the image source directly in your
CSS. For example, try `mask-image: paint(squircle);` to create a squircle layer
mask. At time of writing, only Chromium-based browsers support the Paint API, so
use `@supports (paint(id)) {...}` to check for support. See [Can I
Use](https://caniuse.com/css-paint-api) for updates.

These properties control the squircle drawing:

| Property                  | Equivalent         |
| ------------------------- | ------------------ |
| `--squircle-radius`       | `border-radius`    |
| `--squircle-fill`         | `background-color` |
| `--squircle-border-width` | `border-width`     |
| `--squircle-border-color` | `border-color`     |

To reduce verbosity, consider aliasing the CSS properties. For example, to use
`--radius` instead of `--squircle-radius`:

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
