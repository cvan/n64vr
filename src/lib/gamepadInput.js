import Gamepads from '../../../../../node_modules/gamepad-plus/src/lib/gamepads.js';


export default class GamepadInput {
  constructor() {
    this._debug = false;
    this._pollingInterval = {};
    this.config = {};
    this.gamepads = {};
  }

  /**
   * Polls the gamepad state, updating the `Gamepads` instance's `state`
   * property with the latest gamepad data.
   */
  _update() {
    this.gamepads.update();
    window.requestAnimationFrame(this._update.bind(this));
  }

  init(runtime) {
    this.gamepads = new Gamepads(this.config.input);

    if (!this.gamepads.gamepadsSupported) {
      return;
    }

    // At the time of this writing, Firefox is the only browser that
    // fires the `gamepadconnected` event. For the other browsers
    // <https://crbug.com/344556>, we start polling every 200ms
    // until the first gamepad is connected.
    if (Gamepads.utils.browser !== 'firefox') {
      this._pollingInterval = window.setInterval(() => {
        if (this.gamepads.poll().length) {
          this._update();
          window.clearInterval(this._pollingInterval);
        }
      }, 200);
    }

    window.addEventListener('gamepadconnected', e => {
      if (this._debug) {
        console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
          e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length,
          e.gamepad.axes.length);
      }

      this._update();
    });

    window.addEventListener('gamepaddisconnected', e => {
      if (this._debug) {
        console.log('Gamepad removed at index %d: %s.', e.gamepad.index,
          e.gamepad.id);
      }
    });
  }

  /**
   * Assigns gamepad configurations.
   * @param {Object} config Options object to use for creating `Gamepads` instance.
   */
  assign(config) {
    this.config = config || {};
  }
}
