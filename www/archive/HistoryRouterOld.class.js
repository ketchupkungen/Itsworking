class HistoryRouter {

// Use it like following: <a href="/student-admin">A Link</a>
//new HistoryRouter({
//    '/student-admin': function(){
//        
//    },
//    '/options-link': function(){
//         
//    }
//});


// If no other route rule fulfilled then return www/index.html
//    This is for Backend, have it after all other app.get
//    this.app.get('*',(req,res)=>{
//      res.sendFile(__dirname + '/www/index.html');
//    });
  
  

  constructor(routes){

    var self = this;

    this.routes = routes;

    // when clicking a link run the click handler
    $(document).on('click','a',function(e){
//      console.log("Event object",e);
      var aTag = $(this);
      self.clickHandler(aTag,e);
    });

    // when using back/forward buttons call actOnRoute
    window.onpopstate = function(){
      self.actOnRoute(location.pathname);
    }

    // on initial load
    self.actOnRoute(location.pathname);

  }

  clickHandler(aTag,eventObj){

    var href = aTag.attr('href'), handleThisRoute = false;

    // check if the href is among
    // the routes this router should handle
    for(var route in this.routes){
      if(route == href){
        handleThisRoute = true;
        break;
      }
    }

    if(!handleThisRoute){
      // the router shouldn't handle this route
      return;
    }

    // handle this route:

    // use pushState (change url + add to history)
    // (the two first arguments are meaningless but required)
    history.pushState(null,'',href);

    // prevent the browser default behaviour
    // (the reload of the page)
    eventObj.preventDefault();

    // run the function connected to the route
    this.actOnRoute(href);

  }

  actOnRoute(route){
    // find the function corresponding to the route
    var func = this.routes[route];
    // if the route has no corresponding function
    // then set an "empty route", just "/"
    func = func || this.routes['/'];
    // make sure the dom is ready then run
    // the function corresponding to the route
    $(func);
  }


}