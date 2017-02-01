'use strict';
module.exports = class RestrouterP {

  constructor(expressApp,_class,routerName,populate,populate2,access){

    // populate is optional:
    // 
    // OBS! 'populate' parameter is a property in the Shema which refers to another shema. EX: _education

    this.app = expressApp;
    this.populate = populate;
    this.populate2 = populate2;
    this._class = _class;
    this.access = access;
    
    this.access = this.access || {};

    // get the class name
    var className = _class.name;

    // for classes created with mongoosefromclass
    // we need to get the class name like this
    if(_class.name == "model" && _class.orgClass){
      className = _class.orgClass.name;
    }

    // If routerName exists then use it as className
    if(routerName){
        className = routerName;
        console.log("------------------------->routerName: " + className);
    }

    // a base rest route
    this.baseRoute = '/rest/' + className.toLowerCase() + '/';
    console.log("----------------------------->baseRoute: " + this.baseRoute);

    // set up routes
    this.post();
    this.get();
    this.put();
    this.delete();
  }


  post(){

    // Since "this" will change inside routes
    var _class = this._class, that = this;

    // Create a new instance
    this.app.post(this.baseRoute,function(req,res){
      var instance = new _class(req.body);
      instance.save(function(err,result){
        if(err){
            res.send("err: " + err);
        }else{
            // find again so we can populate it
            that.respond('findOne',{_id:result._id},res);
        }
        
      });
    });

  }

  // A response helper for gets
  // (so we can populate things)
  respond(method,query,res){
    var m = this._class[method](query);
    if(this.populate){
        if(this.populate2){
            m.populate({
             path: this.populate,
            // Get friends of friends - populate the 'friends' array for every friend
             populate: { path: this.populate2 }
            });
        }else{
           m.populate(this.populate);
        }
      
    }
    m.exec(function(err,result){
      res.json(err || result);
    });
  }


  get(){

    // Since "this" will change inside routes
    var _class = this._class, that = this;

    // All instances
    this.app.get(this.baseRoute,function(req,res){
      that.respond('find',{},res);
    });

    // Find an instance using a mongo query object
    this.app.get(this.baseRoute + 'find/*',function(req,res){
      var searchStr = decodeURIComponent(req.url.split('/find/')[1]);
      var searchObj;
      eval('searchObj = ' + searchStr);
      that.respond('find',searchObj,res);
    });

    //==========================================================================
    //==========================================================================
    
    //CUSTOM QUERY - GET STUDENTS FOR EDUCATION X (EDUCATION_REST)
     this.app.get(this.baseRoute + 'findEduStud/*',function(req,res){
        var searchStr = decodeURIComponent(req.url.split('/findEduStud/')[1]);
        var searchObj; 
        eval('searchObj = ' + searchStr);
        
        _class.find({})
            .populate({
                path: '_education',
                match: {name:searchObj.name},
                select: 'name'
              })
            .exec(function (err, students) {
                if (err) return handleError(err);
                students = students.filter(filtering);
                res.json(students);              
        });
        
        function filtering(element, index, array){
            if(element._education){
               return element._education.name === searchObj.name;
            }
        }       
    });
    
    //CUSTOM QUERY - GET BOOKINGS FOR EDUCATION X (BOOKING_REST)
    this.app.get(this.baseRoute + 'findEduBook/*',function(req,res){
        var searchStr = decodeURIComponent(req.url.split('/findEduBook/')[1]);
        var searchObj; 
        eval('searchObj = ' + searchStr);
        
        _class.find({})
            .populate({
                path: '_education',
                match: {name:searchObj.name},
                select: 'name'
              })
            .exec(function (err, students) {
                if (err) return handleError(err);
                students = students.filter(filtering);
                res.json(students);              
        });
        
        function filtering(element, index, array){
            if(element._education){
               return element._education.name === searchObj.name;
            }
        }       
    });
    
    //==========================================================================
    //==========================================================================
    
    // One instance by id
    this.app.get(this.baseRoute + ':id',function(req,res){
      that.respond('findOne',{_id:req.params.id},res);
    });


    // Call the method of an instance
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
