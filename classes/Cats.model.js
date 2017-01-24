module.exports = function(mongoose){

  // Mongoose Schema, One-to-Few relation
  var shema = mongoose.Schema({
      name: String,
      age: Number,
      addresses : Array
    },
     {collection: 'cats'} 
    );
  
//  shema.set('autoIndex', true);
  //================================<STATIC METHODS>============================
  
  /**
   * Model.create("Shaddy",9,function(err,cat){
   *   res.json(cat);
   * });
   * @tested
   * @returns {undefined}
   */
  shema.statics.create = function(name,age,cb) {
      var cat = new this({
        name: name, 
        age: age,
        addresses: []
    });
    //
    cat.save(cb);
  };
  
  /**
   * Note how the static method is called inside another static method 
   * 
   * Model.createFromJson(Model,catNames,function(err,resp){
   *    console.log("created: " + resp.toString());
   * });
   * @tested
   * @returns {undefined}
   */
  shema.statics.createFromJson = function(json,cb) {
    var me = this;  
    json.forEach(function(name){
        me.create(name,0,cb);
    });
 };
 
    /**
     * Creates and notifies after it's done
     * @tested
     * @returns {undefined}
     */
   shema.statics.createFromJsonWithNotify = function(json,cb) {
    //
    var leftToSave = json.length;
    //
    var me = this;
    //
    json.forEach(function(name){
       //
        var cat = new me({
            name: name, 
            age: 0,
            addresses: []
        });
        //
        cat.save(function(err,cat){
           leftToSave--;
           if(leftToSave === 0){
                cb(err,"Create ready");
           }
     });
   });
 };
 

 
  
  //BASIC QUERIES
  //
  //ALL:    {} - empty brackets as parameter
  //SINGLE: {name:value}
  //AND:    {name:{$in:[param1,param2]}
  //OR:     {$or:[{name:param1},{name:param2}]}
  //
  
  /**
   * Use this one as a reminder
   * OBS! OBS! find returns not a single object but an Array!!!
   * 
   * YourModel.find({ something: true }, function (err, docs) {
   *   docs.forEach(function (doc) {
   *   // do something
   *   });
   * });
   * 
   * @tested
   */
  shema.statics.find_ = function(query,cb) {
    this.find(query,cb);
  };
  
   shema.statics.findNameLike = function(like,cb) {
     this.find({name: new RegExp('^'+like+'$', "i")},cb);
  };
  
   /**
  * Updates only one entry
  * Model.updateOne({name:"Zorro"},"Borro",function (err,resp){...
  * @tested
  * @returns {undefined}
  */
 shema.statics.updateOne = function(query,replaceWith,cb) {
    this.findOne(query, function (err, doc){
      doc.name = replaceWith;
      doc.save();
      cb(err,doc);
    });
  };
 
  
  /**
  * Model.updateMulti({name:"Zorro"},{name:"Borrro"},function (err,resp){
  * @tested
  * @returns {undefined}
  */
 shema.statics.updateMulti = function(query,update, cb) {
     this.update(query, update, { multi: true }, cb);
 };
 
 /**
  * @tested
  * @returns {nm$_Cats.model.module.exports.shema.statics@call;remove}
  */
 shema.statics.delete = function(query,cb) {
     return this.remove(query, cb);
 };
  
  /**
   * Deletes all from this Collection/Model
   * Kitten.deleteAll(function(err, resp){...
   * @tested
   * @param {type} cb
   * @returns {nr of deleted objects}
   */
  shema.statics.deleteAll = function(cb) {
    return this.remove({}, cb);
  };
  
  
 //================================</STATIC METHODS>============================
 //
 //
 //================================<CLASS METHODS>==============================

  shema.methods.getIdObj = function(){
        return this._id;
  };

  shema.methods.getId = function(){
        return this._id.toString();
  };
  
  
  shema.methods.addAdress = function(street,city,cc){
        var newAddr = {street: street, city: city, cc:cc};
        this.addresses.push(newAddr);
        this.save();
  };
  
    
  shema.methods.toString = function(){
        return "name: " + this.name + "  age: " + this.age + "  adresses: " + JSON.stringify(this.addresses) + "  id: " + this._id.toString();
  };
 
/**
 * var cat = new Kitten({ name: 'Murka',age: 15});
 * cat.findSimilarName(function (err, dogs){
 *    console.log(dogs);
 * });
 * @tested
 * @param {type} cb
 * @returns {nm$_Kitten.model.module.exports.shema.methods@call;model@call;find}
 */  
 shema.methods.findSimilarName = function(cb) {
    return this.model('Cats').find({ name: this.name }, cb);
 };
 
  //================================</CLASS METHODS>==============================

  // Compile the schema to a model
  // it will result in a new collection in the database
  Model = mongoose.model('Cats', shema);
  return Model;
};