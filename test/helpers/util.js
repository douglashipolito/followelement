(function(root, undefined) {
  'use strict';

  root.insertNewElement = function (elementSelector, options, classAttr, hide) {
    var body = document.querySelector('body'),
        element = document.createElement(elementSelector),
        selectorType = '',
        selector = elementSelector;

    options = options || {};

    if(options.id || options.class) {
      selectorType = options.id ? '#' : '.';
      selector = selectorType + options[selectorType.id ? 'id' : 'class'];
    }

    if(document.querySelector(selector)) {
      return document.querySelector(selector);
    }

    if(options.class) {
      element.classList.add(options.class);
    }

    element.innerHTML = 'Test element';


    if(options.hide) {
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
