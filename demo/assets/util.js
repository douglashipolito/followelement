(function(root, undefined) {
  'use strict';

  root.insertNewElement = function (classAttr, hide) {
    var body = document.querySelector('body'),
        element = document.createElement('div');

    if(document.querySelector('.' + classAttr)) {
      return document.querySelector('.' + classAttr);
    }

    element.classList.add(classAttr || 'element-' + document.querySelectorAll('div').length);
    element.innerHTML = 'Test element';


    if(hide) {
      element.style.display = 'none';
    }

    body.appendChild(element);

    return element;
  };

  root.showElement = function (selector) {
    var elements = document.querySelectorAll(selector),
        elementsLength = elements.length,
        i = 0;

    for(; i < elementsLength; i++) {
      elements[i].style.display = 'block';
    }

    return elements;
  };

  root.hideElement = function (selector) {
    var elements = document.querySelectorAll(selector),
        elementsLength = elements.length,
        i = 0;

    for(; i < elementsLength; i++) {
      elements[i].style.display = 'none';
    }

    return elements;
  };

  root.removeElement = function (selector) {
    var elements = document.querySelectorAll(selector),
        elementsLength = elements.length,
        i = 0;

    for(; i < elementsLength; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }

    return elements;
  };

  root.isThereThisElement = function (selector) {
    return !!document.querySelectorAll(selector).length;
  };

  root.testFollowElementFlow = function (c, time) {
    return {
      insert: function () {
        this.element = insertNewElement(c, true);
        return this;
      },
      show: function () {
        //Appear
        this.element.style.display = 'block';
        return this;
      },
      hide: function () {
        //Disappear
        this.element.style.display = 'none';
        return this;
      },
      remove: function () {
        //Remove
        this.element.parentNode.removeChild(element);
        return this;
      }
    }
  };

}(this));
