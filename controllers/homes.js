const HomesFolder = require('../models/homeFolder');
const r = require('../lib/thinky').r;

module.exports = {

    showFolder: function (req, res, next) {

        HomesFolder
            .filter({name: req.params.folderName})
            .getJoin({scan: true})
            // .dateHumanShort()
            .orderBy(r.desc(function (row) {
                return row('scan')('date');
            }))
            .limit(5) //ONLY SHOW LAST 10 SCANS!!
            .then(instances => {
                console.log(instances);
                return res.render('homes/show', {instances});
            })
            .catch(err => {
                console.error(err);
                return next(err);
            })

    }

};