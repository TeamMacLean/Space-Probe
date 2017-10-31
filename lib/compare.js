const filesize = require('../lib/filesize');

function buildComparison(currentFolder, previousFolder) {

    // const outputObject = JSON.parse(JSON.stringify(currentFolder));
    const outputObject = {
        id: currentFolder.id || null,
        size: currentFolder.size || 0,
        name: currentFolder.name || previousFolder.name || 'UNKNOWN'
    };
    outputObject.sizePrevious = 0;
    outputObject.sizeDifference = 0;
    outputObject.sizeDifferenceHuman = '0';

    if (!previousFolder) {
        previousFolder = {size: 0};
    }
    if (!currentFolder) {
        currentFolder = {size: 0};
    }


    outputObject.sizePrevious = previousFolder.size;
    outputObject.sizeDifference = (currentFolder.size > previousFolder.size) ? currentFolder.size - previousFolder.size : previousFolder.size - currentFolder.size//currentFolder.size - previousFolder.size;

    if (Math.abs(outputObject.sizeDifference) !== 0) {
        outputObject.sizeDifferenceHuman = `${outputObject.sizeDifference > 0 ? '+' : '-'} ${filesize(Math.abs(outputObject.sizeDifference))}`
    }


    return outputObject;

}


function processNewAndOldFolders(current, previous) {


    const mergedFolders = current.concat(previous);

    let flags = {};
    const uniqueFolders = mergedFolders.filter(folder => {
        if (flags[folder.name]) {
            return false;
        }
        flags[folder.name] = true;
        return true;
    });

    return uniqueFolders.map(uf => {
        const previousVersion = previous.filter(c => c.name === uf.name)[0] || {};
        const currentVersion = current.filter(c => c.name === uf.name)[0] || {};
        return buildComparison(currentVersion, previousVersion);
    })


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
            const pLocation = previous.locations.filter(pl => pl.name === location.name)[0];
            if (pLocation) {
                current.locations[i].folders = processNewAndOldFolders(location.folders, pLocation.folders);
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
        current.folders = processNewAndOldFolders(current.folders, previous.folders);
        return current;
    }
};