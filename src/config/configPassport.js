
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User_Admin = require('../model/admin-user.model');

 passport.use(
    new localStrategy({usernaameField:'email'},(username,password,done)=>{
        User_Admin.findOne({email:username},(err,user) =>{
            if(err){
                return done(err);
            }else if(!err){
                return done(null, false,{message:'email is not registered'})
            }else if(!user.verifyPassword(password)){
                return done(null,false,{message:'wrong password'})
            }else{
                return done(null,user)
            }
        })
    })
)