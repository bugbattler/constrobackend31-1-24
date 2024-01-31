const Role = require('../model/role.model')

const routes = (router) => {

    router.get('/getRole', (req,res) => {
        try{
            Role.find({isActive:true}).then(result => {
                res.json({status:200, message:`Succeed`,Result:result});
            }).catch(err => {
                res.json({status:402,message:`Error is : ${err}`})
            })
        }catch(error){
            res.json({status:402,message:`Internal Server Error : ${error}`})
        }
    })


    router.post('/addRole',(req,res) => {
        try{
            const app = new Role();
            if(req.body.role!==undefined)
            app.role = req.body.role;
            app.permission = req.body.permission;

            app.save().then(result => {
                res.json({status:200 ,message:`Role Inserted Successfully`})
            }).catch(err =>{
                res.json({status:402,message:`Error is : ${err}`})
            })
         }catch(error){
            res.json({status:402,message:`Internal Server Error  : ${error}`})
        }
    })

    router.get('/getRole/:id',(req,res) => {
        try{
            Role.findById({_id : req.params.id}).then(result => {
                res.json({status:200,Result:result})
            }).catch(err => {
                res.json({status:402,message:`error is : ${err}`})
            })
        }catch(error){
            res.json({status:402,message:`Internal Server Error : ${error}`})
        }
    })

    router.put('/updateRole/:id',(req,res) => {
        try{
            Role.findOneAndUpdate({_id : req.params.id},req.body).then(result => {
                res.json({status:200,message:`Role Updated Successfully`})
            }).catch(err => {
                res.json({status:402,message:`Error is : ${err}`})
            })
        }catch(error){
            res.json({status:402,message:`Internal Server Error`})
        }
    })

    router.put('/deleteRole/:id',(req,res) => {
        try{
            Role.findOneAndUpdate({_id : req.params.id},{isActive:false}).then(result => {
                res.json({status:200,message:`Role Deleted Successfully`})
            }).catch(err => {
                res.json({status:402,message:`Error is : ${err}`})
            })
        }catch(error){
            res.json({status:402,message:`Internal Server Error`})
        }
    })

    return router;
}

module.exports = routes;