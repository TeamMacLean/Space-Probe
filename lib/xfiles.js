const cp = require('child_process');
const readline = require('readline');
module.exports = function (dir, finders) {
    return new Promise((good, bad) => {

        Promise.all(
            finders.map(finder => {
                return new Promise((good, bad) => {
                    const currentOutput = [];
                    const child = cp.spawn('find', [dir, '-type', 'f', '-name', finder]);

                    readline.createInterface({
                        input: child.stdout,
                        terminal: false
                    }).on('line', function (line) {
                        currentOutput.push(line);
                    });
                    child.stderr.on('data', function (data) {
                        return bad(data.toString());
                    });
                    //
                    child.on('close', function (code) {
                        return good(currentOutput);
                    });
                })
            })
        )
            .then(output => {
                return [].concat.apply([], output);
            })
            .catch(err => bad(err));
    })
};