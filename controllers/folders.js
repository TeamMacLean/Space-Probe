const Location = require('../models/location');
const Folder = require('../models/folder');
const r = require('../lib/thinky').r;

module.exports = {

    show: function (req, res, next) {

        Folder
            .getJoin({location: {scan: true}})
            .filter({name: req.params.folder, location: {name: req.params.location}})
            // .dateHumanShort()
            .orderBy(r.desc(function (row) {
                return row('scan')('date');
            }))
            .limit(10) //ONLY SHOW LAST 10 SCANS!!
            .then(instances => {
                return res.render('folders/show', {instances});
            })
            .catch(err => {
                console.error(err);
                return next(err);
            })

    }

};