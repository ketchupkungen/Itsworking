class HistoryRouter {
    
// Example simple usage    
//new HistoryRouter({
//    '/status-link': function(){
//         openLink("#content-main","templates/statusTest.html");
//    },
//    '/options-link': function(){
//         openLink("#content-main","templates/optionsTest.html");
//    }
//});

//Example with params (Updated Version)
//new HistoryRouter({
//  '/': ()=>{ 
//      //... this route should always exsist... 
//  },
//  '/about/': ()=>{
//    // my logic to change views etc
//    // and show an about page
//  },
//  '/student/:id/view/:viewname': (params)=>{
//    console.log(params.id, params.viewname);
//    // do different things depending on id and viewname
//   }
//});
    

  constructor(routes){

    var self = this;

    this.routes = routes;

    // when clicking a link run the click handler
    $(document).on('click','a',function(e){
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

    var href = aTag.attr('href');

    var handleThisRoute = this.actOnRoute(href);

    if(!handleThisRoute){
      // the router shouldn't handle this route
      return;
    }

    // use pushState (change url + add to history)
    // (the two first arguments are meaningless but required)
    history.pushState(null,'',href);

    // prevent the browser default behaviour
    // (the reload of the page)
    eventObj.preventDefault();

  }

  actOnRoute(href){

    var func, params, routeWithParams;

    // check if the href is among
    // the routes this router should handle
    for(var route in this.routes){
      // complete match
      if(route == href){
        func = this.routes[route];
        break;
      }
      // handle params
      if(route.indexOf(':') >= 0){
        // match up until first param
        var routeWithoutParams =
          route.substring(0,route.indexOf(':'));
        var hrefWithoutParams =
          href.substring(0,route.indexOf(':'));
        if(routeWithoutParams == hrefWithoutParams){
          params = {};
          // calculate params and check that the route
          // really matches
          var hrefParts = href.split('/');
          var routeParts = route.split('/');
          var allNonParamsPartsMatch = true;
          // check arrays against each other
          for(var i = 0; i < routeParts.length; i++){
            if(routeParts[i][0] == ':'){
              // is a param
              params[routeParts[i].substr(1)] = hrefParts[i];
            }
            else {
              // is not a param
              if(routeParts[i] != hrefParts[i]){
                allNonParamsPartsMatch = false;
              }
            }
          }
          if(allNonParamsPartsMatch){
            // it did match!!!
            func = this.routes[route];
            break;
          }
        }
      }
    }

    // we should not handle this route
    if(!func){ return false; }

    // handle a route without params
    if(!params){
      // wait for DOM ready and call the func
      $(func);
    }
    else {
      // wait for DOM ready and call the func
      // with the params object as argument
      $(()=>{func(params);});
    }

    return true;
  }

}