'use strict';

module.exports = class Mymiddleware {
    
  constructor(express,accessModel){
    this.app = express;
    this.accessModel = accessModel;
    
//    this.accessControl();
    this.get();
        
  }
  
   


  accessControl(){
      var that = this;
      this.app.use(function(req,res,next){
      //
      if(req.url.indexOf('/rest/student') >= 0){
//         that.checkAccess(req,res,"student",next);
      }
      //
      next();
    });
  }
  
  
  get(){
    this.app.get("/checksession",function(req,res){
        res.json(req.session);
    });
    //
    //
    // A path to get user roles
    this.app.get('/user-roles',(req,res)=>{
        res.json(global.userRoles);
    });
  }
//  
//  post(){
//      //Just an example of writing some session daata
//      this.app.post("/writeToSession",function(req,res){
//       if(!req.session.content.stupidThings){req.session.content.stupidThings = []; }
//       req.session.content.stupidThings.push(req.body); // OBS! req.session is a mongoose model
//       req.session.markModified('content'); // mark modified is needed for 'mongoose.Schema.Types.Mixed'
//       req.session.save();
//       res.json(req.session);
//    });
//  }
  
}