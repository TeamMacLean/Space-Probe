// const ReadsFolder = require('../models/readsFolder');
// const ScratchFolder = require('../models/scratchFolder');
// const HomeFolder = require('../models/homeFolder');
const express = require('express');
const router = express.Router();
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
        console.log(previous);
        return current;
    }

    current.readsFolders = current.readsFolders.map(rf => {
        rf.sizePrevious = 0;
        rf.sizeHumanPrevious = 0;
        rf.sizeDifference = 0;
        rf.sizeDifferenceHuman = '0';
        const pFound = previous.readsFolders.filter(prf => {
            return prf.name === rf.name;
        });

        if (pFound && pFound.length) {
            rf.sizePrevious = pFound[0].size;
            rf.sizeHumanPrevious = pFound[0].sizeHuman;
            rf.sizeDifference = rf.size - pFound[0].size;
            if (rf.sizeDifference) {
                rf.sizeDifferenceHuman = `${rf.sizeDifference > 0 ? '+' : '-'}  ${filesize(Math.abs(rf.sizeDifference))}`
            }
        }

        return rf;
    });

    current.scratchFolders = current.scratchFolders.map(sf => {

        sf.sizePrevious = 0;
        sf.sizeHumanPrevious = 0;
        sf.sizeDifference = 0;
        sf.sizeDifferenceHuman = '0';
        const pFound = previous.scratchFolders.filter(psf => {
            return psf.name === sf.name;
        });

        console.log(sf.size, pFound[0].size);


        if (pFound && pFound.length) {
            sf.sizePrevious = pFound[0].size;
            sf.sizeHumanPrevious = pFound[0].sizeHuman;
            sf.sizeDifference = sf.size - pFound[0].size;
            if (sf.sizeDifference) {
                sf.sizeDifferenceHuman = `${sf.sizeDifference > 0 ? '+' : '-'}  ${filesize(Math.abs(sf.sizeDifference))}`
            }
        }

        return sf;
    });

    current.homeFolders = current.homeFolders.map(hf => {
        hf.sizePrevious = 0;
        hf.sizeHumanPrevious = 0;
        hf.sizeDifference = 0;
        hf.sizeDifferenceHuman = '0';
        const pFound = previous.scratchFolders.filter(phf => {
            return phf.name === hf.name;
        });

        if (pFound && pFound.length) {
            hf.sizePrevious = pFound[0].size;
            hf.sizeHumanPrevious = pFound[0].sizeHuman;
            hf.sizeDifference = hf.size - pFound[0].size;
            if (hf.sizeDifference) {
                hf.sizeDifferenceHuman = `${hf.sizeDifference > 0 ? '+' : '-'}  ${filesize(Math.abs(hf.sizeDifference))}`
            }
        }

        return hf;
    });

    return current;

}

module.exports = {
    index: function (req, res, next) {
        Scan.orderBy({index: r.desc("date")})
            .getJoin()
            .run()
            .then(scans => {
                const scanWithComparison = compareScans(scans[0], scans[1]);
                return res.render('index', {scan: scanWithComparison});
            });
    }
};


