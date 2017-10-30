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
    this.dateHuman = moment(this.date).format('MMMM Do YYYY, HH:mm');
});

module.exports = Scan;

Scan.define('getDateHuman', function () {
    return moment(this.date).format('MMMM Do YYYY, HH:mm');
});

const Location = require('./location');

Scan.hasMany(Location, 'locations', 'id', 'scanID');

Scan.ensureIndex("date");