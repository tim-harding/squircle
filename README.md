# Squircle [![Version](https://img.shields.io/npm/v/superellipse-squircle)](https://www.npmjs.com/package/superellipse-squircle)

The smoothest CSS squircles south of Saskatchewan. Powered by superellipses and
CSS Houdini 🪄. Visit the project site and [experience the
magic](https://tim-harding.github.io/squircle/) or read about [how it
works](https://tim-harding.github.io/blog/squircles/).

## Usage

### CSS

First, register the squircle web worker.

```js
import { register } from "superellipse-squircle";
register();
```

Now you can use `paint(squircle)` as a image source in CSS. Usually that will be
`background: paint(squircle);`, in which case you can use the provided
`squircle` class. This includes a fallback to normal rounded rectangles when CSS
Houdini isn't available.

```html
<div
  class="squircle"
  style="
    --squircle-border-radius: 1rem;
    --squircle-background-color: black;"
></div>
;
```

These properties control the squircle drawing:

| Property                      | Equivalent         |
| ----------------------------- | ------------------ |
| `--squircle-background-color` | `background-color` |
| `--squircle-border-radius`    | `border-radius`    |
| `--squircle-border-width`     | `border-width`     |
| `--squircle-border-color`     | `border-color`     |

To reduce the verbosity, consider using aliases:

```css
.squircle {
  --squircle-background-color: var(--fill);
  --squircle-border-radius: var(--radius);
  --squircle-border-width: var(--border-width);
  --squircle-border-color: var(--border-color);
}
```

### Web component

The `squircle` class falls back to normal rounded rectangles on browsers that
don't support the Paint API, which is [most of
them](https://caniuse.com/css-paint-api) at time of writing. To guarantee
squircles on all platforms, you can use the web component instead. It will add
an HTML5 `<canvas>` to draw with when the Paint API isn't available.

```js
import { createCustomElement } from "superellipse-squircle";
createCustomElement();
```

```html
<ce-squircle
  background-color="rgba(64, 128, 192, 0.5)"
  border-radius="16"
  border-width="4"
  border-color="black"
>
  Hello, world!
</ce-squircle>
```

### Canvas

You can also use the squircle drawing code directly in an HTML canvas. Import
the `paint` function to draw into a canvas context.

```js
import { draw, paint } from "superellipse-squircle";

// Just create a path
draw(canvasContext, posX, posY, width, height, borderRadius);

// Draw the squircle with stroke and fill
paint(
  canvasContext,
  posX,
  posY,
  width,
  height,
  borderRadius,
  borderWidth,
  fillColor,
  borderColor,
);
```

### SVG

You can create a string that is compatible with SVG `path` elements.

```svg
<svg viewBox="0 0 512 512">
  <path id="my-path" />
</svg>
```

```js
import { path } from "superellipse-squircle";

const d = path(0, 0, 512, 512, myRadius);
const path = document.getElementById("my-path");
path.d = d;
```
