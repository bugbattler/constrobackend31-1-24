
var S_City = require('../../model/basic_models/s_city_model');

module.exports = function (router) {

    router.post('/post_NewCity', function (req, res) {
        try {
            var obj = new S_City();
            if (req.body.city !== undefined)
                obj.city = req.body.city;
            if (req.body.stateID !== undefined)
                obj.stateID = req.body.stateID;
            if (req.body.regOn !== undefined)
                obj.regOn = req.body.regOn;

            S_City.find({ city: { $regex: new RegExp('^' + req.body.city + '$', "i") }, stateID: req.body.stateID, isActive: true }, { city: 1 })
                .then(result => {
                    if (result.length > 0)
                        res.json({ statuscode: 400, success: true, message: 'City is already registered', Result: result });
                    else {
                        obj.save()
                            .then(result => {
                                res.json({ statuscode: 200, success: true, message: 'City Registered successfully!' });
                            })
                            .catch(err => {
                                res.json({ statuscode: 500, success: true, message: err.message });
                            })
                    }
                })
                .catch(err => {
                    res.json({ statuscode: 500, success: true, message: "New city reg " + err });
                });
        }
        catch (mainEx) {
            res.json({ statuscode: 500, success: true, message: "Internal server error " + mainEx });
        }
    });

    router.put('/update_city/:id', async function (req, res) {
        try {
            await S_City.findByIdAndUpdate(req.params.id, req.body)
                .then(post => {
                    res.json({ statuscode: 200, success: true, message: 'Data updated successfully' });
                })
                .catch(err => {
                    res.json({ statuscode: 500, success: true, message: err });
                });
        }
        catch (mainEx) {
            res.json({ statuscode: 500, success: true, message: "Internal server error " + mainEx });
        }
    });

    router.get('/getAll_Cities_ddl', async function (req, res) {
        try {
            await S_City.find({ isActive: true }, { city: 1, stateID: 1 })
                .sort([["city", "ascending"]]).lean()
                .then(result => {
                    res.json({ statuscode: 200, success: true, message: 'Data Fetched successfully', Result: result });
                })
                .catch(err => {
                    res.json({ statuscode: 500, success: false, message: err, result: null });
                });
        }
        catch (mainEx) {
            res.json({ statuscode: 500, success: true, message: "Internal server error " + mainEx });
        }

    });

    router.get('/getAll_Cities_Rpt', async function (req, res) {
        try {
            await S_City.find({ isActive: true }, { city: 1, state: 1, regOn: 1 })
                .populate({ path: 'stateID', select: 'state' })
                .sort([["regOn", "descending"]]).lean()
                .then(result => {
                    res.json({ statuscode: 200, success: true, message: 'Data Fetched successfully', Result: result });
                })
                .catch(err => {
                    res.json({ statuscode: 500, success: false, message: err, result: null });
                });
        }
        catch (mainEx) {
            res.json({ statuscode: 500, success: true, message: "Internal server error " + mainEx });
        }
    });

    router.get('/getCityByID/:id', async function (req, res) {
        try {
            await S_City.findOne({ _id: req.params.id, isActive: true }, { city: 1 })
                .then(result => {
                    res.json({ statuscode: 200, success: true, message: 'Data Fetched successfully', Result: result });
                })
                .catch(err => {
                    res.json({ statuscode: 500, success: false, message: err, result: null });
                });
        }
        catch (mainEx) {
            res.json({ statuscode: 500, success: true, message: "Internal server error " + mainEx });
        }
    });

    router.get('/getCityByState_ddl/:name', async function (req, res) {
        try {
            var state_RGx = new RegExp('^' + req.params.name + '$', "i")
            await S_City.find({ state: state_RGx, isActive: true }, { city: 1 })
                .populate({ path: 'stateID', select: 'state' })
                .sort([["city", "ascending"]]).lean()
                .then(result => {
                    res.json({ statuscode: 200, success: true, message: 'Data Fetched successfully', Result: result });
                })
                .catch(err => {
                    res.json({ statuscode: 500, success: false, message: err, result: null });
                });
        }
        catch (mainEx) {
            res.json({ statuscode: 500, success: true, message: "Internal server error " + mainEx });
        }
    });

    router.get('/getCityByStateID_ddl/:_id', async function (req, res) {
        try {
            await S_City.find({ state: req.params._id, isActive: true }, { city: 1 })
                .populate({ path: 'stateID', select: 'state' })
                .sort([["city", "ascending"]]).lean()
                .then(result => {
                    res.json({ statuscode: 200, success: true, message: 'Data Fetched successfully', Result: result });
                })
                .catch(err => {
                    res.json({ statuscode: 500, success: false, message: err, result: null });
                });
        }
        catch (mainEx) {
            res.json({ statuscode: 500, success: true, message: "Internal server error " + mainEx });
        }
    });

    return router;
};



