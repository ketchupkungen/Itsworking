$(document).ready(function () {
    var mainDiv = $.parseHTML("<div class='view-port-wh' id='view-port-wh'> </div>");
    $(mainDiv).css("width", "160px");
    $(mainDiv).css("height", "40px");
    $(mainDiv).css("padding", "5px");
    $(mainDiv).css("background-color", "black");
    $(mainDiv).css("color", "white");
    $(mainDiv).css("position", "fixed");
    $(mainDiv).css("bottom", "20px");
    $(mainDiv).css("right", "0");

    $('body').append(mainDiv);


    $(window).resize(function () {
        if (inProgress) {
            return;
        }
        $('#view-port-wh').animate({opacity: 1}, 0);
            inProgress = true;
        $('#view-port-wh').text("W:" + $(document).width() + "  /  H: " + $(document).height()).delay(1500).animate({opacity: 0}, 500, function () {
            inProgress = false;
        });
    });
});

var inProgress = false;