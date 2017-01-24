//==============================================================================
//==============================================================================

//Executes first
$(document).ready(function () {
    initialize();
});

//Executes last
$(window).load(function () {

});

/**
 * Check for changes in DOM
 * @returns {undefined}
 */
function checkDOMChange() {

    //Do something each x ms

    setTimeout(checkDOMChange, 300);
}

//==============================================================================
//==============================================================================

function initialize() {
   var answer = nodeServerCall("testGetB","GET","test1","test2","test3",false);
   var respDiv = $("<div class='test-div-response'></div>");
   $(respDiv).append("<p>" + answer + "</p>" );
   $(".test-div-a").append(respDiv);
}



//==============================================================================
//==============================================================================