// const ReadsFolder = require('../models/readsFolder');
// const ScratchFolder = require('../models/scratchFolder');
// const HomeFolder = require('../models/homeFolder');
const Scan = require('../models/scan');

const r = require('../lib/thinky').r;
const compare = require('../lib/compare');
const filesize = require('../lib/filesize');

module.exports = {
    index: function (req, res, next) {

        if (req.query.scanID) {
            Scan.get(req.query.scanID)
        }

        Scan.orderBy({index: r.desc("date")})
            .getJoin({locations: {folders: true}})
            .run()
            .then(scans => {
                const scanWithComparison = compare.scan(scans[0], scans[1]);
                return res.render('index', {scan: scanWithComparison, instances: scans, filesize});
            });
    }
};


