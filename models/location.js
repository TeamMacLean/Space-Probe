const thinky = require('../lib/thinky.js');
const type = thinky.type;

const Location = thinky.createModel("Location", {
    id: type.string(),
    scanID: type.string().required(),
    name: type.string().required(),
    // size: type.number().required(),
});

module.exports = Location;

const Folder = require('./folder');
Location.hasMany(Folder, 'folders', 'id', 'locationID');

const Scan = require('./scan');
Location.belongsTo(Scan, 'scan', 'scanID', 'id');