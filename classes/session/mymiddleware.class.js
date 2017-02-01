'use strict';

module.exports = class Mymiddleware {
    
   // cookie eny value can be used for ex. app name
  constructor(express){
    this.app = express;
    
    this.allRequestTypes();
    this.get();
  }


  allRequestTypes(){
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
    //
    // A path to get user roles
    this.app.get('/rest/user-roles',(req,res)=>{
        res.json(global.userRoles);
    });
  }
  

}