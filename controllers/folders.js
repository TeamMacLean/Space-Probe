const Folder = require('../models/folder');
const r = require('../lib/thinky').r;
const filesize = require('../lib/filesize');
module.exports = {

    show: function (req, res, next) {

        Folder
            .getJoin({location: {scan: true}})
            .filter({name: req.params.folder, location: {name: req.params.location}})
            // .dateHumanShort()
            .orderBy(r.desc(function (row) {
                return row('location')('scan')('date');
            }))
            .limit(10) //ONLY SHOW LAST 10 SCANS!!
            .then(instances => {


                if (!instances || instances.length < 1) {
                    return next();
                }

                return res.render('folders/show', {instances, filesize});
            })
            .catch(err => {
                console.error(err);
                return next(err);
            })

    }

};