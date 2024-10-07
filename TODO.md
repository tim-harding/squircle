- [ ] Move web component to framework

- [ ] Support gradients

Gradients support adds complexity since instead of just passing `--squircle-fill` to the canvas `fillStyle`, we have to either parse the `--squircle-fill` as a color or gradient definition to create a `CanvasGradient` in code. Either that or we can support arbitrary `<image>` definitions, which requires creating an `SVGImageElement` for `drawImage`. That could involve a lot of string manipulation, which might not be as good for something that needs to run really fast.
