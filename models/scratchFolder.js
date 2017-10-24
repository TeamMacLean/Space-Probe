const thinky = require('../lib/thinky.js');
const type = thinky.type;

const ScratchFolder = thinky.createModel("ScratchFolder", {
    id: type.string(),
    scanID: type.string().required(),
    name: type.string().required(),
    size: type.number().required(),
    xfiles: [type.object()]
});

module.exports = ScratchFolder;

const Scan = require('./scan');
ScratchFolder.belongsTo(Scan, 'scan', 'scanID', 'id');
