const cp = require('child_process');
const readline = require('readline');
module.exports = function (dir, finders) {
    return new Promise((good, bad) => {
        Promise.all(
            finders.map(finder => {
                return new Promise((g2, b2) => {
                    const currentOutput = [];
                    const child = cp.spawn('find', [dir, '-type', 'f', '-name', finder]);

                    readline.createInterface({
                        input: child.stdout,
                        terminal: false
                    }).on('line', function (line) {
                        currentOutput.push(line);
                    });
                    child.stderr.on('data', function (data) {
                        return b2(data.toString());
                    });
                    //
                    child.on('close', function (code) {
                        return g2(currentOutput);
                    });
                })
            })
        )
            .then(output => {
                return good([].concat.apply([], output));
            })
            .catch(err => bad(err));
    })
};