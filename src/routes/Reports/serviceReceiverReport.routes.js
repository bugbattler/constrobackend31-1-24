const Service_Receiver = require('../../model/service_receiver_model/service_receiver.model');
const mongoose = require('mongoose');

module.exports = (router) => {
    router.get('/get_servie_receiver_count_for_admin', async (req,res) =>{
        let qry_sr_tdy = { regOn: { $gte: new Date((new Date().getTime() - 24 * 60 * 60 * 1000)) }, isActive: true };
        let qry_sr_wk = { regOn : { $gte: new Date((new Date().getTime() -7 * 24 *60 * 60 * 1000)) }, isActive: true};
        let qry_sr_mth = { regOn : { $gte: new Date((new Date().getTime() -30 * 24 * 60 * 60 * 1000)) }, isActive: true};
        let qry_sr_yr = { regOn : { $gte: new Date((new Date().getTime() -365 * 24 * 60 * 60 * 1000)) }, isActive:true};
        let qry_sr_ttl = { isActive: true};

        Promise.all([
            await Service_Receiver.countDocuments(qry_sr_tdy),
            await Service_Receiver.countDocuments(qry_sr_wk),
            await Service_Receiver.countDocuments(qry_sr_mth),
            await Service_Receiver.countDocuments(qry_sr_yr),
            await Service_Receiver.countDocuments(qry_sr_ttl)

        ]).then(([todayReceiver, weekReceiver, monthReceiver,yearReceiver, totalReceiver]) => {
            res.json({statuscode: 200, message:`Result Found`, todayReceiver: todayReceiver,
            weekReceiver: weekReceiver, monthReceiver: monthReceiver, yearReceiver: yearReceiver,totalReceiver: totalReceiver})
        }).catch(err => {
            res.json({statuscode: 402, message: `Error is: ${err}`});
       })
    })
    return router;
}