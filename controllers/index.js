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
        rf.differenceHuman = '0';
        const pFound = previous.readsFolders.filter(prf => {
            return prf.name === rf.name;
        });

        if (pFound && pFound.length) {
            rf.sizePrevious = pFound[0].size;
            rf.sizeHumanPrevious = pFound[0].sizeHuman;

            rf.differenceHuman = `${rf.size > pFound[0].size ? '+' : '-'}  ${filesize(Math.abs(rf.size - pFound[0].size))}`
        }

        return rf;
    });

    current.scratchFolders = current.scratchFolders.map(sf => {

        sf.sizePrevious = 0;
        sf.sizeHumanPrevious = 0;
        sf.differenceHuman = '0';


        const pFound = previous.scratchFolders.filter(psf => {
            return psf.name === sf.name;
        });

        if (pFound && pFound.length) {
            sf.sizePrevious = pFound[0].size;
            sf.sizeHumanPrevious = pFound[0].sizeHuman;
            sf.differenceHuman = `${sf.size > pFound[0].size ? '+' : '-'}  ${filesize(Math.abs(sf.size - pFound[0].size))}`
        }

        return sf;
    });

    current.homeFolders = current.homeFolders.map(hf => {
        hf.sizePrevious = 0;
        hf.sizeHumanPrevious = 0;
        hf.differenceHuman = '0';
        const pFound = previous.scratchFolders.filter(phf => {
            return phf.name === hf.name;
        });

        if (pFound && pFound.length) {
            hf.sizePrevious = pFound[0].size;
            hf.sizeHumanPrevious = pFound[0].sizeHuman;
            hf.differenceHuman = `${hf.size > pFound[0].size ? '+' : '-'}  ${filesize(Math.abs(hf.size - pFound[0].size))}`
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


