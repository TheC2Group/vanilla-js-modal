(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
 * vanilla-js-modal
 * https://github.com/TheC2Group/vanilla-js-modal
 * @version 1.0.0
 * @license MIT (c) The C2 Group (c2experience.com)
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var eventHandler = _interopDefault(require('c2-event-handler'));

var handler = eventHandler({}); // private variables

var _collection = {};
var _index = 0;
var _active = [];
var _restore = [];
var _options = {
  zIndexStart: 1000,
  appendTo: document.forms.length > 0 && document.forms[0].parentElement === document.body ? document.forms[0] : document.body // Try to detect .NET webforms and append to the .NET form

}; // default options for a modal instance

var _defaults = {
  hasOverlay: true,
  overlayClass: 'Overlay',
  overlayIsOff: true,
  attr: 'data-state',
  onState: 'on',
  offState: 'off',
  verticallyCenterModal: true
}; // Need IE9+ polyfill for closest

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
} // Pass in the objects to merge as arguments.
// For a deep extend, set the first argument to `true`.


var extend = function extend() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length; // Check if a deep merge

  if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
    deep = arguments[0];
    i++;
  } // Merge the object into the extended object


  var merge = function merge(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        // If deep merge and property is an object, merge properties
        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  }; // Loop through each object and conduct a merge


  for (; i < length; i++) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};
/**
 * get the distance to the top of the window if the modal was centered
 * @param modal
 * @return {Number}
 */


var getModalTop = function getModalTop(modal) {
  var wHeight = window.innerHeight;
  var mHeight = modal.offsetHeight;
  var scrollTop = window.pageYOffset;
  var top = Math.max((wHeight - mHeight) / 2, 0) + scrollTop;
  return top + 'px';
};
/**
 * get the active modal
 * @return {Object} modal instance
 */


var getActiveModal = function getActiveModal() {
  if (_active.length === 0) return null;
  return _active[_active.length - 1];
};
/**
 * new Modal class
 */


var Modal = function Modal(el, id, options) {
  // assign the modal element
  this.el = el; // assign the modal id

  this.id = id;
  this.opts = extend(_defaults, options);
  this.isOpen = false;

  if (this.opts.hasOverlay) {
    // create overlay
    this.overlay = document.createElement('div');
    this.overlay.setAttribute('class', this.opts.overlayClass);

    if (this.opts.overlayIsOff) {
      this.overlay.setAttribute('data-state', this.opts.offState);
    } else {
      this.overlay.setAttribute('data-state', this.opts.onState);
    } // append the modal and overlay to the body


    _options.appendTo.appendChild(this.overlay);
  }

  _options.appendTo.appendChild(this.el);

  this.el.setAttribute('tabindex', '-1');
  this.el.setAttribute('role', 'dialog');
};

eventHandler(Modal);
/**
 * modal.open()
 */

Modal.prototype.open = function () {
  if (this.isOpen) return;
  this.isOpen = true; // add modal to the stack

  _active.push(this);

  _restore.push(document.activeElement);

  var calculatedZIndex = _options.zIndexStart + _active.length;
  var calculatedTop = 0;

  if (this.opts.hasOverlay) {
    // activate overlay
    this.overlay.style.zIndex = calculatedZIndex;
    this.overlay.setAttribute(this.opts.attr, this.opts.onState);
  }

  if (this.opts.verticallyCenterModal) {
    calculatedTop = getModalTop(this.el);
  } // open modal


  this.el.style.zIndex = calculatedZIndex;
  this.el.style.top = calculatedTop;
  this.el.setAttribute(this.opts.attr, this.opts.onState);
  this.emit('open');
  handler.emit('open', this);
};
/**
 * modal.close()
 */


Modal.prototype.close = function () {
  if (!this.isOpen) return;
  this.isOpen = false; // remove modal from the stack

  var indexOf = _active.indexOf(this);

  var restore;

  if (indexOf > -1) {
    _active.splice(indexOf, 1);

    restore = _restore.splice(indexOf, 1)[0];
  }

  if (this.opts.hasOverlay) {
    // deactivate overlay
    this.overlay.setAttribute(this.opts.attr, this.opts.offState);
  } // close modal


  this.el.setAttribute(this.opts.attr, this.opts.offState); // restore the focus to the previously active element

  restore.focus();
  this.emit('close');
  handler.emit('close', this);
};
/**
 * modal.verticallyCenter()
 */


Modal.prototype.verticallyCenter = function () {
  this.el.style.top = getModalTop(this.el);
};
/**
 * MODAL.config()
 * @param {Object} overwrite MODAL options
 */


var _config = function _config(options) {
  extend(_options, options);
};
/**
 * MODAL.setDefaults()
 * @param {Object} overwrite modal defaults
 */


var _setDefaults = function _setDefaults(defaults) {
  extend(_defaults, defaults);
};
/**
 * MODAL.create()
 * @param element or selector
 * @param {Object} options
 * @return {Object} new modal instance
 */


var _create = function _create(el, options) {
  var id; // early return of cached modal

  if (typeof el === 'string') {
    id = el.indexOf('#') === 0 ? el.substr(1) : el;

    if (_collection.hasOwnProperty(id)) {
      return _collection[id];
    }
  }

  var el = document.querySelector(el);
  if (!el) return; // determine the modal id

  id = el.getAttribute('id') || '_' + ++_index; // return the modal if it exists

  if (_collection.hasOwnProperty(id)) {
    return _collection[id];
  } // create the modal


  var modal = new Modal(el, id, options); // add the modal to the collection

  _collection[id] = modal;
  return modal;
};
/**
 * MODAL.closeAll()
 */


var _closeAll = function _closeAll() {
  while (_active.length > 0) {
    getActiveModal().close();
  }
};
/**
 * MODAL.closeActive()
 */


var _closeActive = function _closeActive() {
  var active = getActiveModal();

  if (active) {
    active.close();
  }
};
/**
 * MODAL.open()
 * @param {String} id
 */


var _open = function _open(id) {
  if (!_collection.hasOwnProperty(id)) return;

  _collection[id].open();
};
/**
 * MODAL.close()
 * @param {String} id
 */


var _close = function _close(id) {
  if (!_collection.hasOwnProperty(id)) return;

  _collection[id].close();
};
/**
 * MODAL.verticallyCenter()
 * @param {String} id
 */


var _verticallyCenter = function _verticallyCenter(id) {
  if (!_collection.hasOwnProperty(id)) return;

  _collection[id].verticallyCenter();
}; // bind events to trap the focus and close on 'esc'


document.addEventListener('keydown', function (e) {
  if (e.which !== 27) return;
  var activeModal = getActiveModal();
  if (!activeModal) return;
  activeModal.close();
}); // TODO: test in IE/Edge for closest support

document.addEventListener('focus', function (e) {
  var activeModal = getActiveModal();
  var selectorIsInModal = false;

  if (activeModal) {
    var activeModalId = activeModal.el.getAttribute('id');
    selectorIsInModal = e.target.closest('#' + activeModalId) !== null ? true : false;
  }

  if (!activeModal || selectorIsInModal) return;
  e.stopPropagation();
  activeModal.el.focus();
}, true);
var modalHandler = extend(handler, {
  config: _config,
  setDefaults: _setDefaults,
  create: _create,
  closeAll: _closeAll,
  closeActive: _closeActive,
  open: _open,
  close: _close,
  verticallyCenter: _verticallyCenter
});

module.exports = modalHandler;

},{"c2-event-handler":3}],2:[function(require,module,exports){
var MODAL = require('../../cjs/modal-handler.js');

MODAL.config({
    'zIndexStart': 50
});

MODAL.setDefaults({
    'modalOpenClass': 'isActive'
});

document.addEventListener('click', function (e) {

    if (e.target.getAttribute('href') && e.target.getAttribute('href').includes('#Modal-')) {
        e.preventDefault();
        var modal = MODAL.create(e.target.getAttribute('href'));

        // cause a repaint
        modal.el.getBoundingClientRect();

        modal.open();
    }
});

document.addEventListener('click', function (e) {

    if (e.target.getAttribute('href') && e.target.getAttribute('href') === ('#CloseModal')) {
        e.preventDefault();
        MODAL.close(e.target.closest('.CustomModal').getAttribute('id'));
    }
});

document.addEventListener('click', function (e) {

    if (e.target === document.querySelector('.Overlay')) {
        MODAL.closeAll();
    }
});

},{"../../cjs/modal-handler.js":1}],3:[function(require,module,exports){
'use strict';

var on = function (event, fn) {
    var _this = this;

    if (typeof event !== 'string' || !event.length || typeof fn === 'undefined') return;

    if (event.indexOf(' ') > -1) {
        event.split(' ').forEach(function (eventName) {
            on.call(_this, eventName, fn);
        });
        return;
    }

    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(fn);
};

var off = function (event, fn) {
    var _this2 = this;

    if (typeof event !== 'string' || !event.length) return;

    if (event.indexOf(' ') > -1) {
        event.split(' ').forEach(function (eventName) {
            off.call(_this2, eventName, fn);
        });
        return;
    }

    this._events = this._events || {};

    if (event in this._events === false) return;

    if (typeof fn === 'undefined') {
        delete this._events[event];
        return;
    }

    var index = this._events[event].indexOf(fn);
    if (index > -1) {
        if (this._events[event].length === 1) {
            delete this._events[event];
        } else {
            this._events[event].splice(index, 1);
        }
    }
};

var emit = function (event) {
    var _this3 = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var lastIndex = event.lastIndexOf(':');
    if (lastIndex > -1) {
        emit.call.apply(emit, [this, event.substring(0, lastIndex)].concat(args));
    }

    this._events = this._events || {};

    if (event in this._events === false) return;

    this._events[event].forEach(function (fn) {
        fn.apply(_this3, args);
    });
};

var EventConstructor = function () {};

var proto = EventConstructor.prototype;
proto.on = on;
proto.off = off;
proto.emit = emit;

// legacy extensions
proto.bind = on;
proto.unbind = off;
proto.trigger = emit;

var handler = function (_class) {

    // constructor
    if (arguments.length === 0) {
        return new EventConstructor();
    }

    // mixin
    if (typeof _class === 'function') {
        _class.prototype.on = on;
        _class.prototype.off = off;
        _class.prototype.emit = emit;
    }

    if (typeof _class === 'object') {
        _class.on = on;
        _class.off = off;
        _class.emit = emit;
    }

    return _class;
};

handler.EventConstructor = EventConstructor;

module.exports = handler;
},{}]},{},[2]);
