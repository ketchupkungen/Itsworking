module.exports = function (mongoose) {

    // Mongoose Schema, One-to-Few relation
    var shema = mongoose.Schema({
        name:  {type:String,required: true},
        pnr:   {type:String,required: true},
        epost: {type:String,required: true},
        education: {type:mongoose.Schema.Types.ObjectId, ref: 'education'} // "foreignkey"  type:mongoose.Schema.Types.ObjectId
    },
       {collection: 'students'} // sets the name of Collection in Database
    );

    shema.statics.createFromJsonWithNotify = function (json, cb) {
        //
        var leftToSave = json.length;
        //
        var me = this;
        //
        json.forEach(function (act) {
            //
            var student = new me({
                name: act.name,
                pnr: act.pnr,
                epost: act.epost,
//                education: act.education
            });
            //
            student.save(function (err, cat) {
                leftToSave--;
                if (leftToSave === 0) {
                    cb(err, "Create students ready");
                }
            });
        });
    };
    
  shema.methods.setEducation = function(educationModel,educationName,cb) {
      educationModel.find({name:educationName},function(err,doc){
          this.education = doc._id;
          this.save(cb);
      });
  };  
    
  shema.statics.deleteAll = function(cb) {
    return this.remove({}, cb);
  };

    /**
     *
     * @returns {array}
     */
    shema.methods.findSimilar = function (cb) {
        return this.model('student').find({name: this.name}, cb);
    };
    

    // Compile the schema to a model
    // it will result in a new collection in the database
    Model = mongoose.model('student', shema);
    return Model;
};