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
var catNames = require('./cats.json');
var Model = require('./Cats.model')(mongoose);

//Link examples
// localhost:3000/rest/catsrouter - get all
// localhost:3000/rest/catsrouter/find/{name:"Zorro"}
var Restrouter = require('./restrouter.class');
new Restrouter(this.app,Model,"CatsRouter");

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

db.once('open', function (){
    console.log("Connected to MongoDB");
    connected();
});

// To make sometihing only after connecting to the DB
function connected(){
  
}


//==============================================================================
//==============================================================================
   // listen on port 3000
    this.app.listen(this.settings.port,  function() {
      console.log("Server listening on port "+me.settings.port);
    });
  }
  
}


