//
var STUDENT_REST = new REST('student');
var EDUCATION_REST = new REST('edu');
var TEACHERS_REST = new REST('teach');
var BOOKING_REST = new REST('book');
var CLASS_REST = new REST('class');
var LOGIN_SHEMA_REST = new REST('shemalogin'); // make adjustments to the shema, not the login operations
var ACCESS_REST = new REST('access');
//
var LOGIN_REST = new REST('login'); // FOR THE LOGIN OPERATIONS -> loginhandler.class.js
//
//
//
var TABLE_TEACHER = new Table(
        'teacher',
        TEACHERS_REST,
        'Administrera lärare',
        '#content-main',
        ['Namn', 'Pnr', 'Epost'],
        ['name', 'pnr', 'epost'],
        {_fields: '', _sort: 'name', _skip: 0, _limit: 10000},
        '_educations',
        {name: 'Education', score: 'Score'}
);

var TABLE_ACCESS = new Table(
        'access',
        ACCESS_REST,
        'Administrera tillgång',
        '#content-main',
        ['Basicroute', 'GET', 'POST', 'PUT', 'DELETE'],
        ['basicroute', 'get_', 'post_', 'put_', 'delete_'],
        {_fields: '', _sort: 'basicroute', _skip: 0, _limit: 10000}
        );
//

function openFirstPage() {
    getAccessLevel(function (level) {
        if (level === 0) {
            logOut();
        } else if (level > 0) {
            loggedIn();
        }
    });
}

function loggedIn() {
    //
    $("body").empty();
    $('body').template('basiclayout', {email: "något@något.com"});
    //
    //
    getAccessLevel(function (level) {
        console.log("ACCESS LEVEL:", level);
        if (level < 3) {
            $('#access-admin-panel').css('display', 'none');
        }
        //
        if (level < 2) {
            $('#access-booking-panel').css('display', 'none');
        }
    });
}


function login(username, password, cb) {
    LOGIN_REST.create({username: username, password: password}, function (data, textStatus, jqXHR) {
        if (!data.error) {
            console.log("LOGIN OK, ACCESS_LEVEL:" + data.user.level);
            cb(true);
        } else {
            cb(false);
        }
    });
}

function logOut(cb) {
    LOGIN_REST.delete('', function (data, textStatus, jqXHR) {
        $("body").empty();
        includeHtml("templates/login.html", "body");
        if (cb) {
            cb(true);
        }
    });
}

function isLoggedIn(cb) {
    LOGIN_REST.find('', function (data, textStatus, jqXHR) {
        if (data.user) {
            cb(true);
        } else {
            cb(false);
        }
    });
}

function getAccessLevel(cb) {
    $.getJSON('/accesslevel', function (level, textStatus, jqXHR) {
        if (level) {
            cb(level);
        } else {
            cb(0);
        }
    });
}

function getUserName(cb) {
    $.getJSON('/username', function (email, textStatus, jqXHR) {
        if (email) {
            cb(email);
        } else {
            cb(false);
        }
    });
}


function EXAMPLE_CRUD() {
    //CREATE/POST
    STUDENT_REST.create({name: "pontus johansson", pnr: "850131-0737", epost: "pjohansson@gmail.com"}, function (data, textStatus, jqXHR) {
    });

    TEACHERS_REST.createRef({primId: teacherId, refId: eduId}, function (data, textStatus, jqXHR) {
    });

    //==========================================================================

    //UPDATE/PUT BY QUERY
    STUDENT_REST.update(_find({name: 'george morge'}), {epost: 'jn@gmail.com', pnr: '450131-0737'}, function (data, textStatus, jqXHR) {
    });

    //UPDATE/PUT BY ID
    STUDENT_REST.update('588bc5e9f2907a0b608a1f31', {epost: 'doe@gmail.com'}, function (data, textStatus, jqXHR) {
    });

    //==========================================================================
    //
    //
    //GET WITH OPTIONS  -- ***************IMPORTANT****************************
    TEACHERS_REST.find(_find({_fields: 'name _id', _sort: 'name', _skip: 0, _limit: 3}), function (data, textStatus, jqXHR) {
    });
    //
    //
    //GET ALL
    STUDENT_REST.find('', function (data, textStatus, jqXHR) {
    });

    //GET BY ID
    STUDENT_REST.find('588bc28d9e001a148cf713b7', function (data, textStatus, jqXHR) {
    });

    //GET BY QUERY
    STUDENT_REST.find(_find({name: 'john doe'}), function (data, textStatus, jqXHR) {
    });

    //GET SPECIAL QUERY; GET ALL STUDENTS WITH EDUCATION X
    STUDENT_REST.find(_findEduStud({name: 'suw16'}), function (data, textStatus, jqXHR) {
    });

    //GET SPECIAL QUERY; GET ALL BOOKINGS FOR EDUCATION X
    BOOKING_REST.find(_findEduBook({name: 'suw18'}), function (data, textStatus, jqXHR) {
    });

    //==========================================================================

    //DELETE QUERY
    STUDENT_REST.delete(_find({name: 'george morge'}), function (data, textStatus, jqXHR) {
    });

    //DELETE BY ID
    STUDENT_REST.delete('588bc5e9f2907a0b608a1f31', function (data, textStatus, jqXHR) {
    });

    //DELETE A TEACHERS ID FROM THE ARRAY OF TEACHERS REFERENSES
    //REMOVE A TEACHER FROM EDUCATION
    EDUCATION_REST.deleteRef('EDU_ID', {ref_id: 'TEACHER_ID'}, function (data, textStatus, jqXHR) {
    });

}

//Simplifies use with 'find/' prefix
function _find(obj) {
    return "find/" + JSON.stringify(obj);
}

function _findEduStud(obj) {
    return "findEduStud/" + JSON.stringify(obj);
}

function _findEduBook(obj) {
    return "findEduBook/" + JSON.stringify(obj);
}


function buildComboAll(rest, cb) {
    rest.find(_find({_fields: '', _sort: 'name', _skip: 0, _limit: 1000}), function (data, textStatus, jqXHR) {
        var select = $('<select></select>');
        $(data).each(function (index, obj) {
            var option = $("<option value=" + obj._id + ">" + obj.name + "</option>");
            $(select).append(option);
        });
        cb(select);
    });
}

function createInstanse(rest, properties, cb) {
    rest.create(properties, function (data, textStatus, jqXHR) {
        if (data) {
            cb(true, data);
        } else {
            cb(false, data);
        }
    });
}

function deleteById(rest, id, cb) {
    rest.delete(id, function (data, textStatus, jqXHR) {
        if (data.ok === 1) {
            cb(true);
        } else {
            cb(false);
        }
    });
}

function findById(rest, id, cb) {
    rest.find(id, function (data, textStatus, jqXHR) {
        if (data) {
            cb(data, true);
        } else {
            cb(data, false);
        }
    });
}


$(document).ready(function () {
    addEventAdminModalPreviewElem();
});

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




