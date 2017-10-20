// const ReadsFolder = require('../models/readsFolder');
// const ScratchFolder = require('../models/scratchFolder');
// const HomeFolder = require('../models/homeFolder');
const Scan = require('../models/scan');
const filesize = require('filesize');
const r = require('../lib/thinky').r;

/**
 *
 * @param current
 * @param previous
 */
function compareScans(current, previous) {


    if (!previous) {
        console.log('NO PREVIOUS');
        return current;
    }

    function buildComparison(currentFolders, previousFolders) {

        return currentFolders.map(cf => {

            cf.sizePrevious = 0;
            cf.sizeHumanPrevious = 0;
            cf.sizeDifference = 0;
            cf.sizeDifferenceHuman = '0';


            const pFound = previousFolders.filter(pf => {
                return pf.name === cf.name;
            });

            if (pFound && pFound.length) {
                cf.sizePrevious = pFound[0].size;
                cf.sizeHumanPrevious = pFound[0].sizeHuman;
                cf.sizeDifference = cf.size - pFound[0].size;
                if (Math.abs(cf.sizeDifference) !== 0) {
                    cf.sizeDifferenceHuman = `${cf.sizeDifference > 0 ? '+' : '-'}  ${filesize(Math.abs(cf.sizeDifference))}`
                }
            }

            return cf;

        })

    }

    current.readsFolders = buildComparison(current.readsFolders, previous.readsFolders);
    current.scratchFolders = buildComparison(current.scratchFolders, previous.scratchFolders);
    current.homeFolders = buildComparison(current.homeFolders, previous.homeFolders);

    return current;

}

module.exports = {
    index: function (req, res, next) {
        Scan.orderBy({index: r.desc("date")})
            .getJoin()
            .run()
            .then(scans => {

                // console.log(scans[0], scans[1]);

                const scanWithComparison = compareScans(scans[0], scans[1]);
                return res.render('index', {scan: scanWithComparison});
            });
    }
};


