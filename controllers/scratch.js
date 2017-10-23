const ScratchFolder = require('../models/scratchFolder');
const r = require('../lib/thinky').r;
const filesize = require('../lib/filesize');

module.exports = {

    showFolder: function (req, res, next) {

        ScratchFolder
            .filter({name: req.params.folderName})
            .getJoin({scan: true})
            // .dateHumanShort()
            .orderBy(r.desc(function (row) {
                return row('scan')('date');
            }))
            .limit(10) //ONLY SHOW LAST 10 SCANS!!
            .then(instances => {
                return res.render('scratch/show', {instances});
            })
            .catch(err => {
                console.error(err);
                return next(err);
            })

    }

};