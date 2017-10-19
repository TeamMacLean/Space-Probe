const xfiles = require('./lib/xfiles');

xfiles('./', ['*.js'])
    .then(found => {
        found.map(f=>{
            console.log();
            console.log(f);
        })

    })
    .catch(err => {
        console.error(err);
    });