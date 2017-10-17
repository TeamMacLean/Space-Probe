const thinky = require('../lib/thinky.js');
const r = thinky.r;
const type = thinky.type;
const filesize = require('filesize');

const HomeFolder = thinky.createModel("HomeFolder", {
    id: type.string(),
    scanID: type.string().required(),
    name: type.string().required(),
    size: type.number().required(),
    sizeHuman: type.string().required()
});


HomeFolder.pre('save', function () {
    this.sizeHuman = filesize(this.size);
});

module.exports = HomeFolder;
