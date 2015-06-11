;(function () {

function GamepadInput() {
  this._debug = true;
  this._pollingInterval = {};
  this.config = {};
  this.gamepads = {};
}

/**
 * Polls the gamepad state, updating the `Gamepads` instance's `state`
 * property with the latest gamepad data.
 */
GamepadInput.prototype._update = function () {
  this.gamepads.update();
  window.requestAnimationFrame(this._update.bind(this));
};

GamepadInput.prototype.init = function (runtime) {
  var self = this;

  self.gamepads = new Gamepads(self.config);

  if (!self.gamepads.gamepadsSupported) {
    return;
  }

  // At the time of self writing, Firefox is the only browser that
  // fires the `gamepadconnected` event. For the other browsers
  // <https://crbug.com/344556>, we start polling every 200ms
  // until the first gamepad is connected.
  if (Gamepads.utils.browser !== 'firefox') {
    self._pollingInterval = window.setInterval(function () {
      if (self.gamepads.poll().length) {
        self._update();
        window.clearInterval(self._pollingInterval);
      }
    }, 200);
  }

  window.addEventListener('gamepadconnected', function (e) {
    if (self._debug) {
      console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
        e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length,
        e.gamepad.axes.length);
    }

    self._update();
  });

  window.addEventListener('gamepaddisconnected', function (e) {
    if (self._debug) {
      console.log('Gamepad removed at index %d: %s.', e.gamepad.index,
        e.gamepad.id);
    }
  });
}

/**
 * Assigns gamepad configurations.
 * @param {Object} config Options object to use for creating `Gamepads` instance.
 */
GamepadInput.prototype.assign = function (config) {
  this.config = config || {};
};


var gamepadInput = new GamepadInput();

function triggerKeyEvent(keyCode, doc) {
  doc = doc || document;

  var keyboardEvent = doc.createEvent('KeyboardEvent');
  var initMethod = typeof keyboardEvent.initKeyboardEvent === 'undefined' ? 'initKeyEvent': 'initKeyboardEvent';

  keyboardEvent[initMethod](
    'keydown',  // event type: keydown, keyup, keypress
    true,  // bubbles
    true,  // cancelable
    window,  // viewArg: should be window
    false,  // ctrlKeyArg
    false,  // altKeyArg
    false,  // shiftKeyArg
    false,  // metaKeyArg
    keyCode,  // keyCodeArg: unsigned long – the virtual key code, else 0
    0  // charCodeArgs: unsigned long – the Unicode character associated with the depressed key, else 0
  );
  doc.dispatchEvent(keyboardEvent);
}


document.addEventListener('keydown', function (e) {
  console.log('keydown', e.which, e.key);
});


gamepadInput.assign({
  axisThreshold: 0,
  indices: {
    standard: {

      'b0.down': function () {
        console.log('[c-up]');
        triggerKeyEvent('i'.charCodeAt(0));
      },

      'b1.down': function () {
        console.log('[c-right]');
        triggerKeyEvent('k'.charCodeAt(0));
      },

      'b2.down': function () {
        console.log('[c-down]');
        triggerKeyEvent('j'.charCodeAt(0));
      },

      'b3.down': function () {
        console.log('[c-left]');
        triggerKeyEvent('l'.charCodeAt(0));
      },

      'b6.down': function () {
        console.log('[a]');
        triggerKeyEvent('g'.charCodeAt(0));
      },

      'b8.down': function () {
        console.log('[b]');
        triggerKeyEvent('f'.charCodeAt(0));
      },

      'b9.down': function () {
        console.log('[start]');
        triggerKeyEvent(13);
      },

      'b4.down': function () {
        console.log('[left]');
        triggerKeyEvent('x'.charCodeAt(0));
      },

      'b5.down': function () {
        console.log('[right]');
        triggerKeyEvent('c'.charCodeAt(0));
      },

      'b7.down': function () {
        console.log('[z]');
        triggerKeyEvent('z'.charCodeAt(0));
      },

      'b12.down': function () {
        console.log('[up]');
        triggerKeyEvent('w'.charCodeAt(0));
      },

      'b13.down': function () {
        console.log('[down]');
        triggerKeyEvent('s'.charCodeAt(0));
      },

      'b14.down': function () {
        console.log('[left]');
        triggerKeyEvent('a'.charCodeAt(0));
      },

      'b15.down': function () {
        console.log('[right]');
        triggerKeyEvent('d'.charCodeAt(0));
      },

      'a1': function (gamepad, axis, value) {
        console.log('[stick x]');
        if (value > 0) {
          triggerKeyEvent('39'.charCodeAt(0));
        }
        else {
          triggerKeyEvent('37'.charCodeAt(0));
        }
      },

      'a2': function (gamepad, axis, value) {
        console.log('[stick y]');
        if (value > 0) {
          triggerKeyEvent('40'.charCodeAt(0));
        }
        else {
          triggerKeyEvent('38'.charCodeAt(0));
        }
      },

    }
  }
});

gamepadInput.init();

})();
