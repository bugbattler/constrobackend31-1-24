var Category = require('../../model/service_provider_models/service_provider_category_model');

module.exports = function (router) {

    router.post('/add_category', function (req, res) {
        try {
            var obj = new Category();
            Category.findOne({ category: req.body.category, isActive: true }, { category: 1 }).then(categoryRes => {
                if (categoryRes) {
                    res.json({ statuscode: 202, success: false, message: 'Category with this name already registered.' })
                } else {
                    if (req.body.category !== undefined)
                        obj.category = req.body.category;
                    if (req.body.lastModified !== undefined)
                        obj.lastModified = req.body.lastModified;
                    if (req.body.isActive !== undefined)
                        obj.isActive = req.body.isActive;
                    obj.save().then(result => {
                        res.json({ statuscode: 200, success: true, message: "Data Saved Successfully." });
                    }).catch(e => {
                        res.json({ statuscode: 500, success: false, message: "Internal server error" });
                    });
                }
            }).catch(err => {
                    res.json({ statuscode: 500, success: false, message: err })
                })
        } catch (error) {
            res.json({ statuscode: 500, success: false, message: "Internal server error" });
        }
    });

    router.get('/get_all_categories', async function (req, res) {
        try {
            await Category.find({ isActive: true }, { category: 1 ,lastModified:1})
                .sort([["category", "ascending"]]).lean()
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

    router.put('/update_category/:id', (req, res) => {
        try {
            Category.findByIdAndUpdate({ _id: req.params.id }, req.body).then(result => {
                res.json({ statuscode: 200, message: `Category Updated Successfully` });
            }).catch(err => {
                res.json({ statuscode: 402, message: `Error is : ${err}` });
            })
        } catch (error) {
            res.json({ statuscode: 402, message: `Internal Server Error : ${error}` });
        }
    })

    return router;
}