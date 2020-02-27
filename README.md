vanilla-js-modal
================

* Allow modals to be added anywhere on the page
* Handle z-index for multiple modals
* Trap the focus inside the modal
* Restore the focus to the active element when modal is closed
* Allow the `esc` key to close the active modal
* CommonJS module



Get Started
-----------

### CommonJS

```shell
$ npm install vanilla-js-modal
```

```js
var MODAL = require('vanilla-js-modal');
```

### Browser Global

```html
<script src="TheC2Group/event-handler.js"></script>
<script src="iife/modal-handler.js"></script>
```


MODAL
-----

### MODAL.config()
_param_ {Object} overwrite MODAL options  

### MODAL.setDefaults()
_param_ {Object} overwrite modal defaults  

### MODAL.create()
_param_  element or selector  
_param_ {Object} options  
_return_ {Object} new modal instance  

```js
// example
var modal = MODAL.create('#Modal', {
    verticallyCenterModal: false
});
```

### MODAL.closeAll()

### MODAL.closeActive()

### MODAL.open()
_param_ {String} id  

### MODAL.close()
_param_ {String} id  

### MODAL.verticallyCenter()
_param_ {String} id  


modal
-----

```js
var modal = MODAL.create('#Modal');
```

### modal.open()
### modal.close()
### modal.verticallyCenter()


MODAL options
-------------

```js
{
    zIndexStart: 1000,
    appendTo: (document.forms.length > 0 && document.forms[0].parentElement === document.body) ? document.forms[0] : document.body // Try to detect .NET webforms and append to the .NET form
}
```


modal defaults
--------------

```js
{
    hasOverlay: true,
    overlayClass: 'Overlay',
    overlayIsOff: true,
    attr: 'data-state',
    onState: 'on',
    offState: 'off',
    verticallyCenterModal: true
}
```


Accessibility
-------------

[Making an accessible dialog box](http://www.nczonline.net/blog/2013/02/12/making-an-accessible-dialog-box/)  


Notes for working on project
---------------------------

* After you pull down the project, run `npm install` to get all of the node modules
* You will want to work in the modal-handler.js file in the root
* To compile your changes, run `npm run build` (creates the CJS, IIFE and UMD versions of the module), then `npm run bundle-example` (creates the example file)
* You can run `gulp watch` to run the two npm scripts sequentially (build and bundle-example)
* To test your changes, open example/on-the-fly.html or example/simple.html in a browser



License
-------

MIT © [The C2 Group](https://c2experience.com)
