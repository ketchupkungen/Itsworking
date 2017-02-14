module.exports = function (mongoose) {

    var shema = mongoose.Schema({
        cookieVal:  String,
        lastActivity: Date,
        content: {type: mongoose.Schema.Types.Mixed} //Mixed means obestämt typ
    },
       {collection: 'sessions'} // sets the name of Collection in Database
    );
    

    // Compile the schema to a model
    // it will result in a new collection in the database
    Model = mongoose.model('session', shema);
    return Model;
};