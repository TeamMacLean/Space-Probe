module.exports = {
    port: 3000,
    locations: [
        {
            name: 'Reads',
            path: '/Users/pagem/Documents/workspace/space_probe',
            checkXFiles: false,
            innerFolders: true
        },
        {
            name: 'Scratch',
            path: '/Users/pagem/Documents/workspace/space_probe',
            checkXFiles: true,
            innerFolders: true
        },
        {
            name: 'Homes',
            path: '/Users/pagem/Documents/workspace/space_probe',
            checkXFiles: true,
            innerFolders: true
        },
        {
            name: 'top level test',
            path: '/Users/pagem/Documents/workspace/space_probe',
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