const fs = require('fs');
const path = require('path');
const du = require('./du');
const xFilesScan = require('./xfiles');
const config = require('../config');
const queue = require('queue');

const q = queue();
q.concurrency = 1;
q.autostart = true;

/**
 *
 * @param root
 * @returns {Promise.<*[]>}
 */
function getSizeOfSubFolders(root) {
    console.log('scanning', root);
    const isDirectory = source => fs.lstatSync(source).isDirectory();
    const getDirectories = source =>
        fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
    return Promise.all(
        getDirectories(root).map(dir => {
            return new Promise((g2, b2) => {
                q.push(
                    function (cb) {
                        console.log('du-ing', dir);
                        du(dir)
                            .then(size => {
                                console.log('du done', dir, size);
                                cb();
                                return g2({name: dir.split('/').pop(), size: size})
                            })
                            .catch(err => {
                                cb();
                                return b2(err);
                            });
                    }
                )
            })
        })
    )
}

/**
 *
 * @param dir
 */
function xfer(dir) {
    return xFilesScan(dir, config.xfiles)
}


return module.exports = {
    /**
     *
     * @param scan
     * @returns {Promise}
     */
    reads: function (scan) {
        return new Promise((good, bad) => {
            getSizeOfSubFolders(config.readsRootPath)
                .then(folders => {
                    return Promise.all(
                        folders.map(folder => {
                            folder.scanID = scan.id;
                            return folder;
                        })
                    )
                })
                .then(savedFolders => good(savedFolders))
                .catch(err => bad(err));
        });
    },
    /**
     *
     * @param scan
     * @returns {Promise}
     */
    scratch: function (scan) {
        return new Promise((good, bad) => {
            getSizeOfSubFolders(config.scratchRootPath)
                .then(folders => {
                    return Promise.all(
                        folders.map(folder => {
                            return new Promise((g2, b2) => {
                                console.log('getting xfiles for', folder);
                                xfer(config.scratchRootPath)
                                    .then(xfiles => {
                                        folder.xfiles = xfiles;
                                        folder.scanID = scan.id;
                                        console.log('xfiles', xfiles.length);
                                        return g2(folder);
                                    })
                                    .catch(err => {
                                        console.error(err);
                                        folder.xfiles = [];
                                        folder.scanID = scan.id;
                                        console.log('xfiles', xfiles.length);
                                        return g2(folder); //LET IT FAIL FOR NOW
                                    })
                            })
                        })
                    )
                        .then(savedFolders => good(savedFolders))
                })
                .catch(err => bad(err));
        })
    },
    /**
     *
     * @param scan
     * @returns {Promise}
     */
    home: function (scan) {
        return new Promise((good, bad) => {

            getSizeOfSubFolders(config.homeRootPath)
                .then(folders => {
                    return Promise.all(
                        folders.map(folder => {
                            folder.scanID = scan.id;
                            return folder;
                        })
                    )
                })
                .then(savedFolders => good(savedFolders))
                .catch(err => bad(err));
        })
    },
    /**
     *
     */
    all: function () {
        return new Promise((good, bad) => {
            const savedScan = {date: new Date()};
            Promise.all([this.home(savedScan), this.reads(savedScan), this.scratch(savedScan)])
                .then((folders) => {
                    console.log('DONE!!');
                    return good(
                        {
                            scan: savedScan,
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