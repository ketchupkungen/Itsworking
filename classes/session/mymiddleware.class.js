'use strict';
module.exports = class Mymiddleware {
    
  constructor(express){
    this.app = express;
    
    this.get();
    this.use();
  }
  
  use(){
      //Never cache rest
    this.app.use(function(req,res,next){
        if(req.url.indexOf('/rest/') >= 0){
           res.set("Cache-Control", "no-store, must-revalidate"); 
        }
        next();
    }); 
  }
  
  get(){
       
      
    this.app.get("/checksession",function(req,res){
        res.json(req.session);
    });
    
    this.app.get("/accesslevel",function(req,res){
        if(req.session.content.user){
           res.json(req.session.content.user.level); 
        }else{
           res.json(0);
        }
    });
    
    this.app.get("/useremail",function(req,res){
        res.json(req.session.content.user.epost);
    });
    
     this.app.get("/loggedIn",function(req,res){
        res.json(req.session.content.user);
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
  
};