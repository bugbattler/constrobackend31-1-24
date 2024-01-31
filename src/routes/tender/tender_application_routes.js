const { result } = require('lodash');
const Tender_Application = require('../../model/tender/tender_applications_model');

const routes = (router) => {
    router.post('/post_tender_application', (req, res) => {
        try {
            const obj = new Tender_Application();
            if (req.body.tenderId !== undefined)
                obj.tenderId = req.body.tenderId;
            if (req.body.receiverId !== undefined)
                obj.receiverId = req.body.receiverId;
            if (req.body.providerId !== undefined)
                obj.providerId = req.body.providerId;
            if (req.body.status !== undefined)
                obj.status = req.body.status;
            if (req.body.isAccepted !== undefined)
                obj.isAccepted = req.body.isAccepted;
            if (req.body.appliedOn !== undefined)
                obj.appliedOn = req.body.appliedOn;
            if (req.body.acceptedOn !== undefined)
                obj.acceptedOn = req.body.acceptedOn;
            if (req.body.isActive !== undefined)
                obj.isActive = req.body.isActive;

            obj.save()
                .then(result => {
                    res.json({ statuscode: 200, message: `Data Saved Successfully.` });
                }).catch(err => {
                    res.json({ statuscode: 500, message: `Error is :${err}` });
                })

        } catch (error) {
            console.log("Error: " + error);
            res.json({ statuscode: 500, success: false, message: `Internal Server Error :${error}` });
        }
    });

    router.get('/get_receiver_applications/:receiverId', (req, res) => {
        try {
            Tender_Application.find( { isActive: true, receiverId: req.params.receiverId})
            .populate({path: 'tenderId', select: 'eoiNo'})
            .populate({path: 'providerId', select: 'firmRepresentative'})
            .then(result => {
                res.json({ statuscode: 200, message: 'Data fetched successfully', Result: result});
            }).catch(err => {
                res.json({ statuscode: 500, message: `Error is : ${err}` });
            })
        } catch (error) {
            res.json({ statuscode: 500, message: `Error is : ${error}` });
        }
    });

    router.get('/get_provider_applications/:providerId', (req, res) => {
        try {
            Tender_Application.find( { isActive: true, providerId: req.params.providerId})
            .populate({path: 'tenderId', select: 'eoiNo'})
            .populate({path: 'receiverId', select: 'firmName firmRepresentative'})
            .then(result => {
                res.json({ statuscode: 200, message: 'Data fetched successfully', Result: result});
            }).catch(err => {
                res.json({ statuscode: 500, message: `Error is : ${err}` });
            })
        } catch (error) {
            res.json({ statuscode: 500, message: `Error is : ${error}` });
        }
    });

    router.get('/get_tender_applications/:tenderId', (req, res) => {
        try {
            Tender_Application.find( { isActive: true, tenderId: req.params.tenderId})
            .populate({path: 'tenderId', select: 'eoiNo'})
            .populate({path: 'providerId', select: 'firmRepresentative'})
            .then(result => {
                res.json({ statuscode: 200, message: 'Data fetched successfully', Result: result});
            }).catch(err => {
                res.json({ statuscode: 500, message: `Error is : ${err}` });
            })
        } catch (error) {
            res.json({ statuscode: 500, message: `Error is : ${error}` });
        }
    });

    router.get('/check_provider_application/:providerId/:tenderId', (req, res) => {
        try {
            Tender_Application.findOne({providerId: req.params.providerId, tenderId: req.params.tenderId, isActive: true},
                 { status: 1 })
                .then(mxres => {
                    if (mxres === null) {
                        console.log("No Application");
                        res.json({ statuscode: 500, message: `No application found`, Result: false });
                    } else {
                        console.log("Application found");
                        res.json({ statuscode: 200, message: `Application found`, Result: true });
                    }
                }).catch(er => {
                    res.json({ statuscode: 500, message: `Error is :${er}` });
                })
        } catch (error) {
            res.json({ statuscode: 500, message: `Error is : ${error}` });
        }

    });

    return router;
}

module.exports = routes;
