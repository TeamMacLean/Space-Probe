module.exports = {
    port: 3000,
    cron: '0 0 * * *',
    locations: [
        {
            name: 'Reads',
            paths: ['/Users/pagem/Documents/workspace/space_probe'],
            checkXFiles: false,
            innerFolders: true
        },
        {
            name: 'Scratch',
            paths: ['/Users/pagem/Documents/workspace/space_probe'],
            checkXFiles: true,
            innerFolders: true
        },
        {
            name: 'Homes',
            paths: ['/Users/pagem/Documents/workspace/space_probe'],
            checkXFiles: true,
            innerFolders: true
        },
        {
            name: 'top level test',
            paths: ['/Users/pagem/Documents/workspace/space_probe'],
            checkXFiles: true,
            innerFolders: false
        }

    ],
    xFileExtensions: [
        '*.bam',
        '*.bam.*',
        '*.fastq',
        '*.fastq.*',
        '*.fq',
        '*.fq.*',
        '*.sam',
        '*.fasta',
        '*.fasta.*',
        '*.fa',
        '*.fa.*'
    ],

};