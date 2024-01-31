var S_State = require('../../model/basic_models/s_state_model');

module.exports = function (router) {
    //--------------------------- Register New State -----------------
    router.post('/post_NewState', function (req, res) {
        try {
            var obj = new S_State();
            obj.state = req.body.state;
            if (req.body.regOn !== undefined)
                obj.regOn = req.body.regOn;

            S_State.find({ state: { $regex: new RegExp('^' + req.body.state + '$', "i") }, isActive: true }, { state: 1 })
                .then(result => {
                    if (result.length > 0)
                        res.json({ statuscode: 400, success: true, message: 'State is already registered', Result: result });
                    else {
                        obj.save()
                            .then(result => {
                                res.json({ statuscode: 200, success: true, message: 'State Registered successfully!' });
                            })
                            .catch(err => {
                                res.json({ statuscode: 500, success: true, message: err.message });
                            })
                    }
                })
                .catch(err => {
                    res.json({ statuscode: 500, success: true, message: "Internal server error " + err });
                });
        }
        catch (mainEx) {
            res.json({ statuscode: 500, success: true, message: "Internal server error " + mainEx });
        }
    });

    router.put('/update_state/:id', async function (req, res) {
        try {
            await S_State.findByIdAndUpdate(req.params.id, req.body)
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

    router.get('/getAll_States_ddl', async function (req, res) {
        try {
            await S_State.find({ isActive: true }, { state: 1 })
                .sort([["state", "ascending"]]).lean()
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

    router.get('/getAll_States_Rpt', async function (req, res) {
        try {
            await S_State.find({ isActive: true }, { state: 1, regOn: 1 })
                .sort([["regOn", "descending"]])
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

    router.get('/getStateByID/:id', async function (req, res) {
        try {
            await S_State.findOne({ _id: req.params.id, isActive: true }, { state: 1 })
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



