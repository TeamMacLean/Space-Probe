const express = require('express');
const router = express.Router();

const r = require('../lib/thinky').r;

// const ReadsFolder = require('../models/readsFolder');
// const ScratchFolder = require('../models/scratchFolder');
// const HomeFolder = require('../models/homeFolder');

const Scan = require('../models/scan');

/**
 *
 * @param current
 * @param previous
 */
function compareScans(current, previous) {


    if (!previous) {
        console.log(previous);
        return current;
    }

    current.readsFolders = current.readsFolders.map(rf => {
        const pFound = previous.readsFolders.filter(prf => {
            return prf.name === rf.name;
        });

        if (pFound && pFound.length) {
            rf.sizePrevious = pFound[0].size;
            rf.sizeHumanPrevious = pFound[0].sizeHuman;
        }

        return rf;
    });

    current.scratchFolders = current.scratchFolders.map(sf => {
        const pFound = previous.scratchFolders.filter(psf => {
            return psf.name === sf.name;
        });

        if (pFound && pFound.length) {
            sf.sizePrevious = pFound[0].size;
            sf.sizeHumanPrevious = pFound[0].sizeHuman;
        }

        return sf;
    });

    current.homeFolders = current.homeFolders.map(hf => {
        const pFound = previous.scratchFolders.filter(phf => {
            return phf.name === hf.name;
        });

        if (pFound && pFound.length) {
            hf.sizePrevious = pFound[0].size;
            hf.sizeHumanPrevious = pFound[0].sizeHuman;
        }

        return hf;
    });

    return current;

}


/* GET home page. */
router.get('/', function (req, res, next) {


    Scan.orderBy({index: r.desc("date")})
        .getJoin()
        .run()
        .then(scans => {

            const scanWithComparison = compareScans(scans[0], scans[1]);
            // .then(scanWithComparison => {
            return res.render('index', {scan: scanWithComparison});
            // });


        });
});

module.exports = router;
