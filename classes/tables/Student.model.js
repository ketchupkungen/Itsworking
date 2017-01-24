module.exports = function (mongoose) {

    // Mongoose Schema, One-to-Few relation
    var shema = mongoose.Schema({
        name: String,
        pnr: String,
        epost: String,
        utb_id: {type: String, ref: 'utbildning'}
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
                utb_id: act.utb_id
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
    
  shema.statics.deleteAll = function(cb) {
    return this.remove({}, cb);
  };

    /**
     *
     * @returns {array}
     */
    shema.methods.findSimilar = function (cb) {
        return this.model('students').find({name: this.name}, cb);
    };
    

    // Compile the schema to a model
    // it will result in a new collection in the database
    Model = mongoose.model('students', shema);
    return Model;
};