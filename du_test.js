const du = require('./lib/du-native');
const filesize = require('./lib/filesize');


du('./')
    .then(out => {
        console.log(out, filesize(out));
    })
    .catch(err => {
        console.error(err);
    });


