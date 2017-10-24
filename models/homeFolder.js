const thinky = require('../lib/thinky.js');
const type = thinky.type;
const filesize = require('../lib/filesize');

const HomeFolder = thinky.createModel("HomeFolder", {
    id: type.string(),
    scanID: type.string().required(),
    name: type.string().required(),
    size: type.number().required(),
    xfiles: [type.object()]
});



// HomeFolder.defineStatic('getChanges',function(){
//
// });

module.exports = HomeFolder;


const Scan = require('./scan');
HomeFolder.belongsTo(Scan, 'scan', 'scanID', 'id');