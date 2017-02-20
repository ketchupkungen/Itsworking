module.exports = function (mongoose) {

    // Mongoose Schema, One-to-Few relation
    var shema = mongoose.Schema({
        name: {type: String, required: true},
        pnr: {type: String,
            validate: {
                validator: function (v) {
                    return /^(?:19|[2-9][0-9]){0,1}(?:[0-9]{2})(?!0229|0230|0231|0431|0631|0931|1131)(?:(?:0[1-9])|(?:1[0-2]))(?:(?:0[1-9])|(?:1[0-9])|(?:2[0-9])|(?:3[01]))[-+](?!0000)(?:[0-9]{4})$/.test(v);
                },
                message: 'ERROR: {VALUE} is not a valid personal id!'
            },
            required: [true, 'ERROR: Personal id required']
        },
        epost: {type: String,
            validate: {
                validator: function (v) {
                    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
                },
                message: 'ERROR: {VALUE} is not a valid email!'
            },
            required: [true, 'ERROR: email required']
        },
        _education: {type: mongoose.Schema.Types.ObjectId, ref: 'education'} // "foreignkey"  type:mongoose.Schema.Types.ObjectId
    },
            {collection: 'students'} // sets the name of Collection in Database
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
            obj.save(function (err, obj) {
                leftToSave--;
                if (leftToSave === 0) {
                    cb(err, "Create students ready");
                }
            });
        });
    };

    shema.methods.addReference = function (education_id, cb) {
        this._education = education_id;
        this.save(function (err, doc) {
            cb(true, '' + err, education_id);
        });
    };

    shema.methods.removeReference = function (education_id, cb) {
        if (this._education == education_id) {//must be checked with == not ===
            this._education = null;
            this.save(function (err, doc) {
                cb(true, '', education_id);
            });
        } else {
            cb(false, 'id not match', education_id);
        }
    };


    shema.statics.deleteAll = function (cb) {
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