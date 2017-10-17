const thinky = require('../lib/thinky.js');
const r = thinky.r;
const type = thinky.type;
const filesize = require('filesize');

const ScratchFolder = thinky.createModel("ScratchFolder", {
    id: type.string(),
    scanID: type.string().required(),
    name: type.string().required(),
    size: type.number().required(),
    xfiles: [type.string()]
});

ScratchFolder.pre('save', function () {
    this.sizeHuman = filesize(this.size);
});

module.exports = ScratchFolder;
