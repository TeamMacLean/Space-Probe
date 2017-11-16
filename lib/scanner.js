const fs = require('fs');
const path = require('path');
const du = require('./du');
const xFilesScan = require('./xfiles');
const config = require('../config');


const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source =>
    fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);


/**
 *
 * @param root
 * @param checkXFiles boolean
 * @param checkInnerFolders
 * @returns {Promise.<*[]>}
 */
function process(root, checkXFiles, checkInnerFolders) {


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


                        let folder = {name: name, size: size};

                        if (checkXFiles) {
                            xFilesScan(dir, config.xFileExtensions)
                                .then(xfiles => {
                                    folder.xfiles = xfiles;
                                    console.log('scanned', dir, 'size:' + size, 'xfiles:' + xfiles);
                                    return good(folder)
                                })
                                .catch(err => bad(err));
                        } else {
                            console.log('scanned', dir, 'size:' + size);
                            return good(folder);
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
    scan: function () {


        return Promise.all(
            config.locations.map(location => {
                return new Promise((good, bad) => {
                    Promise.all(
                        location.paths.map(locationPath => {
                            return process(locationPath, location.checkXFiles, location.innerFolders)
                        })
                    )
                        .then(pathArray => {
                            return good({name: location.name, folders: [].concat.apply([], pathArray)})
                        })
                        .catch(err => bad(err))
                })

            })
        )
    }
};