const thinky = require('../lib/thinky.js');
// const r = thinky.r;
const type = thinky.type;
const filesize = require('../lib/filesize');

const ReadsFolder = thinky.createModel("ReadsFolder", {
    id: type.string(),
    scanID: type.string().required(),
    name: type.string().required(),
    size: type.number().required()
});


module.exports = ReadsFolder;

const Scan = require('./scan');
ReadsFolder.belongsTo(Scan,'scan', 'scanID', 'id');
