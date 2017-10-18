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
            .limit(5) //ONLY SHOW LAST 10 SCANS!!
            .then(instances => {
                console.log(instances);
                return res.render('reads/show', {instances});
            })
            .catch(err => {
                console.error(err);
                return next(err);
            })

    }

};