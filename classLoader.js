module.exports = function() {
  var settings = g.settings.classLoader;

  g.classes = {};
  settings.toLoad.forEach(function(c) {
    g.classes[c] = require(m.path.join(settings.baseDir, c+'.class.js'));
  });
};