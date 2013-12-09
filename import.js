//
// # Import
//
// Subsitute `@import 'filename'` with the contents of `filename`.
//

/*jslint node: true */
"use strict";

var fs         = require('fs');
var path       = require('path');
var whitespace = require('css-whitespace');
var rework     = require('rework');

//
// ## Register plugin
//
// * **opts**, options object. May contain the following:
//
//   * path: base path for resolving imports.
//   * ext: optional extension, defaults to `css`.
//   * whitespace: boolean, set to true if imported files use significant
//     whitespace instead of curlies.
//
module.exports = function (opts) {
  return function (style) {
    return new Import(opts).visit(style);
  };
};

//
// ## Importer
//
function Import(opts) {
  opts        = opts || {};
  this.opts   = opts;
  this.path   = opts.path || process.cwd();
  this.visit  = this.visit.bind(this);
  this.import = this.import.bind(this);
}

Import.prototype.visit = function (node, index, arr) {
  var type = node.type || 'stylesheet';
  if (!this[type]) return;
  this[type](node, index, arr);
};

Import.prototype.stylesheet = function (stylesheet) {
  stylesheet.rules.forEach(this.visit);
};

Import.prototype.rule = function (rule, index, base) {
  if (rule.selectors[0] == '@import') {
    var ast   = rule.declarations.map(this.import);
    var rules = [];
    ast.forEach(function (item) {
      rules = rules.concat(item.rules);
    });

    base.splice(index, 1);
    // Insert rules at same index
    var i = 0; // To make imports in order.
    rules.forEach(function (rule) {
      base.splice(index + i, 0, rule);
      i++;
    });
  }
};

Import.prototype.import = function (declaration) {
  if (declaration.property !== 'file') return;

  var file = declaration.value;
  var load = path.join(this.path, file);
  var data = fs.readFileSync(load, this.encoding || 'utf-8');

  if (this.opts.whitespace) {
    data = whitespace(data);
  }

  // Create AST and look for imports in imported code.
  // @TODO: Check for circular imports. For now don't be stupid.
  var ast = rework(data).use(module.exports(this.opts));
  return ast.obj.stylesheet;
};

