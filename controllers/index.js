// const ReadsFolder = require('../models/readsFolder');
// const ScratchFolder = require('../models/scratchFolder');
// const HomeFolder = require('../models/homeFolder');
const Scan = require('../models/scan');

const r = require('../lib/thinky').r;
const compare = require('../lib/compare');


module.exports = {
    index: function (req, res, next) {
        Scan.orderBy({index: r.desc("date")})
            .getJoin({locations: {folders: true}})
            .run()
            .then(scans => {

                // console.log(scans[0], scans[1]);

                const scanWithComparison = compare.scan(scans[0], scans[1]);
                //SORT BY NAME


                return res.render('index', {scan: scanWithComparison, instances: scans});
            });
    }
};


