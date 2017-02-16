$(document).ready(function () {
    addEventAdminDeleteIcon();
    addEventAdminEditIcon();
    addEventAdminAddRoomBtn();
    addEventAdminAddRoomSubmitBtn();
    //
    //
    addEventAdminDeleteTeacherIcon();
    addEventAdminAddTeacher();
    //
    addEventAdminAddEduBtn();
    addEventAdminEditEduIcon();
    addEventAdminDeleteEduIcon();
    addEventAdminEduSubmitBtn();
    //
    addEventAdminAddLoginIcon();
    addEventDeleteEduRefStud();
    addEventAddEduRefStud();
    addEventDeleteStud();
});

//==============================================================================

function adminDisplayStudents() {
    $("#content-main").empty();
    var tableTemplate = $(loadTemplate("templates/admin/adminStudents.html"));

    STUDENT_REST.find(_find({_fields: '', _sort: 'name', _skip: 0, _limit: 50}), function (data, textStatus, jqXHR) {
        $(data).each(function (index, value) {
            var TR = $('<tr>');
            var td_name = $("<td>" + value.name + "</td>")
            $(TR).append(td_name);
            //
            hasLogin(value, td_name);
            //
            if (value._education) {
                var td_edu = $("<td>" + "<a class='admin-modal-preview'>" + value._education.name + "</a>" + "</td>");
                $(td_edu).append("<img src='images/delete.png' class='basic-icon admin-delete-edu-ref-stud'>");
                //
                $(td_edu).find('.admin-modal-preview').data('_id', value._education._id);
                $(td_edu).find('.admin-modal-preview').data('rest', EDUCATION_REST);
                //
                $(td_edu).find('.admin-delete-edu-ref-stud').data('_id', value._id);
                $(td_edu).find('.admin-delete-edu-ref-stud').data('ref', value._education._id);
                $(TR).append(td_edu);
            } else {
                var td_edu = $("<td><img src='images/add.png' class='basic-icon admin-add-edu-ref-stud'></td>");
                $(td_edu).find('.admin-add-edu-ref-stud').data("_id", value._id);
                $(TR).append(td_edu);
            }
            //
            $(TR).append("<td>" + value.epost + "</td>");
            $(TR).append("<td>" + value.pnr + "</td>");
            //
            $(TR).append("<td><img src='images/delete.png' class='basic-icon admin-delete-stud'></td>");
            $(TR).find('.admin-delete-stud').data('_id', value._id);
            $(TR).append("<td><img src='images/edit.png' class='basic-icon admin-edit-stud'></td>");
            //
            $(tableTemplate).find('tbody').append(TR);
        });
        //
        $('#content-main').append(tableTemplate);

    });
}

function addEventDeleteStud() {
    $('body').on("click", '.admin-delete-stud', function (e) {
        var stud_id = $(this).data('_id');
        showConfirmModal("Radera?", "Bekräfta handling", 'sm', 'error', (yes) => {
            if (!yes) {
                return;
            }
            deleteById(STUDENT_REST, stud_id, function () {
                adminDisplayStudents();
            });
        });
    });
}

//ADD EDU REF STUD 
function addEventAddEduRefStud() {
    $('body').on("click", '.admin-add-edu-ref-stud', function (e) {
        //
        var studId = $(this).data('_id');
        //
        buildComboAll(EDUCATION_REST, function (comboBox) {
            showInputModalB("Läggtill utb.", "Välj utb.", comboBox, 'sm', function (modalInput) {
                if (modalInput === false) {
                    return;
                }
                //
                var educationId = $(comboBox).val();
                STUDENT_REST.createRef({primId: studId, refId: educationId}, function (data) {
                    adminDisplayStudents();
                });
            });
        });
    });
}

//DELETE EDU REF STUD 
function addEventDeleteEduRefStud() {
    $('body').on("click", '.admin-delete-edu-ref-stud', function (e) {
        var stud_id = $(this).data('_id');
        var edu_id = $(this).data('ref');

        STUDENT_REST.deleteRef(stud_id, {ref_id: edu_id}, function (data, textStatus, jqXHR) {
            if (data.status) {
                adminDisplayStudents();
            }
        });

    });
}

function hasLogin(pers, td) {
    LOGIN_SHEMA_REST.find(_find({epost: pers.epost}), function (data) {

        var value = data[0];
        if (value) {
            $(td).append("<img src='images/key-" + value.level + ".png' class='basic-icon admin-modal-preview'>");
            $(td).append("<img src='images/edit.png' class='basic-icon admin-edit-login'>");
            $(td).find('.admin-edit-login').data('person', pers);
            $(td).find('.admin-edit-login').data('edit', true);
            $(td).find('.admin-edit-login').data('level', value.level);
            //
            $(td).find('.admin-modal-preview').data('_id', value._id);
            $(td).find('.admin-modal-preview').data('rest', LOGIN_SHEMA_REST);
        } else {
            $(td).append("<img src='images/key-add.png' class='basic-icon admin-add-login-icon'>");
            $(td).find('.admin-add-login-icon').data('person', pers);
        }
    });
}

function addEventAdminAddLoginIcon() {
    $('body').on("click", '.admin-add-login-icon, .admin-edit-login', function (e) {
        var person = $(this).data('person');
        var edit = $(this).data('edit');
        var level = $(this).data('level');
        //
        var template = $(loadTemplate('templates/admin/other/adminAddLoginForm.html'));
        //
        if (edit) {
            $(template).find('#form-group-pass').append("<label><input type='checkbox' id='cboxpass'>ändra lösenord</label>");
            $(template).find('#admin-login-level').val('' + level);
        }
        //
        $(template).find('#admin-login-name').val(person.name);
        $(template).find('#admin-login-pass').val(generatePassword());
        //
        $(template).find('#admin-add-login-submit-btn').data('person', person);
        $(template).find('#admin-add-login-submit-btn').data('template', template);
        $(template).find('#admin-add-login-submit-btn').data('edit', edit);
        //
        showInfoModal(edit ? 'Edit login' : 'Create login', '', template, 'sm');
    });

    $('body').on("click", '#admin-add-login-submit-btn', function (e) {
        e.preventDefault();
        //
        var edit = $(this).data('edit');
        var per = $(this).data('person');
        var template = $($(this).data('template'));
        //
        var pass = $('#admin-login-pass').val();
        var level = $('#admin-login-level').val();
        //
        if (edit) {
            var updatePass = isChecked("#cboxpass");
            LOGIN_SHEMA_REST.update(_find({epost: per.epost}), !updatePass ? {level: level} : {level: level, password: pass}, function (data, textStatus, jqXHR) {
                showStatus(data, template);
            });
        } else {
            LOGIN_SHEMA_REST.create({pnr: per.pnr, epost: per.epost, password: pass, level: level}, function (data, textStatus, jqXHR) {
                showStatus(data, template);
            });
        }
    });

    function showStatus(data, template) {
        if (data) {
            $(template).find('.status').addClass('ok');
            $(template).find('.status').text('Status: OK');
            //
            adminDisplayStudents();
            //
        } else {
            $(template).find('.status').addClass('failed');
            $(template).find('.status').text('Status: failed');
        }
    }
}


//==============================================================================
//==============================================================================

function adminDisplayEducations() {
    $("#content-main").empty();
    var tableTemplate = $(loadTemplate("templates/admin/adminEducations.html"));

    var vals = [];

    EDUCATION_REST.find('', function (data, textStatus, jqXHR) {
        $(data).each(function (index, value) {
            var tr = $('<tr>');
            var td_a = $("<td><a class='admin-modal-preview'>" + value.name + "</a></td>");
            $(td_a).find(".admin-modal-preview").data('_id', value._id);
            $(td_a).find(".admin-modal-preview").data('rest', EDUCATION_REST);
            $(tr).append(td_a);
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
                var tdT = $("<td></td>");
                var _a = $("<a class='admin-modal-preview'>" + teacher.name + "</a>");
                $(_a).data('_id', teacher._id);
                $(_a).data('rest', TEACHERS_REST);
                $(tdT).append(_a);
                //
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
        var th = $('<th>L.till</th>');
        $(tableTemplate).find("thead tr").append(th);
        //
        $("#content-main").append(tableTemplate);

    });
}

//SUBMIT ADD/UPDATE
function addEventAdminEduSubmitBtn() {
    $('body').on("click", "#admin-edu-submit-btn", function (e) {
        e.preventDefault();
        var isUpdate = $(this).data('update');

        var name = $("#education-name").val();
        var score = $("#education-score").val();
        var info = $("#education-info").val();

        if (isUpdate) {
            EDUCATION_REST.update(ACT_EDIT_ID, {name: name, score: score, info: info}, function (data, textStatus, jqXHR) {
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

//ADD FORM
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

function addEventAdminAddTeacher() {
    $('body').on('click', '.add-teacher-icon', function (e) {
        var parent = $(this).parent();
        var eduId = $(parent).data('_id');

        buildComboAll(TEACHERS_REST, function (comboBox) {

            showInputModalB("Add Teacher", "Choose teacher", comboBox, 'sm', function (modalInput) {
                //
                if (modalInput === false) {
                    return;
                }
                //
                var teacherId = $(comboBox).val();
                EDUCATION_REST.createRef({primId: eduId, refId: teacherId}, function (data, textStatus, jqXHR) {
                    //
                    TEACHERS_REST.createRef({primId: teacherId, refId: eduId}, function (data, textStatus, jqXHR) {
                        adminDisplayEducations();
                    });
                });
            });

        });

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

