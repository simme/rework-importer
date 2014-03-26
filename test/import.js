//
// # Test
//

var assert = require('assert');
var imprt  = require('../import');
var rework = require('rework');
var read   = require('fs').readFileSync;

suite('Import', function () {
  test('Correctly imports files.', function () {
    var str = r('test.css');
    var css = rework(str)
      .use(imprt({
        path: "test.css",
        base: __dirname
      }))
      .toString() + '\n';
    assert.equal(r('exp1.css'), css);
  });

  test('Nested imports works.', function () {
    var str = r('test2.css');
    var css = rework(str)
      .use(imprt({
        path: "test2.css",
        base: __dirname
      }))
      .toString() + '\n';
    assert.equal(r('exp2.css'), css);
  });

  test('Multiple imports works.', function () {
    var str = r('test3.css');
    var css = rework(str)
      .use(imprt({
        path: "test3.css",
        base: __dirname
      }))
      .toString() + '\n';
    assert.equal(r('exp3.css'), css);
  });

  test('Circular imports are blocked.', function () {
    var str = r('test4.css');
    var css = rework(str)
      .use(imprt({
        path: "test4.css",
        base: __dirname
      }))
      .toString() + '\n';
    assert.equal(r('exp4.css'), css);
  });

  test('"Native" import works.', function () {
    var str = r('test5.css');
    var css = rework(str)
      .use(imprt({
        path: "test5.css",
        base: __dirname
      }))
      .toString() + '\n';
    assert.equal(r('exp5.css'), css);
  });

  test('Internet urls will not break the process', function () {
    var str = r('test6.css');
    var css = rework(str)
      .use(imprt({
        path: "test6.css",
        base: __dirname
      }))
      .toString() + '\n';
    assert.equal(r('exp6.css'), css);
  });
});

function r(name) {
  return read(__dirname + '/' + name, 'utf-8');
}

