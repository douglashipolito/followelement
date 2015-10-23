/*global describe, it */
'use strict';

describe('followElement', function () {

  describe('#insert()', function () {
    it('should calls the callback function when a element is inserted', function (done) {
      insertNewElement('div', {
        hide: false,
        class: 'test-1'
      });

      followElement('div.test-1', {
        context: 'body'
      })
      .insert(function () {
        expect(document.querySelectorAll('div.test-1').length).toEqual(1);
        done();
      });
    });
  });
});
