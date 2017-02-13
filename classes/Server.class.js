'use strict';

module.exports = class Server {
  constructor() {
    // save our settings to this
    this.settings = g.settings.Server;
    
    // add express to this
    this.app = m.express();

    // run the setup method
    this.setup();
    this.main();
    this.listen();
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
    //Restrouter also needs this
    this.app.use(m.bodyparser.urlencoded({extended: false}));
  }
    
main(){
var sha1 = require('sha1');
global.sha1 = sha1;
global.passwordSalt = "kocmoc";

var LoginhandlerRouter = require('./session/loginhandler.class');
var Sessionhandler = require('./session/sessionhandler.class');
var Mymiddleware = require('./session/mymiddleware.class');
var Restrouter = require('./restrouterP.class');

var mset = g.settings.MONGOOSE;//see 'settingsConstr.js'

if(mset.connect === 'true'){  

    var mongoose = require('mongoose');
    //Stop mongoose from using an old promise library
    mongoose.Promise = Promise;
    //
    var Session = require('./session/session.model')(mongoose);
    this.app.use(new Sessionhandler(Session).middleware());
    //
    //Implements some basic functionality
    new Mymiddleware(this.app);
    //
    var studentModel = require('./models/Student.model')(mongoose);
    var educationModel = require('./models/Education.model')(mongoose);
    var teacherModel = require('./models/Teacher.model')(mongoose);
    var bookingModel = require('./models/Booking.model')(mongoose);
    var classModel = require('./models/Classroom.model')(mongoose);
    var loginModel = require('./models/Login.model')(mongoose);
    var accessModel = require('./models/Access.model')(mongoose);
    global.accessModel = accessModel;
    //
    var models = [studentModel,educationModel,teacherModel,bookingModel,classModel,loginModel,accessModel];
    //
    var JSONLoader = require('./json/jsonLoader.class')(models);
    //
    //
    var pop2booking = [{path:'_education'},{path:'_classroom'}];
    //Set up basic routes
    new Restrouter(this.app,studentModel,"student",'_education','_teachers'); // populate deep
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

   
    // If no other route rule fulfilled then return www/index.html
    var myIndexFile = m.path.join(__dirname,'..','www','index.html');
    console.log(myIndexFile);
    this.app.get('*',(req,res)=>{
      res.sendFile(myIndexFile);
    });

}

listen(){
    // listen on port 3000
    var me = this;
    this.app.listen(this.settings.port,  function() {
      console.log("Server listening on port "+me.settings.port);
    });
}
  
};


