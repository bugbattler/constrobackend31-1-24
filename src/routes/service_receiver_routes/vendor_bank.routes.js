const Vendor_Bank = require('../../model/service_receiver_model/vendor_bank.model');

const routes = (router) => {

    router.post('/post_vendorbank', (req, res) => {
        try {
            const obj = Vendor_Bank();
            if (req.body.providerId !== undefined)
                obj.providerId = req.body.providerId;
            if (req.body.receiverId !== undefined)
                obj.receiverId = req.body.receiverId;
            if (req.body.lastModified !== undefined)
                obj.lastModified = req.body.lastModified;
            if (req.body.isActive !== undefined)
                obj.isActive = req.body.isActive;

            obj.save().then(result => {
                res.json({ statuscode: 200, message: `Data Registered Successfully` });
            }).catch(err => {
                res.json({ statuscode: 500, message: `Error is : ${err}` })
            })
        } catch (error) {
            res.json({ statuscode: 500, message: `Internal Server Error : ${error}` });
        }
    });

    router.get('/get_all_vendorbank', async (req, res) => {
        try {
            //await Vendor_Bank.find({ isActive: true, isAccepted: true }).then(result => {
            await Vendor_Bank.find({ isActive: true }).then(result => {
                res.json({ statuscode: 200, message: `Data Fetch Successfully `, Result: result });
            }).catch(err => {
                res.json({ statuscode: 500, message: `Error is : ${err}` });
            })
        } catch (error) {
            res.json({ statuscode: 500, message: `Internal Server Error : ${error}` });
        }
    });

    router.get('/get_RegisteredClients/:providerId', async (req, res) => {
        try {
            //await Vendor_Bank.find({ providerId: req.params.providerId, isAccepted: false, isActive: true })
            await Vendor_Bank.find({ providerId: req.params.providerId, isActive: true })
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

    router.get('/get_RegisteredClients/:providerId', async (req, res) => {
        try {
            //await Vendor_Bank.find({ providerId: req.params.providerId, isAccepted: false, isActive: true })
            await Vendor_Bank.find({ providerId: req.params.providerId, isActive: true })
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

    router.get('/get_vendorBank/:receiverId', async (req, res) => {
        try {
            await Vendor_Bank.find({ receiverId: req.params.receiverId, isActive: true })
                .populate({ path: 'providerId', select: 'firmName firmRepresentative representativeDesignation' })
                .then(result => {
                    res.json({ statuscode: 200, Result: result });
                    console.log(JSON.stringify(result))
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is : ${err}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Internal Server Error :${error}` });
        }
    });

    router.put('/remove_vendor_bank_record/:id', async function (req, res) {
        try {
            await Vendor_Bank.findByIdAndUpdate(req.params.id, {isActive: false})
                .then(post => {
                    res.json({ statuscode: 200, success: true, message: 'Data updated successfully' });
                })
                .catch(err => {
                    console.log(err);
                    res.json({ statuscode: 500, success: true, message: err });
                });
        }
        catch (mainEx) {
            console.log(mainEx);
            res.json({ statuscode: 500, success: true, message: "Internal server error " + mainEx });
        }
    });
    return router;
}
module.exports = routes;