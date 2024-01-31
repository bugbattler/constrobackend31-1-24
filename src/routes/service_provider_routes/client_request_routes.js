const Client_Request = require('../../model/service_provider_models/client_request_model');

const routes = (router) => {

    router.post('/post_ClientRequest', (req, res) => {//posted by provider
        try {
            const obj = Client_Request();
            //Vendor_Bank_Request.findOne({ $and: [{ providerId: req.body.providerId }, { receiverId: req.body.receiverId }], isActive: true })
            Client_Request.findOne({ providerId: req.body.providerId, receiverId: req.body.receiverId, isActive: true })
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

    router.get('/get_All_ClientReq', async (req, res) => {
        try {
            await Client_Request.find({ isActive: true })
                .then(result => {
                    res.json({ statuscode: 200, message: `Data Fetch Successfully`, Result: result });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Internal Server Error :${error}` });
        }
    });

    router.get('/get_ClientReqBy_id/:receiverId', async (req, res) => {
        try {
            await Client_Request.find({ receiverId: req.params.receiverId, isAccepted: false, isActive: true })
                .then(result => {
                    res.json({ statuscode: 200, Result: result });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Internal Server Error :${error}` });
        }
    });

    router.get('/get_clientRequests/:providerId', async (req, res) => {
        try {
            await Client_Request.find({ providerId: req.params.providerId, isAccepted: false, isActive: true })
                .populate({ path: 'receiverId', select: 'firmName firmRepresentative representativeDesignation' })
                .then(result => {
                    res.json({ statuscode: 200, Result: result });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Internal Server Error :${error}` });
        }
    });

    router.put('/accept_req/:id', async (req, res) => {
        try {
            await Client_Request.findByIdAndUpdate({ _id: req.params.id }, { isAccepted: true })
                .then(result => {
                    res.json({ statuscode: 200, message: `Data Fetched Successfullly`, Result: result });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Internal Server Error : ${error}` });
        }
    })

    router.post('/cancelClientRequest', async (req, res) => {
        try {
            await Client_Request.findOneAndDelete({ receiverId: req.body.receiverId, providerId: req.body.providerId, isAccepted: false })
                .then(result => {
                    console.log('removed, recId:'+ req.body.receiverId + 'provId:' + req.body.providerId);
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