const scanner = require('./lib/scanner');
const fs = require('fs');

scanner.all()
    .then((folders) => {


    console.log('scan done');

        //TODO save to files
        const ts = Math.round((new Date()).getTime() / 1000);


        fs.writeFile(`./scan-${ts}.json`, JSON.stringify(folders, null, 2), function (err) {
            if (err) {
                console.log(err);
                process.exit();
            }

            console.log("The file was saved!");
            console.log('done');

        });


        // console.log(folders);


    })
    .catch(err => console.error(err));
