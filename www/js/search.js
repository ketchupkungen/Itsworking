$( document ).ready(function() {

    initEvents();

});

function initEvents() {

    $("#searchButton").on("click", function () {

        var $btn = $(this).button("loading");
        $("#searchField").attr("disabled", true);

    });

    $(".inputContainer").hover(function(){

        $(this).stop().animate({borderBottomWidth: "4px"},{duration: 170, complete: function() {}} );

    }, function () {

        $(this).stop().animate({borderBottomWidth: "2px"},{duration: 170, complete: function() {}} );

    });

}


function enableInput() {

    $("#searchButton").button("loading");
    $("#searchField").attr("disabled", false);

}
