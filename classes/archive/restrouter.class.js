module.exports = class Restrouter {

  constructor(expressApp,_class,populate,entityName,access){


 
    // populate is optional:
    // use if we want mongoose to populate properties
    // on GET queries and DOESN'T  want to specify a
    // populate method in our class (like in owner.class and kitten.class)

    // entityName is optional:
    // * you must use it if you are using traditional mongoose
    //   models (rather than those created from classes)
    // * you can also use if you want to set a different name
    //  than the class name for the rest route

    // access is optional:
    // use if we want to restrict access to post, get, update, delete
    // based on user/user role and our own logic and DON'T want to
    // specify this in our class with postAccess, getAccess, putAccess
    // and deleteAccess methods (like in owner.class)

    this.app = expressApp;
    this._class = _class;
    this.populate = populate;
    this.access = access;

    // Alternatively get populate and access properties
    // from the class definition
    if(_class.orgClass){
      let p = _class.orgClass.prototype;
      this.populate = populate || (p.populate && p.populate());
      this.access = access || ({
        post: p.postAccess,
        get: p.getAccess,
        put: p.putAccess,
        delete: p.deleteAccess
      });
      // Delete these methods so that they don't become part of the
      // mongoose model - we have already moved them to properties above
      let del = ["populate","postAccess","getAccess","putAccess","deleteAccess"];
      del.forEach((d)=>{ delete p[d]; });
    }

    // Set this.access to an empty object if still not defined
    this.access = this.access || {};

    // get the class name
    var className = _class.name;

    // for classes created with mongoosefromclass
    // we need to get the class name like this
    if(_class.name == "model" && _class.orgClass){
      className = _class.orgClass.name;
    }

    // If entityName exists then use it as className
    if(entityName){className = entityName;}

    // a base rest route
    this.baseRoute = '/rest/' + className.toLowerCase() + '/';

    // set up routes
    this.post();
    this.get();
    this.put();
    this.delete();
  }
  
  


  post(){

    // Create a new instance
    this.app.post(this.baseRoute,(req,res)=>{
      if(!this.rights(req,res)){return;}
      var instance = new this._class(req.body);
      instance.save((err,result)=>{
        if(err){
          if(err.constructor === Error){
            // mongoose should wrap the error
            // (from pre save etc) but doesn't
            err = JSON.parse((err+'').substring(6));
          }
          this.json(res,err);
          return;
        }
        // find again so we can populate it
        this.respond('findOne',{_id:result._id},res);
      });
    });

  }

  // A response helper for gets
  // (so we can populate things)
  respond(method,query,res){
    var m = this._class[method](query);
    if(this.populate){
      m.populate(this.populate);
    }
    m.exec((err,result)=>{
      this.json(res,err,result);
    });
  }


  get(){

    // All instances
    this.app.get(this.baseRoute,(req,res)=>{
      if(!this.rights(req,res)){return;}
      this.respond('find',{},res);
    });

    // Find an instance using a mongo query object
    this.app.get(this.baseRoute + 'find/*',(req,res)=>{
      if(!this.rights(req,res)){return;}
      var searchStr = decodeURIComponent(req.url.split('/find/')[1]);
      var searchObj;
      eval('searchObj = ' + searchStr);
      this.respond('find',searchObj,res);
    });

    // One instance by id
    this.app.get(this.baseRoute + ':id',(req,res)=>{
      if(!this.rights(req,res)){return;}
      this.respond('findOne',{_id:req.params.id},res);
    });

    // Call the method of an instance
    this.app.get(this.baseRoute + ':id/:method',(req,res)=>{
      if(!this.rights(req,res)){return;}
      this._class.findOne({_id:req.params.id},(err,result)=>{
        this.json(res,err,{returns:result[req.params.method]()});
      });
    });
  }


  put(){

    // Update several instances using a mongo query object
    this.app.put(this.baseRoute + 'find/*',(req,res)=>{
      if(!this.rights(req,res)){return;}
      var searchStr = decodeURIComponent(req.url.split('/find/')[1]);
      var searchObj;
      eval('searchObj = ' + searchStr);
      this._class.update(searchObj,req.body,{multi:true},(err,result)=>{
        this.json(res,err,result);
      });
    });

    // Update one instance by id
    this.app.put(this.baseRoute + ':id',(req,res)=>{
      if(!this.rights(req,res)){return;}
      this._class.update({_id:req.params.id},req.body,(err,result)=>{
        this.json(res,err,result);
      });
    });

  }


  delete(){

    // Delete several instances using a mongo query object
    this.app.delete(this.baseRoute + 'find/*',(req,res)=>{
      if(!this.rights(req,res)){return;}
      var searchStr = decodeURIComponent(req.url.split('/find/')[1]);
      var searchObj;
      eval('searchObj = ' + searchStr);
      this._class.remove(searchObj,(err,result)=>{
        this.json(res,err,result);
      });
    });

    // Delete one instance by id
    this.app.delete(this.baseRoute + ':id',(req,res)=>{
      if(!this.rights(req,res)){return;}
      this._class.remove({_id:req.params.id},(err,result)=>{
        this.json(res,err,result);
      });
    });

  }

  jsonCleaner(toClean){
    // clean away or transform properties
    return JSON.stringify(toClean._doc || toClean,(key,val)=>{
      // remove __v
      if(key == "__v"){ return; }
      // set password to "[secret]"
      if(key == "password"){ return "[secret]"; }
      // unchanged properties
      return val;
    });
  }


  json(res,err,response){
    // set status to 403 if error
    if(err){ res.statusCode = 403; }
    // send the response
    res.end(this.jsonCleaner(err || response));
  }


  rights(req,res){
    // check if the user has rights to access this route
    var restrictor = this.access[req.method.toLowerCase()];
    if(typeof restrictor == "function"){
      if(!restrictor(req.session.content.user,req)){
        this.json(res,{errors:'access not allowed'});
        return false;
      }
    }
    return true;
  }


}
