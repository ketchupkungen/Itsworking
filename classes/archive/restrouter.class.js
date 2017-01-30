'use strict';
module.exports = class Restrouter {
  
  constructor(expressApp,model,routerName){

    this.app = expressApp;
    this._class = model;
    
    var className = routerName;
    
    console.log("routerName: " + className);
   
    // a base rest route
    this.baseRoute = '/rest/' + className.toLowerCase() + '/';
    console.log("baseRoute: " + this.baseRoute);
    
    // set up routes
    this.post();
    this.get();
    this.put();
    this.delete();
  }


  post(){

    // Since "this" will change inside routes
    var model = this._class;

    // Create a new instance
    this.app.post(this.baseRoute,function(req,res){
      console.log(req.body);  
      var instance = new model(req.body);
      instance.save(function(err,result){
        res.json(err || result);
      });
    });

  }


  get(){

    // Since "this" will change inside routes
    var _class = this._class;
    
    // All instances
    this.app.get(this.baseRoute,function(req,res){
      _class.find(function(err,result){
        res.json(err || result);
      });
    });

    // Find an instance using a mongo query object
    this.app.get(this.baseRoute + 'find/*',function(req,res){
      var searchStr = decodeURIComponent(req.url.split('/find/')[1]);
      var searchObj;
      eval('searchObj = ' + searchStr);
//      console.log(searchStr);
//      console.log(searchObj);
      _class.find(searchObj,function(err,result){
        res.json(err || result);
      });
    });

    // One instance by id
    this.app.get(this.baseRoute + ':id',function(req,res){
      _class.findOne({_id:req.params.id},function(err,result){
        res.json(err || result);
      });
    });

    // Call a method of an instance
    this.app.get(this.baseRoute + ':id/:method',function(req,res){
      _class.findOne({_id:req.params.id},function(err,result){
        res.json(err || {returns:result[req.params.method]()});
      });
    });
 
  }


  put(){

    // Since "this" will change inside routes
    var _class = this._class;

    // Update several instances using a mongo query object
    this.app.put(this.baseRoute + 'find/*',function(req,res){
      var searchStr = decodeURIComponent(req.url.split('/find/')[1]);
      var searchObj;
      eval('searchObj = ' + searchStr);
      _class.update(searchObj,req.body,{multi:true},function(err,result){
        res.json(err || result);
      });
    });

    // Update one instance by id
    this.app.put(this.baseRoute + ':id',function(req,res){
      _class.update({_id:req.params.id},req.body,function(err,result){
        res.json(err || result);
      });
    });

  }


  delete(){

    // Since "this" will change inside routes
    var _class = this._class;

    // Delete several instances using a mongo query object
    this.app.delete(this.baseRoute + 'find/*',function(req,res){
      var searchStr = decodeURIComponent(req.url.split('/find/')[1]);
      var searchObj;
      eval('searchObj = ' + searchStr);
      _class.remove(searchObj,function(err,result){
        res.json(err || result);
      });
    });

    // Delete one instance by id
    this.app.delete(this.baseRoute + ':id',function(req,res){
      _class.remove({_id:req.params.id},function(err,result){
        res.json(err || result);
      });
    });

  }

}
