const cp = require('child_process');
const readline = require('readline');
const fs = require('fs');
const filesize = require('./filesize');
module.exports = function (dir, finders) {
    return new Promise((good, bad) => {
        Promise.all(
            finders.map(finder => {
                return new Promise((g2, b2) => {
                    const currentOutput = [];
                    const child = cp.spawn('find', [dir, '-type', 'f', '-iname', finder]);

                    readline.createInterface({
                        input: child.stdout,
                        terminal: false
                    }).on('line', function (line) {
                        currentOutput.push(line);
                    });
                    child.stderr.on('data', function (data) {
                        console.log('WARNING', data.toString());
                    });
                    //
                    child.on('close', function (code) {
                        return g2(currentOutput);
                    });
                })
            })
        )
            .then(outputs => {
                const output = [].concat.apply([], outputs);

                return Promise.all(
                    output.map(o => {
                        return new Promise((g3, b3) => {
                            fs.stat(o, function (err, stats) {
                                if (err) {
                                    return b3(err);
                                }
                                return g3({path: o, size: stats.size, sizeHuman: filesize(stats.size, true)});
                            })
                        })

                    })
                )


            })
            .then(output => {
                return good(output);
            })
            .catch(err => bad(err));
    })
};