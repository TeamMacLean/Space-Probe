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
    // console.log('scanning', root);
    const isDirectory = source => fs.lstatSync(source).isDirectory();
    const getDirectories = source =>
        fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
    return Promise.all(
        getDirectories(root).map(dir => {
            return new Promise((g2, b2) => {
                du(dir)
                    .then(size => {
                        console.log('du done', dir, size);
                        return g2({name: dir.split('/').pop(), size: size})
                    })
                    .catch(err => {
                        return b2(err);
                    });
            })
        })
    )
}


return module.exports = {
    /**
     *
     * @param scan
     * @returns {Promise}
     */
    reads: function () {
        return getSizeOfSubFolders(config.readsRootPath);
        // return new Promise((good, bad) => {
        //     getSizeOfSubFolders(config.readsRootPath)
        // .then(folders => {
        //     good(folders.map(folder => {
        //             folder.scanID = scan.id;
        //             return folder;
        //         })
        //     )
        // })
        // .catch(err => bad(err));
        // });
    },
    /**
     *
     * @param scan
     * @returns {Promise}
     */
    scratch: function () {
        return getSizeOfSubFolders(config.scratchRootPath);
        // return new Promise((good, bad) => {
        //     getSizeOfSubFolders(config.scratchRootPath)
        //         .then(folders => {

        // folders.map(folder => {
        //     folder.scanID = scan.id;
        // })

        // return Promise.all(
        //     folders.map(folder => {
        //         return new Promise((g2, b2) => {
        //             const folderPath = path.join(config.scratchRootPath, folder.name);
        //             console.log('getting xfiles for', folderPath);
        //             xFilesScan(folderPath, config.xfiles)
        //                 .then(xfiles => {
        //                     folder.xfiles = xfiles;
        //                     folder.scanID = scan.id;
        //                     console.log('xfiles', xfiles.length);
        //                     return g2(folder);
        //                 })
        //                 .catch(err => {
        //                     console.error(err);
        //                     folder.xfiles = [];
        //                     folder.scanID = scan.id;
        //                     return g2(folder); //LET IT FAIL FOR NOW
        //                 })
        //         })
        //     })
        // )
        // .then(savedFolders => {
        //     console.log('done sctatch');
        //     good(savedFolders)
        // })
        // })
        // .catch(err => bad(err));
        // })
    },
    /**
     *
     * @param scan
     * @returns {Promise}
     */
    home: function () {
        getSizeOfSubFolders(config.homeRootPath)
            .then(folders => {

                Promise.all(
                    folders.map(folder => {
                        return new Promise((good, bad) => {
                            const folderPath = path.join(config.scratchRootPath, folder.name);
                            xFilesScan(folderPath, config.xfiles)
                                .then(xfiles => {
                                    folder.xfiles = xfiles;
                                    return good(folder);
                                })
                                .catch(err => bad(err));
                        })
                    })
                )
            })
        // return new Promise((good, bad) => {
        //
        //     getSizeOfSubFolders(config.homeRootPath)
        //         .then(folders => {
        //             good(folders.map(folder => {
        //                     folder.scanID = scan.id;
        //                     return folder;
        //                 })
        //             )
        //         })
        //         .catch(err => bad(err));
        // })
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