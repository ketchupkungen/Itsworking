$(document).ready(function () {
    addEventAdminDeleteIcon();
    addEventAdminEditIcon();
    addEventAdminAddRoomBtn();
    addEventAdminAddRoomSubmitBtn();
    //
    addEventAdminDeleteTeacherIcon();
    addEventAdminAddTeacher();
    //
    addEventAdminAddEduBtn();
    addEventAdminEditEduIcon();
    addEventAdminDeleteEduIcon();
    addEventAdminEduSubmitBtn();
});

function addEventAdminEduSubmitBtn() {
    $('body').on("click", "#admin-edu-submit-btn", function (e) {
        e.preventDefault();
        var isUpdate = $(this).data('update');

        var name = $("#education-name").val();
        var score = $("#education-score").val();
        var info = $("#education-info").val();

        if (isUpdate) {
            EDUCATION_REST.update(ACT_EDIT_ID, {name: name, score: score, info: info}, function (data, textStatus, jqXHR) {
                console.log("UPDATE:", data)
                adminDisplayEducations();
            });
        } else {
            createInstanse(EDUCATION_REST, {name: name, score: score, info: info}, function (ok, data) {
                if (ok) {
                    adminDisplayEducations();
                }
            });
        }

    });
}

//EDIT
function addEventAdminEditEduIcon() {
    $('body').on("click", ".edit-edu-icon", function () {
        $('.admin-add-edu-form').remove();
        var parent = $(this).parent();
        var edu_id = $(parent).data("_id");
        ACT_EDIT_ID = edu_id;

        findById(EDUCATION_REST, edu_id, function (data) {
            $('#content-main').template('adminAddEduForm', {name: data.name, info: data.info, score: data.score});
            $('#admin-edu-submit-btn').data('update', true);
        });
    });
}

//ADD
function addEventAdminAddEduBtn() {
    $('body').on("click", "#admin-add-edu-btn", function () {
        $('.admin-add-edu-form').remove();
        $('#content-main').template('adminAddEduForm', {name: '', info: '', score: ''});
    });
}

//DELETE
function addEventAdminDeleteEduIcon() {
    $('body').on("click", ".delete-edu-icon", function () {
        showConfirmModal("Radera?", "Bekräfta handling", 'sm', 'error', (yes) => {
            if (!yes) {
                return;
            }
            //
            var parent = $(this).parent();
            var edu_id = $(parent).data("_id");
            //
            deleteById(EDUCATION_REST, edu_id, function (data, ok) {
                adminDisplayEducations();
            });
            //
        });
    });
}

function adminDisplayEducations() {
    $("#content-main").empty();
    var tableTemplate = $(loadTemplate("templates/admin/adminEducations.html"));

    var vals = [];

    EDUCATION_REST.find('', function (data, textStatus, jqXHR) {
        $(data).each(function (index, value) {
            var tr = $('<tr>');
            $(tr).append("<td>" + value.name + "</td>");
            $(tr).append("<td>" + value.score + "</td>");

            var tdDelete = $("<td>" + "<img src='images/delete.png' class='basic-icon delete-edu-icon'>" + "</td>");
            $(tdDelete).data("_id", value._id);
            $(tdDelete).data("tr", tr);
            $(tr).append(tdDelete);

            var tdEdit = $("<td>" + "<img src='images/edit.png' class='basic-icon edit-edu-icon'>" + "</td>");
            $(tdEdit).data("_id", value._id);
            $(tr).append(tdEdit);
            //
            $(value._teachers).each(function (index, teacher) {
                //
                var tdT = $("<td>" + teacher.name + "</td>");
                var imgDel = $("<img src='images/delete.png' class='basic-icon delete-teacher-icon'>");
                $(imgDel).data("teacher_id", teacher._id);
                $(imgDel).data("edu_id", value._id);
                $(tdT).append(imgDel);
                $(tr).append(tdT);
                //
                if (vals.indexOf(index) === -1) {
                    vals.push(index);
                    var th = $('<th>Teacher ' + (index + 1) + '</th>');
                    $(tableTemplate).find("thead tr").append(th);
                }
                //
            });
            //
            var tdAddTeacher = $("<td>" + "<img src='images/add-user.png' class='basic-icon add-teacher-icon'>" + "</td>");
            $(tdAddTeacher).data("_id", value._id);
            $(tr).append(tdAddTeacher);
            //
            //
            $(tableTemplate).find("tbody").append(tr);
        });
        //
        var th = $('<th>Add</th>');
        $(tableTemplate).find("thead tr").append(th);
        //
        $("#content-main").append(tableTemplate);

    });
}


function addEventAdminAddTeacher() {
    $('body').on('click', '.add-teacher-icon', function (e) {
        var parent = $(this).parent();
        var eduId = $(parent).data('_id');

        buildTeachersCombo(function (comboBox) {

            showInputModalB("Add Teacher", "Choose teacher", comboBox, 'sm', function (modalInput) {
                var teacherId = $(comboBox).val();
                EDUCATION_REST.createRef({primId: eduId, refId: teacherId}, function (data, textStatus, jqXHR) {
                    console.log("add teacher -> edu", data);
                    TEACHERS_REST.createRef({primId: teacherId, refId: eduId}, function (data, textStatus, jqXHR) {
                        console.log("add edu -> teacher", data);
                        adminDisplayEducations();
                    });
                });
            });

        });

    });
}

function buildTeachersCombo(cb) {

    TEACHERS_REST.find('', function (data, textStatus, jqXHR) {
        var select = $('<select></select>');
        $(data).each(function (index, t) {
            var option = $("<option value=" + t._id + ">" + t.name + "</option>");
            $(select).append(option);
        });
        cb(select);
    });
}


function addEventAdminDeleteTeacherIcon() {
    $('body').on("click", ".delete-teacher-icon", function () {
        var teacher_id = $(this).data('teacher_id');
        var edu_id = $(this).data('edu_id');

        EDUCATION_REST.deleteRef(edu_id, {ref_id: teacher_id}, function (data, textStatus, jqXHR) {
            if (data.status === true) {
                console.log("DELETE TEACHER REF OK: " + data.id);
                TEACHERS_REST.deleteRef(teacher_id, {ref_id: edu_id}, function (data) {
                    if (data.status === true) {
                        console.log("DELETE EDU REF OK: " + data.id);
                        adminDisplayEducations();
                    }
                });
            }
        });
    });
}

//==============================================================================


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


function addEventAdminAddRoomSubmitBtn() {
    $('body').on("click", "#admin-add-room-submit-btn", function (e) {
        e.preventDefault();
        var nr = $("#admin-room-nr-select option:selected").text();
        var size = $("#admin-room-size-select option:selected").text();
        var projector = $("#admin-room-projector-select option:selected").text();

        var isEditAction = $(this).attr('edit');
        console.log("EditAction:", isEditAction);

        if (isEditAction === 'true') { // update
            CLASS_REST.update(ACT_EDIT_ID, {nr: nr, size: size, projector: projector}, function (data, textStatus, jqXHR) {
                console.log("UPDATE:", data)
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
        $('.admin-add-room-form').remove();

        var parent = $(this).parent();
        var id = $(parent).data('_id');
        console.log("ID:", id);

        showConfirmModal("Radera?", "Bekräfta handling", 'sm', 'error', (yes) => {
            if (!yes) {
                return;
            }
            deleteById(CLASS_REST, id, function (ok) {
                if (ok) {
                    var row = $(parent).data('tr');
                    $(row).remove();
                }
            });
        });
    });
}

