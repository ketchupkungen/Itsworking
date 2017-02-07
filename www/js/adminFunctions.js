
function adminDisplayRooms() {
    $("#content-main").empty();
    var tableTemplate = $(loadTemplate("templates/admin/adminRooms.html"));

    CLASS_REST.find('', function (data, textStatus, jqXHR) {

        data.sort(function (a, b) {
            return parseFloat(a.nr) - parseFloat(b.nr);
        });

        $(data).each(function (index, value) {
            var tr = $('<tr>');
            $(tr).append("<td>" + value.nr + "</td>");
            $(tr).append("<td>" + value.size + "</td>");
            $(tr).append("<td>" + value.projector + "</td>");

            var tdDelete = $("<td>" + "<img src='images/delete.png' class='basic-icon delete-room-icon'>" + "</td>");
            $(tdDelete).data("_id", value._id);
            $(tdDelete).data("tr", tr);
            $(tr).append(tdDelete);

            var tdEdit = $("<td>" + "<img src='images/edit.png' class='basic-icon edit-room-icon'>" + "</td>");
            $(tdEdit).data("_id", value._id);
            $(tr).append(tdEdit);

            $(tableTemplate).find("tbody").append(tr);
        });

        $("#content-main").append(tableTemplate);

    });
}

$(document).ready(function () {
    addEventAdminDeleteIcon();
    addEventAdminEditIcon();
    addEventAdminAddRoomBtn();
    addEventAdminAddRoomSubmitBtn();
});

function addEventAdminAddRoomSubmitBtn() {
    $('body').on("click", "#admin-add-room-submit-btn", function (e) {
        e.preventDefault();
        var nr = $("#admin-room-nr-select option:selected").text();
        var size = $("#admin-room-size-select option:selected").text();
        var projector = $("#admin-room-projector-select option:selected").text();

        var isEditAction = $(this).attr('edit');
        console.log("EditAction:",isEditAction);

        if (isEditAction === 'true') { // update
            CLASS_REST.update(ACT_EDIT_ID, {nr:nr,size:size,projector:projector}, function (data, textStatus, jqXHR) {
                console.log("UPDATE:",data)
                adminDisplayRooms();
            });
        } else { //create
            createInstanse(CLASS_REST, {nr: nr, size: size, projector: projector}, function (ok, data) {
                if (ok) {
                    adminDisplayRooms();
                }
            });
        }

    });
}

function addEventAdminAddRoomBtn() {
    $('body').on("click", "#admin-add-room-btn", function () {
        $('.admin-add-room-form').remove();
        var formTemplate = $(loadTemplate("templates/admin/adminAddRoomForm.html"));
        $(formTemplate).find("#admin-add-room-submit-btn").attr('edit', false);
        $("#content-main").append(formTemplate);
    });
}

var ACT_EDIT_ID;

function addEventAdminEditIcon() {
    $('body').on("click", ".edit-room-icon", function () {
        $('.admin-add-room-form').remove();

        var parent = $(this).parent();
        ACT_EDIT_ID = $(parent).data('_id');

        findById(CLASS_REST, ACT_EDIT_ID, function (data, ok) {
            if (ok) {
                var nr = data.nr;
                var size = data.size;
                var projector = data.projector;
                console.log("EDIT:" + nr + " / " + size + " / " + projector);

                var formTemplate = $(loadTemplate("templates/admin/adminAddRoomForm.html"));

                $(formTemplate).find('#admin-room-nr-select').val('' + nr);
                $(formTemplate).find("#admin-room-size-select").val('' + size);
                $(formTemplate).find("#admin-room-projector-select").val('' + projector);

                $(formTemplate).find("#admin-add-room-submit-btn").attr('edit', true);

                $("#content-main").append(formTemplate);
            }

        });

    });
}

function addEventAdminDeleteIcon() {
    $('body').on("click", ".delete-room-icon", function () {
        var parent = $(this).parent();
        var id = $(parent).data('_id');
        console.log("ID:", id);

        deleteById(CLASS_REST, id, function (ok) {
            if (ok) {
                var row = $(parent).data('tr');
                $(row).remove();
            }
        });
    });
}

