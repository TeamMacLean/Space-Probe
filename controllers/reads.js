const ReadsFolder = require('../models/readsFolder');
const r = require('../lib/thinky').r;

module.exports = {

    showFolder: function (req, res, next) {

        ReadsFolder
            .filter({name: req.params.folderName})
            .getJoin({scan: true})
            // .dateHumanShort()
            .orderBy(r.desc(function (row) {
                return row('scan')('date');
            }))
            .limit(10) //ONLY SHOW LAST 10 SCANS!!
            .then(instances => {
                return res.render('reads/show', {instances});
            })
            .catch(err => {
                console.error(err);
                return next(err);
            })

    }

};