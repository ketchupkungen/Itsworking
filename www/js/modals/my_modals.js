var PATH = "js/modals/";

//showInputModal("Change button text", "", "md", $(this));
//showInfoModal("Error", "Test", "md", "error");
//showConfirmModal("Erase button?", "Shall the button be removed", "md", $(this),"warning");

function showInfoModal(title, infoMsg, size, type) {
    var modalObj = $.parseHTML(loadTemplate(PATH + "modal_info.html"));
    $(modalObj).find(".modal-title").text(title);
    $(modalObj).find(".modal-body").text(infoMsg);
    //
    if (size === 'sm') {
        $(modalObj).find(".modal-dialog").addClass("modal-sm");
    } else if (size === 'lg') {
        $(modalObj).find(".modal-dialog").addClass("modal-lg");
    }
    //
    //available-types: 'warning','error',
    $(modalObj).find(".modal-header").addClass(type);
    //
    if (exists("#modal-info")) {
        $("#modal-info").remove();
        $("body").append(modalObj);
    } else {
        $("body").append(modalObj);
    }

    $('#modal-info').modal();
}
//------------------------------------------------------------------------------
var INPUT_MODAL_OBJ;

$("html").on('click', '#modal-input-abort-btn', function () {

});

$("html").on('click', '#modal-input-ok-btn', function () {
    var input = $("#modal-input-text").val();
    $(INPUT_MODAL_OBJ).attr("value", input);
//    showInfoModal("INPUT MODAL TEXT", input, "lg");
//    $(INPUT_MODAL_OBJ).text(".....example.....");
});



function showInputModal(title, infoMsg, size, obj) {
    //
    $('body').on('shown.bs.modal', '#gridSystemModalLabel', function () {
        $('#modal-input-text').focus();
    });
    //
    INPUT_MODAL_OBJ = obj;
    //
    var modalObj = $.parseHTML(loadTemplate(PATH + "modal_input.html"));
    $(modalObj).find(".modal-title").text(title);
    $(modalObj).find(".modal-body p").text(infoMsg);
    //
    if (size === 'sm') {
        $(modalObj).find(".modal-dialog").addClass("modal-sm");
    } else if (size === 'lg') {
        $(modalObj).find(".modal-dialog").addClass("modal-lg");
    }
    //
    if (exists("#gridSystemModalLabel")) {
        $("#gridSystemModalLabel").remove();
        $("body").append(modalObj);
    } else {
        $("body").append(modalObj);
    }
    //
    $('#gridSystemModalLabel').modal();
    //
}

//------------------------------------------------------------------------------

$("html").on('click', '#modal-no-btn', function () {
});

$("html").on('click', '#modal-yes-btn', function () {
    $(CONFIRM_MODAL_OBJ).remove();
});

var CONFIRM_MODAL_OBJ;

function showConfirmModal(title, infoMsg, size, obj, type) {
    //
    CONFIRM_MODAL_OBJ = obj;
    //
    var modalObj = $.parseHTML(loadTemplate(PATH + "modal_confirm.html"));
    $(modalObj).find(".modal-title").text(title);
    $(modalObj).find(".modal-body").text(infoMsg);
    //
    if (size === 'sm') {
        $(modalObj).find(".modal-dialog").addClass("modal-sm");
    } else if (size === 'lg') {
        $(modalObj).find(".modal-dialog").addClass("modal-lg");
    }
    //available-types: 'warning','error',
    $(modalObj).find(".modal-header").addClass(type);
    //
    //
    if (exists("#modal_confirm")) {
        $("#modal_confirm").remove();
        $("body").append(modalObj);
    } else {
        $("body").append(modalObj);
    }
    //
    $('#modal-confirm').modal();
    //
}

//------------------------------------------------------------------------------

//function loadTemplate(url) {
//    //
//    var html = $.ajax({
//        url: url,
//        type: "GET",
//        dataType: 'html',
//        async: false
//    }).responseText;
//    //
//    return html;
//}
//
//function exists(selector) {
//    if ($(selector).length) {
//        return true;
//    } else {
//        return false;
//    }
//}