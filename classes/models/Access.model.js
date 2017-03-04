module.exports = function (mongoose) {

    var shema = mongoose.Schema({
        basicroute:  {type:String,required: true},
        get_:    {type:Number,min: 0, max: 3, default:1},
        post_:   {type:Number,min: 0, max: 3, default:2},
        put_:    {type:Number,min: 0, max: 3, default:2},
        delete_: {type:Number,min: 0, max: 3, default:3}
        
    },
       {collection: 'access'} // sets the name of Collection in Database
    );

    shema.statics.createFromJsonWithNotify = function (json, cb) {
        //
        var leftToSave = json.length;
        //
        var me = this;
        //
        json.forEach(function (act) {
            //
            var access = new me({
                basicroute: act.basicroute,
                get_: act.get,
                post_: act.post,
                put_: act.put,
                delete_: act.delete
            });
            //
            access.save(function (err, doc) {
                leftToSave--;
                if (leftToSave === 0) {
                    cb(err, "Create access ready");
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
        return this.model('access').find({basicroute: this.basicroute}, cb);
    };
    

    // Compile the schema to a model
    // it will result in a new collection in the database
    Model = mongoose.model('access', shema);
    return Model;
};