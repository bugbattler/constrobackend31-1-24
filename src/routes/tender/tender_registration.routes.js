const Tender_Registration = require('../../model/tender/tender-registration.model');

const routes = (router) => {
    router.post('/post_tender', (req, res) => {
        try {
            const obj = new Tender_Registration();
            if (req.body.developer !== undefined)
                obj.developer = req.body.developer
            if (req.body.projectId !== undefined)
                obj.projectId = req.body.projectId;
            if (req.body.cityId !== undefined)
                obj.cityId = req.body.cityId;
            if (req.body.building !== undefined)
                obj.building = req.body.building;
            if (req.body.scope !== undefined)
                obj.scope = req.body.scope;
            if (req.body.isOpen !== undefined)
                obj.isOpen = req.body.isOpen;
            if (req.body.isLive !== undefined)
                obj.isLive = req.body.isLive;
            if (req.body.startDate !== undefined)
                obj.startDate = req.body.startDate;
            if (req.body.lastDate !== undefined)
                obj.lastDate = req.body.lastDate;
            if (req.body.maxContractValue !== undefined)
                obj.maxContractValue = req.body.maxContractValue;
            if (req.body.remark !== undefined)
                obj.remark = req.body.remark;
            if (req.body.regOn !== undefined)
                obj.regOn = req.body.regOn;
            if (req.body.eoiNo !== undefined)
                obj.eoiNo = req.body.eoiNo;
            if (req.body.isActive !== undefined)
                obj.isActive = req.body.isActive;

            Tender_Registration.findOne({}, { regNo: 1 })
                .sort([["regNo", "descending"]]).
                then(mxres => {
                    if (mxres === null) {
                        obj.regNo = "100000";
                    } else {
                        var str = mxres.regNo;
                        if (str === null)
                            obj.regNo = "100000";
                        else {
                            let newId = parseInt(str);
                            newId++;
                            obj.regNo = newId;
                        }
                    }

                    var strYear = new Date().getFullYear();
                    var shortYear = strYear.toString().substr(-2);
                    var eoi = "EOI/" + shortYear + "/" + obj.regNo;
                    console.log(eoi);
                    obj.eoiNo = eoi;

                        obj.save()
                        .then(result => {
                            res.json({ statuscode: 200, message: `Data Saved Successfully.` });
                        }).catch(err => {
                            res.json({ statuscode: 500, message: `Error is :${err}` });
                        })
                }).catch(er => {
                    console.log(er);
                    res.json({ statuscode: 500, message: `Error is :${er}` });
                })

        } catch (error) {
            console.log("Error: " + error);
            res.json({ statuscode: 500, success: false, message: `Internal Server Error :${error}` });
        }
    });

    router.get('/get_all_tender', async (req, res) => {
        try {
            let limit = 10; let skip = 0;
            if (req.query.limit !== undefined)
                limit = req.query.limit;
            if (req.query.skip !== undefined)
                skip = req.query.skip;
            let qry = { isActive: true };
            if (req.query.filterData !== undefined) {
                if (req.query.filterData && req.query.filter_Field) {
                    let regex = new RegExp(req.query.filterData, 'i')
                    if (req.query.filter_Field === 'project') {
                        qry.project = regex;
                    } else if (req.query.filter_Field === 'formNo') {
                        qry.formNo = regex;
                    } else if (req.query.filter_Field === 'author') {
                        qry.author = regex;
                    }
                }
            }
            var allRec = (await Tender_Registartion.find(qry, { _id: 1 })).length;
            Tender_Registration.find(qry)
                .populate({ path: 'project', select: 'projectName' })
                .then(result => {
                    res.json({ statuscode: 200, message: `Data Fetch Successfully`, Result: result, ttlRecords: allRec });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Internal Server Error : ${error}` });
        }
    });

    router.get('/get_all_tenders/:id', (req, res) => {
        try {
            Tender_Registration.findById({ _id: req.body.id })
                .populate({ path: 'project', select: 'projectName' })
                .then(result => {
                    res.json({ statuscode: 200, message: `Data fetched successfully`, Result: result });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Error is : ${error}` });
        }
    });

    router.put('/update_tender/:id', async function (req, res) {
        try {
            await Tender_Registration.findByIdAndUpdate(req.params.id, req.body)
                .then(post => {
                    res.json({ statuscode: 200, message: 'Data updated successfully' });
                })
                .catch(err => {
                    res.json({ statuscode: 500, message: err });
                });
        }
        catch (mainEx) {
            res.json({ statuscode: 500, message: "Internal server error " + mainEx });
        }
    });

    router.get('/get_draft_tenders/:id', (req, res) => {
        try {
            Tender_Registration.find({ isActive: true, isLive: false, developer: req.params.id, lastDate: { $gte: new Date().setHours(00, 00, 00) } })
                .populate({ path: 'developer', select: 'firmName' })
                .populate({ path: 'projectId', select: 'projectName location' })
                .populate({ path: 'cityId', select: 'city' })
                .populate({ path: 'scope', select: 'expertise' })
                .sort([["regNo", "descending"]])
                .then(result => {
                    res.json({ statuscode: 200, message: `Data fetched successfully`, Result: result });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Error is : ${error}` });
        }
    });

    router.get('/get_live_tenders/:id', (req, res) => {
        try {
            Tender_Registration.find({ isActive: true, isLive: true, developer: req.params.id, lastDate: { $gte: new Date().setHours(00, 00, 00) } })
                .populate({ path: 'developer', select: 'firmName' })
                .populate({ path: 'projectId', select: 'projectName location' })
                .populate({ path: 'cityId', select: 'city' })
                .populate({ path: 'scope', select: 'expertise' })
                .sort([["regNo", "descending"]])
                .then(result => {
                    res.json({ statuscode: 200, message: `Data fetched successfully`, Result: result });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Error is : ${error}` });
        }
    });

    router.get('/get_closed_tenders/:id', (req, res) => {
        try {
            Tender_Registration.find({ isActive: true, developer: req.params.id, lastDate: { $lt: new Date().setHours(00, 00, 00) } })
                .populate({ path: 'developer', select: 'firmName' })
                .populate({ path: 'projectId', select: 'projectName location' })
                .populate({ path: 'cityId', select: 'city' })
                .populate({ path: 'scope', select: 'expertise' })
                .sort([["regNo", "descending"]])
                .then(result => {
                    res.json({ statuscode: 200, message: `Data fetched successfully`, Result: result });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Error is : ${error}` });
        }
    });


    router.post('/get_provider_tenders', (req, res) => {
        try {
            Tender_Registration.find({
                $or: [
                    { isActive: true, isLive: true, isOpen: true, lastDate: { $gte: new Date().setHours(00, 00, 00) }, cityId: { $in: req.body.city }, scope: { $in: req.body.expertise } },
                    { isActive: true, isLive: true, isOpen: false, lastDate: { $gte: new Date().setHours(00, 00, 00) }, cityId: { $in: req.body.city }, scope: { $in: req.body.expertise }, developer: { $in: req.body.receiver } }
                ]
            })
                .populate({ path: 'developer', select: 'firmName' })
                .populate({ path: 'projectId', select: 'projectName location' })
                .populate({ path: 'cityId', select: 'city' })
                .populate({ path: 'scope', select: 'expertise' })
                .sort([["regNo", "descending"]])
                .then(result => {
                    res.json({ statuscode: 200, message: `Data fetched successfully`, Result: result });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Error is : ${error}` });
        }
    });

    router.post('/get_complete_provider_tenders', (req, res) => {
        try {
            var qry;
            if (req.body.city !== undefined && req.body.expertise !== undefined) {
                qry = {
                    $or: [
                        { isActive: true, isLive: true, isOpen: true, lastDate: { $gte: new Date().setHours(00, 00, 00) }, cityId: req.body.city, scope: req.body.expertise },
                        { isActive: true, isLive: true, isOpen: false, lastDate: { $gte: new Date().setHours(00, 00, 00) }, cityId: req.body.city, scope: req.body.expertise, developer: { $in: req.body.receiver } }
                    ]
                }
            } else {
                if (req.body.city !== undefined) {
                    qry = {
                        $or: [
                            { isActive: true, isLive: true, isOpen: true, lastDate: { $gte: new Date().setHours(00, 00, 00) }, cityId: req.body.city },
                            { isActive: true, isLive: true, isOpen: false, lastDate: { $gte: new Date().setHours(00, 00, 00) }, cityId: req.body.city, developer: { $in: req.body.receiver } }
                        ]
                    }
                } else {
                    if (req.body.expertise !== undefined) {
                        qry = {
                            $or: [
                                { isActive: true, isLive: true, isOpen: true, lastDate: { $gte: new Date().setHours(00, 00, 00) }, scope: req.body.expertise },
                                { isActive: true, isLive: true, isOpen: false, lastDate: { $gte: new Date().setHours(00, 00, 00) }, scope: req.body.expertise, developer: { $in: req.body.receiver } }
                            ]
                        }
                    } else {
                        qry = {
                            $or: [
                                { isActive: true, isLive: true, isOpen: true, lastDate: { $gte: new Date().setHours(00, 00, 00) } },
                                { isActive: true, isLive: true, isOpen: false, lastDate: { $gte: new Date().setHours(00, 00, 00) }, developer: { $in: req.body.receiver } }
                            ]
                        }
                    }
                }
            }

            console.log(qry);
            Tender_Registration.find(qry)
                .populate({ path: 'developer', select: 'firmName' })
                .populate({ path: 'projectId', select: 'projectName location' })
                .populate({ path: 'cityId', select: 'city' })
                .populate({ path: 'scope', select: 'expertise' })
                .sort([["regNo", "descending"]])
                .then(result => {
                    res.json({ statuscode: 200, message: `Data fetched successfully`, Result: result });
                }).catch(err => {
                    console.log(err);
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            console.log(error);
            res.json({ statuscode: 500, message: `Error is : ${error}` });
        }
    });

    router.put('/float_tender/:id', async function (req, res) {
        try {
            await Tender_Registration.findByIdAndUpdate(req.params.id, req.body)
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


    return router;
}

module.exports = routes;

