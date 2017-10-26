const thinky = require('../lib/thinky.js');
// const r = thinky.r;
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


// Scan.defineStatic('dateHumanShort', function () {
//     this.dateHumanShort = moment(this.date).format('DDMMYYYY');
//     return this;
// });

module.exports = Scan;

// const ReadsFolder = require('./readsFolder');
// const ScratchFolder = require('./scratchFolder');
// const HomeFolder = require('./homeFolder');
const Location = require('./location');

Scan.hasMany(Location, 'locations', 'id', 'scanID');
// Scan.hasMany(ScratchFolder, 'scratchFolders', 'id', 'scanID');
// Scan.hasMany(HomeFolder, 'homeFolders', 'id', 'scanID');

Scan.ensureIndex("date");