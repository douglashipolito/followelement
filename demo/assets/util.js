(function(root, undefined) {
  'use strict';

  root.insertNewElement = function (classAttr, hide) {
    var body = document.querySelector('body'),
        element = document.createElement('div');

    element.classList.add(classAttr || 'element-' + document.querySelectorAll('div').length);

    if(hide) {
      element.classList.add('hide');
    }

    body.appendChild(element);
  };

}(this));
