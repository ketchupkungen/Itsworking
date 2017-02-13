'use strict';
module.exports = class Loginhandler {

  constructor(expressApp,loginModel){
    this.app = expressApp;
    this.loginModel = loginModel;
    this.get();
    this.post();
    this.delete();
    //
    var HashMap = require('hashmap');
    global.FINGER_PRINT_SESSION_MAP = new HashMap();
  }


  get(){
    // check if logged in
    this.app.get('/rest/login',(req,res)=>{
      // not logged in
      if(!req.session.content.user){
        res.json({user:false, status: 'not logged in'});
        return;
      }
      // logged in
      res.json({user:req.session.content.user, status: 'logged in'});
    });
  }


  post(){
    // logging in
    this.app.post('/rest/login',(req,res)=>{
      // already logged in
      if(req.session.content.user){
        res.json({
          user:req.session.content.user,
          status: 'logged in already'
        });
        return;
      }
      // trying to log in
      var user = req.body.username;
      var pass = sha1(req.body.password + global.passwordSalt);
      //
      var that = this;
      this.loginModel.findOne({epost:user, password: pass},function(err,doc){
          if(doc){
              that.postReply(req,res,doc);
          }else{
              res.json({error:'login failed for: ' + user});
          }
      });      
            
    });
  }
  
  
  postReply(req,res,foundUser){
//      var user = Object.assign({},foundUser._doc,{role:foundUser.level});
      var user = foundUser;
      user.password = "";
      user.__v = "";
      // log in successful
      req.session.content.user = user; // ------------------->req.session is a Mongoose shema
      //
      //since content is of type mixed we need to tell Mongoose it is updated before saving
      req.session.markModified('content');
      req.session.save(function(err,doc){
          res.json({user:user, status: 'logged in succesfully'});
      });
      
  }

  delete(){
    // logging out
    this.app.delete('/rest/login',(req,res)=>{
      // already logged out / not logged in
      if(!req.session.content.user){
        res.json({
          user:false,
          status: 'logged out already'
        });
        return;
      }
      // loggin out
      req.session.content.user = false;
      // since content is of type mixed we need to
      // tell Mongoose it is updated before saving
      req.session.markModified('content');
      req.session.save();
      res.json({
        user:false,
        status: 'logged out successfully'
      });
    });
  }

}
