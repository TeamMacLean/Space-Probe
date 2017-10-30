const Scan = require('../models/scan');

module.exports = {

    deleteScan: function (req, res, next) {


        const scanID = req.params.scanID;


        Scan.get(scanID)
            .getJoin()
            .run()
            .then(function (scan) {
                return scan.deleteAll({locations: {folders: true}})
            })
            .then(function () {
                return res.send(`Scan ${scanID} was deleted`);
            })
            .catch(function () {
                return res.send(`Scan ${scanID} failed to delete`)
            });

    }

};