function defineFingerPrint() {
    var client = new ClientJS();
    var prints = client.getFingerprint(); // Calculate Device/Browser Fingerprint
    $(".test-div-finger-print").text("Browser finger print: " + prints);
    return prints;
}


function getJsonFromUrlSync(url) {
    //
    var jsonStr = $.ajax({
        url: url,
        dataType: 'json',
        async: false
    }).responseText;
    //
    return JSON.parse(jsonStr);
}

function includeHtml(url, selector, addType) {
    //
    var html = $.ajax({
        url: url,
        dataType: 'text',
        async: false
    }).responseText;
    //
    if (addType === "append") {
        $(selector).append(html);
    } else if (addType === "prepend") {
        $(selector).prepend(html);
    } else if (addType === "after") {
        $(selector).after(html);
    } else if (addType === "before") {
        $(selector).before(html);
    } else {
        $(selector).append(html);
    }
}

function includeHtmlAsync(url, selector, addType) {
    $.ajax({
        url: url,
        dataType: 'text',
        async: true
    }).done(function (msg) {
        if (addType === "append") {
            $(selector).append(msg);
        } else if (addType === "prepend") {
            $(selector).prepend(msg);
        } else if (addType === "after") {
            $(selector).after(msg);
        } else if (addType === "before") {
            $(selector).before(msg);
        } else {
            $(selector).append(msg);
        }
    });
}

/**
 * To convert the rcieved html string into jquery object use: var obj = $(responseText)
 * @param {type} url
 * @returns {jqXHR.responseText}
 */
function loadTemplate(url) {
    //
    var html = $.ajax({
        url: url,
        type: "GET",
        dataType: 'html',
        async: false
    }).responseText;
    //
    return html;
}
//==============================================================================
//==============================================================================
function linkNotFound(obj) {
    var src = $(obj).attr("src");
    var href = $(obj).attr("href");

    if (src) {
        alert("NOT FOUND:" + $(obj).attr("src"));
    }
    
    if(href){
        alert("NOT FOUND:" + $(obj).attr("href"));
    }


}

function exists(selector) {
    if ($(selector).length) {
        return true;
    } else {
        return false;
    }
}

function stringContains(string, searched_string) {
    if (string.indexOf(searched_string) > -1) {
        return true;
    } else {
        return false;
    }
}

function refreshWindow() {
    window.location = window.location;
}

function removeAllClassesX(class_) {
    $("." + class_).each(function () {
        $(this).removeClass(class_);
    });
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
//==============================================================================
//==============================================================================

function getRandomInt(betweenA, betweenB) {
    return Math.floor((Math.random() * betweenB) + betweenA);
}

//==============================================================================
//==============================================================================

function isScrolledIntoView(selector) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $(selector).offset().top;
    var elemBottom = elemTop + $(selector).height();
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function isVisible(selector) {
    return $(selector).is(':visible');
}

function scrollToElementSmooth(selector) {
    $('html, body').animate({
        scrollTop: $(selector).offset().top - 20
    }, 1000);
}
//==============================================================================
//==============================================================================

function sortArrayByDate(blogsArray) {
    blogsArray.sort(function (a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
}

//==============================================================================
//==============================================================================

var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var formatYYY_mm_dd = "#year-#month-#day";
var formatDD_mm_YYYY = "#day/#month/#year";

function getCurrentDate(format) {
    var d = new Date();
    return format.replace("#year", d.getFullYear()).replace("#month", months[d.getMonth()]).replace("#day", d.getDate());
}

function getDateGivenFormat(date, format) {
    var d = new Date(date);
    return format.replace("#year", d.getFullYear()).replace("#month", months[d.getMonth()]).replace("#day", d.getDate());
}