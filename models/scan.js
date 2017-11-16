
const path = require('path');
const thinky = require(path.join(__dirname,'../lib/thinky.js'));
// const r = thinky.r;
const type = thinky.type;
const moment = require('moment');

const Scan = thinky.createModel("Scan", {
    id: type.string(),
    date: type.date().default(new Date())
});

module.exports = Scan;

Scan.define('getDateHuman', function () {
    return moment(this.date).format('DD/MM/YY HH:mm');
});

const Location = require(path.join(__dirname,'./location'));

Scan.hasMany(Location, 'locations', 'id', 'scanID');

Scan.ensureIndex("date");