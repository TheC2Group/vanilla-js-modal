var MODAL = require('../../cjs/modal-handler.js');

MODAL.on('open', function (modal) {
    console.log(modal);
});

MODAL.on('close', function (modal) {
    console.log(modal);
});

var modal = MODAL.create('#Modal');

modal.on('open', function () {
    console.log('open');
});

modal.on('close', function () {
    console.log('close');
});

modal.el.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target === this.querySelector('.Close')) {
        modal.close();
    }
});

document.getElementById('Trigger').addEventListener('click', function (e) {
    e.preventDefault();
    modal.open();
});

document.body.addEventListener('click', function (e) {
    if (e.target === document.querySelector('.Overlay')) {
        MODAL.closeActive();
    }
});
