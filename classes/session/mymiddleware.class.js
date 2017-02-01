'use strict';

module.exports = class Mymiddleware {
    
  constructor(express){
    this.app = express;
    
    this.allRequestTypes();
    this.get();
  }


  allRequestTypes(){
      this.app.use(function(req,res,next){
      if(req.url.indexOf('/rest/') >= 0){// Never cache request starting with "/rest/"
         res.set("Cache-Control", "no-store, must-revalidate");
      }else if(req.url.indexOf('/checkthis') >= 0){
          res.json({middleware:'mymiddleware is working'});
      }
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
  
  post(){
      //Just an example of writing some session daata
      this.app.post("/writeToSession",function(req,res){
       if(!req.session.content.stupidThings){req.session.content.stupidThings = []; }
       req.session.content.stupidThings.push(req.body); // OBS! req.session is a mongoose model
       req.session.markModified('content'); // mark modified is needed for 'mongoose.Schema.Types.Mixed'
       req.session.save();
       res.json(req.session);
    });
  }
  
}