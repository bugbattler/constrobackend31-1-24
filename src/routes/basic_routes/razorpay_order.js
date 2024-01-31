
const Razorpay = require('razorpay');

module.exports = function (router) {

    router.get('/razor_order', function (req, res) {
        try {
            var instance = new Razorpay({ key_id: 'rzp_test_wQFAA2uxbAsx0E', key_secret: 'vijIxj94UFiPoSXeG23gexSF' });

            instance.orders.create({
                amount: 50000,
                currency: "INR",
                receipt: "receipt#1",
                notes: {
                    key1: "value3",
                    key2: "value2"
                }
            })

            res.json({ statuscode: 200, success: true, message: "success", Result: instance });
        }
        catch (err) {
            console.log(err);
            res.json({ statuscode: 500, success: true, message: err, Result: null });
        }
    });

    return router;
};

