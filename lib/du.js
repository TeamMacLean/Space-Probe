const cp = require('child_process');

/**
 * returns folder in kb size
 * @param dir
 * @returns {Promise}
 */
module.exports = function (dir) {


    return new Promise((good, bad) => {

        cp.exec(`du -sk ${dir}`, function (err, stdout, stderr) { //getting Kb but returns b
            stdout = stdout.toString('utf8');
            stderr = stderr.toString('utf8'); //TODO DEAL WITH IT!!!
            // if (err || stderr) {
            //     return bad(stderr || err);
            // }
            //TODO currently if there is an error (permission denied) it will still finish

            try {
                const int = parseInt(stdout.split("\t")[0], 10);
                return good(int * 1000);
            } catch (catchErr) {

                if (err || stderr) {
                    return bad(stderr || err);
                } else {
                    bad(catchErr);
                }

                return bad(err);
            }


        });

    })


};

