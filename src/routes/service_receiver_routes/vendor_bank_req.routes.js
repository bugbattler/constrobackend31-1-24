const Vendor_Bank_Request = require('../../model/service_receiver_model/vendor_bank_req.model');
const Vendor_Bank = require('../../model/service_receiver_model/vendor_bank.model');
const Client_Request = require('../../model/service_provider_models/client_request_model');

const routes = (router) => {

    router.post('/post_vendorBankReq', (req, res) => {//posted by provider
        try {
            const obj = Vendor_Bank_Request();
            //Vendor_Bank_Request.findOne({ $and: [{ providerId: req.body.providerId }, { receiverId: req.body.receiverId }], isActive: true })
            Vendor_Bank_Request.findOne({ providerId: req.body.providerId, receiverId: req.body.receiverId, isActive: true })
                .then(providerRes => {
                    if (providerRes) {
                        res.json({ statuscode: 202, success: false, message: `Already Requested` });
                    } else {
                        if (req.body.providerId !== undefined)
                            obj.providerId = req.body.providerId;
                        if (req.body.receiverId !== undefined)
                            obj.receiverId = req.body.receiverId;
                        if (req.body.isAccepted !== undefined)
                            obj.isAccepted = req.body.isAccepted;
                        if (req.body.lastModified !== undefined)
                            obj.lastModified = req.body.lastModified;
                        if (req.body.isActive !== undefined)
                            obj.isActive = req.body.isActive;

                        obj.save().then(result => {
                            res.json({ statuscode: 200, message: `Data Registered Successfully` });
                        }).catch(err => {
                            res.json({ statuscode: 500, message: `Error is: ${err}` });
                        })
                    }
                })

        } catch (error) {
            res.json({ statuscode: 500, message: `Internal Server Error :${error}` });
        }
    });

    router.get('/get_All_vendorBankReq', async (req, res) => {
        try {
            await Vendor_Bank_Request.find({ isActive: true })
                .then(result => {
                    res.json({ statuscode: 200, message: `Data Fetch Successfully`, Result: result });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Internal Server Error :${error}` });
        }
    });

    router.get('/get_vendorBankReqBy_id/:providerId', async (req, res) => {
        try {
            await Vendor_Bank_Request.find({ providerId: req.params.providerId, isAccepted: false, isActive: true })
                .then(result => {
                    res.json({ statuscode: 200, Result: result });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Internal Server Error :${error}` });
        }
    });

    router.get('/get_vendorRequests/:receiverId', async (req, res) => {
        try {
            await Vendor_Bank_Request.find({ receiverId: req.params.receiverId, isAccepted: false, isActive: true })
                .populate({ path: 'providerId', select: 'firmName firmRepresentative representativeDesignation' })
                .then(result => {
                    res.json({ statuscode: 200, Result: result });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Internal Server Error :${error}` });
        }
    });

    router.get('/accept_req/:providerId/:receiverId', async (req, res) => {
        try {
            await Vendor_Bank_Request.findOneAndUpdate({ providerId: req.params.providerId, receiverId: req.params.receiverId, isActive: true },
                { isAccepted: true, isActive: false })
                .then(result => {
                    Client_Request.findOneAndUpdate({ providerId: req.params.providerId, receiverId: req.params.receiverId, isActive: true },
                        { isAccepted: true, isActive: false })
                        .then(resClient => {
                            console.log("Updated")
                        }).catch(err => {
                            console.log(err)
                        })

                    const obj = Vendor_Bank();
                    if (req.params.providerId !== undefined)
                        obj.providerId = req.params.providerId;
                    if (req.params.receiverId !== undefined)
                        obj.receiverId = req.params.receiverId;

                    obj.save().then(resBank => {
                        res.json({ statuscode: 200, message: `Request Accepted Successfully` });
                    }).catch(err => {
                        res.json({ statuscode: 500, message: `Error is: ${err}` });
                    })
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Internal Server Error : ${error}` });
        }
    })

    router.post('/cancelVendorBankRequest', async (req, res) => {
        try {
            await Vendor_Bank_Request.findOneAndDelete({ receiverId: req.body.receiverId, providerId: req.body.providerId, isAccepted: false })
                .then(result => {
                    res.json({ statuscode: 200, message: `Request cancelled successfully` });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Internal Server Error :${error}` });
        }
    });

    return router;
}
module.exports = routes;