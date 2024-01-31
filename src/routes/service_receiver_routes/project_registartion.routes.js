const Project_Registration = require('../../model/service_receiver_model/project_registration.model');

const routes = (router) => {

    router.post('/post_projects', (req, res) => {
        try {
            const obj = new Project_Registration();
            if (req.body.receiverId != undefined)
                obj.receiverId = req.body.receiverId;
            if (req.body.buildings !== undefined)
                obj.buildings = req.body.buildings;
            if (req.body.projectName !== undefined)
                obj.projectName = req.body.projectName;
            if (req.body.city !== undefined)
                obj.city = req.body.city;
            if (req.body.location !== undefined)
                obj.location = req.body.location;
            if (req.body.remark !== undefined)
                obj.remark = req.body.remark;
            if (req.body.regFrom !== undefined)
                obj.regFrom = req.body.regFrom;
            if (req.body.regOn !== undefined)
                obj.regOn = req.body.regOn;

            Project_Registration.findOne({}, { regNo: 1 })
                .sort([["regOn", "descending"]])
                .then(maxres => {
                    if (maxres == null) {
                        obj.regNo === '1000';
                    } else {
                        var str = maxres.regNo;
                        if (str === null)
                            obj.regNo = '1000';
                        else {
                            let newId = parseInt(str);
                            newId++;
                            obj.regNo = newId;
                        }
                    }
                    obj.save().then(result => {
                        res.json({ statuscode: 200, message: `Data Registered Successfully` })
                    }).catch(er => {
                        res.json({ statuscode: 500, message: `Error is : ${er}` });
                    })
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Error is : ${error}` });
        }
    });

    router.get('/get_all_projects', async (req, res) => {
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
                    if (req.query.filter_Field === 'projectName') {
                        qry.projectName = regex;
                    } else if (req.query.filter_Field === 'receiverId') {
                        qry.receiverId = regex;
                    } else if (req.query.filter_Field === 'siteName') {
                        qry.siteName = regex;
                    }
                }
            }
            var allRec = (await Project_Registration.find(qry, { _id: 1 })).length;
            Project_Registration.find(qry)
                .populate({ path: 'receiverId', select: 'firmRepresentative' })
                .skip(skip).limit(limit)
                .then(result => {
                    res.json({ statuscode: 200, Result: result, ttlRecords: allRec });
                }).catch(err => {
                    res.json({ statuscode: 402, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 402, message: `Internal Server Error : ${error}` });
        }
    });

    router.get('/get_all_projects/:id',(req,res) => {
        try{
            Project_Registration.findById({_id: req.params.id})
            .populate({ path: 'receiverId', select: 'userCode firmRepresentative' })
            .then(result => {
                
                res.json({statuscode: 200, message: `Data fetched successfully`,Result: result});
            }).catch(err => {
                res.json({statuscode: 500, message: `Error is : ${err}`});
            })
        }catch(error){
            res.json({statuscode: 500, message: `Internal Server error is : ${error}`});
        }
    });

    router.get('/getProjectByReceiver/:receiverId',(req,res) => {
        try{
            Project_Registration.find({receiverId: req.params.receiverId})
            .populate({ path: 'receiverId', select: 'firmRepresentative' })
            .populate({path: 'city', select: 'city'})
            .then(result => {
                res.json({statuscode: 200, message: `Data Fetched Successfully`, Result: result});
            }).catch(err => {
                res.json({statuscode: 500, message: `Error is : ${err}`});
            })
        }catch(error){
            res.json({statuscode: 500,message: `Internal Server Error : ${error}`});
        }
    })

    router.put('/update_projects/:id', (req, res) => {
        try {
            Project_Registration.findByIdAndUpdate({ _id: req.params.id }, req.body).then(result => {
                res.json({ statuscode: 200, message: `Data Updated Successfully` });
            }).catch(err => {
                res.json({ statuscode: 402, message: `Error is : ${err}` });
            })
        } catch (error) {
            res.json({ statuscode: 402, message: `Internal Server Error : ${error}` });
        }
    });

    return router;
}

module.exports = routes;