var PATH = "js/modals/";

//showInputModal("Change button text", "", "md", $(this));
//showInfoModal("Error", "Test", "md", "error");
//showConfirmModal("Erase button?", "Shall the button be removed", "md", $(this),"warning");

function showInfoModal(title, infoMsg, customizedObj, size, type) {
    var modalObj = $.parseHTML(loadTemplate(PATH + "modal_info.html"));
    if(title){
      $(modalObj).find(".modal-title").text(title);  
    }else{
        $(modalObj).find('.modal-header').remove();
    }
    //
    //
    if (customizedObj) {
        $(modalObj).find(".modal-body").empty();
        $(modalObj).find(".modal-body").append(customizedObj);
    } else {
        $(modalObj).find(".modal-body").text(infoMsg);
    }
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
var INPUT_MODAL_CB;

$("html").on('click', '#modal-input-abort-btn', function () {
    INPUT_MODAL_CB(false);
});

$("html").on('click', '#modal-input-ok-btn', function () {
    //
    INPUT_MODAL_CB($('#modal-input'));
});


function showInputModalB(title, infoMsg, customizedObj, size, cb) {
    //
    $('body').on('shown.bs.modal', '#gridSystemModalLabel', function () {
        $('#modal-input-text').focus();
    });
    //
    INPUT_MODAL_CB = cb;
    //
    var modalObj = $.parseHTML(loadTemplate(PATH + "modal_input.html"));
    //
    $(modalObj).find(".modal-title").text(title);
    $(modalObj).find(".modal-body p").text(infoMsg);
    //
    if (customizedObj) {
        $(modalObj).find("#modal-input").append(customizedObj);
        $(modalObj).find('#modal-input-text').remove();
    }
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

var CRUD_TABLE_MODAL_CB;

$("html").on('click', '#modal-crud-table-abort-btn', function () {
    CRUD_TABLE_MODAL_CB(false);
});

$("html").on('click', '#modal-crud-table-ok-btn', function () {
    //
    CRUD_TABLE_MODAL_CB($('#modal-input'));
});

$("html").on('click', '#modal-crud-table-delete-btn', function () {
    CRUD_TABLE_MODAL_CB('delete');
});

function showCrudEditDeleteModal(title, infoMsg, customizedObj, size, cb) {
    //
    $('body').on('shown.bs.modal', '#gridSystemModalLabel', function () {
        $('#modal-input-text').focus();
    });
    //
    CRUD_TABLE_MODAL_CB = cb;
    //
    var modalObj = $.parseHTML(loadTemplate(PATH + "special/modal_crud_table_edit.html"));
    //
    $(modalObj).find(".modal-title").text(title);
    $(modalObj).find(".modal-body p").text(infoMsg);
    //
    if (customizedObj) {
        $(modalObj).find("#modal-input").append(customizedObj);
        $(modalObj).find('#modal-input-text').remove();
    }
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
    CONFIRM_MODAL_CB(false);
});

$("html").on('click', '#modal-yes-btn', function () {
    CONFIRM_MODAL_CB(true);
});

var CONFIRM_MODAL_CB;

function showConfirmModal(title, infoMsg, size, type, cb) {
    //
    CONFIRM_MODAL_CB = cb;
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

/**
 * Automates preview of elements
 * @returns {undefined}
 */
function addEventAdminModalPreviewElem() {
    $('body').on("click", ".admin-modal-preview", function (e) {
        e.stopPropagation();
        var id = $(this).data('_id');
        var rest = $(this).data('rest');
        //
        findById(rest, id, function (data) {
            var cont = $("<div class='admin-modal-auto'></div>");
            //
            $.each(data, function (name, value) {
                if (name.indexOf('_id') >= 0 || name.indexOf('__v') >= 0) {
                    return true;
                }
                //
                if (Array.isArray(value) === false) {
                    var pName = $("<h3>" + name + "</h3>");
                    var pValue = $("<p>" + value + "</p>");
                    $(cont).append(pName);
                    $(cont).append(pValue);
                } else { //is array
                    //Populating...
                    $(value).each(function (index, value_) {
                        //
                        $(cont).append('<hr>');
                        $.each(value_, function (key, val) {
                            //
                            if (Array.isArray(val) || key.indexOf('_id') >= 0 || key.indexOf('__v') >= 0) {
                                return true;
                            }
                            //
                            var pName = $("<h4>" + key + "</h4>");
                            var pValue = $("<p>" + val + "</p>");
                            $(cont).append(pName);
                            $(cont).append(pValue);
                        });
                    });
                    return true;
                }
                //

            });

            showInfoModal('', '', cont);
        });
    });
}



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