const thinky = require('../lib/thinky.js');
const type = thinky.type;

const Folder = thinky.createModel("Folder", {
    id: type.string(),
    locationID: type.string().required(),
    name: type.string().required(),
    size: type.number().required(),
    xfiles: type.number()
});

module.exports = Folder;

const Location = require('./location');
Folder.belongsTo(Location, 'location', 'locationID', 'id');