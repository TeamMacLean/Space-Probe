const Location = require('../models/location');
const r = require('../lib/thinky').r;

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
                    return res.render('locations/show', {location: instances[0]});
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