'use strict';

module.exports = class Server {
  constructor() {
    // save our settings to this
    this.settings = g.settings.Server;
    
    // add express to this
    this.app = m.express();
    
    var bodyparser =  require('body-parser');
    
    this.app.use(bodyparser.json());
    this.app.use(bodyparser.urlencoded({ extended: false }));

    // run the setup method
    this.setup();
  }

  setup() {
    // tell express to use middleware to parse JSON
    this.app.use(m.bodyparser.json());
    // declare a webroot
    this.app.use(
      m.express.static(
        m.path.join(g.settings.appRoot, this.settings.webroot)
      )
    );

    // compress all files using gzip
    this.app.use(m.compression());

    // parse all request cookies
    this.app.use(m.cookieparser());

    // parse all urlencoded request body data
    // for example from "standard" HTML forms
    this.app.use(m.bodyparser.urlencoded({extended: false}));

    var me = this;
    
//==============================================================================
//==============================================================================
        
var mongoose = require('mongoose');

var studentsJson = require('./json/students.json');
var studentModel = require('./tables/Student.model')(mongoose);

var educationsJson = require('./json/educations.json');
var educationModel = require('./tables/Education.model')(mongoose);

var Restrouter = require('./restrouter.class');
new Restrouter(this.app,studentModel,"student");
new Restrouter(this.app,educationModel,"edu");

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

db.once('open', function (){
    console.log("Connected to MongoDB");
//    testStudents();
    testEducations();
});

function testEducations(){
     educationModel.deleteAll(function(err, resp){
        //
       console.log("schema cleared: " + resp);
       //
       educationModel.createFromJsonWithNotify(educationsJson,function(err,resp){
           console.log("created: " + resp.toString());
           
       });
       //
    });
}

// To make sometihing only after connecting to the DB
function testStudents(){
  studentModel.deleteAll(function(err, resp){
        //
       console.log("schema cleared: " + resp);
       //
       studentModel.createFromJsonWithNotify(studentsJson,function(err,resp){
           console.log("created: " + resp.toString());
           
           
//            studentModel.findOne({name:"john doe"},function (err,doc){
//                doc.findSimilar(function (err,docs){
//                    docs[0].remove();
//                });
//            });
           
//            studentModel.findOne({name:"john doe"},function (err,doc){
//                console.log("doc: " + doc.name);
//                doc.utb_id = "fdf343dsf";
//                doc.save();
//            });
           
       });
       //
    });
}


//==============================================================================
//==============================================================================
   // listen on port 3000
    this.app.listen(this.settings.port,  function() {
      console.log("Server listening on port "+me.settings.port);
    });
  }
  
}


