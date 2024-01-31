
const User_Admin = require('../model/admin-user.model');
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');
const utilities = require('../middleware/utilities');

const routes = (router) => {

    router.post('/post_New_Admin_User', (req, res) => {
        try {
            const app = new User_Admin();
            if (req.body.name !== undefined)
                app.name = req.body.name
            if (req.body.email !== undefined)
                app.email = req.body.email
            if (req.body.password !== undefined)
                app.password = req.body.password
            if (req.body.mobile !== undefined)
                app.mobile = req.body.mobile
            if (req.body.gender !== undefined)
                app.gender = req.body.gender
            if (req.body.roleID !== undefined)
                app.roleID = req.body.roleID
            if (req.body.profile !== undefined)
                app.profile = req.body.profile
            if (req.body.address !== undefined)
                app.address = req.body.address
            if (req.body.source !== undefined)
                app.source = req.body.source
            if (req.body.regOn !== undefined)
                app.regOn = req.body.regOn
            app.save().then(result => {
                res.json({ statuscode: 200, message: `User Registered Successfully` });
            }).catch(err => {
                res.json({ statuscode: 402, message: `Error is : ${err}` });
            })
        } catch (error) {
            res.json({ statuscode: 402, message: `Internal Server Error :${error}` });
        }
    });

    router.get('/get_All_Admin_Users', checkAuth,async (req, res) => {
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
                    if (req.query.filter_Field === 'name') {
                        qry.name = regex;
                    }else if(req.query.filter_Field === 'mobile'){
                        qry.mobile = regex;
                    }else if(req.query.filter_Field === 'email'){
                        qry.email = regex;
                    }
                }
            }

                var allRec = (await User_Admin.find(qry, { _id: 1 })).length;
               await User_Admin.find(qry, { password: 0, temporarytoken: 0, fcmToken: 0, fcmToken_web: 0, resettoken: 0 }).populate({ path: 'roleID', select: 'role' })
                .populate({ path: 'address.stateID', select: 'state' }).populate({ path: 'address.cityID', select: 'city' })
                .skip(skip).limit(limit)
                .then(result => {
                    res.json({ statuscode: 200, message: `Data Fetch Successfully`, Result: result ,ttlRecords: allRec});
                }).catch(err => {
                    res.json({ statuscode: 402, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 402, message: `Internal Server Error : ${error}` });
        }
    });

    router.get('/get_All_Admin_Users/:id', checkAuth, (req, res) => {
        try {
            User_Admin.findById({ _id: req.params.id }, { password: 0, temporarytoken: 0, fcmToken: 0, fcmToken_web: 0, resettoken: 0 }).then(result => {
                res.json({ statuscode: 200, Result: result })
            }).catch(err => {
                res.json({ statuscode: 402, message: `Error is : ${err}` })
            })
        } catch (error) {
            res.json({ statuscode: 402, message: `Internal Server Error : ${error}` });
        }
    });

    router.put('/update_Admin_Users/:id', (req, res) => {
        try {
            User_Admin.findByIdAndUpdate({ _id: req.params.id }, req.body).then(result => {
                res.json({ statuscode: 200, message: `User Updated Successfully` });
            }).catch(err => {
                res.json({ statuscode: 402, message: `Error is : ${err}` });
            })
        } catch (error) {
            res.json({ statuscode: 402, message: `Internal Server Error : ${error}` });
        }
    })

    router.delete('/delete_Admin_Users/:id', (req, res) => {
        try {
            User_Admin.deleteOne({ _id: req.params.id }).then(result => {
                res.json({ statuscode: 200, message: `User Deleted Suceessfully` })
            }).catch(err => {
                res.json({ statuscode: 402, message: `Error is : ${err}` });
            })
        } catch (error) {
            res.json({ statuscode: 402, message: `Internal Server Error :${error}` });
        }
    })

    router.post('/user_authenticate', (req, res) => {
        try {
            User_Admin.findOne({ $or: [{ email: req.body.username }, { mobile: req.body.username }], isActive: true },
                { name: 1, profile: 1, roleID: 1, fcmToken: 1, fcmToken_web: 1 }).populate({ path: 'roleID', select: 'role permission' })
                .then(user => {
                    if (!user) {
                        res.json({ statuscode: 402, message: `Invalid mobile and email address` });
                    }
                    else if (user) {
                        if (!req.body.password) {
                            res.json({ statuscode: 402, message: `No password provided` });
                        } else {
                             let validPassword = (req.body.password);
                            if (!validPassword) {
                                res.json({ statuscode: 402, message: `Invalid Credential` });
                            }  else {
                                const token = jwt.sign({
                                    email: req.body.username,
                                    userId: user._id
                                }, "secrete this should be longer",
                                    { expiresIn: '24h' }
                                );
                             //const token= utilities.createToken(req);
                                res.json({ statuscode: 200, message: `User Authenticated`, Result: user, token: token, expiresIn: '24h', userId: user._id });
                            }
                        }
                    }
                }).catch(err => {
                    res.json({ statuscode: 402, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 402, message: `Internal Server Error : ${error}` });
        }
    })

    return router;
}

module.exports = routes;