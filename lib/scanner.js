const fs = require('fs');
const path = require('path');
const du = require('./du');
const xFilesScan = require('./xfiles');
const config = require('../config');

/**
 *
 * @param root
 * @param checkXFiles boolean
 * @returns {Promise.<*[]>}
 */
function getSizeOfSubFolders(root, checkXFiles) {
    const isDirectory = source => fs.lstatSync(source).isDirectory();
    const getDirectories = source =>
        fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
    return Promise.all(
        getDirectories(root).map(dir => {
            return new Promise((good, bad) => {
                du(dir)
                    .then(size => {
                        console.log('scanned', dir, size);
                        let folder = {name: dir.split('/').pop(), size: size};

                        if (checkXFiles) {
                            xFilesScan(root, config.xfiles)
                                .then(xfiles => {
                                    folder.xfiles = xfiles;
                                    return good(xfiles)
                                })
                                .catch(err => bad(err));
                        } else {
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
    /**
     *
     * @returns {Promise}
     */
    reads: function () {
        return getSizeOfSubFolders(config.readsRootPath);
    },
    /**
     *
     * @returns {Promise}
     */
    scratch: function () {
        return getSizeOfSubFolders(config.scratchRootPath, true);
    },
    /**
     *
     * @returns {Promise}
     */
    home: function () {
        return getSizeOfSubFolders(config.scratchRootPath, true);

    },
    /**
     *
     */
    all: function () {
        return new Promise((good, bad) => {
            Promise.all([this.home(), this.reads(), this.scratch()])
                .then((folders) => {
                    console.log('scanned all');
                    return good(
                        {
                            scan: {date: new Date()},
                            home: folders[0],
                            reads: folders[1],
                            scratch: folders[2]
                        }
                    );
                })
                .catch(err => bad(err));
        })
    }
};