(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Gamepads = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A simple event-emitter class. Like Node's but much simpler.
 */

var EventEmitter = (function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this._listeners = {};
  }

  _createClass(EventEmitter, [{
    key: "emit",
    value: function emit(name) {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // console.log('emit', name, args, this._listeners);
      (this._listeners[name] || []).forEach(function (func) {
        return func.apply(_this, args);
      });
      return this;
    }
  }, {
    key: "on",
    value: function on(name, func) {
      if (name in this._listeners) {
        this._listeners[name].push(func);
      } else {
        this._listeners[name] = [func];
      }
      return this;
    }
  }, {
    key: "off",
    value: function off(name) {
      if (name) {
        this._listeners[name] = [];
      } else {
        this._listeners = {};
      }
      return this;
    }
  }]);

  return EventEmitter;
})();

exports["default"] = EventEmitter;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _event_emitterJs = require('./event_emitter.js');

var _event_emitterJs2 = _interopRequireDefault(_event_emitterJs);

var _utilsJs = require('./utils.js');

var _utilsJs2 = _interopRequireDefault(_utilsJs);

var utils = new _utilsJs2['default']();

var DEFAULT_CONFIG = {
  'axisThreshold': 0.15,
  'gamepadAttributesEnabled': true,
  'gamepadIndicesEnabled': true,
  'keyEventsEnabled': true,
  'nonstandardEventsEnabled': true,
  'indices': undefined,
  'keyEvents': undefined
};

var DEFAULT_STATE = {
  buttons: new Array(17),
  axes: [0, 0, 0, 0]
};

for (var i = 0; i < 17; i++) {
  DEFAULT_STATE.buttons[i] = {
    pressed: false,
    value: 0
  };
}

var Gamepads = (function (_EventEmitter) {
  function Gamepads(config) {
    var _this = this;

    _classCallCheck(this, Gamepads);

    _get(Object.getPrototypeOf(Gamepads.prototype), 'constructor', this).call(this);

    this.polyfill();

    this._gamepadApis = ['getGamepads', 'webkitGetGamepads', 'webkitGamepads'];
    this._gamepadDOMEvents = ['gamepadconnected', 'gamepaddisconnected'];
    this._gamepadInternalEvents = ['gamepadconnected', 'gamepaddisconnected', 'gamepadbuttondown', 'gamepadbuttonup', 'gamepadaxismove'];
    this._seenEvents = {};

    this.dataSource = this.getGamepadDataSource();
    this.gamepadsSupported = this._hasGamepads();
    this.indices = {};
    this.keyEvents = {};
    this.previousState = {};
    this.state = {};

    // Mark the events we see (keyed off gamepad index)
    // so we don't fire the same event twice.
    this._gamepadDOMEvents.forEach(function (eventName) {
      window.addEventListener(eventName, function (e) {
        _this.addSeenEvent(e.gamepad, eventName, 'dom');

        // Let the events fire again, if they've been disconnected/reconnected.
        if (eventName === 'gamepaddisconnected') {
          _this.removeSeenEvent(e.gamepad, 'gamepadconnected', 'dom');
        } else if (eventName === 'gamepadconnected') {
          _this.removeSeenEvent(e.gamepad, 'gamepaddisconnected', 'dom');
        }
      });
    });
    this._gamepadInternalEvents.forEach(function (eventName) {
      _this.on(eventName, function (gamepad) {
        _this.addSeenEvent(gamepad, eventName, 'internal');

        if (eventName === 'gamepaddisconnected') {
          _this.removeSeenEvent(gamepad, 'gamepadconnected', 'internal');
        } else {
          _this.removeSeenEvent(gamepad, 'gamepaddisconnected', 'internal');
        }
      });
    });

    config = config || {};
    Object.keys(DEFAULT_CONFIG).forEach(function (key) {
      _this[key] = typeof config[key] === 'undefined' ? DEFAULT_CONFIG[key] : utils.clone(config[key]);
    });

    if (this.gamepadIndicesEnabled) {
      this.on('gamepadconnected', this._onGamepadConnected.bind(this));
      this.on('gamepaddisconnected', this._onGamepadDisconnected.bind(this));
      this.on('gamepadbuttondown', this._onGamepadButtonDown.bind(this));
      this.on('gamepadbuttonup', this._onGamepadButtonUp.bind(this));
      this.on('gamepadaxismove', this._onGamepadAxisMove.bind(this));
    }
  }

  _inherits(Gamepads, _EventEmitter);

  _createClass(Gamepads, [{
    key: 'polyfill',
    value: function polyfill() {
      if (this._polyfilled) {
        return;
      }

      if (!('performance' in window)) {
        window.performance = {};
      }

      if (!('now' in window.performance)) {
        window.performance.now = function () {
          return +new Date();
        };
      }

      if (!('GamepadButton' in window)) {
        var GamepadButton = window.GamepadButton = function (obj) {
          return {
            pressed: obj.pressed,
            value: obj.value
          };
        };
      }

      this._polyfilled = true;
    }
  }, {
    key: '_getVendorProductIds',
    value: function _getVendorProductIds(gamepad) {
      var bits = gamepad.id.split('-');
      var match;

      if (bits.length < 2) {
        match = gamepad.id.match(/vendor: (\w+) product: (\w+)/i);
        if (match) {
          return match.slice(1).map(utils.stripLeadingZeros);
        }
      }

      match = gamepad.id.match(/(\w+)-(\w+)/);
      if (match) {
        return match.slice(1).map(utils.stripLeadingZeros);
      }

      return bits.slice(0, 2).map(utils.stripLeadingZeros);
    }
  }, {
    key: '_hasGamepads',
    value: function _hasGamepads() {
      for (var i = 0, len = this._gamepadApis.length; i < len; i++) {
        if (this._gamepadApis[i] in navigator) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: '_getGamepads',
    value: function _getGamepads() {
      for (var i = 0, len = this._gamepadApis.length; i < len; i++) {
        if (this._gamepadApis[i] in navigator) {
          return navigator[this._gamepadApis[i]]();
        }
      }
      return [];
    }
  }, {
    key: 'updateGamepad',
    value: function updateGamepad(gamepad) {
      this.previousState[gamepad.index] = utils.clone(this.state[gamepad.index] || DEFAULT_STATE);
      this.state[gamepad.index] = gamepad ? utils.clone(gamepad) : DEFAULT_STATE;

      // Fire connection event, if gamepad was actually connected.
      this.fireConnectionEvent(this.state[gamepad.index], true);
    }
  }, {
    key: 'removeGamepad',
    value: function removeGamepad(gamepad) {
      delete this.state[gamepad.index];

      // Fire disconnection event.
      this.fireConnectionEvent(gamepad, false);
    }
  }, {
    key: 'observeButtonChanges',
    value: function observeButtonChanges(gamepad) {
      var _this2 = this;

      var previousPad = this.previousState[gamepad.index];
      var currentPad = this.state[gamepad.index];

      if (!previousPad || !Object.keys(previousPad).length || !currentPad || !Object.keys(currentPad).length) {
        return;
      }

      currentPad.buttons.forEach(function (button, buttonIdx) {
        if (button.value !== previousPad.buttons[buttonIdx].value) {
          // Fire button events.
          _this2.fireButtonEvent(currentPad, buttonIdx, button.value);

          // Fire synthetic keyboard events, if needed.
          _this2.fireKeyEvent(currentPad, buttonIdx, button.value);
        }
      });
    }
  }, {
    key: 'observeAxisChanges',
    value: function observeAxisChanges(gamepad) {
      var _this3 = this;

      var previousPad = this.previousState[gamepad.index];
      var currentPad = this.state[gamepad.index];

      if (!previousPad || !Object.keys(previousPad).length || !currentPad || !Object.keys(currentPad).length) {
        return;
      }

      currentPad.axes.forEach(function (axis, axisIdx) {
        // Fire axis events.
        if (axis !== previousPad.axes[axisIdx]) {
          _this3.fireAxisMoveEvent(currentPad, axisIdx, axis);
        }
      });
    }
  }, {
    key: 'update',

    /**
     * @function
     * @name Gamepads#update
     * @description
     *   Update the current and previous states of the gamepads.
     *   This must be called every frame for events to work.
     */
    value: function update() {
      var _this4 = this;

      var activePads = {};

      this.poll().forEach(function (pad) {
        // Keep track of which gamepads are still active (not disconnected).
        activePads[pad.index] = true;

        // Add/update connected gamepads
        // (and fire internal events + polyfilled events, if needed).
        _this4.updateGamepad(pad);

        // Never seen this actually be the case, but if a pad is still in the
        // `navigator.getGamepads()` list and it's disconnected, emit the event.
        if (!pad.connected) {
          _this4.removeGamepad(_this4.state[padIdx]);
        }

        // Fire internal events + polyfilled non-standard events, if needed.
        _this4.observeButtonChanges(pad);
        _this4.observeAxisChanges(pad);
      });

      Object.keys(this.state).forEach(function (padIdx) {
        if (!(padIdx in activePads)) {
          // Remove disconnected gamepads
          // (and fire internal events + polyfilled events, if needed).
          _this4.removeGamepad(_this4.state[padIdx]);
        }
      });
    }
  }, {
    key: 'getGamepadDataSource',

    /**
     * @function
     * @name Gamepads#getGamepadDataSource
     * @description Get gamepad data source (e.g., linuxjoy, hid, dinput, xinput).
     * @returns {String} A string of gamepad data source.
     */
    value: function getGamepadDataSource() {
      var dataSource;
      if (navigator.platform.match(/^Linux/)) {
        dataSource = 'linuxjoy';
      } else if (navigator.platform.match(/^Mac/)) {
        dataSource = 'hid';
      } else if (navigator.platform.match(/^Win/)) {
        var m = navigator.userAgent.match('Gecko/(..)');
        if (m && parseInt(m[1]) < 32) {
          dataSource = 'dinput';
        } else {
          dataSource = 'hid';
        }
      }
      return dataSource;
    }
  }, {
    key: 'poll',

    /**
     * @function
     * @name Gamepads#poll
     * @description Poll for the latest data from the gamepad API.
     * @returns {Array} An array of gamepads and mappings for the model of the connected gamepad.
     * @example
     *   var gamepads = new Gamepads();
     *   var pads = gamepads.poll();
     */
    value: function poll() {
      var pads = [];

      if (this.gamepadsSupported) {
        var padsRaw = this._getGamepads();
        var pad;

        for (var i = 0, len = padsRaw.length; i < len; i++) {
          pad = padsRaw[i];

          if (!pad) {
            continue;
          }

          pad = this.extend(pad);

          pads.push(pad);
        }
      }

      return pads;
    }
  }, {
    key: 'extend',

    /**
     * @function
     * @name Gamepads#extend
     * @description Set new properties on a gamepad object.
     * @param {Object} gamepad The original gamepad object.
     * @returns {Object} An extended copy of the gamepad.
     */
    value: function extend(gamepad) {
      if (gamepad._extended) {
        return gamepad;
      }

      var pad = utils.clone(gamepad);

      pad._extended = true;

      if (this.gamepadAttributesEnabled) {
        pad.attributes = this._getAttributes(pad);
      }

      if (!pad.timestamp) {
        pad.timestamp = window.performance.now();
      }

      if (this.gamepadIndicesEnabled) {
        pad.indices = this._getIndices(pad);
      }

      return pad;
    }
  }, {
    key: '_getAttributes',

    /**
     * @function
     * @name Gamepads#_getAttributes
     * @description Generate and return the attributes of a gamepad.
     * @param {Object} gamepad The gamepad object.
     * @returns {Object} The attributes for this gamepad.
     */
    value: function _getAttributes(gamepad) {
      var padIds = this._getVendorProductIds(gamepad);
      return {
        vendorId: padIds[0],
        productId: padIds[1],
        name: gamepad.id,
        dataSource: this.dataSource
      };
    }
  }, {
    key: '_getIndices',

    /**
     * @function
     * @name Gamepads#_getIndices
     * @description Return the named indices of a gamepad.
     * @param {Object} gamepad The gamepad object.
     * @returns {Object} The named indices for this gamepad.
     */
    value: function _getIndices(gamepad) {
      return this.indices[gamepad.id] || this.indices.standard || {};
    }
  }, {
    key: '_mapAxis',

    /**
     * @function
     * @name Gamepads#_mapAxis
     * @description Set the value for one of the analogue axes of the pad.
     * @param {Number} axis The button to get the value of.
     * @returns {Number} The value of the axis between -1 and 1.
     */
    value: function _mapAxis(axis) {
      if (Math.abs(axis) < this.axisThreshold) {
        return 0;
      }

      return axis;
    }
  }, {
    key: '_mapButton',

    /**
     * @function
     * @name Gamepads#_mapButton
     * @description Set the value for one of the buttons of the pad.
     * @param {Number} button The button to get the value of.
     * @returns {Object} An object resembling a `GamepadButton` object.
     */
    value: function _mapButton(button) {
      if (typeof button === 'number') {
        // Old versions of the API used to return just numbers instead
        // of `GamepadButton` objects.
        button = new GamepadButton({
          pressed: button === 1,
          value: button
        });
      }

      return button;
    }
  }, {
    key: 'setIndices',
    value: function setIndices(indices) {
      this.indices = utils.clone(indices);
    }
  }, {
    key: 'fireConnectionEvent',
    value: function fireConnectionEvent(gamepad, connected) {
      var name = connected ? 'gamepadconnected' : 'gamepaddisconnected';

      if (!this.hasSeenEvent(gamepad, name, 'internal')) {
        // Fire internal event.
        this.emit(name, gamepad);
      }

      // Don't fire the 'gamepadconnected'/'gamepaddisconnected' events if the
      // browser has already fired them. (Unfortunately, we can't feature detect
      // if they'll get fired.)
      if (!this.hasSeenEvent(gamepad, name, 'dom')) {
        var data = {
          bubbles: false,
          cancelable: false,
          detail: {
            gamepad: gamepad
          }
        };

        utils.triggerEvent(window, name, data);
      }
    }
  }, {
    key: 'fireButtonEvent',
    value: function fireButtonEvent(gamepad, button, value) {
      var name = value === 1 ? 'gamepadbuttondown' : 'gamepadbuttonup';

      // Fire internal event.
      this.emit(name, gamepad, button, value);

      if (this.nonstandardEventsEnabled && !('GamepadButtonEvent' in window)) {
        var data = {
          bubbles: false,
          cancelable: false,
          detail: {
            button: button,
            gamepad: gamepad
          }
        };
        utils.triggerEvent(window, name, data);
      }
    }
  }, {
    key: 'fireAxisMoveEvent',
    value: function fireAxisMoveEvent(gamepad, axis, value) {
      var name = 'gamepadaxismove';

      // Fire internal event.
      this.emit(name, gamepad, axis, value);

      if (!this.nonstandardEventsEnabled || 'GamepadAxisMoveEvent' in window) {
        return;
      }

      if (Math.abs(value) < this.axisThreshold) {
        return;
      }

      var data = {
        bubbles: false,
        cancelable: false,
        detail: {
          axis: axis,
          gamepad: gamepad,
          value: value
        }
      };
      utils.triggerEvent(window, name, data);
    }
  }, {
    key: 'fireKeyEvent',
    value: function fireKeyEvent(gamepad, button, value) {
      if (!this.keyEventsEnabled || !this.keyEvents) {
        return;
      }

      var buttonName = utils.swap(gamepad.indices)[button];

      if (typeof buttonName === 'undefined') {
        return;
      }

      var names = value === 1 ? ['keydown', 'keypress'] : ['keyup'];
      var data = this.keyEvents[buttonName];

      if (!data) {
        return;
      }

      if (!('bubbles' in data)) {
        data.bubbles = true;
      }
      if (!data.detail) {
        data.detail = {};
      }
      data.detail.button = button;
      data.detail.gamepad = gamepad;

      names.forEach(function (name) {
        utils.triggerEvent(data.target || document.activeElement, name, data);
      });
    }
  }, {
    key: 'addSeenEvent',
    value: function addSeenEvent(gamepad, eventType, namespace) {
      var key = [gamepad.index, eventType, namespace].join('.');

      this._seenEvents[key] = true;
    }
  }, {
    key: 'hasSeenEvent',
    value: function hasSeenEvent(gamepad, eventType, namespace) {
      var key = [gamepad.index, eventType, namespace].join('.');

      return !!this._seenEvents[key];
    }
  }, {
    key: 'removeSeenEvent',
    value: function removeSeenEvent(gamepad, eventType, namespace) {
      var key = [gamepad.index, eventType, namespace].join('.');

      delete this._seenEvents[key];
    }
  }, {
    key: 'buttonEvent2axisEvent',
    value: function buttonEvent2axisEvent(e) {
      if (e.type === 'gamepadbuttondown') {
        e.axis = e.button;
        e.value = 1;
      } else if (e.type === 'gamepadbuttonup') {
        e.axis = e.button;
        e.value = 0;
      }
      return e;
    }
  }, {
    key: '_buttonDownEqualsKey',

    /**
     * Returns whether a `button` index equals the supplied `key`.
     *
     * Useful for determining whether ``navigator.getGamepads()[0].buttons[`$button`]``
     * has any bindings defined (in `FrameManager`).
     *
     * @param {Number} button Index of gamepad button (e.g., `4`).
     * @param {String} key Human-readable format for button binding (e.g., 'b4').
     */
    value: function _buttonDownEqualsKey(button, key) {
      return 'b' + button + '.down' === key.trim().toLowerCase();
    }
  }, {
    key: '_buttonUpEqualsKey',
    value: function _buttonUpEqualsKey(button, key) {
      var keyClean = key.trim().toLowerCase();
      return 'b' + button + '.up' === keyClean || 'b' + button === keyClean;
    }
  }, {
    key: '_axisMoveEqualsKey',

    /**
     * Returns whether an `axis` index equals the supplied `key`.
     *
     * Useful for determining whether ``navigator.getGamepads()[0].axes[`$button`]``
     * has any bindings defined (in `FrameManager`).
     *
     * @param {Number} button Index of gamepad axis (e.g., `1`).
     * @param {String} key Human-readable format for button binding (e.g., 'a1').
     */
    value: function _axisMoveEqualsKey(axis, key) {
      return 'a' + axis === key.trim().toLowerCase();
    }
  }, {
    key: '_onGamepadConnected',

    /**
     * Calls any bindings defined for 'connected' (in `FrameManager`).
     *
     * (Called by event listener for `gamepadconnected`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     */
    value: function _onGamepadConnected(gamepad) {
      if ('connected' in gamepad.indices) {
        gamepad.indices.connected(gamepad);
      }
    }
  }, {
    key: '_onGamepadDisconnected',

    /**
     * Calls any bindings defined for 'disconnected' (in `FrameManager`).
     *
     * (Called by event listener for `gamepadconnected`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     */
    value: function _onGamepadDisconnected(gamepad) {
      if ('disconnected' in gamepad.indices) {
        gamepad.indices.disconnected(gamepad);
      }
    }
  }, {
    key: '_onGamepadButtonDown',

    /**
     * Calls any bindings defined for buttons (e.g., 'b4.up' in `FrameManager`).
     *
     * (Called by event listener for `gamepadconnected`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     * @param {Number} button Index of gamepad button (integer) being pressed
     *                        (per `gamepadbuttondown` event).
     */
    value: function _onGamepadButtonDown(gamepad, button) {
      for (var key in gamepad.indices) {
        if (this._buttonDownEqualsKey(button, key)) {
          gamepad.indices[key](gamepad, button);
        }
      }
    }
  }, {
    key: '_onGamepadButtonUp',

    /**
     * Calls any bindings defined for buttons (e.g., 'b4.down' in `FrameManager`).
     *
     * (Called by event listener for `gamepadconnected`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     * @param {Number} button Index of gamepad button (integer) being released
     *                        (per `gamepadbuttonup` event).
     */
    value: function _onGamepadButtonUp(gamepad, button) {
      for (var key in gamepad.indices) {
        if (this._buttonUpEqualsKey(button, key)) {
          gamepad.indices[key](gamepad, button);
        }
      }
    }
  }, {
    key: '_onGamepadAxisMove',

    /**
     * Calls any bindings defined for axes (e.g., 'a1' in `FrameManager`).
     *
     * (Called by event listener for `gamepadaxismove`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     * @param {Number} axis Index of gamepad axis (integer) being changed
     *                      (per `gamepadaxismove` event).
     * @param {Number} value Value of gamepad axis (from -1.0 to 1.0) being
     *                       changed (per `gamepadaxismove` event).
     */
    value: function _onGamepadAxisMove(gamepad, axis, value) {
      for (var key in gamepad.indices) {
        if (this._axisMoveEqualsKey(axis, key)) {
          gamepad.indices[key](gamepad, axis, value);
        }
      }
    }
  }]);

  return Gamepads;
})(_event_emitterJs2['default']);

exports['default'] = Gamepads;

Gamepads.utils = utils;
module.exports = exports['default'];

},{"./event_emitter.js":1,"./utils.js":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Utils = (function () {
  function Utils() {
    _classCallCheck(this, Utils);

    this.browser = this.getBrowser();
    this.engine = this.getEngine(this.browser);
  }

  _createClass(Utils, [{
    key: 'clone',
    value: function clone(obj) {
      if (obj === null || typeof obj === 'function' || !(obj instanceof Object)) {
        return obj;
      }

      var ret = '';

      if (obj instanceof Date) {
        ret = new Date();
        ret.setTime(obj.getTime());
        return ret;
      }

      if (obj instanceof Array) {
        ret = [];
        for (var i = 0, len = obj.length; i < len; i++) {
          ret[i] = this.clone(obj[i]);
        }
        return ret;
      }

      if (obj instanceof Object) {
        ret = {};
        for (var attr in obj) {
          if (attr in obj) {
            ret[attr] = this.clone(obj[attr]);
          }
        }
        return ret;
      }

      throw new Error('Unable to clone object of unexpected type!');
    }
  }, {
    key: 'swap',
    value: function swap(obj) {
      var ret = {};
      for (var attr in obj) {
        if (attr in obj) {
          ret[obj[attr]] = attr;
        }
      }
      return ret;
    }
  }, {
    key: 'getBrowser',
    value: function getBrowser() {
      if (typeof window === 'undefined') {
        return;
      }

      if (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera).
        return 'opera';
      } else if ('chrome' in window) {
        // Chrome 1+.
        return 'chrome';
      } else if (typeof InstallTrigger !== 'undefined') {
        // Firefox 1.0+.
        return 'firefox';
      } else if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
        // At least Safari 3+: "[object HTMLElementConstructor]".
        return 'safari';
      } else if ( /*@cc_on!@*/false || !!document.documentMode) {
        // At least IE6.
        return 'ie';
      }
    }
  }, {
    key: 'getEngine',
    value: function getEngine(browser) {
      browser = browser || this.getBrowser();

      if (browser === 'firefox') {
        return 'gecko';
      } else if (browser === 'opera' || browser === 'chrome' || browser === 'safari') {
        return 'webkit';
      } else if (browser === 'ie') {
        return 'trident';
      }
    }
  }, {
    key: 'stripLeadingZeros',
    value: function stripLeadingZeros(str) {
      if (typeof str !== 'string') {
        return str;
      }
      return str.replace(/^0+(?=\d+)/g, '');
    }
  }, {
    key: 'triggerEvent',
    value: function triggerEvent(el, name, data) {
      data = data || {};
      data.detail = data.detail || {};

      var event;

      if ('CustomEvent' in window) {
        event = new CustomEvent(name, data);
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(name, data.bubbles, data.cancelable, data.detail);
      }

      Object.keys(data.detail).forEach(function (key) {
        event[key] = data.detail[key];
      });

      el.dispatchEvent(event);
    }
  }]);

  return Utils;
})();

exports['default'] = Utils;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libGamepadsJs = require('./lib/gamepads.js');

var _libGamepadsJs2 = _interopRequireDefault(_libGamepadsJs);

exports['default'] = _libGamepadsJs2['default'];
module.exports = exports['default'];

},{"./lib/gamepads.js":2}]},{},[4])(4)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvb3B0L2dhbWVwYWQtcGx1cy9zcmMvbGliL2V2ZW50X2VtaXR0ZXIuanMiLCIvb3B0L2dhbWVwYWQtcGx1cy9zcmMvbGliL2dhbWVwYWRzLmpzIiwiL29wdC9nYW1lcGFkLXBsdXMvc3JjL2xpYi91dGlscy5qcyIsIi9vcHQvZ2FtZXBhZC1wbHVzL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0lDSXFCLFlBQVk7QUFDcEIsV0FEUSxZQUFZLEdBQ2pCOzBCQURLLFlBQVk7O0FBRTdCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0dBQ3RCOztlQUhrQixZQUFZOztXQUszQixjQUFDLElBQUksRUFBVzs7O3dDQUFOLElBQUk7QUFBSixZQUFJOzs7O0FBRWhCLE9BQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUEsQ0FBRSxPQUFPLENBQUMsVUFBQSxJQUFJO2VBQUksSUFBSSxDQUFDLEtBQUssUUFBTyxJQUFJLENBQUM7T0FBQSxDQUFDLENBQUM7QUFDdEUsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRUMsWUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ2IsVUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUMzQixZQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNsQyxNQUFNO0FBQ0wsWUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ2hDO0FBQ0QsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRUUsYUFBQyxJQUFJLEVBQUU7QUFDUixVQUFJLElBQUksRUFBRTtBQUNSLFlBQUksQ0FBQyxVQUFVLENBQUMsSUFB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VUFBSSxLQUFLLENBQUM7O0FBRVYsVUFBSSxhQUFhLElBQUksTUFBTSxFQUFFO0FBQzNCLGFBQUssR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDckMsTUFBTTtBQUNMLGFBQUssR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzVDLGFBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDekU7O0FBRUQsWUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ3hDLGFBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQy9CLENBQUMsQ0FBQzs7QUFFSCxRQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3pCOzs7U0E5R2tCLEtBQUs7OztxQkFBTCxLQUFLOzs7Ozs7Ozs7Ozs7NkJDQUwsbUJBQW1CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQSBzaW1wbGUgZXZlbnQtZW1pdHRlciBjbGFzcy4gTGlrZSBOb2RlJ3MgYnV0IG11Y2ggc2ltcGxlci5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgfVxuXG4gIGVtaXQobmFtZSwgLi4uYXJncykge1xuICAgIC8vIGNvbnNvbGUubG9nKCdlbWl0JywgbmFtZSwgYXJncywgdGhpcy5fbGlzdGVuZXJzKTtcbiAgICAodGhpcy5fbGlzdGVuZXJzW25hbWVdIHx8IFtdKS5mb3JFYWNoKGZ1bmMgPT4gZnVuYy5hcHBseSh0aGlzLCBhcmdzKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBvbihuYW1lLCBmdW5jKSB7XG4gICAgaWYgKG5hbWUgaW4gdGhpcy5fbGlzdGVuZXJzKSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnNbbmFtZV0ucHVzaChmdW5jKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW25hbWVdID0gW2Z1bmNdO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG9mZihuYW1lKSB7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tuYW1lXSA9IFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiIsImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi9ldmVudF9lbWl0dGVyLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuL3V0aWxzLmpzJztcblxuXG52YXIgdXRpbHMgPSBuZXcgVXRpbHMoKTtcblxuY29uc3QgREVGQVVMVF9DT05GSUcgPSB7XG4gICdheGlzVGhyZXNob2xkJzogMC4xNSxcbiAgJ2dhbWVwYWRBdHRyaWJ1dGVzRW5hYmxlZCc6IHRydWUsXG4gICdnYW1lcGFkSW5kaWNlc0VuYWJsZWQnOiB0cnVlLFxuICAna2V5RXZlbnRzRW5hYmxlZCc6IHRydWUsXG4gICdub25zdGFuZGFyZEV2ZW50c0VuYWJsZWQnOiB0cnVlLFxuICAnaW5kaWNlcyc6IHVuZGVmaW5lZCxcbiAgJ2tleUV2ZW50cyc6IHVuZGVmaW5lZFxufTtcblxudmFyIERFRkFVTFRfU1RBVEUgPSB7XG4gIGJ1dHRvbnM6IG5ldyBBcnJheSgxNyksXG4gIGF4ZXM6IFswLjAsIDAuMCwgMC4wLCAwLjBdXG59O1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IDE3OyBpKyspIHtcbiAgREVGQVVMVF9TVEFURS5idXR0b25zW2ldID0ge1xuICAgIHByZXNzZWQ6IGZhbHNlLFxuICAgIHZhbHVlOiAwLjBcbiB9O1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVwYWRzIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMucG9seWZpbGwoKTtcblxuICAgIHRoaXMuX2dhbWVwYWRBcGlzID0gWydnZXRHYW1lcGFkcycsICd3ZWJraXRHZXRHYW1lcGFkcycsICd3ZWJraXRHYW1lcGFkcyddO1xuICAgIHRoaXMuX2dhbWVwYWRET01FdmVudHMgPSBbJ2dhbWVwYWRjb25uZWN0ZWQnLCAnZ2FtZXBhZGRpc2Nvbm5lY3RlZCddO1xuICAgIHRoaXMuX2dhbWVwYWRJbnRlcm5hbEV2ZW50cyA9IFsnZ2FtZXBhZGNvbm5lY3RlZCcsICdnYW1lcGFkZGlzY29ubmVjdGVkJyxcbiAgICAgICdnYW1lcGFkYnV0dG9uZG93bicsICdnYW1lcGFkYnV0dG9udXAnLCAnZ2FtZXBhZGF4aXNtb3ZlJ107XG4gICAgdGhpcy5fc2VlbkV2ZW50cyA9IHt9O1xuXG4gICAgdGhpcy5kYXRhU291cmNlID0gdGhpcy5nZXRHYW1lcGFkRGF0YVNvdXJjZSgpO1xuICAgIHRoaXMuZ2FtZXBhZHNTdXBwb3J0ZWQgPSB0aGlzLl9oYXNHYW1lcGFkcygpO1xuICAgIHRoaXMuaW5kaWNlcyA9IHt9O1xuICAgIHRoaXMua2V5RXZlbnRzID0ge307XG4gICAgdGhpcy5wcmV2aW91c1N0YXRlID0ge307XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuXG4gICAgLy8gTWFyayB0aGUgZXZlbnRzIHdlIHNlZSAoa2V5ZWQgb2ZmIGdhbWVwYWQgaW5kZXgpXG4gICAgLy8gc28gd2UgZG9uJ3QgZmlyZSB0aGUgc2FtZSBldmVudCB0d2ljZS5cbiAgICB0aGlzLl9nYW1lcGFkRE9NRXZlbnRzLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZSA9PiB7XG4gICAgICAgIHRoaXMuYWRkU2VlbkV2ZW50KGUuZ2FtZXBhZCwgZXZlbnROYW1lLCAnZG9tJyk7XG5cbiAgICAgICAgLy8gTGV0IHRoZSBldmVudHMgZmlyZSBhZ2FpbiwgaWYgdGhleSd2ZSBiZWVuIGRpc2Nvbm5lY3RlZC9yZWNvbm5lY3RlZC5cbiAgICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gJ2dhbWVwYWRkaXNjb25uZWN0ZWQnKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVTZWVuRXZlbnQoZS5nYW1lcGFkLCAnZ2FtZXBhZGNvbm5lY3RlZCcsICdkb20nKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudE5hbWUgPT09ICdnYW1lcGFkY29ubmVjdGVkJykge1xuICAgICAgICAgIHRoaXMucmVtb3ZlU2VlbkV2ZW50KGUuZ2FtZXBhZCwgJ2dhbWVwYWRkaXNjb25uZWN0ZWQnLCAnZG9tJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMuX2dhbWVwYWRJbnRlcm5hbEV2ZW50cy5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICB0aGlzLm9uKGV2ZW50TmFtZSwgZ2FtZXBhZCA9PiB7XG4gICAgICAgIHRoaXMuYWRkU2VlbkV2ZW50KGdhbWVwYWQsIGV2ZW50TmFtZSwgJ2ludGVybmFsJyk7XG5cbiAgICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gJ2dhbWVwYWRkaXNjb25uZWN0ZWQnKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVTZWVuRXZlbnQoZ2FtZXBhZCwgJ2dhbWVwYWRjb25uZWN0ZWQnLCAnaW50ZXJuYWwnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZVNlZW5FdmVudChnYW1lcGFkLCAnZ2FtZXBhZGRpc2Nvbm5lY3RlZCcsICdpbnRlcm5hbCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgICBPYmplY3Qua2V5cyhERUZBVUxUX0NPTkZJRykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgdGhpc1trZXldID0gdHlwZW9mIGNvbmZpZ1trZXldID09PSAndW5kZWZpbmVkJyA/IERFRkFVTFRfQ09ORklHW2tleV0gOiB1dGlscy5jbG9uZShjb25maWdba2V5XSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5nYW1lcGFkSW5kaWNlc0VuYWJsZWQpIHtcbiAgICAgIHRoaXMub24oJ2dhbWVwYWRjb25uZWN0ZWQnLCB0aGlzLl9vbkdhbWVwYWRDb25uZWN0ZWQuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLm9uKCdnYW1lcGFkZGlzY29ubmVjdGVkJywgdGhpcy5fb25HYW1lcGFkRGlzY29ubmVjdGVkLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5vbignZ2FtZXBhZGJ1dHRvbmRvd24nLCB0aGlzLl9vbkdhbWVwYWRCdXR0b25Eb3duLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5vbignZ2FtZXBhZGJ1dHRvbnVwJywgdGhpcy5fb25HYW1lcGFkQnV0dG9uVXAuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLm9uKCdnYW1lcGFkYXhpc21vdmUnLCB0aGlzLl9vbkdhbWVwYWRBeGlzTW92ZS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1cblxuICBwb2x5ZmlsbCgpIHtcbiAgICBpZiAodGhpcy5fcG9seWZpbGxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghKCdwZXJmb3JtYW5jZScgaW4gd2luZG93KSkge1xuICAgICAgd2luZG93LnBlcmZvcm1hbmNlID0ge307XG4gICAgfVxuXG4gICAgaWYgKCEoJ25vdycgaW4gd2luZG93LnBlcmZvcm1hbmNlKSkge1xuICAgICAgd2luZG93LnBlcmZvcm1hbmNlLm5vdyA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuICtuZXcgRGF0ZSgpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoISgnR2FtZXBhZEJ1dHRvbicgaW4gd2luZG93KSkge1xuICAgICAgdmFyIEdhbWVwYWRCdXR0b24gPSB3aW5kb3cuR2FtZXBhZEJ1dHRvbiA9IChvYmopID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwcmVzc2VkOiBvYmoucHJlc3NlZCxcbiAgICAgICAgICB2YWx1ZTogb2JqLnZhbHVlXG4gICAgICAgIH07XG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMuX3BvbHlmaWxsZWQgPSB0cnVlO1xuICB9XG5cbiAgX2dldFZlbmRvclByb2R1Y3RJZHMoZ2FtZXBhZCkge1xuICAgIHZhciBiaXRzID0gZ2FtZXBhZC5pZC5zcGxpdCgnLScpO1xuICAgIHZhciBtYXRjaDtcblxuICAgIGlmIChiaXRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIG1hdGNoID0gZ2FtZXBhZC5pZC5tYXRjaCgvdmVuZG9yOiAoXFx3KykgcHJvZHVjdDogKFxcdyspL2kpO1xuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiBtYXRjaC5zbGljZSgxKS5tYXAodXRpbHMuc3RyaXBMZWFkaW5nWmVyb3MpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1hdGNoID0gZ2FtZXBhZC5pZC5tYXRjaCgvKFxcdyspLShcXHcrKS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgcmV0dXJuIG1hdGNoLnNsaWNlKDEpLm1hcCh1dGlscy5zdHJpcExlYWRpbmdaZXJvcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJpdHMuc2xpY2UoMCwgMikubWFwKHV0aWxzLnN0cmlwTGVhZGluZ1plcm9zKTtcbiAgfVxuXG4gIF9oYXNHYW1lcGFkcygpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5fZ2FtZXBhZEFwaXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLl9nYW1lcGFkQXBpc1tpXSBpbiBuYXZpZ2F0b3IpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIF9nZXRHYW1lcGFkcygpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5fZ2FtZXBhZEFwaXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLl9nYW1lcGFkQXBpc1tpXSBpbiBuYXZpZ2F0b3IpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvclt0aGlzLl9nYW1lcGFkQXBpc1tpXV0oKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdXBkYXRlR2FtZXBhZChnYW1lcGFkKSB7XG4gICAgdGhpcy5wcmV2aW91c1N0YXRlW2dhbWVwYWQuaW5kZXhdID0gdXRpbHMuY2xvbmUodGhpcy5zdGF0ZVtnYW1lcGFkLmluZGV4XSB8fCBERUZBVUxUX1NUQVRFKTtcbiAgICB0aGlzLnN0YXRlW2dhbWVwYWQuaW5kZXhdID0gZ2FtZXBhZCA/IHV0aWxzLmNsb25lKGdhbWVwYWQpIDogREVGQVVMVF9TVEFURTtcblxuICAgIC8vIEZpcmUgY29ubmVjdGlvbiBldmVudCwgaWYgZ2FtZXBhZCB3YXMgYWN0dWFsbHkgY29ubmVjdGVkLlxuICAgIHRoaXMuZmlyZUNvbm5lY3Rpb25FdmVudCh0aGlzLnN0YXRlW2dhbWVwYWQuaW5kZXhdLCB0cnVlKTtcbiAgfVxuXG4gIHJlbW92ZUdhbWVwYWQoZ2FtZXBhZCkge1xuICAgIGRlbGV0ZSB0aGlzLnN0YXRlW2dhbWVwYWQuaW5kZXhdO1xuXG4gICAgLy8gRmlyZSBkaXNjb25uZWN0aW9uIGV2ZW50LlxuICAgIHRoaXMuZmlyZUNvbm5lY3Rpb25FdmVudChnYW1lcGFkLCBmYWxzZSk7XG4gIH1cblxuICBvYnNlcnZlQnV0dG9uQ2hhbmdlcyhnYW1lcGFkKSB7XG4gICAgdmFyIHByZXZpb3VzUGFkID0gdGhpcy5wcmV2aW91c1N0YXRlW2dhbWVwYWQuaW5kZXhdO1xuICAgIHZhciBjdXJyZW50UGFkID0gdGhpcy5zdGF0ZVtnYW1lcGFkLmluZGV4XTtcblxuICAgIGlmICghcHJldmlvdXNQYWQgfHwgIU9iamVjdC5rZXlzKHByZXZpb3VzUGFkKS5sZW5ndGggfHxcbiAgICAgICAgIWN1cnJlbnRQYWQgfHwgIU9iamVjdC5rZXlzKGN1cnJlbnRQYWQpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGN1cnJlbnRQYWQuYnV0dG9ucy5mb3JFYWNoKChidXR0b24sIGJ1dHRvbklkeCkgPT4ge1xuICAgICAgaWYgKGJ1dHRvbi52YWx1ZSAhPT0gcHJldmlvdXNQYWQuYnV0dG9uc1tidXR0b25JZHhdLnZhbHVlKSB7XG4gICAgICAgIC8vIEZpcmUgYnV0dG9uIGV2ZW50cy5cbiAgICAgICAgdGhpcy5maXJlQnV0dG9uRXZlbnQoY3VycmVudFBhZCwgYnV0dG9uSWR4LCBidXR0b24udmFsdWUpO1xuXG4gICAgICAgIC8vIEZpcmUgc3ludGhldGljIGtleWJvYXJkIGV2ZW50cywgaWYgbmVlZGVkLlxuICAgICAgICB0aGlzLmZpcmVLZXlFdmVudChjdXJyZW50UGFkLCBidXR0b25JZHgsIGJ1dHRvbi52YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBvYnNlcnZlQXhpc0NoYW5nZXMoZ2FtZXBhZCkge1xuICAgIHZhciBwcmV2aW91c1BhZCA9IHRoaXMucHJldmlvdXNTdGF0ZVtnYW1lcGFkLmluZGV4XTtcbiAgICB2YXIgY3VycmVudFBhZCA9IHRoaXMuc3RhdGVbZ2FtZXBhZC5pbmRleF07XG5cbiAgICBpZiAoIXByZXZpb3VzUGFkIHx8ICFPYmplY3Qua2V5cyhwcmV2aW91c1BhZCkubGVuZ3RoIHx8XG4gICAgICAgICFjdXJyZW50UGFkIHx8ICFPYmplY3Qua2V5cyhjdXJyZW50UGFkKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjdXJyZW50UGFkLmF4ZXMuZm9yRWFjaCgoYXhpcywgYXhpc0lkeCkgPT4ge1xuICAgICAgLy8gRmlyZSBheGlzIGV2ZW50cy5cbiAgICAgIGlmIChheGlzICE9PSBwcmV2aW91c1BhZC5heGVzW2F4aXNJZHhdKSB7XG4gICAgICAgIHRoaXMuZmlyZUF4aXNNb3ZlRXZlbnQoY3VycmVudFBhZCwgYXhpc0lkeCwgYXhpcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBuYW1lIEdhbWVwYWRzI3VwZGF0ZVxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogICBVcGRhdGUgdGhlIGN1cnJlbnQgYW5kIHByZXZpb3VzIHN0YXRlcyBvZiB0aGUgZ2FtZXBhZHMuXG4gICAqICAgVGhpcyBtdXN0IGJlIGNhbGxlZCBldmVyeSBmcmFtZSBmb3IgZXZlbnRzIHRvIHdvcmsuXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdmFyIGFjdGl2ZVBhZHMgPSB7fTtcblxuICAgIHRoaXMucG9sbCgpLmZvckVhY2gocGFkID0+IHtcbiAgICAgIC8vIEtlZXAgdHJhY2sgb2Ygd2hpY2ggZ2FtZXBhZHMgYXJlIHN0aWxsIGFjdGl2ZSAobm90IGRpc2Nvbm5lY3RlZCkuXG4gICAgICBhY3RpdmVQYWRzW3BhZC5pbmRleF0gPSB0cnVlO1xuXG4gICAgICAvLyBBZGQvdXBkYXRlIGNvbm5lY3RlZCBnYW1lcGFkc1xuICAgICAgLy8gKGFuZCBmaXJlIGludGVybmFsIGV2ZW50cyArIHBvbHlmaWxsZWQgZXZlbnRzLCBpZiBuZWVkZWQpLlxuICAgICAgdGhpcy51cGRhdGVHYW1lcGFkKHBhZCk7XG5cbiAgICAgIC8vIE5ldmVyIHNlZW4gdGhpcyBhY3R1YWxseSBiZSB0aGUgY2FzZSwgYnV0IGlmIGEgcGFkIGlzIHN0aWxsIGluIHRoZVxuICAgICAgLy8gYG5hdmlnYXRvci5nZXRHYW1lcGFkcygpYCBsaXN0IGFuZCBpdCdzIGRpc2Nvbm5lY3RlZCwgZW1pdCB0aGUgZXZlbnQuXG4gICAgICBpZiAoIXBhZC5jb25uZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVHYW1lcGFkKHRoaXMuc3RhdGVbcGFkSWR4XSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZpcmUgaW50ZXJuYWwgZXZlbnRzICsgcG9seWZpbGxlZCBub24tc3RhbmRhcmQgZXZlbnRzLCBpZiBuZWVkZWQuXG4gICAgICB0aGlzLm9ic2VydmVCdXR0b25DaGFuZ2VzKHBhZCk7XG4gICAgICB0aGlzLm9ic2VydmVBeGlzQ2hhbmdlcyhwYWQpO1xuICAgIH0pO1xuXG4gICAgT2JqZWN0LmtleXModGhpcy5zdGF0ZSkuZm9yRWFjaChwYWRJZHggPT4ge1xuICAgICAgaWYgKCEocGFkSWR4IGluIGFjdGl2ZVBhZHMpKSB7XG4gICAgICAgIC8vIFJlbW92ZSBkaXNjb25uZWN0ZWQgZ2FtZXBhZHNcbiAgICAgICAgLy8gKGFuZCBmaXJlIGludGVybmFsIGV2ZW50cyArIHBvbHlmaWxsZWQgZXZlbnRzLCBpZiBuZWVkZWQpLlxuICAgICAgICB0aGlzLnJlbW92ZUdhbWVwYWQodGhpcy5zdGF0ZVtwYWRJZHhdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG5hbWUgR2FtZXBhZHMjZ2V0R2FtZXBhZERhdGFTb3VyY2VcbiAgICogQGRlc2NyaXB0aW9uIEdldCBnYW1lcGFkIGRhdGEgc291cmNlIChlLmcuLCBsaW51eGpveSwgaGlkLCBkaW5wdXQsIHhpbnB1dCkuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IEEgc3RyaW5nIG9mIGdhbWVwYWQgZGF0YSBzb3VyY2UuXG4gICAqL1xuICBnZXRHYW1lcGFkRGF0YVNvdXJjZSgpIHtcbiAgICB2YXIgZGF0YVNvdXJjZTtcbiAgICBpZiAobmF2aWdhdG9yLnBsYXRmb3JtLm1hdGNoKC9eTGludXgvKSkge1xuICAgICAgZGF0YVNvdXJjZSA9ICdsaW51eGpveSc7XG4gICAgfSBlbHNlIGlmIChuYXZpZ2F0b3IucGxhdGZvcm0ubWF0Y2goL15NYWMvKSkge1xuICAgICAgZGF0YVNvdXJjZSA9ICdoaWQnO1xuICAgIH0gZWxzZSBpZiAobmF2aWdhdG9yLnBsYXRmb3JtLm1hdGNoKC9eV2luLykpIHtcbiAgICAgIHZhciBtID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgnR2Vja28vKC4uKScpO1xuICAgICAgaWYgKG0gJiYgcGFyc2VJbnQobVsxXSkgPCAzMikge1xuICAgICAgICBkYXRhU291cmNlID0gJ2RpbnB1dCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYXRhU291cmNlID0gJ2hpZCc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhU291cmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbmFtZSBHYW1lcGFkcyNwb2xsXG4gICAqIEBkZXNjcmlwdGlvbiBQb2xsIGZvciB0aGUgbGF0ZXN0IGRhdGEgZnJvbSB0aGUgZ2FtZXBhZCBBUEkuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gQW4gYXJyYXkgb2YgZ2FtZXBhZHMgYW5kIG1hcHBpbmdzIGZvciB0aGUgbW9kZWwgb2YgdGhlIGNvbm5lY3RlZCBnYW1lcGFkLlxuICAgKiBAZXhhbXBsZVxuICAgKiAgIHZhciBnYW1lcGFkcyA9IG5ldyBHYW1lcGFkcygpO1xuICAgKiAgIHZhciBwYWRzID0gZ2FtZXBhZHMucG9sbCgpO1xuICAgKi9cbiAgcG9sbCgpIHtcbiAgICB2YXIgcGFkcyA9IFtdO1xuXG4gICAgaWYgKHRoaXMuZ2FtZXBhZHNTdXBwb3J0ZWQpIHtcbiAgICAgIHZhciBwYWRzUmF3ID0gdGhpcy5fZ2V0R2FtZXBhZHMoKTtcbiAgICAgIHZhciBwYWQ7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYWRzUmF3Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHBhZCA9IHBhZHNSYXdbaV07XG5cbiAgICAgICAgaWYgKCFwYWQpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhZCA9IHRoaXMuZXh0ZW5kKHBhZCk7XG5cbiAgICAgICAgcGFkcy5wdXNoKHBhZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhZHM7XG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBuYW1lIEdhbWVwYWRzI2V4dGVuZFxuICAgKiBAZGVzY3JpcHRpb24gU2V0IG5ldyBwcm9wZXJ0aWVzIG9uIGEgZ2FtZXBhZCBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBnYW1lcGFkIFRoZSBvcmlnaW5hbCBnYW1lcGFkIG9iamVjdC5cbiAgICogQHJldHVybnMge09iamVjdH0gQW4gZXh0ZW5kZWQgY29weSBvZiB0aGUgZ2FtZXBhZC5cbiAgICovXG4gIGV4dGVuZChnYW1lcGFkKSB7XG4gICAgaWYgKGdhbWVwYWQuX2V4dGVuZGVkKSB7XG4gICAgICByZXR1cm4gZ2FtZXBhZDtcbiAgICB9XG5cbiAgICB2YXIgcGFkID0gdXRpbHMuY2xvbmUoZ2FtZXBhZCk7XG5cbiAgICBwYWQuX2V4dGVuZGVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLmdhbWVwYWRBdHRyaWJ1dGVzRW5hYmxlZCkge1xuICAgICAgcGFkLmF0dHJpYnV0ZXMgPSB0aGlzLl9nZXRBdHRyaWJ1dGVzKHBhZCk7XG4gICAgfVxuXG4gICAgaWYgKCFwYWQudGltZXN0YW1wKSB7XG4gICAgICBwYWQudGltZXN0YW1wID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmdhbWVwYWRJbmRpY2VzRW5hYmxlZCkge1xuICAgICAgcGFkLmluZGljZXMgPSB0aGlzLl9nZXRJbmRpY2VzKHBhZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG5hbWUgR2FtZXBhZHMjX2dldEF0dHJpYnV0ZXNcbiAgICogQGRlc2NyaXB0aW9uIEdlbmVyYXRlIGFuZCByZXR1cm4gdGhlIGF0dHJpYnV0ZXMgb2YgYSBnYW1lcGFkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZ2FtZXBhZCBUaGUgZ2FtZXBhZCBvYmplY3QuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBhdHRyaWJ1dGVzIGZvciB0aGlzIGdhbWVwYWQuXG4gICAqL1xuICBfZ2V0QXR0cmlidXRlcyhnYW1lcGFkKSB7XG4gICAgdmFyIHBhZElkcyA9IHRoaXMuX2dldFZlbmRvclByb2R1Y3RJZHMoZ2FtZXBhZCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZlbmRvcklkOiBwYWRJZHNbMF0sXG4gICAgICBwcm9kdWN0SWQ6IHBhZElkc1sxXSxcbiAgICAgIG5hbWU6IGdhbWVwYWQuaWQsXG4gICAgICBkYXRhU291cmNlOiB0aGlzLmRhdGFTb3VyY2VcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbmFtZSBHYW1lcGFkcyNfZ2V0SW5kaWNlc1xuICAgKiBAZGVzY3JpcHRpb24gUmV0dXJuIHRoZSBuYW1lZCBpbmRpY2VzIG9mIGEgZ2FtZXBhZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGdhbWVwYWQgVGhlIGdhbWVwYWQgb2JqZWN0LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbmFtZWQgaW5kaWNlcyBmb3IgdGhpcyBnYW1lcGFkLlxuICAgKi9cbiAgX2dldEluZGljZXMoZ2FtZXBhZCkge1xuICAgIHJldHVybiB0aGlzLmluZGljZXNbZ2FtZXBhZC5pZF0gfHwgdGhpcy5pbmRpY2VzLnN0YW5kYXJkIHx8IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbmFtZSBHYW1lcGFkcyNfbWFwQXhpc1xuICAgKiBAZGVzY3JpcHRpb24gU2V0IHRoZSB2YWx1ZSBmb3Igb25lIG9mIHRoZSBhbmFsb2d1ZSBheGVzIG9mIHRoZSBwYWQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBheGlzIFRoZSBidXR0b24gdG8gZ2V0IHRoZSB2YWx1ZSBvZi5cbiAgICogQHJldHVybnMge051bWJlcn0gVGhlIHZhbHVlIG9mIHRoZSBheGlzIGJldHdlZW4gLTEgYW5kIDEuXG4gICAqL1xuICBfbWFwQXhpcyhheGlzKSB7XG4gICAgaWYgKE1hdGguYWJzKGF4aXMpIDwgdGhpcy5heGlzVGhyZXNob2xkKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gYXhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG5hbWUgR2FtZXBhZHMjX21hcEJ1dHRvblxuICAgKiBAZGVzY3JpcHRpb24gU2V0IHRoZSB2YWx1ZSBmb3Igb25lIG9mIHRoZSBidXR0b25zIG9mIHRoZSBwYWQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBidXR0b24gVGhlIGJ1dHRvbiB0byBnZXQgdGhlIHZhbHVlIG9mLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBBbiBvYmplY3QgcmVzZW1ibGluZyBhIGBHYW1lcGFkQnV0dG9uYCBvYmplY3QuXG4gICAqL1xuICBfbWFwQnV0dG9uKGJ1dHRvbikge1xuICAgIGlmICh0eXBlb2YgYnV0dG9uID09PSAnbnVtYmVyJykge1xuICAgICAgLy8gT2xkIHZlcnNpb25zIG9mIHRoZSBBUEkgdXNlZCB0byByZXR1cm4ganVzdCBudW1iZXJzIGluc3RlYWRcbiAgICAgIC8vIG9mIGBHYW1lcGFkQnV0dG9uYCBvYmplY3RzLlxuICAgICAgYnV0dG9uID0gbmV3IEdhbWVwYWRCdXR0b24oe1xuICAgICAgICBwcmVzc2VkOiBidXR0b24gPT09IDEsXG4gICAgICAgIHZhbHVlOiBidXR0b25cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBidXR0b247XG4gIH1cblxuICBzZXRJbmRpY2VzKGluZGljZXMpIHtcbiAgICB0aGlzLmluZGljZXMgPSB1dGlscy5jbG9uZShpbmRpY2VzKTtcbiAgfVxuXG4gIGZpcmVDb25uZWN0aW9uRXZlbnQoZ2FtZXBhZCwgY29ubmVjdGVkKSB7XG4gICAgdmFyIG5hbWUgPSBjb25uZWN0ZWQgPyAnZ2FtZXBhZGNvbm5lY3RlZCcgOiAnZ2FtZXBhZGRpc2Nvbm5lY3RlZCc7XG5cbiAgICBpZiAoIXRoaXMuaGFzU2VlbkV2ZW50KGdhbWVwYWQsIG5hbWUsICdpbnRlcm5hbCcpKSB7XG4gICAgICAvLyBGaXJlIGludGVybmFsIGV2ZW50LlxuICAgICAgdGhpcy5lbWl0KG5hbWUsIGdhbWVwYWQpO1xuICAgIH1cblxuICAgIC8vIERvbid0IGZpcmUgdGhlICdnYW1lcGFkY29ubmVjdGVkJy8nZ2FtZXBhZGRpc2Nvbm5lY3RlZCcgZXZlbnRzIGlmIHRoZVxuICAgIC8vIGJyb3dzZXIgaGFzIGFscmVhZHkgZmlyZWQgdGhlbS4gKFVuZm9ydHVuYXRlbHksIHdlIGNhbid0IGZlYXR1cmUgZGV0ZWN0XG4gICAgLy8gaWYgdGhleSdsbCBnZXQgZmlyZWQuKVxuICAgIGlmICghdGhpcy5oYXNTZWVuRXZlbnQoZ2FtZXBhZCwgbmFtZSwgJ2RvbScpKSB7XG4gICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgYnViYmxlczogZmFsc2UsXG4gICAgICAgIGNhbmNlbGFibGU6IGZhbHNlLFxuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBnYW1lcGFkOiBnYW1lcGFkXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHV0aWxzLnRyaWdnZXJFdmVudCh3aW5kb3csIG5hbWUsIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIGZpcmVCdXR0b25FdmVudChnYW1lcGFkLCBidXR0b24sIHZhbHVlKSB7XG4gICAgdmFyIG5hbWUgPSB2YWx1ZSA9PT0gMSA/ICdnYW1lcGFkYnV0dG9uZG93bicgOiAnZ2FtZXBhZGJ1dHRvbnVwJztcblxuICAgIC8vIEZpcmUgaW50ZXJuYWwgZXZlbnQuXG4gICAgdGhpcy5lbWl0KG5hbWUsIGdhbWVwYWQsIGJ1dHRvbiwgdmFsdWUpO1xuXG4gICAgaWYgKHRoaXMubm9uc3RhbmRhcmRFdmVudHNFbmFibGVkICYmICEoJ0dhbWVwYWRCdXR0b25FdmVudCcgaW4gd2luZG93KSkge1xuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGJ1YmJsZXM6IGZhbHNlLFxuICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgYnV0dG9uOiBidXR0b24sXG4gICAgICAgICAgZ2FtZXBhZDogZ2FtZXBhZFxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdXRpbHMudHJpZ2dlckV2ZW50KHdpbmRvdywgbmFtZSwgZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgZmlyZUF4aXNNb3ZlRXZlbnQoZ2FtZXBhZCwgYXhpcywgdmFsdWUpIHtcbiAgICB2YXIgbmFtZSA9ICdnYW1lcGFkYXhpc21vdmUnO1xuXG4gICAgLy8gRmlyZSBpbnRlcm5hbCBldmVudC5cbiAgICB0aGlzLmVtaXQobmFtZSwgZ2FtZXBhZCwgYXhpcywgdmFsdWUpO1xuXG4gICAgaWYgKCF0aGlzLm5vbnN0YW5kYXJkRXZlbnRzRW5hYmxlZCB8fCAnR2FtZXBhZEF4aXNNb3ZlRXZlbnQnIGluIHdpbmRvdykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChNYXRoLmFicyh2YWx1ZSkgPCB0aGlzLmF4aXNUaHJlc2hvbGQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIGJ1YmJsZXM6IGZhbHNlLFxuICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgYXhpczogYXhpcyxcbiAgICAgICAgZ2FtZXBhZDogZ2FtZXBhZCxcbiAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICB9XG4gICAgfTtcbiAgICB1dGlscy50cmlnZ2VyRXZlbnQod2luZG93LCBuYW1lLCBkYXRhKTtcbiAgfVxuXG4gIGZpcmVLZXlFdmVudChnYW1lcGFkLCBidXR0b24sIHZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLmtleUV2ZW50c0VuYWJsZWQgfHwgIXRoaXMua2V5RXZlbnRzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGJ1dHRvbk5hbWUgPSB1dGlscy5zd2FwKGdhbWVwYWQuaW5kaWNlcylbYnV0dG9uXTtcblxuICAgIGlmICh0eXBlb2YgYnV0dG9uTmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmFtZXMgPSB2YWx1ZSA9PT0gMSA/IFsna2V5ZG93bicsICdrZXlwcmVzcyddIDogWydrZXl1cCddO1xuICAgIHZhciBkYXRhID0gdGhpcy5rZXlFdmVudHNbYnV0dG9uTmFtZV07XG5cbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoISgnYnViYmxlcycgaW4gZGF0YSkpIHtcbiAgICAgIGRhdGEuYnViYmxlcyA9IHRydWU7XG4gICAgfVxuICAgIGlmICghZGF0YS5kZXRhaWwpIHtcbiAgICAgIGRhdGEuZGV0YWlsID0ge307XG4gICAgfVxuICAgIGRhdGEuZGV0YWlsLmJ1dHRvbiA9IGJ1dHRvbjtcbiAgICBkYXRhLmRldGFpbC5nYW1lcGFkID0gZ2FtZXBhZDtcblxuICAgIG5hbWVzLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICB1dGlscy50cmlnZ2VyRXZlbnQoZGF0YS50YXJnZXQgfHwgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCwgbmFtZSwgZGF0YSk7XG4gICAgfSk7XG4gIH1cblxuICBhZGRTZWVuRXZlbnQoZ2FtZXBhZCwgZXZlbnRUeXBlLCBuYW1lc3BhY2UpIHtcbiAgICB2YXIga2V5ID0gW2dhbWVwYWQuaW5kZXgsIGV2ZW50VHlwZSwgbmFtZXNwYWNlXS5qb2luKCcuJyk7XG5cbiAgICB0aGlzLl9zZWVuRXZlbnRzW2tleV0gPSB0cnVlO1xuICB9XG5cbiAgaGFzU2VlbkV2ZW50KGdhbWVwYWQsIGV2ZW50VHlwZSwgbmFtZXNwYWNlKSB7XG4gICAgdmFyIGtleSA9IFtnYW1lcGFkLmluZGV4LCBldmVudFR5cGUsIG5hbWVzcGFjZV0uam9pbignLicpO1xuXG4gICAgcmV0dXJuICEhdGhpcy5fc2VlbkV2ZW50c1trZXldO1xuICB9XG5cbiAgcmVtb3ZlU2VlbkV2ZW50KGdhbWVwYWQsIGV2ZW50VHlwZSwgbmFtZXNwYWNlKSB7XG4gICAgdmFyIGtleSA9IFtnYW1lcGFkLmluZGV4LCBldmVudFR5cGUsIG5hbWVzcGFjZV0uam9pbignLicpO1xuXG4gICAgZGVsZXRlIHRoaXMuX3NlZW5FdmVudHNba2V5XTtcbiAgfVxuXG4gIGJ1dHRvbkV2ZW50MmF4aXNFdmVudChlKSB7XG4gICAgaWYgKGUudHlwZSA9PT0gJ2dhbWVwYWRidXR0b25kb3duJykge1xuICAgICAgZS5heGlzID0gZS5idXR0b247XG4gICAgICBlLnZhbHVlID0gMS4wO1xuICAgIH0gZWxzZSBpZiAoZS50eXBlID09PSAnZ2FtZXBhZGJ1dHRvbnVwJykge1xuICAgICAgZS5heGlzID0gZS5idXR0b247XG4gICAgICBlLnZhbHVlID0gMC4wO1xuICAgIH1cbiAgICByZXR1cm4gZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgYSBgYnV0dG9uYCBpbmRleCBlcXVhbHMgdGhlIHN1cHBsaWVkIGBrZXlgLlxuICAgKlxuICAgKiBVc2VmdWwgZm9yIGRldGVybWluaW5nIHdoZXRoZXIgYGBuYXZpZ2F0b3IuZ2V0R2FtZXBhZHMoKVswXS5idXR0b25zW2AkYnV0dG9uYF1gYFxuICAgKiBoYXMgYW55IGJpbmRpbmdzIGRlZmluZWQgKGluIGBGcmFtZU1hbmFnZXJgKS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGJ1dHRvbiBJbmRleCBvZiBnYW1lcGFkIGJ1dHRvbiAoZS5nLiwgYDRgKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBIdW1hbi1yZWFkYWJsZSBmb3JtYXQgZm9yIGJ1dHRvbiBiaW5kaW5nIChlLmcuLCAnYjQnKS5cbiAgICovXG4gIF9idXR0b25Eb3duRXF1YWxzS2V5KGJ1dHRvbiwga2V5KSB7XG4gICAgcmV0dXJuICdiJyArIGJ1dHRvbiArICcuZG93bicgPT09IGtleS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIF9idXR0b25VcEVxdWFsc0tleShidXR0b24sIGtleSkge1xuICAgIHZhciBrZXlDbGVhbiA9IGtleS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gKFxuICAgICAgJ2InICsgYnV0dG9uICsgJy51cCcgPT09IGtleUNsZWFuIHx8XG4gICAgICAnYicgKyBidXR0b24gPT09IGtleUNsZWFuXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgYW4gYGF4aXNgIGluZGV4IGVxdWFscyB0aGUgc3VwcGxpZWQgYGtleWAuXG4gICAqXG4gICAqIFVzZWZ1bCBmb3IgZGV0ZXJtaW5pbmcgd2hldGhlciBgYG5hdmlnYXRvci5nZXRHYW1lcGFkcygpWzBdLmF4ZXNbYCRidXR0b25gXWBgXG4gICAqIGhhcyBhbnkgYmluZGluZ3MgZGVmaW5lZCAoaW4gYEZyYW1lTWFuYWdlcmApLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gYnV0dG9uIEluZGV4IG9mIGdhbWVwYWQgYXhpcyAoZS5nLiwgYDFgKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBIdW1hbi1yZWFkYWJsZSBmb3JtYXQgZm9yIGJ1dHRvbiBiaW5kaW5nIChlLmcuLCAnYTEnKS5cbiAgICovXG4gIF9heGlzTW92ZUVxdWFsc0tleShheGlzLCBrZXkpIHtcbiAgICByZXR1cm4gJ2EnICsgYXhpcyA9PT0ga2V5LnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxzIGFueSBiaW5kaW5ncyBkZWZpbmVkIGZvciAnY29ubmVjdGVkJyAoaW4gYEZyYW1lTWFuYWdlcmApLlxuICAgKlxuICAgKiAoQ2FsbGVkIGJ5IGV2ZW50IGxpc3RlbmVyIGZvciBgZ2FtZXBhZGNvbm5lY3RlZGAuKVxuICAgKlxuICAgKiBAcGFyYW0ge0dhbWVwYWR9IGdhbWVwYWQgR2FtZXBhZCBvYmplY3QgKGFmdGVyIGl0J3MgYmVlbiB3cmFwcGVkIGJ5IGdhbWVwYWQtcGx1cykuXG4gICAqL1xuICBfb25HYW1lcGFkQ29ubmVjdGVkKGdhbWVwYWQpIHtcbiAgICBpZiAoJ2Nvbm5lY3RlZCcgaW4gZ2FtZXBhZC5pbmRpY2VzKSB7XG4gICAgICBnYW1lcGFkLmluZGljZXMuY29ubmVjdGVkKGdhbWVwYWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyBhbnkgYmluZGluZ3MgZGVmaW5lZCBmb3IgJ2Rpc2Nvbm5lY3RlZCcgKGluIGBGcmFtZU1hbmFnZXJgKS5cbiAgICpcbiAgICogKENhbGxlZCBieSBldmVudCBsaXN0ZW5lciBmb3IgYGdhbWVwYWRjb25uZWN0ZWRgLilcbiAgICpcbiAgICogQHBhcmFtIHtHYW1lcGFkfSBnYW1lcGFkIEdhbWVwYWQgb2JqZWN0IChhZnRlciBpdCdzIGJlZW4gd3JhcHBlZCBieSBnYW1lcGFkLXBsdXMpLlxuICAgKi9cbiAgX29uR2FtZXBhZERpc2Nvbm5lY3RlZChnYW1lcGFkKSB7XG4gICAgaWYgKCdkaXNjb25uZWN0ZWQnIGluIGdhbWVwYWQuaW5kaWNlcykge1xuICAgICAgZ2FtZXBhZC5pbmRpY2VzLmRpc2Nvbm5lY3RlZChnYW1lcGFkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgYW55IGJpbmRpbmdzIGRlZmluZWQgZm9yIGJ1dHRvbnMgKGUuZy4sICdiNC51cCcgaW4gYEZyYW1lTWFuYWdlcmApLlxuICAgKlxuICAgKiAoQ2FsbGVkIGJ5IGV2ZW50IGxpc3RlbmVyIGZvciBgZ2FtZXBhZGNvbm5lY3RlZGAuKVxuICAgKlxuICAgKiBAcGFyYW0ge0dhbWVwYWR9IGdhbWVwYWQgR2FtZXBhZCBvYmplY3QgKGFmdGVyIGl0J3MgYmVlbiB3cmFwcGVkIGJ5IGdhbWVwYWQtcGx1cykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBidXR0b24gSW5kZXggb2YgZ2FtZXBhZCBidXR0b24gKGludGVnZXIpIGJlaW5nIHByZXNzZWRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAocGVyIGBnYW1lcGFkYnV0dG9uZG93bmAgZXZlbnQpLlxuICAgKi9cbiAgX29uR2FtZXBhZEJ1dHRvbkRvd24oZ2FtZXBhZCwgYnV0dG9uKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGdhbWVwYWQuaW5kaWNlcykge1xuICAgICAgaWYgKHRoaXMuX2J1dHRvbkRvd25FcXVhbHNLZXkoYnV0dG9uLCBrZXkpKSB7XG4gICAgICAgIGdhbWVwYWQuaW5kaWNlc1trZXldKGdhbWVwYWQsIGJ1dHRvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxzIGFueSBiaW5kaW5ncyBkZWZpbmVkIGZvciBidXR0b25zIChlLmcuLCAnYjQuZG93bicgaW4gYEZyYW1lTWFuYWdlcmApLlxuICAgKlxuICAgKiAoQ2FsbGVkIGJ5IGV2ZW50IGxpc3RlbmVyIGZvciBgZ2FtZXBhZGNvbm5lY3RlZGAuKVxuICAgKlxuICAgKiBAcGFyYW0ge0dhbWVwYWR9IGdhbWVwYWQgR2FtZXBhZCBvYmplY3QgKGFmdGVyIGl0J3MgYmVlbiB3cmFwcGVkIGJ5IGdhbWVwYWQtcGx1cykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBidXR0b24gSW5kZXggb2YgZ2FtZXBhZCBidXR0b24gKGludGVnZXIpIGJlaW5nIHJlbGVhc2VkXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgKHBlciBgZ2FtZXBhZGJ1dHRvbnVwYCBldmVudCkuXG4gICAqL1xuICBfb25HYW1lcGFkQnV0dG9uVXAoZ2FtZXBhZCwgYnV0dG9uKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGdhbWVwYWQuaW5kaWNlcykge1xuICAgICAgaWYgKHRoaXMuX2J1dHRvblVwRXF1YWxzS2V5KGJ1dHRvbiwga2V5KSkge1xuICAgICAgICBnYW1lcGFkLmluZGljZXNba2V5XShnYW1lcGFkLCBidXR0b24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyBhbnkgYmluZGluZ3MgZGVmaW5lZCBmb3IgYXhlcyAoZS5nLiwgJ2ExJyBpbiBgRnJhbWVNYW5hZ2VyYCkuXG4gICAqXG4gICAqIChDYWxsZWQgYnkgZXZlbnQgbGlzdGVuZXIgZm9yIGBnYW1lcGFkYXhpc21vdmVgLilcbiAgICpcbiAgICogQHBhcmFtIHtHYW1lcGFkfSBnYW1lcGFkIEdhbWVwYWQgb2JqZWN0IChhZnRlciBpdCdzIGJlZW4gd3JhcHBlZCBieSBnYW1lcGFkLXBsdXMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gYXhpcyBJbmRleCBvZiBnYW1lcGFkIGF4aXMgKGludGVnZXIpIGJlaW5nIGNoYW5nZWRcbiAgICogICAgICAgICAgICAgICAgICAgICAgKHBlciBgZ2FtZXBhZGF4aXNtb3ZlYCBldmVudCkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSBWYWx1ZSBvZiBnYW1lcGFkIGF4aXMgKGZyb20gLTEuMCB0byAxLjApIGJlaW5nXG4gICAqICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkIChwZXIgYGdhbWVwYWRheGlzbW92ZWAgZXZlbnQpLlxuICAgKi9cbiAgX29uR2FtZXBhZEF4aXNNb3ZlKGdhbWVwYWQsIGF4aXMsIHZhbHVlKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGdhbWVwYWQuaW5kaWNlcykge1xuICAgICAgaWYgKHRoaXMuX2F4aXNNb3ZlRXF1YWxzS2V5KGF4aXMsIGtleSkpIHtcbiAgICAgICAgZ2FtZXBhZC5pbmRpY2VzW2tleV0oZ2FtZXBhZCwgYXhpcywgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5cbkdhbWVwYWRzLnV0aWxzID0gdXRpbHM7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBVdGlscyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYnJvd3NlciA9IHRoaXMuZ2V0QnJvd3NlcigpO1xuICAgIHRoaXMuZW5naW5lID0gdGhpcy5nZXRFbmdpbmUodGhpcy5icm93c2VyKTtcbiAgfVxuXG4gIGNsb25lKG9iaikge1xuICAgIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJyB8fCAhKG9iaiBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgdmFyIHJldCA9ICcnO1xuXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHJldCA9IG5ldyBEYXRlKCk7XG4gICAgICByZXQuc2V0VGltZShvYmouZ2V0VGltZSgpKTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICByZXQgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBvYmoubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcmV0W2ldID0gdGhpcy5jbG9uZShvYmpbaV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICByZXQgPSB7fTtcbiAgICAgIGZvciAodmFyIGF0dHIgaW4gb2JqKSB7XG4gICAgICAgIGlmIChhdHRyIGluIG9iaikge1xuICAgICAgICAgIHJldFthdHRyXSA9IHRoaXMuY2xvbmUob2JqW2F0dHJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBjbG9uZSBvYmplY3Qgb2YgdW5leHBlY3RlZCB0eXBlIScpO1xuICB9XG5cbiAgc3dhcChvYmopIHtcbiAgICB2YXIgcmV0ID0ge307XG4gICAgZm9yICh2YXIgYXR0ciBpbiBvYmopIHtcbiAgICAgIGlmIChhdHRyIGluIG9iaikge1xuICAgICAgICByZXRbb2JqW2F0dHJdXSA9IGF0dHI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBnZXRCcm93c2VyKCkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghIXdpbmRvdy5vcGVyYSB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJyBPUFIvJykgPj0gMCkge1xuICAgICAgLy8gT3BlcmEgOC4wKyAoVUEgZGV0ZWN0aW9uIHRvIGRldGVjdCBCbGluay92OC1wb3dlcmVkIE9wZXJhKS5cbiAgICAgIHJldHVybiAnb3BlcmEnO1xuICAgIH0gZWxzZSBpZiAoJ2Nocm9tZScgaW4gd2luZG93KSB7XG4gICAgICAvLyBDaHJvbWUgMSsuXG4gICAgICByZXR1cm4gJ2Nocm9tZSc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgSW5zdGFsbFRyaWdnZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyBGaXJlZm94IDEuMCsuXG4gICAgICByZXR1cm4gJ2ZpcmVmb3gnO1xuICAgIH0gZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHdpbmRvdy5IVE1MRWxlbWVudCkuaW5kZXhPZignQ29uc3RydWN0b3InKSA+IDApIHtcbiAgICAgIC8vIEF0IGxlYXN0IFNhZmFyaSAzKzogXCJbb2JqZWN0IEhUTUxFbGVtZW50Q29uc3RydWN0b3JdXCIuXG4gICAgICByZXR1cm4gJ3NhZmFyaSc7XG4gICAgfSBlbHNlIGlmICgvKkBjY19vbiFAKi9mYWxzZSB8fCAhIWRvY3VtZW50LmRvY3VtZW50TW9kZSkge1xuICAgICAgLy8gQXQgbGVhc3QgSUU2LlxuICAgICAgcmV0dXJuICdpZSc7XG4gICAgfVxuICB9XG5cbiAgZ2V0RW5naW5lKGJyb3dzZXIpIHtcbiAgICBicm93c2VyID0gYnJvd3NlciB8fCB0aGlzLmdldEJyb3dzZXIoKTtcblxuICAgIGlmIChicm93c2VyID09PSAnZmlyZWZveCcpIHtcbiAgICAgIHJldHVybiAnZ2Vja28nO1xuICAgIH0gZWxzZSBpZiAoYnJvd3NlciA9PT0gJ29wZXJhJyB8fCBicm93c2VyID09PSAnY2hyb21lJyB8fCBicm93c2VyID09PSAnc2FmYXJpJykge1xuICAgICAgcmV0dXJuICd3ZWJraXQnO1xuICAgIH0gZWxzZSBpZiAoYnJvd3NlciA9PT0gJ2llJykge1xuICAgICAgcmV0dXJuICd0cmlkZW50JztcbiAgICB9XG4gIH1cblxuICBzdHJpcExlYWRpbmdaZXJvcyhzdHIpIHtcbiAgICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXjArKD89XFxkKykvZywgJycpO1xuICB9XG5cbiAgdHJpZ2dlckV2ZW50KGVsLCBuYW1lLCBkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgZGF0YS5kZXRhaWwgPSBkYXRhLmRldGFpbCB8fCB7fTtcblxuICAgIHZhciBldmVudDtcblxuICAgIGlmICgnQ3VzdG9tRXZlbnQnIGluIHdpbmRvdykge1xuICAgICAgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQobmFtZSwgZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICBldmVudC5pbml0Q3VzdG9tRXZlbnQobmFtZSwgZGF0YS5idWJibGVzLCBkYXRhLmNhbmNlbGFibGUsIGRhdGEuZGV0YWlsKTtcbiAgICB9XG5cbiAgICBPYmplY3Qua2V5cyhkYXRhLmRldGFpbCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBldmVudFtrZXldID0gZGF0YS5kZXRhaWxba2V5XTtcbiAgICB9KTtcblxuICAgIGVsLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG59XG4iLCJpbXBvcnQgR2FtZXBhZHMgZnJvbSAnLi9saWIvZ2FtZXBhZHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBHYW1lcGFkcztcbiJdfQ==
