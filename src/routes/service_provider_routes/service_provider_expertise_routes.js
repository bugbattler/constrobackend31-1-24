var Expertise = require('../../model/service_provider_models/service_provider_expertise_model');

module.exports = function (router) {

    router.post('/add_expertise', function (req, res) {
        try {
            var obj = new Expertise();

            Expertise.findOne({ expertise: req.body.expertise, categoryId: req.body.categoryId, isActive: true },
                { expertise: 1 })
                .then(expertiseRes => {
                    if (expertiseRes) {
                        res.json({ statuscode: 202, success: false, message: 'Expertise with this name already registered.' })
                    } else {
                        if (req.body.categoryId !== undefined)
                            obj.categoryId = req.body.categoryId;

                        if (req.body.expertise !== undefined)
                            obj.expertise = req.body.expertise;

                        if (req.body.lastModified !== undefined)
                            obj.lastModified = req.body.lastModified;

                        if (req.body.isActive !== undefined)
                            obj.isActive = req.body.isActive;

                        obj.save()
                            .then(result => {
                                res.json({ statuscode: 200, success: true, message: "Data Saved Successfully." });
                            }).catch(e => {
                                console.log("Error: " + e);
                                res.json({ statuscode: 500, success: false, message: "Internal server error" });
                            });
                    }
                })
                .catch(err => {
                    console.log("Error: " + err);
                    res.json({ statuscode: 500, success: false, message: err })
                })
        } catch (error) {
            console.log("Error: " + error);
            res.json({ statuscode: 500, success: false, message: "Internal server error" });
        }
    });

    router.get('/get_expertise/:categoryId', async function (req, res) {
        try {
            await Expertise.find({ isActive: true, categoryId: req.params.categoryId }, { categoryid: 1, expertise: 1})
                .sort([["expertise", "ascending"]]).lean()
                .then(result => {
                    res.json({
                        statuscode: 200, success: true, message: 'Data Fetched Successfully',
                        Result: result
                    });
                })
                .catch(err => {
                    console.log("Error---> " + err);
                    res.json({ statuscode: 500, success: false, message: 'Internal server error', Result: null });
                });
        } catch (error) {
            res.json({ statuscode: 500, success: false, message: error, Result: null });
        }
    });

    router.get('/get_all_expertise', async function (req, res) {
        try {
            await Expertise.find({ isActive: true}).populate({path:'categoryId',select:'category'})
                .then(result => {
                    res.json({
                        statuscode: 200, success: true, message: 'Data Fetched Successfully',
                        Result: result
                    });
                })
                .catch(err => {
                    console.log("Error---> " + err);
                    res.json({ statuscode: 500, success: false, message: 'Internal server error', Result: null });
                });
        } catch (error) {
            res.json({ statuscode: 500, success: false, message: error, Result: null });
        }
    });
    router.put('/update_expertise/:id', (req, res) => {
        try {
            Expertise.findByIdAndUpdate({ _id: req.params.id }, req.body).then(result => {
                res.json({ statuscode: 200, message: `Expertise Updated Successfully` });
            }).catch(err => {
                res.json({ statuscode: 402, message: `Error is : ${err}` });
            })
        } catch (error) {
            res.json({ statuscode: 402, message: `Internal Server Error : ${error}` });
        }
    })
    return router;
}