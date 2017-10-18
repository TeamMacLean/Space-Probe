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
        const pFound = previous.readsFolders.filter(prf => {
            return prf.name === rf.name;
        });

        if (pFound && pFound.length) {
            rf.sizePrevious = pFound[0].size;
            rf.sizeHumanPrevious = pFound[0].sizeHuman;

            if (rf.size === pFound[0].size) {
                rf.differenceHuman = '0';
            } else {
                rf.differenceHuman = `${rf.size > pFound[0].size ? '+' : '-'}  ${filesize(Math.abs(rf.size - pFound[0].size))}`

            }

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

            if (sf.size === pFound[0].size) {
                sf.differenceHuman = '0';
            } else {
                sf.differenceHuman = `${sf.size > pFound[0].size ? '+' : '-'}  ${filesize(Math.abs(sf.size - pFound[0].size))}`
            }
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

            if (hf.size === pFound[0].size) {
                hf.differenceHuman = '0';
            } else {
                hf.differenceHuman = `${hf.size > pFound[0].size ? '+' : '-'}  ${filesize(Math.abs(hf.size - pFound[0].size))}`
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


