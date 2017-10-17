const thinky = require('../lib/thinky.js');
const r = thinky.r;
const type = thinky.type;
const moment = require('moment');

const Scan = thinky.createModel("Scan", {
    id: type.string(),
    date: type.date().default(new Date()),
    dateHuman: type.string().required()
});

Scan.pre('save', function () {
    this.dateHuman = moment(this.date).format('MMMM Do YYYY, h:mm:ss a');
});

module.exports = Scan;

const ReadsFolder = require('./readsFolder');
const ScratchFolder = require('./scratchFolder');
const HomeFolder = require('./homeFolder');

Scan.hasMany(ReadsFolder, 'readsFolders', 'id', 'scanID');
Scan.hasMany(ScratchFolder, 'scratchFolders', 'id', 'scanID');
Scan.hasMany(HomeFolder, 'homeFolders', 'id', 'scanID');

Scan.ensureIndex("date");