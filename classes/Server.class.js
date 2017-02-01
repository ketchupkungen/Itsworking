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
var bodyparser =  require('body-parser'); // Used for Restrouter
var cookieparser = require('cookie-parser');
var sha1 = require('sha1');

var LoginhandlerRouter = require('./session/loginhandler.class');

global.sha1 = sha1;
global.userRoles = ['user','teacher','admin'];
global.passwordSalt = "kocmoc";

this.app.use(bodyparser.json());
this.app.use(bodyparser.urlencoded({ extended: false }));

var mset = g.settings.MONGOOSE;//see 'settingsConstr.js'

if(mset.connect === 'true'){  
    console.log("Connecting");
    var mongoose = require('mongoose');

    //Stop mongoose from using an old promise library
    mongoose.Promise = Promise;
    //
    // Make the express server able to handle
    // cookies, sessions and logins
    var Sessionhandler = require('./session/sessionhandler.class');
    var Session = require('./session/session.model')(mongoose);
    this.app.use(cookieparser()); // read cookies
    this.app.use(new Sessionhandler(Session).middleware());
    //
    //
    var Mymiddleware = require('./session/mymiddleware.class');
    new Mymiddleware(this.app);
    //
    //
    var studentModel = require('./tables/Student.model')(mongoose);
    var educationModel = require('./tables/Education.model')(mongoose);
    var teacherModel = require('./tables/Teacher.model')(mongoose);
    var bookingModel = require('./tables/Booking.model')(mongoose);
    var classModel = require('./tables/Classroom.model')(mongoose);
    var loginModel = require('./tables/Login.model')(mongoose);
    //
    var models = [studentModel,educationModel,teacherModel,bookingModel,classModel,loginModel];
    //
    var JSONLoader = require('./json/jsonLoader.class')(models);
    //
    //
    var Restrouter = require('./restrouterP.class');
    //
    var pop2booking = [{path:'_education'},{path:'_classroom'}];
    //
    //Set up basic routes
    new Restrouter(this.app,studentModel,"student",'_education','_teachers',{ // populate deep
          //OBS! OBS! I think i must use 'user.level' not 'user.role'       
//        get: function(user,req){
//            // Only Teachers and Admins can see/read/find students
//            if(user && user.role != "Teacher" && user.role != "Admin"){ return false; }
//            return true;
//        },
//        post: function(user,req){
//            // Only Admins can create Students
//            if(user && user.role == "Admin"){
//                return true;
//            }
//            return false;
//        }
    });
    
    new Restrouter(this.app,educationModel,"edu",'_teachers'); // populate one
    new Restrouter(this.app,teacherModel,"teach",'_educations');// populate one
    new Restrouter(this.app,bookingModel,"book",pop2booking);// populate several / two
    new Restrouter(this.app,classModel,"class");
    new Restrouter(this.app,loginModel,"shemalogin");
    //
    new LoginhandlerRouter(this.app,loginModel);
    //
    //
    mongoose.connect('mongodb://' + mset.host + '/' + mset.database);
    var db = mongoose.connection;
    //
    db.once('open', function (){
        console.log("Connected to MongoDB");
        JSONLoader.fillData();
    });
}//mset.connect

//==============================================================================
//==============================================================================
   // listen on port 3000
    this.app.listen(this.settings.port,  function() {
      console.log("Server listening on port "+me.settings.port);
    });
  }
  
}


