// globals
m = {}; // all modules
g = {}; // all global variables (ex. settings)

// Require modules
[
  "express",
  "compression",
  "path",
  "fs",
  "serve-favicon",
  "cookie-parser",
  "body-parser",
  "gulp",
  "gulp-less",
  "gulp-clean-css",
  "./settingsConstr",
  "./classLoader"
].forEach(function(x){
  // store required modules in "m"
  m[x.replace(/\W/g,'')] = require(x);
});

// console.log("All loaded modules", Object.keys(m));

// constructs g.settings object
m.settingsConstr();

// loads all classes
m.classLoader();

// console.log("All loaded classes", Object.keys(g.classes));

// start LessWatch
 new g.classes.LessWatch();

// start express server
 new g.classes.Server();


