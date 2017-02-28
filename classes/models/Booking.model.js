module.exports = function (mongoose) {

    // Mongoose Schema, One-to-Few relation
    var shema = mongoose.Schema({
        name: {type: String, required: true},
        date:  {type:String, required: true},  // date: {type: Date, default: Date.now, required: false},
        education: {type: String, required: true}, // "foreignkey"  type:mongoose.Schema.Types.ObjectId
        classroom: {type: String, required: true}
    },
            {collection: 'bookings'} // sets the name of Collection in Database
    );

    shema.statics.createFromJsonWithNotify = function (json, cb) {
        //
        var leftToSave = json.length;
        //
        var me = this;
        //
        json.forEach(function (act) {
            //
            var booking = new me({
                name: act.name,
                date: act.date,
                education: act.education,
                classroom: act.classroom
            });
            //
            booking.save(function (err, cat) {
                leftToSave--;
                if (leftToSave === 0) {
                    cb(err, "Create bookings ready");
                }
            });
        });
    };

    shema.statics.deleteAll = function (cb) {
        return this.remove({}, cb);
    };

    /**
     *
     * @returns {array}
     */
    shema.methods.findSimilar = function (cb) {
        return this.model('booking').find({name: this.name}, cb);
    };


    // Compile the schema to a model
    // it will result in a new collection in the database
    Model = mongoose.model('booking', shema);
    return Model;
};