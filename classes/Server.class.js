'use strict';

module.exports = class Server {
  constructor() {
    // save our settings to this
    this.settings = g.settings.Server;
    
    // add express to this
    this.app = m.express();
    
    

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

//Stop mongoose from using an old promise library
mongoose.Promise = Promise;
//
var studentsJson = require('./json/students.json');
var educationsJson = require('./json/educations.json');
var teachersJson = require('./json/teachers.json');
var bookingsJson = require('./json/bookings.json');
var classroomsJson = require('./json/classrooms.json');
var loginsJson = require('./json/logins.json');
//
var studentModel = require('./tables/Student.model')(mongoose);
var educationModel = require('./tables/Education.model')(mongoose);
var teacherModel = require('./tables/Teacher.model')(mongoose);
var bookingModel = require('./tables/Booking.model')(mongoose);
var classModel = require('./tables/Classroom.model')(mongoose);
var loginModel = require('./tables/Login.model')(mongoose);
//
var models = [studentModel,educationModel,teacherModel,bookingModel,classModel,loginModel];
var jsons = [studentsJson,educationsJson,teachersJson,bookingsJson,classroomsJson,loginsJson];
//
//
var JSONLoader = require('./json/jsonLoader.class')(jsons,models);
//
var bodyparser =  require('body-parser'); //Used for Restrouter
this.app.use(bodyparser.json());
this.app.use(bodyparser.urlencoded({ extended: false }));
//
var Restrouter = require('./restrouterP.class');
//
//
var pop2booking = [{path:'_education'},{path:'_classroom'}];
//
new Restrouter(this.app,studentModel,"student",'_education','_teachers'); //populate deep
new Restrouter(this.app,educationModel,"edu",'_teachers');
new Restrouter(this.app,teacherModel,"teach",'_educations');
new Restrouter(this.app,bookingModel,"book",pop2booking);// populate several
new Restrouter(this.app,classModel,"class");
new Restrouter(this.app,loginModel,"login");
//
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
//
db.once('open', function (){
    console.log("Connected to MongoDB");
    testPopulations();
//  JSONLoader.fillData();
});

function testPopulations(){
    
//    //Find education which belongs to student
//    studentModel.findOne({ name: 'john doe' })
//        .populate('_education') //OBS! not Shema name but the name of property in the Model
//        .exec(function (err, student) {
//          if (err) return handleError(err);
////          console.log("Pop student: " + student);
//          console.log('Populate: %s', student._education.name);
//          // prints "The creator is Aaron"
//    });
//    
//    //Find educations which a teacher has
//     teacherModel.findOne({ name: 'tomas frank' })
//        .populate('_educations') //OBS! not Shema name but the name of property in the Model
//        .exec(function (err, teacher) {
//          if (err) return handleError(err);
//          console.log("Populate teacher: " + teacher);
//          console.log('Populate: %s', teacher._educations[0].name);
//          // prints "The creator is Aaron"
//    });
    
    //Find students which a education has
     studentModel.find({})
        .populate({
            path: '_education',
            match: {name:'suw16'},
            select: 'name',
            options: { sort: { name: -1 }}
          })
        .exec(function (err, students) {
             students = students.filter(function(doc){
                  console.log('Populate: %s', doc._education);
//                return doc.tags.length;
            });
          if (err) return handleError(err);
//          console.log("Populate teacher: " + students);
         
    });
    
//    function filtering(eduName){
//        return eduName === 'suw16'
//    }
}

//==============================================================================
//==============================================================================
   // listen on port 3000
    this.app.listen(this.settings.port,  function() {
      console.log("Server listening on port "+me.settings.port);
    });
  }
  
}


