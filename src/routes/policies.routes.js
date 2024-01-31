const Policy = require('../model/policies.model');

const routes = (router) => {

    router.get('/getPolicy', (req,res) => {
        try{
            Policy.find({isActive:true}).then(result => {
                res.json({status:200, message:`Succeed`,Result:result});
            }).catch(err => {
                res.json({status:402,message:`Error is : ${err}`})
            })
        }catch(error){
            res.json({status:402,message:`Internal Server Error : ${error}`})
        }
    })

    router.post('/addPolicy',(req,res) => {
        try{
            const app = new Policy();
            if(req.body.policy!==undefined)
            app.policy = req.body.policy;
            if(req.body.policy_code!==undefined)
            app.policy_code = req.body.policy_code;
            if(req.body.module!==undefined)
            app.module = req.body.module;

            app.save().then(result => {
                res.json({status:200,message:`Policy Registered Successfully`});
            }).catch(err => {
                res.json({status:402,message:`Error is : ${err}`})
            })
        }catch(error){
            res.json({status:402,message:`Internal Server Error : ${error}`})
        }
      })

    return router;
}

module.exports = routes;