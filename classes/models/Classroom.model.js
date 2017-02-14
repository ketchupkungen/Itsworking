module.exports = function (mongoose) {

    // Mongoose Schema, One-to-Few relation
    var shema = mongoose.Schema({
        nr:  {type:Number,required: true,min: 1, max: 10},
        size:   {type:String,enum:['SM',"MD","LG"]},
        projector: {type:Boolean,default: false}
    },
       {collection: 'classrooms'} // sets the name of Collection in Database
    );

    shema.statics.createFromJsonWithNotify = function (json, cb) {
        //
        var leftToSave = json.length;
        //
        var me = this;
        //
        json.forEach(function (act) {
            //
            var classroom = new me({
                nr: act.nr,
                size: act.size
            });
            //
            classroom.save(function (err, cat) {
                leftToSave--;
                if (leftToSave === 0) {
                    cb(err, "Create classroom ready");
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
        return this.model('classroom').find({name: this.name}, cb);
    };
    

    // Compile the schema to a model
    // it will result in a new collection in the database
    Model = mongoose.model('classroom', shema);
    return Model;
};