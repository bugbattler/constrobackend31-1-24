const Service_Receiver = require('../../model/service_receiver_model/service_receiver.model');
var Vendor_Bank = require('../../model/service_receiver_model/vendor_bank.model');
const jwt = require('jsonwebtoken');

const routes = (router) => {

    router.post('/post_service_receiver', (req, res) => {
        try {
            const obj = new Service_Receiver();
            if (req.body.profile !== undefined)
                obj.profile = req.body.profile
            if (req.body.userName !== undefined)
                obj.userName = req.body.userName;
            if (req.body.mobile !== undefined)
                obj.mobile = req.body.mobile;
            if (req.body.alternateMobile !== undefined)
                obj.alternateMobile = req.body.alternateMobile;
            if (req.body.email !== undefined)
                obj.email = req.body.email;
            if (req.body.password !== undefined)
                obj.password = req.body.password;
            if (req.body.categoryId !== undefined)
                obj.categoryId = req.body.categoryId;
            if (req.body.categoryType !== undefined)
                obj.categoryType = req.body.categoryType;
            if (req.body.firmName !== undefined)
                obj.firmName = req.body.firmName;
            // if (req.body.firmType !== undefined)
            //     obj.firmType = req.body.firmType;
            if (req.body.firmRepresentative !== undefined)
                obj.firmRepresentative = req.body.firmRepresentative;
            if (req.body.representativeDesignation !== undefined)
                obj.representativeDesignation = req.body.representativeDesignation;
            // if (req.body.representativeEducation !== undefined)
            //     obj.representativeEducation = req.body.representativeEducation;
            if (req.body.website !== undefined)
                obj.website = req.body.website;
            if (req.body.address !== undefined)
                obj.address = req.body.address;
            if (req.body.preferredCities !== undefined)
                obj.preferredCities = req.body.preferredCities;
            // if (req.body.isGSTAvail !== undefined)
            //     obj.isGSTAvail = req.body.isGSTAvail;
            // if (req.body.gstNo !== undefined)
            //     obj.gstNo = req.body.gstNo;
            // if (req.body.isPFAvail !== undefined)
            //     obj.isPFAvail = req.body.isPFAvail;
            // if (req.body.pfNo !== undefined)
            //     obj.pfNo = req.body.pfNo;
            // if (req.body.isPANAvail !== undefined)
            //     obj.isPANAvail = req.body.isPANAvail;
            // if (req.body.panNo !== undefined)
            //     obj.panNo = req.body.panNo;
            if (req.body.remark !== undefined)
                obj.remark = req.body.remark;
            if (req.body.regFrom !== undefined)
                obj.regFrom = req.body.regFrom;
            if (req.body.fcmToken !== undefined)
                obj.fcmToken = req.body.fcmToken;
            if (req.body.regOn !== undefined)
                obj.regOn = req.body.regOn;
            if (req.body.docs !== undefined)
                obj.docs = req.body.docs;

            Service_Receiver.findOne({}, { userCode: 1 })
                .sort([["regOn", "descending"]]).
                then(mxres => {
                    if (mxres === null) {
                        obj.userCode = "100000";
                    } else {
                        var str = mxres.userCode;
                        if (str === null)
                            obj.userCode = "100000";
                        else {
                            let newId = parseInt(str);
                            newId++;
                            obj.userCode = newId;
                        }
                    }

                    obj.save()
                        .then(result => {
                            res.json({ statuscode: 200, success: true, message: `Data Saved Successfully.` });
                        }).catch(err => {
                            res.json({ statuscode: 500, success: false, message: `Error is :${err}` });
                        })
                }).catch(er => {
                    console.log("Error--->" + err);
                    res.json({ statuscode: 500, success: false, message: `Error is :${er}` });
                })

        } catch (error) {
            console.log("Error: " + error);
            res.json({ statuscode: 500, success: false, message: `Internal Server Error :${error}` });
        }
    });

    router.get('/verify_receiver_mobile/:mobile', async function (req, res) {
        try {
            await Service_Receiver.findOne({ mobile: req.params.mobile, isActive: true }, { mobile: 1, userCode: 1 })
                .then(mobRes => {
                    if (mobRes) {
                        res.json({ statuscode: 202, message: 'This mobile number is already registered', otp: null });
                    } else {
                        var otp_val = Math.floor(1000 + Math.random() * 9000);
                        //*** Code To send sms */
                        res.json({ statuscode: 200, message: 'Otp has been sent to your mobile number !!', otp: otp_val }); // If user is not returned, then e-mail is not taken
                    }
                })
                .catch(err => {
                    console.log("Error---> " + err);
                    res.json({ statuscode: 500, success: false, message: 'Internal server error', otp: null });
                });
        }
        catch (error) {
            res.json({ statuscode: 500, success: false, message: error, otp: null });
        }
    });

    router.get('/verify_receiver_username/:userName', async function (req, res) {
        try {
            await Service_Receiver.findOne({ userName: req.params.userName, isActive: true }, { userName: 1, userCode: 1 })
                .then(mobRes => {
                    if (mobRes) {
                        res.json({ statuscode: 202, message: 'This user name is already registered' });
                    } else {
                        res.json({ statuscode: 200, message: 'Valid user name' });
                    }
                })
                .catch(err => {
                    console.log("Error---> " + err);
                    res.json({ statuscode: 500, success: false, message: 'Internal server error' });
                });
        }
        catch (error) {
            res.json({ statuscode: 500, success: false, message: error });
        }
    });

    router.post('/receiver_sign_in', async function (req, res) {
        try {
            await Service_Receiver.findOne({ userName: req.body.userName, isActive: true })
                .populate({ path: 'address.cityID', select: { 'city': 1 } })
                .populate({ path: 'address.stateID', select: { 'state': 1 } })
                .populate({ path: 'preferredCities', select: { 'city': 1 } })
                .populate({ path: 'categoryId', select: { 'category': 1 } })
                .then(result => {
                    if (!result) {
                        res.json({ statuscode: 401, success: false, message: 'Invalid user name', Result: null });
                    } else if (result) {
                        if (!req.body.password) {
                            res.json({ statuscode: 401, success: false, message: 'No password provided', Result: null });
                        } else {
                            var validPassword = result.comparePassword(req.body.password);
                            if (!validPassword) {
                                res.json({ statuscode: 401, success: false, message: 'Invalid credentials.', Result: null });
                            } else {
                                const token = jwt.sign({
                                    userName: req.body.userName,
                                    userId: result._id
                                }, "secrete this should be longer",
                                    { expiresIn: '24h' }
                                );

                                res.json({
                                    statuscode: 200, success: true, message: 'User Signed In Successfully!',
                                    Result: result, token: token, expiresIn: '24h'
                                });
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log("Error---> " + err);
                    res.json({ statuscode: 500, success: false, message: 'Internal server error', Result: null });
                });
        } catch (error) {
            res.json({ statuscode: 500, success: false, message: error, Result: null });
        }
    });

    router.get('/get_receiver_profile/:id', async function (req, res) {
        try {
            await Service_Receiver.findOne({ _id: req.params.id, isActive: true })
                .populate({ path: 'address.cityID', select: { 'city': 1 } })
                .populate({ path: 'address.stateID', select: { 'state': 1 } })
                .populate({ path: 'preferredCities', select: { 'city': 1 } })
                .populate({ path: 'categoryId', select: { 'category': 1 } })
                .then(result => {
                    const token = jwt.sign({
                        userName: req.body.userName,
                        userId: result._id
                    }, "secrete this should be longer",
                        { expiresIn: '24h' }
                    );

                    res.json({
                        statuscode: 200, success: true, message: 'User Signed In Successfully!',
                        Result: result, token: token, expiresIn: '24h'
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


    router.get('/get_all_receiver', async (req, res) => {
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
                    if (req.query.filter_Field === 'firmName') {
                        qry.firmName = regex;
                    } else if (req.query.filter_Field === 'mobile') {
                        qry.mobile = regex;
                    } else if (req.query.filter_Field === 'email') {
                        qry.email = regex;
                    }
                }
            }
            if (req.query.rpt_Field === "today") {
                qry.regOn = { $gte: new Date((new Date().getTime() - 24 * 60 * 60 * 1000)) };
            }
            if (req.query.rpt_Field === 'week') {
                qry.regOn = { $gte: new Date((new Date().getTime() - 7 * 24 * 60 * 60 * 1000)) };
            }
            else if (req.query.rpt_Field === "month") {
                qry.regOn = { $gte: new Date((new Date().getTime() - 30 * 24 * 60 * 60 * 1000)) };
            }
            else if (req.query.rpt_Field === "year") {
                qry.regOn = { $gte: new Date((new Date().getTime() - 365 * 24 * 60 * 60 * 1000)) };
            }
            var allRec = (await Service_Receiver.find(qry, { _id: 1 })).length;
            Service_Receiver.find(qry, { password: 0, temporarytoken: 0, fcmToken: 0 })
                .populate({ path: 'address.stateID', select: 'state' })
                .populate({ path: 'address.cityID', select: 'city' })
                .populate({ path: 'preferredCities', select: 'city' })
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

    router.put('/update_service_receiver/:id', (req, res) => {
        try {
            Service_Receiver.findByIdAndUpdate({ _id: req.params.id }, req.body).then(result => {
                Service_Receiver.findByIdAndUpdate({ _id: req.params.id }, { lastModified: new Date() }).then(r => {
                    res.json({ statuscode: 200, message: `Receivers Updated Successfully` });
                })
            }).catch(err => {
                res.json({ statuscode: 402, message: `Error is : ${err}` });
            })
        } catch (error) {
            res.json({ statuscode: 402, message: `Internal Server Error : ${error}` });
        }
    });

    router.get('/get_service_receiver/:id', (req, res) => {
        try {
            Service_Receiver.findById({ _id: req.params.id }, { password: 0, fcmToken: 0 }).then(result => {
                res.json({ statuscode: 200, Result: result })
            }).catch(err => {
                res.json({ statuscode: 402, message: `Error is : ${err}` })
            })
        } catch (error) {
            res.json({ statuscode: 402, message: `Internal Server Error : ${error}` });
        }
    });

    router.put('/get_receiverByPreferredCities/:providerId', (req, res) => {
        try {
            Vendor_Bank.find({ isActive: true, providerId: req.params.providerId }, { _id: 0, receiverId: 1 })
                .then(resClients => {

                    var array = [];
                    resClients.forEach(function (client) {
                        array.push(client.receiverId)
                    });

                    console.log(JSON.stringify(array));

                    let qry = { _id: { $nin: array }, isActive: true, preferredCities: { $in: req.body.preferredCities } };

                    console.log(qry);

                    Service_Receiver.find(qry, { 'firmName': 1, 'firmRepresentative': 1, 'representativeDesignation': 1 })
                        .populate({ path: 'address.cityID', select: 'city' })
                        .populate({ path: 'preferredCities', select: 'city' })
                        .then(result => {
                            res.json({ statuscode: 200, Result: result });
                        }).catch(err => {
                            console.log(err)
                            res.json({ statuscode: 402, message: `Error is : ${err}` });
                        })
                }).catch(err => {
                    console.log(err)
                    res.json({ statuscode: 402, message: `Internal Server Error : ${err}` });
                })

        } catch (error) {
            console.log(error)
            res.json({ statuscode: 402, message: `Internal Server Error : ${error}` });
        }
    });

    return router;
}
module.exports = routes;