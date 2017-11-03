const fs = require('fs');
const path = require('path');
const du = require('./du');
const xFilesScan = require('./xfiles');
const config = require('../config');

const Scan = require('../models/scan');
const Location = require('../models/location');
const Folder = require('../models/folder');

const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source =>
    fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);


/**
 * @param savedLocation Location
 * @param root
 * @param checkXFiles boolean
 * @param checkInnerFolders
 * @returns {Promise.<*[]>}
 */
function process(savedLocation, root, checkXFiles, checkInnerFolders) {


    //TODO do we want the inner folders or root

    let foldersToCheck = [];

    if (checkInnerFolders) {
        foldersToCheck = getDirectories(root);
    } else {
        foldersToCheck.push(root);

    }


    return Promise.all(
        foldersToCheck.map(dir => {
            return new Promise((good, bad) => {
                du(dir)
                    .then(size => {

                        const name = dir.split('/').filter(function (entry) {
                            return entry.trim() !== '';
                        }).pop();

                        function saveIt(folderToSave) {
                            console.log('scanned', root, 'size:' + folderToSave.size, 'xfiles:' + (folderToSave.xfiles || 0));

                            new Folder({
                                name: folderToSave.name,
                                locationID: savedLocation.id,
                                size: folderToSave.size,
                                xfiles: folderToSave.xfiles || 0
                            })
                                .save()
                                .then(savedFolder => {
                                    return good(savedFolder);
                                })
                                .catch(err => bad(err));
                        }

                        let folder = {name: name, size: size};

                        if (checkXFiles) {
                            xFilesScan(dir, config.xFileExtensions)
                                .then(xfiles => {
                                    folder.xfiles = xfiles;
                                    saveIt(folder)
                                })
                                .catch(err => bad(err));
                        } else {
                            saveIt(folder)
                        }
                    })
                    .catch(err => {
                        return bad(err);
                    });
            })
        })
    )
}


return module.exports = {
    /**
     *
     */
    scan: function () {

        new Scan({}).save()
            .then(savedScan => {


                return Promise.all(
                    config.locations.map(locationConfig => {

                        new Location({
                            name: locationConfig.name,
                            scanID: savedScan.id
                        }).save()
                            .then(savedLocation => {
                                return new Promise((good, bad) => {
                                    process(savedLocation, locationConfig.path, locationConfig.checkXFiles, locationConfig.innerFolders)
                                        .then(folders => {
                                            return good(savedScan);
                                        })
                                        .catch(err => bad(err));
                                })
                            })


                    })
                )
            })
    }
};