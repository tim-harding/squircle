class State {
  #radius = 16;
  #borderWidth = 4;
  #borderColor = "#1e66f5";
  #fill = "#7287fd";
  /** @type {Array<() => any>} */
  #subscribers = [];

  /**
   * @param {() => any} cb
   */
  subscribe(cb) {
    this.#subscribers.push(cb);
    cb();
  }

  #publish() {
    for (const cb of this.#subscribers) {
      cb();
    }
  }

  get radius() {
    return this.#radius;
  }

  set radius(x) {
    this.#radius = x;
    this.#publish();
  }

  get borderWidth() {
    return this.#borderWidth;
  }

  set borderWidth(x) {
    this.#borderWidth = x;
    this.#publish();
  }

  get borderColor() {
    return this.#borderColor;
  }

  set borderColor(x) {
    this.#borderColor = x;
    this.#publish();
  }

  get fill() {
    return this.#fill;
  }

  set fill(x) {
    this.#fill = x;
    this.#publish();
  }
}

export const state = new State();
