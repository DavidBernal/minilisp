const parse = require('./parse')

const fnDict = {};
const fnNames = {};
const fnIncludes = [];
let functionsChunk = '';

module.exports = function runner (map) {
  return compileLisp;

  function compileLisp (s) {
    const source = compileAll(parse(s));
    return functionsChunk + source.join('\n');
  }

  function compileAll(programs){
    return programs.map(f => {
      const c = compile(f);
      return c + ';';
    });
  }

  function compile(program, deep = 0){
    if(!program) return;
    
    if(!Array.isArray(program)) return program.toString();
    
    const p = program[0];

    if (Array.isArray(p)) {
      return function () {
        let res
        for (const prog of program) res = compile(prog)
        return res
      }
    }

    const fnName = fnNames[p] || `fn_${Object.keys(fnNames).length}`;
    if(!fnNames[p]) fnNames[p] = fnName;
    const fn = fnDict[fnName] || map(p);
    if(!fnDict[fnName]) fnDict[fnName] = fn;

    if (typeof fn !== 'function') throw new Error(p + ' is not a function')
    let chunk = '\n';

    if(!fnIncludes.includes(fnName)) {
      functionsChunk += `
var ${fnName} = ${fn.toString()};
`
      fnIncludes.push(fnName);
    }

    chunk += `${'  '.repeat(deep)}${fnName}(${(program.slice(1).map(_p => compile(_p, deep + 1))).join(', ')})`;

    return chunk;
  }
}
