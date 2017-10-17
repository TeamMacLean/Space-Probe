const fs = require('fs');
const path = require('path');
const async = require('async');

function readSizeRecursive(item, cb) {


    fs.lstat(item, function (err, stats) {
        // process.stdout.write(".");
        if (!err && stats.isDirectory()) {
            let total = stats.size;

            fs.readdir(item, function (err, list) {
                    // if (err) return cb(err);

                    if (err) {
                        if (err.code === 'EACCES') {
                            console.error('could not access', item);
                            return cb(null, 0);
                        } else {
                            return cb(err, total);
                        }
                    }
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
                }
            );
        }
        else {
            cb(err);
        }
    });
}

module.exports = readSizeRecursive;