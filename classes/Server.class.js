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
global.passwordSalt = "shouldBeHardToGuess132638@@@@x";


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
    // Never cache request starting with "/rest/"
    this.app.use((req,res,next)=>{
    if(req.url.indexOf('/rest/') >= 0){
       // never cache rest requests
       res.set("Cache-Control", "no-store, must-revalidate");
     }
      next();
    });
    
    
    //Bara ett exempel på att skapa Middleware
    this.app.use(function(req,res,next){
       
    });
    
    
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
        get: function(user,req){
            // Only Teachers and Admins can see/read/find students
            if(user && user.role != "Teacher" && user.role != "Admin"){ return false; }
            return true;
        },
        post: function(user,req){
            // Only Admins can create Students
            if(user && user.role == "Admin"){
                return true;
            }
            return false;
        }
    });
    
    new Restrouter(this.app,educationModel,"edu",'_teachers'); // populate one
    new Restrouter(this.app,teacherModel,"teach",'_educations');// populate one
    new Restrouter(this.app,bookingModel,"book",pop2booking);// populate several / two
    new Restrouter(this.app,classModel,"class");
    new Restrouter(this.app,loginModel,"login");
    new LoginhandlerRouter(this.app);
    
    this.app.get("/checksession",function(req,res){
        res.json(req.session);
    });
    
    //Det är sällan man skickar request från clienten för att ändra något
    this.app.post("/storesomethinginsession",function(req,res){
       if(!req.session.content.stupidThings){req.session.content.stupidThings = []; }
       req.session.content.stupidThings.push(req.body);
       req.session.markModified('content');
       req.session.save();
       res.json(req.session);
    });
    
    
    this.app.get("/canisee",function(req,res){
       if(req.session.content.stupidThings){
           res.json({message:"You have entered stupid things!",stupid:req.session.content.stupidThings});
       }
       else {
           res.json({message:"Not allowed to see stupid things until you post a stupid thing..."});
       }
    });
    //
    //
    // A path to get user roles
    this.app.get('/rest/user-roles',(req,res)=>{
        res.json(global.userRoles);
    });
    //
    mongoose.connect('mongodb://' + mset.host + '/' + mset.database);
    var db = mongoose.connection;
    //
    db.once('open', function (){
        console.log("Connected to MongoDB");
//        JSONLoader.fillData();
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


