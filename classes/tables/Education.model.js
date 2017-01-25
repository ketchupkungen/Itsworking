module.exports = function (mongoose) {

    // Mongoose Schema, One-to-Few relation
    var shema = mongoose.Schema({
        name: String,
        teachers: [{ type: String, ref: 'teacher' }] // "foreignkey"  type:mongoose.Schema.Types.ObjectId
    },
       {collection: 'educations'} // sets the name of Collection in Database
    );

    shema.statics.createFromJsonWithNotify = function (json, cb) {
        //
        var leftToSave = json.length;
        //
        var me = this;
        //
        json.forEach(function (act) {
            //
            var education = new me({
                name: act.name
            });
            //
            act.teachers.forEach(function(act){
                education.teachers.push(act.id);
            });
            //
            education.save(function (err, cat) {
                leftToSave--;
                if (leftToSave === 0) {
                    cb(err, "Create educations ready");
                }
            });
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
        return this.model('educations').find({name: this.name}, cb);
    };
    

    // Compile the schema to a model
    // it will result in a new collection in the database
    Model = mongoose.model('educations', shema);
    return Model;
};