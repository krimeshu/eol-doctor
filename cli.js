#!/usr/bin/env node

const { analyseArgs } = require('./args');

const main = require('.');

(() => {
    const [dir, eol, ...extraArgs] = process.argv.slice(2);
    const options = analyseArgs(extraArgs);
    // console.log(argMap);
    if (!dir || !eol) {
        main.showExample();
    } else {
        main.process(dir, eol, options);
    }
})();
