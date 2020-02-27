'use strict';

import eventHandler from 'c2-event-handler';

var handler = eventHandler({});

// private variables
var _collection = {};
var _index = 0;
var _active = [];
var _restore = [];

var _options = {
    zIndexStart: 1000,
    appendTo: (document.forms.length > 0 && document.forms[0].parentElement === document.body) ? document.forms[0] : document.body // Try to detect .NET webforms and append to the .NET form
};

// default options for a modal instance
var _defaults = {
    hasOverlay: true,
    overlayClass: 'Overlay',
    overlayIsOff: true,
    attr: 'data-state',
    onState: 'on',
    offState: 'off',
    verticallyCenterModal: true
};

// Need IE9+ polyfill for closest
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;

        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}


// Pass in the objects to merge as arguments.
// For a deep extend, set the first argument to `true`.
var extend = function () {

    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;

    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
        deep = arguments[0];
        i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
        for ( var prop in obj ) {
            if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                // If deep merge and property is an object, merge properties
                if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                    extended[prop] = extend( true, extended[prop], obj[prop] );
                } else {
                    extended[prop] = obj[prop];
                }
            }
        }
    };

    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
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
var getModalTop = function (modal) {
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
var getActiveModal = function () {
    if (_active.length === 0) return null;
    return _active[_active.length - 1];
};

/**
 * new Modal class
 */
var Modal = function (el, id, options) {

    // assign the modal element
    this.el = el;

    // assign the modal id
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
        }

        // append the modal and overlay to the body
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
    this.isOpen = true;

    // add modal to the stack
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
    }

    // open modal
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
    this.isOpen = false;

    // remove modal from the stack
    var indexOf = _active.indexOf(this);
    var restore;
    if (indexOf > -1) {
        _active.splice(indexOf, 1);
        restore = _restore.splice(indexOf, 1)[0];
    }

    if (this.opts.hasOverlay) {
        // deactivate overlay
        this.overlay.setAttribute(this.opts.attr, this.opts.offState);
    }

    // close modal
    this.el.setAttribute(this.opts.attr, this.opts.offState);

    // restore the focus to the previously active element
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
var _config = function (options) {
    extend(_options, options);
};

/**
 * MODAL.setDefaults()
 * @param {Object} overwrite modal defaults
 */
var _setDefaults = function (defaults) {
    extend(_defaults, defaults);
};

/**
 * MODAL.create()
 * @param element or selector
 * @param {Object} options
 * @return {Object} new modal instance
 */
var _create = function (el, options) {
    var id;

    // early return of cached modal
    if (typeof el === 'string') {
        id = (el.indexOf('#') === 0) ? el.substr(1) : el;
        if (_collection.hasOwnProperty(id)) {
            return _collection[id];
        }
    }

    var el = document.querySelector(el);
    if (!el) return;

    // determine the modal id
    id = el.getAttribute('id') || '_' + (++_index);

    // return the modal if it exists
    if (_collection.hasOwnProperty(id)) {
        return _collection[id];
    }

    // create the modal
    var modal = new Modal(el, id, options);

    // add the modal to the collection
    _collection[id] = modal;

    return modal;
};

/**
 * MODAL.closeAll()
 */
var _closeAll = function () {
    while (_active.length > 0) {
        getActiveModal().close();
    }
};

/**
 * MODAL.closeActive()
 */
var _closeActive = function () {
    var active = getActiveModal();
    if (active) {
        active.close();
    }
};

/**
 * MODAL.open()
 * @param {String} id
 */
var _open = function (id) {
    if (!_collection.hasOwnProperty(id)) return;
    _collection[id].open();
};

/**
 * MODAL.close()
 * @param {String} id
 */
var _close = function (id) {
    if (!_collection.hasOwnProperty(id)) return;
    _collection[id].close();
};

/**
 * MODAL.verticallyCenter()
 * @param {String} id
 */
var _verticallyCenter = function (id) {
    if (!_collection.hasOwnProperty(id)) return;
    _collection[id].verticallyCenter();
};

// bind events to trap the focus and close on 'esc'
document.addEventListener('keydown', function (e) {
    if (e.which !== 27) return;
    var activeModal = getActiveModal();
    if (!activeModal) return;
    activeModal.close();
});

// TODO: test in IE/Edge for closest support
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

export default extend(handler, {
    config: _config,
    setDefaults: _setDefaults,
    create: _create,
    closeAll: _closeAll,
    closeActive: _closeActive,
    open: _open,
    close: _close,
    verticallyCenter: _verticallyCenter
});
