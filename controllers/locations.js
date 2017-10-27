const Location = require('../models/location');
const r = require('../lib/thinky').r;
const compare = require('../lib/compare');
module.exports = {

    show: function (req, res, next) {

        Location
            .filter({name: req.params.location})
            .getJoin({folders: true, scan: true})
            // .dateHumanShort()
            .orderBy(r.desc(function (row) {
                return row('scan')('date');
            }))
            .then(instances => {
                if (instances && instances.length) {

                    const instances = instances.map(i => {
                        return {
                            location: i,
                            size: i.folders.reduce((total, current) => {
                                return total + current.size
                            }, 0)
                        }
                    });

                    const scanWithComparison = compare.locations(instances[0], instances[1]);
                    return res.render('locations/show', {location: scanWithComparison, instances: instances});
                } else {
                    return next();
                }
            })
            .catch(err => {
                console.error(err);
                return next(err);
            })

    }

};