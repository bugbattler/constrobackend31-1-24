var Service_Provider = require('../../model/service_provider_models/service_provider_model');
const mongoose = require('mongoose');

module.exports = (router) => {
    router.get('/get_servie_provider_count_for_admin', async (req,res) =>{
        let qry_sp_tdy = { regOn: { $gte: new Date((new Date().getTime() - 24 * 60 * 60 * 1000)) }, isActive: true };
        let qry_sp_wk = { regOn : { $gte: new Date((new Date().getTime() -7 * 24 *60 * 60 * 1000)) }, isActive: true};
        let qry_sp_mth = { regOn : { $gte: new Date((new Date().getTime() -30 * 24 * 60 * 60 * 1000)) }, isActive: true};
        let qry_sp_yr = { regOn : { $gte: new Date((new Date().getTime() -365 * 24 * 60 * 60 * 1000)) }, isActive:true};
        let qry_sp_ttl = { isActive: true};

        Promise.all([
            await Service_Provider.countDocuments(qry_sp_tdy),
            await Service_Provider.countDocuments(qry_sp_wk),
            await Service_Provider.countDocuments(qry_sp_mth),
            await Service_Provider.countDocuments(qry_sp_yr),
            await Service_Provider.countDocuments(qry_sp_ttl)

        ]).then(([todayProvider, weekProvider, monthProvider,yearProvider, totalProvider]) => {
            res.json({statuscode: 200, message:`Result Found`, todayProvider: todayProvider,
        weekProvider: weekProvider, monthProvider: monthProvider, yearProvider: yearProvider,totalProvider: totalProvider})
        }).catch(err => {
            res.json({statuscode: 402, message: `Error is: ${err}`});
       })
    })
    return router;
}