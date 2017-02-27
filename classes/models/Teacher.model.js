module.exports = function (mongoose) {

    // Mongoose Schema, One-to-Few relation
    var shema = mongoose.Schema({
        name:  {type:String,required: true},
         pnr: {type: String,required:true},
//            validate: {
//              validator: function(v) {
//                return /^(?:19|[2-9][0-9]){0,1}(?:[0-9]{2})(?!0229|0230|0231|0431|0631|0931|1131)(?:(?:0[1-9])|(?:1[0-2]))(?:(?:0[1-9])|(?:1[0-9])|(?:2[0-9])|(?:3[01]))[-+](?!0000)(?:[0-9]{4})$/.test(v);
//              },
//              message: 'ERROR: {VALUE} is not a valid personal id!'
//            },
//            required: [true, 'ERROR: Personal id required']
//        },
        epost: {type:String,required: true,unique:false},
        _educations: [{type:mongoose.Schema.Types.ObjectId, ref: 'education' }] // "foreignkey"  type:mongoose.Schema.Types.ObjectId
    },
       {collection: 'teachers'} // sets the name of Collection in Database
    );
    
    
//    shema.pre('save', function (next) {
//        //OBS! OBS! Validating is woorking without this one when inserting to database....
//        //Validate pnr           
//        err = this.validateSync();
//        if(err){
//            next(err);
//        }else{
//            next();
//        }
//        next(); // OBS! 
//    });
    

    shema.statics.createFromJsonWithNotify = function (json, cb) {
        //
        var leftToSave = json.length;
        //
        var me = this;
        //
        json.forEach(function (act) {
            //
            var obj = new me({
                name: act.name,
                pnr: act.pnr,
                epost: act.epost
            });
            //
//            error = obj.validateSync();
//            //
//            if(error){
//                console.log("----------Teacher Shema------------>"+error);
//            }
            //
            obj.save(function (err, data) {
                leftToSave--;
                if (leftToSave === 0) {
                    cb(err, "Create teachers ready");
                }
            });
        });
    };
    
    shema.methods.removeReference = function (ref_id,cb) {
        var index = this._educations.indexOf(ref_id);
        if(index !== -1){
            this._educations.splice(index, 1);
            this.save(function(err,doc){
              cb(true,'',ref_id); 
            });
        }else{
            cb(false,'dont exist',ref_id);
        }
    };
    
  /**
   * Add education
   * @param {type} edu_id
   * @param {type} cb
   * @returns {undefined}
   */     
  shema.methods.addReference = function (edu_id,cb) {
        if(this._educations.indexOf(edu_id)=== -1){
            this._educations.push(edu_id);
            this.save(function(err,doc){
               cb(true,'',edu_id); 
            });
        }else{
            cb(false,'allready exist',edu_id);
        }
  };
    
  shema.statics.deleteAll = function(cb) {
    return this.remove({}, cb);
  };
  
    /**
     *
     * @returns {array}
     */
    shema.methods.findSimilar = function (cb) {
        return this.model('teacher').find({name: this.name}, cb);
    };
    

    // Compile the schema to a model
    // it will result in a new collection in the database
    Model = mongoose.model('teacher', shema);
    return Model;
};