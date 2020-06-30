const minilisp = require('.')

const fns = global.fns = {};

fns['+'] = (a, b) => a + b;
fns['-'] = (a, b) => a - b;
fns['='] = (a, b) => a === b;
fns['async'] = (...fn) => Promise.resolve().then(fn);
fns['print'] = (...args) => console.log(...args);

const lisp = minilisp(function (name) {
  const fn = fns[name];
  if(!fn) throw new Error (name + ' is not a function');  
  return fn;
})

module.exports = lisp;
