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
        path: __dirname
      }))
      .toString() + '\n';
    assert.equal(r('exp1.css'), css);
  });

  test('Nested imports works', function () {
    var str = r('test2.css');
    var css = rework(str)
      .use(imprt({
        path: __dirname
      }))
      .toString() + '\n';
    assert.equal(r('exp2.css'), css);
  });

  test('Multiple imports works', function () {
    var str = r('test3.css');
    var css = rework(str)
      .use(imprt({
        path: __dirname
      }))
      .toString() + '\n';
    assert.equal(r('exp3.css'), css);
  });
});

function r(name) {
  return read(__dirname + '/' + name, 'utf-8');
}

