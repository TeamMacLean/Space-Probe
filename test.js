const scanner = require('./lib/scanner');

scanner.all()
    .then(() => {
        console.log('done');
        process.exit();
    })
    .catch(err => console.error(err));