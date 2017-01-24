/**
 * Example of how to remove the removeScrollTopListener
 * @returns {undefined}
 */
function checkDOMChange() {

    if (exists("selector") === false) {
        removeScrollTopListener(); // is used
    }

    setTimeout(checkDOMChange, 300);
}


function removeScrollTopListener() {
    $("#scrollTopBtn").remove();
    $(window).off('scroll');
}

var IMAGE_PATH = "images/up.png";

/**
 * Other functions inside this function are "PRIVATE" functions not visible
 * from outside
 * @returns {undefined}
 */
function addScrollTopListener() {

    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 100) {
            addScrollTopController();
        } else if ($(window).scrollTop() === 0) {
            $("#scrollTopBtn").remove();
        }
    });


    function addScrollTopController() {
        if (exists("#scrollTopBtn")) {
            return;
        }
        //
        addEventScrollTopBtn();
        //
        var html = "<img src='' alt='scrollToTop' id='scrollTopBtn'>";
        var elem = $.parseHTML(html);
        $(elem).attr("src",IMAGE_PATH);
        $(elem).css("position", "fixed");
        $(elem).css("top", "80px");
        $(elem).css("right", "20px");
        $(elem).fadeIn(1000);
        $("body").append(elem);
    }

    function addEventScrollTopBtn() {
        $("body").on('click', "#scrollTopBtn", function () {
            disableScroll();
            $('html, body').stop().animate({scrollTop: 0}, 700, function () {
                enableScroll();
            });
        });
    }

    function disableScroll() {
        if (window.addEventListener) // older FF
            window.addEventListener('DOMMouseScroll', preventDefault, false);
        window.onwheel = preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
        window.ontouchmove = preventDefault; // mobile
        document.onkeydown = preventDefaultForScrollKeys;
    }

    function enableScroll() {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
    }

    function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

}

function exists(selector) {
    if ($(selector).length) {
        return true;
    } else {
        return false;
    }
}