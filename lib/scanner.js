const fs = require('fs');
const path = require('path');
const du = require('du');
const FileHound = require('filehound');

const ReadsFolder = require('../models/readsFolder');
const ScratchFolder = require('../models/scratchFolder');
const HomeFolder = require('../models/homeFolder');

const Scan = require('../models/scan');

const config = require('../config');


/**
 *
 * @param root
 * @returns {Promise.<*[]>}
 */
function getSizeOfSubFolders(root) {

    console.log('dir', dir)

    const getDirectories = srcPath => fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory())

    return Promise.all(
        getDirectories(root).map(dir => {

            return new Promise((g2, b2) => {
                du(dir, function (err, size) {
                    if (err) {
                        return b2(err);
                    } else {
                        return g2({name: dir.split('/').pop(), size: size})
                        // return {name: dir.split('/').pop(), size: size}
                    }
                })
            })
        })
    )
}

/**
 *
 * @param root
 * @returns {T|*}
 */
function xfer(root) {
    //bam
    return FileHound.create()
        .paths(root)
        .ext(['.bam', '.fastq.gz', 'fq.gz'])
        .find();
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
                            console.log('folder', folder);
                            folder.scanID = scan.id;
                            return new ReadsFolder(folder).save()
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
                                xfer(config.scratchRootPath)
                                    .then(xfiles => {
                                        folder.xfiles = xfiles;
                                        folder.scanID = scan.id;
                                        return g2(new ScratchFolder(folder).save());
                                    })
                                    .catch(err => b2(err));
                            })


                        })
                    )
                        .then(savedFolders => good(savedFolders))
                })
                .catch(err => bad(err));
        })
        // user, total use, xfiles
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
                            return new HomeFolder(folder).save()
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
            new Scan({})
                .save()
                .then((savedScan) => {
                    return Promise.all([this.home(savedScan), this.reads(savedScan), this.scratch(savedScan)])
                })
                .then(() => {
                    return good()
                })
                .catch(err => bad(err));
        })
    }
};