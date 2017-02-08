'use strict';
module.exports = class RestrouterP {

  constructor(expressApp,_class,routerName,populate,populate2){

    this.app = expressApp;
    this.populate = populate;
    this.populate2 = populate2;
    this._class = _class;
    this.accessModel = global.accessModel;
    // get the class name
    var className = _class.name;

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
     //   
      that.rights(req,res,function(ret){
          if(ret){
            var instance = new _class(req.body);
            instance.save(function(err,result){
                if(err){
                    res.send("err: " + err);
                }else{
                    // find again so we can populate it
                    that.respond('findOne',{_id:result._id},res);
                }
            });//save
          }
      });//rights
    }); //post
  }

  // A response helper for gets
  // (so we can populate things)
  respond(method,query,res){
    var m = this._class[method](query);
    if(this.populate){
        if(this.populate2){
            m.populate({
             path: this.populate,
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
      //   
      that.rights(req,res,function(ret){
          if(ret){
            that.respond('find',{},res);  
          }
      });
      //
    });

    // Find an instance using a mongo query object
    this.app.get(this.baseRoute + 'find/*',function(req,res){
     //
     that.rights(req,res,function(ret){
         if(ret){
            var searchStr = decodeURIComponent(req.url.split('/find/')[1]);
            var searchObj;
            eval('searchObj = ' + searchStr);
            that.respond('find',searchObj,res);
         }
     });
     //
    });

    //==========================================================================
    //==========================================================================
    
    //CUSTOM QUERY - GET STUDENTS FOR EDUCATION X (EDUCATION_REST)
     this.app.get(this.baseRoute + 'findEduStud/*',function(req,res){
        //   
        that.rights(req,res,function(ret){
            if(ret){
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
            }
        });//rights
        //
    });
    
    //CUSTOM QUERY - GET BOOKINGS FOR EDUCATION X (BOOKING_REST)
    this.app.get(this.baseRoute + 'findEduBook/*',function(req,res){
        //   
        that.rights(req,res,function(ret){
           if(ret){
               //
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
           } 
        }); //rights
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
    var that = this;

    // Update several instances using a mongo query object
    this.app.put(this.baseRoute + 'find/*',function(req,res){
      //   
      that.rights(req,res,function(ret){
        if(ret){
            var searchStr = decodeURIComponent(req.url.split('/find/')[1]);
            var searchObj;
            eval('searchObj = ' + searchStr);
            _class.update(searchObj,req.body,{multi:true},function(err,result){
            res.json(err || result);
          });
        }
      });
      //  
    });

    // Update one instance by id
    this.app.put(this.baseRoute + ':id',function(req,res){
        //   
        that.rights(req,res,function(ret){
            if(ret){
              _class.update({_id:req.params.id},req.body,function(err,result){
              res.json(err || result);
             }); 
           }
        });
    });

  }


  delete(){

    // Since "this" will change inside routes
    var _class = this._class;
    var that = this;

    // Delete several instances using a mongo query object
    this.app.delete(this.baseRoute + 'find/*',function(req,res){
      //   
      that.rights(req,res,function(ret){
        if(ret){
           var searchStr = decodeURIComponent(req.url.split('/find/')[1]);
            var searchObj;
            eval('searchObj = ' + searchStr);
            _class.remove(searchObj,function(err,result){
              res.json(err || result);
            });
        }
      });
    });

    // Delete one instance by id
    this.app.delete(this.baseRoute + ':id',function(req,res){
        //   
        that.rights(req,res,function(ret){
             if(ret){
                 _class.remove({_id:req.params.id},function(err,result){
                    res.json(err || result);
                });
             }
        });
        //
    });
    
    //==========================================================================
    //==========================================================================
    
    //CUSTOM QUERY DELETE REFERENCE FROM REFS - EX: DELETE A TEACHER FROM EDUCATIONS
    this.app.delete(this.baseRoute + 'deleteReference/' + ':id',function(req,res){
        //   
        that.rights(req,res,function(ret){
            if(ret){
                var primaryId = req.params.id;
                var referenceId = req.body.ref_id;
                
              _class.findOne({_id:primaryId},function(err,doc){
                  if(doc){
                      doc.removeTeacher(referenceId,function(ok,referenceId){
                        res.json({erase:'ok',refId:referenceId});
                      });
                  }else{
                       res.json({erase:'failed',refId:referenceId});
                  }
                 
              });
            }
        });
    });
    
    //==========================================================================
    //==========================================================================
    
  }
  
  rights(req,res,cb){
     var that = this;
      //
      var method = req.method;
      var level = req.session.content.user.level;
      console.log("method: "+ method + "  accesslevel: " + level);
      //
      if(method === "GET"){
       this.check({basicroute:this.baseRoute,get_:{$lte:level}},res,that,function(ret){
          cb(ret);
       });
      }else if(method === "POST"){
        this.check({basicroute:this.baseRoute,post_:{$lte:level}},res,that,function(ret){
          cb(ret);
       });
      }else if(method === "PUT"){
        this.check({basicroute:this.baseRoute,put_:{$lte:level}},res,that,function(ret){
          cb(ret);
       });
      }else if(method === "DELETE"){
        this.check({basicroute:this.baseRoute,delete_:{$lte:level}},res,that,function(ret){
          cb(ret);
       });
      }
   }
   
   check(properties,res,that,cb){
//      console.log("PROPS: " + JSON.stringify(properties));
       that.accessModel.findOne(properties,function(err,doc){
//           console.log("DOC: ", doc);
           if(!doc){
               that.json(res,{errors:'access not allowed'});
               cb(false);
           }else{
              cb(true);
           }         
        });
   }
  
  jsonCleaner(toClean){
      return JSON.stringify(toClean._doc || toClean,(key,val)=>{
        if(key == "__v"){ return; }
        if(key == "password"){ return "[secret]"; }
        return val;
    });
  }

  json(res,err,response){
    if(err){ res.statusCode = 403; }
    res.end(this.jsonCleaner(err || response));
  }
  
}
