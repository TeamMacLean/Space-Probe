// const ReadsFolder = require('../models/readsFolder');
// const ScratchFolder = require('../models/scratchFolder');
// const HomeFolder = require('../models/homeFolder');
const Scan = require('../models/scan');
const filesize = require('../lib/filesize');
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

    function buildComparison(currentFolder, previousFolder) {


        currentFolder.sizePrevious = 0;
        currentFolder.sizeHumanPrevious = 0;
        currentFolder.sizeDifference = 0;
        currentFolder.sizeDifferenceHuman = '0';


        currentFolder.sizePrevious = previousFolder.size;
        currentFolder.sizeHumanPrevious = previousFolder.sizeHuman;
        currentFolder.sizeDifference = currentFolder.size - previousFolder.size;
        if (Math.abs(currentFolder.sizeDifference) !== 0) {
            currentFolder.sizeDifferenceHuman = `${currentFolder.sizeDifference > 0 ? '+' : '-'} ${filesize(Math.abs(currentFolder.sizeDifference))}`
        }

        return currentFolder;

    }


    current.locations.map((location, i) => {
        const pLocation = previous.locations.filter(pl => pl.name === location.name);
        if (pLocation && pLocation.length) {
            location.folders.map((folder, ii) => {
                const pFolder = pLocation[0].folders.filter(pf => pf.name === folder.name);
                if (pFolder && pFolder.length) {
                    current.locations[i].folders[ii] = buildComparison(folder, pFolder[0])
                }
            })
        }
    });

    console.log(current);
    return current;

}

module.exports = {
    index: function (req, res, next) {
        Scan.orderBy({index: r.desc("date")})
            .getJoin({locations: {folders: true}})
            .run()
            .then(scans => {

                // console.log(scans[0], scans[1]);

                const scanWithComparison = compareScans(scans[0], scans[1]);
                return res.render('index', {scan: scanWithComparison});
            });
    }
};


