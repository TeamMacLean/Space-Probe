const ReadsFolder = require('../models/readsFolder');
const r = require('../lib/thinky').r;

module.exports = {

    showFolder: function (req, res, next) {

        ReadsFolder
            .getJoin()
            .filter({name: req.params.folderName})
            .orderBy(r.desc(function (row) {
                return row('scan')('date');
            }))
            .limit(10) //ONLY SHOW LAST 10 SCANS!!
            .then(instances => {



            })
            .catch(err=>{

            })

    }

};