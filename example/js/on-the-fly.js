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
