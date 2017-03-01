module.exports = function (mongoose) {

    // Mongoose Schema, One-to-Few relation
    var shema = mongoose.Schema({
        pnr: {type: String,
            validate: {
                validator: function (v) {
                    return /^(?:19|[2-9][0-9]){0,1}(?:[0-9]{2})(?!0229|0230|0231|0431|0631|0931|1131)(?:(?:0[1-9])|(?:1[0-2]))(?:(?:0[1-9])|(?:1[0-9])|(?:2[0-9])|(?:3[01]))[-+](?!0000)(?:[0-9]{4})$/.test(v);
                },
                message: 'ERROR: {VALUE} is not a valid personal id!'
            },
            required: [true, 'ERROR: Personal id required']
        },
        epost: {type: String, required: true},
        level: {type: Number, min: 0, max: 3},
        password: {type: String, required: true}
    },
            {collection: 'logins'} // sets the name of Collection in Database
    );


    //Do some stuff before making 'save'
    shema.pre('save', function (next) {

        if (this.isModified('password')) {
            this.password = sha1(this.password + global.passwordSalt);
        }

        var that = this;

        if (this.isModified('epost')) {
            this.model('login').findOne({epost: this.epost}, function (err, doc) {
                if (doc) {
                    var err = new Error('Username already exists:' + that.epost);
                    next(err);
                } else {
                    next();
                }
            });
        }else{
            next();
        }

        //Validate pnr           
//        err = this.validateSync();
//        if(err){
//            next(err);
//        }else{
//            next();
//        }

    });


    shema.statics.createFromJsonWithNotify = function (json, cb) {
        //
        var leftToSave = json.length;
        //
        var me = this;
        //
        json.forEach(function (act) {
            //
            var obj = new me({
                pnr: act.pnr,
                epost: act.epost,
                level: act.level,
                password: act.password
            });

            obj.save(function (err, cat) {
                leftToSave--;
                if (leftToSave === 0) {
                    cb(err, "Create logins ready");
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
        return this.model('login').find({name: this.name}, cb);
    };


    // Compile the schema to a model
    // it will result in a new collection in the database
    Model = mongoose.model('login', shema);
    return Model;
};