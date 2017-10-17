#!/usr/bin/env node

if (process.argv.length < 3) {
    console.error('Usage: import <file>');
    return process.exit(-1)
}

const Scan = require('./models/scan');


// require('./')(process.argv[2], function (err, size) {
//     if (err) {
//         console.error(err)
//         return process.exit(-1)
//     }
//     console.log(size, process.argv[2])
// })