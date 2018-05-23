'use strict';

var acorn = require('acorn')
var walk = require('acorn/dist/walk')

module.exports = function(source) {
  this.cacheable && this.cacheable();

  var fragments = [];
  var endFragment = '';

  let lastEnd = 0;
  let literals = [];
  walk.simple(acorn.parse(source), {
    Literal(node) {
      literals.push(node);
    }
  });

  literals.sort(comparator);

  for (var i = 0; i < literals.length; i++) {
    var node = literals[i];
    var literalValue = node.raw;

    fragments.push(source.slice(lastEnd, node.start));
    lastEnd = node.end;

    endFragment = source.slice(node.end);

    let re = /^0[0-9]+$/
    if (re.test(literalValue)) {
      literalValue = '0o' + literalValue.slice(1);
    }

    fragments.push(literalValue);
  }

  fragments.push(endFragment);
    
  return fragments.join('');
}

function comparator(a, b) {
  if (a.start < b.start) {
    return -1;
  }

  if (a.start == b.start) {
    return 0;
  }

  return 1;
}
