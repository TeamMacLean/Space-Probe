// /* Copyright (c) 2012 Rod Vagg <@rvagg> */
// /* Modified by Martin Page */
// const fs = require('fs');
// const path = require('path');
// const async = require('async');
//
// function du(dir, options, callback) {
//     if (typeof options === 'function') {
//         callback = options;
//         options = {}
//     }
//
//     fs.lstat(dir = path.resolve(dir), function (err, stat) {
//         if (err) return callback(err);
//
//         if (!stat) return callback(null, 0);
//
//         const size = options.disk ? (512 * stat.blocks) : stat.size;
//
//         if (!stat.isDirectory())
//             return callback(null, !options.filter || options.filter(dir) ? size : 0);
//
//
//         fs.readdir(dir, function (err, list) {
//             if (err) {
//                 if (err.code === 'EACCES') {
//                     console.error('could not access', dir);
//                     return callback(null, 0);
//                 } else {
//                     return callback(err);
//                 }
//             } else {
//
//                 async.map(
//                     list.map(function (f) {
//                         return path.join(dir, f)
//                     })
//                     , function (f, callback) {
//                         return du(f, options, callback)
//                     }
//                     , function (err, sizes) {
//                         callback(
//                             err
//                             , sizes && sizes.reduce(function (p, s) {
//                             return p + s
//                         }, size)
//                         )
//                     }
//                 )
//             }
//         })
//     })
// }
//
// module.exports = du;


const fs = require('fs');
const path = require('path');
const async = require('async');

function readSizeRecursive(item, cb) {
    fs.lstat(item, function (err, stats) {
        process.stdout.write(".");
        if (!err && stats.isDirectory()) {
            let total = stats.size;

            fs.readdir(item, function (err, list) {
                if (err) return cb(err);

                async.forEach(
                    list,
                    function (diritem, callback) {
                        readSizeRecursive(path.join(item, diritem), function (err, size) {
                            total += size;
                            callback(err);
                        });
                    },
                    function (err) {
                        cb(err, total);
                    }
                );
            });
        }
        else {
            cb(err);
        }
    });
}

module.exports = readSizeRecursive;