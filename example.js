const fs = require('fs')

const lispy = require('./lispy.js')

const main = fs.readFileSync('./main.ly', 'utf-8');

const prog = lispy(main);

fs.writeFileSync('./compiled.js', prog);
