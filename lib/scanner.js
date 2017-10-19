const fs = require('fs');
const path = require('path');
const du = require('./du');
const xFilesScan = require('./xfiles');
const config = require('../config');

/**
 *
 * @param root
 * @returns {Promise.<*[]>}
 */
function getSizeOfSubFolders(root) {
    const isDirectory = source => fs.lstatSync(source).isDirectory();
    const getDirectories = source =>
        fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
    return Promise.all(
        getDirectories(root).map(dir => {
            return new Promise((good, bad) => {
                du(dir)
                    .then(size => {
                        console.log('du done', dir, size);
                        return good({name: dir.split('/').pop(), size: size})
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
        return getSizeOfSubFolders(config.scratchRootPath);
    },
    /**
     *
     * @returns {Promise}
     */
    home: function () {
        return new Promise((good, bad) => {
            getSizeOfSubFolders(config.homeRootPath)
                .then(folders => {
                    return Promise.all(
                        folders.map(folder => {
                            return new Promise((g2, b2) => {
                                const folderPath = path.join(config.homeRootPath, folder.name);
                                xFilesScan(folderPath, config.xfiles)
                                    .then(xfiles => {
                                        console.log(folder.name, xfiles.length);
                                        folder.xfiles = xfiles;
                                        return g2(folder);
                                    })
                                    .catch(err => b2(err));
                            })
                        })
                    )
                })
                .then(folders => good(folders))
                .catch(err => bad(err));
        })
    },
    /**
     *
     */
    all: function () {
        return new Promise((good, bad) => {
            Promise.all([this.home(), this.reads(), this.scratch()])
                .then((folders) => {
                    console.log('DONE!!');
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