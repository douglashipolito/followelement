/*global describe, it */
'use strict';

describe('followElement tests', function () {
  var noop = function () {},
      observerMethods = ['insert', 'appear', 'disappear', 'remove'],
      elementSpy,
      currentFollowElement;

  function callback(method) {
    return function () {
      elementSpy[method]();
    };
  }

  function shouldHaveNotCalled(methods) {
    methods.forEach(function (method) {
      expect(elementSpy[method]).not.toHaveBeenCalled();
    });

    return this;
  }

  function shouldHaveCalled(methods) {
    methods.forEach(function (method) {
      expect(elementSpy[method]).toHaveBeenCalled();
    });

    return this;
  }

  describe('should be able to listen when an element is inserted', function () {

    beforeEach(function () {
      elementSpy = jasmine.createSpyObj('elementSpy', observerMethods);
      currentFollowElement = followElement('.test');

      currentFollowElement
        .appear(callback('appear'))
        .disappear(callback('disappear'))
        .remove(callback('remove'), 'body');
    });

    it('and currentFollowElement should be an instance of followElement', function () {
      expect(currentFollowElement).toEqual(jasmine.any(followElement));
    });

    it('should throw an error if the context is not defined', function () {
      //Force a null context
      currentFollowElement.setContext(null, 'insert');

      expect(function () {
        var noop = function () {};
        currentFollowElement.insert(noop);
      }).toThrowError('You must define the "context" param');

      insertNewElement('test', true);
    });

    it('and just "insert" method should have been called', function (done) {
      currentFollowElement.insert(function () {
        elementSpy.insert();

        shouldHaveNotCalled(['appear', 'disappear', 'remove']);
        shouldHaveCalled(['insert']);

        done();
      }, 'body');

      insertNewElement('test', true);
    });
  });

  describe('should be able to listen when an element appears', function () {

    beforeEach(function () {
      elementSpy = jasmine.createSpyObj('elementSpy', observerMethods);
      currentFollowElement = followElement('.test');

      currentFollowElement
        .insert(callback('insert'), 'body')
        .disappear(callback('disappear'))
        .remove(callback('remove'), 'body');
    });

    it('and currentFollowElement should be an instance of followElement', function () {
      expect(currentFollowElement).toEqual(jasmine.any(followElement));
    });

    it('and just "insert" and "appear" methods should have been called', function (done) {
      currentFollowElement.appear(function () {
        elementSpy.appear();

        shouldHaveNotCalled(['disappear', 'remove']);
        shouldHaveCalled(['insert', 'appear']);

        done();
      });

      insertNewElement('test', true);
      showElement('.test');
    });
  });
});
