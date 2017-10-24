const cp = require('child_process');
const readline = require('readline');
const fs = require('fs');
module.exports = function (dir, finders) {
    return new Promise((good, bad) => {

        //TODO this is ugly as fuck!
        const names = '\\(' + finders.reduce((total, current) => {
            let o = ' -o';
            if (!total.length) {
                o = '';
            }
            return total + `${o} -iname \\${current}`
        }, '') + ' \\)';

        const currentOutput = [];
        const command = `find ${dir} -type f ${names}`;
        const child = cp.spawn(command, [], {shell: true});

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

            Promise.all(
                currentOutput.map(o => {
                    return new Promise((g2, b2) => {
                        fs.stat(o, function (err, stats) {
                            if (err) {
                                return b2(err);
                            }
                            return g2({path: o, size: stats.size});
                        })
                    })

                })
            )
                .then(output => {
                    return good(output);
                })
                .catch(err => bad(err));
        });
    })
};