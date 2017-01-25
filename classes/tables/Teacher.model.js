module.exports = function (mongoose) {

    // Mongoose Schema, One-to-Few relation
    var shema = mongoose.Schema({
        name:  {type:String,required: true},
        pnr:   {type:String,required: true},
        epost: {type:String,required: true},
        educations: [{type:mongoose.Schema.Types.ObjectId, ref: 'education' }] // "foreignkey"  type:mongoose.Schema.Types.ObjectId
    },
       {collection: 'teachers'} // sets the name of Collection in Database
    );

    shema.statics.createFromJsonWithNotify = function (json, cb) {
        //
        var leftToSave = json.length;
        //
        var me = this;
        //
        json.forEach(function (act) {
            //
            var teacher = new me({
                name: act.name,
                pnr: act.pnr,
                epost: act.epost
            });
            //
            teacher.save(function (err, data) {
                leftToSave--;
                if (leftToSave === 0) {
                    cb(err, "Create teachers ready");
                }
            });
        });
    };
       
    
  shema.statics.deleteAll = function(cb) {
    return this.remove({}, cb);
  };
  
  shema.methods.addEducation = function(educationsId){
        this.educations.push(educationsId);
        this.save();
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