const filesize = require('../lib/filesize');

function buildComparison(currentFolder, previousFolder) {


    currentFolder.sizePrevious = 0;
    currentFolder.sizeDifference = 0;
    currentFolder.sizeDifferenceHuman = '0';


    currentFolder.sizePrevious = previousFolder.size;
    currentFolder.sizeDifference = currentFolder.size - previousFolder.size;
    if (Math.abs(currentFolder.sizeDifference) !== 0) {
        currentFolder.sizeDifferenceHuman = `${currentFolder.sizeDifference > 0 ? '+' : '-'} ${filesize(Math.abs(currentFolder.sizeDifference))}`
    }

    return currentFolder;

}

module.exports = {
    /**
     *
     * @param current
     * @param previous
     * @returns {*}
     */
    scan(current, previous) {

        if (!previous) {
            console.log('NO PREVIOUS');
            return current;
        }

        current.locations.map((location, i) => {
            const pLocation = previous.locations.filter(pl => pl.name === location.name);
            if (pLocation && pLocation.length) {
                location.folders.map((folder, ii) => {
                    const pFolder = pLocation[0].folders.filter(pf => pf.name === folder.name);
                    if (pFolder && pFolder.length) {
                        console.log(folder,pFolder);
                        current.locations[i].folders[ii] = buildComparison(folder, pFolder[0])
                    }
                })
            }
        });


        current.locations = current.locations.sort(function (a, b) {
            const textA = a.name.toUpperCase();
            const textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        return current;

    },
    /**
     *
     * @param current
     * @param previous
     * @returns {*}
     */
    locations(current, previous) {
        current.folders.map((folder, i) => {
            const pFolder = previous.folders.filter(pf => pf.name === folder.name);
            if (pFolder && pFolder.length) {
                current.folders[i] = buildComparison(folder, pFolder[0])
            }
        });
        return current;
    }
};