module.exports = function (mongoose) {

    // Mongoose Schema, One-to-Few relation
    var shema = mongoose.Schema({
        name:  {type:String,required: true},
        score: {type:Number,min: 10, max: 600},
        info:  {type:String},
        _teachers: [{ type:mongoose.Schema.Types.ObjectId, ref: 'teacher' }] // "foreignkey"  type:mongoose.Schema.Types.ObjectId
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
                name: act.name,
                score: act.score,
                info: act.info
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
        return this.model('education').find({name: this.name}, cb);
    };
    
    /**
     * Remove teacher
     * @param {type} teacher_id
     * @param {type} cb
     * @returns {undefined}
     */
    shema.methods.removeReference = function (teacher_id,cb) {
            var index = this._teachers.indexOf(teacher_id);
            if(index !== -1){
                this._teachers.splice(index, 1);
                this.save(function(err,doc){
                  cb(true,'',teacher_id); 
                });
            }else{
                cb(false,'dont exist',teacher_id);
            }
    };
    
    /**
     * Add Teacher
     * @param {type} teacher_id
     * @param {type} cb
     * @returns {undefined}
     */
    shema.methods.addReference = function (teacher_id,cb) {
        if(this._teachers.indexOf(teacher_id)=== -1){
            this._teachers.push(teacher_id);
            this.save(function(err,doc){
               cb(true,'',teacher_id); 
            });
        }else{
            cb(false,'allready exist',teacher_id);
        }
    };
    

    // Compile the schema to a model
    // it will result in a new collection in the database
    Model = mongoose.model('education', shema);
    return Model;
};