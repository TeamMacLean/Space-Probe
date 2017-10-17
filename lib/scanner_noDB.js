const fs = require('fs');
const path = require('path');
const du = require('./du');
const FileHound = require('filehound');
const config = require('../config');


// const readsRootPath = '/tsl/data/reads/';
// const scratchRootPath = '/tsl/scratch';
// const homeRootPath = '/usr/users/sl/';
// const readsRootPath = '/Users/pagem/Documents/workspace/space_probe';
// const scratchRootPath = '/Users/pagem/Documents/workspace/space_probe';
// const homeRootPath = '/Users/pagem/Documents/workspace/space_probe';

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
                du(dir, function (err, size) {
                    if (err) {
                        console.error('du error');
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
                            return folder;
                            // return new ReadsFolder(folder).save()
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
                                        return g2(folder);
                                        // return g2(new ScratchFolder(folder).save());
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
                            return folder;
                            // return new HomeFolder(folder).save()
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

                    return good(
                        {
                            scan: savedScan,
                            home: folders[0],
                            reads: folders[1],
                            scrach: folders[2]
                        }
                    );


                })
                .catch(err => bad(err));
        })
    }
};