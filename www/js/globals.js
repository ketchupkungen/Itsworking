console.log = function() {};
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
var BOOKING_TABLE_CLASS;
var TABLE_ROOMS;
var TABLE_TEACHER;
var TABLE_ACCESS;
var TABLE_LOGIN;
//
$(document).ready(function () {
    openFirstPage();
});
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
//
function loggedIn() {
    //
    $("body").empty();
    $('body').template('basiclayout', {email: "något@något.com"});
    //
    setWelcomeTitle();
    //
    getAccessLevel(function (level) {
        console.log("ACCESS LEVEL:", level);

        show();

        if (level < 3) {
            $('#access-admin-panel').css('display', 'none');
        }
        //
        if (level < 2) {
            $('#access-booking-panel').css('display', 'none');
        }
    });
}

function setWelcomeTitle() {

    getLoggedInUserName(function (name) {
        console.log("NAMEEE",name);
        var wt = $('#welcome');
        name ? $(wt).text("Välkommen " + name) : undefined;
    });

}

//
function show() {
    getAccessLevel(function (level) {
        if (level === 1) {//|| level === 3
            showStudentInfo();
        }
        //
        if (level === 2) {
            displayBookedRooms();
        }
        //
        if (level === 3) {
            createTablesAdmin();
            TABLE_ACCESS.show(true);
        }
    });
}
//


function showStudentInfo() {
    getLoggedInEducation(function (actEdu) {
        console.log("act edu:", actEdu);
        var BOOKING_TABLE_CLASS = new Table(
                'booking',
                false,
                BOOKING_REST,
                'Din klass idag',
                '#start-page-content-b', //start-page-content-b
                ['Utb.', 'Datum', 'Klass'],
                ['education', 'date', 'classroom'],
                {education: actEdu, _fields: '', _sort: '-date', _skip: 0, _limit: 1}
        );
        BOOKING_TABLE_CLASS.setShowAlwaysInvert();
        BOOKING_TABLE_CLASS.show(true);
    });

    setTimeout(function () {
        getLoggedInEducation(function (actEdu) {
            var STUD_EDU_TABLE = new Table(
                    'studedu',
                    false,
                    STUDENT_REST,
                    'Dina klasskamrater',
                    '#start-page-content-a', //start-page-content-b
                    ['Namn', 'epost'],
                    ['name', 'epost'],
                    {_fields: '', _sort: '', _skip: 0, _limit: 1}
            );
            STUD_EDU_TABLE.setSpecialUrl(_findEduStud({name: actEdu}));
            STUD_EDU_TABLE.setShowAlwaysInvert();
            STUD_EDU_TABLE.show(true);
        });
    }, 100);

    setTimeout(function () {
        getLoggedInEducation(function (actEdu) {
            var TEACH_EDU_TABLE = new Table(
                    'teachedu',
                    false,
                    TEACHERS_REST,
                    'Dina lärare',
                    '#start-page-content-c',
                    ['Namn', 'epost'],
                    ['name', 'epost'],
                    {_fields: '', _sort: '', _skip: 0, _limit: 1}
            );
            TEACH_EDU_TABLE.setSpecialUrl(_findEduTeach({name: actEdu}));
            TEACH_EDU_TABLE.setShowAlwaysInvert();
            TEACH_EDU_TABLE.show(true);
        });
    }, 500);

}

function createTablesAdmin() {
    TABLE_ROOMS = new Table(
            'classes',
            true,
            CLASS_REST,
            'Administrera Klassrum',
            '#content-main',
            ['Nr', 'Storlek', 'Projektor'],
            ['nr', 'size', 'projector'],
            {_fields: '', _sort: 'nr', _skip: 0, _limit: 10000}
    );
//
//Adding 'select' options
    TABLE_ROOMS.addSelectOptions(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], 'nr');
    TABLE_ROOMS.addSelectOptionsRest(CLASS_REST, {_fields: 'size', _sort: 'size', _skip: 0, _limit: 10}, 'size');
    TABLE_ROOMS.addSelectOptions(['true', 'false'], 'projector');
//    TABLE_ROOMS.setShowAlwaysInvert();
//
//
    TABLE_TEACHER = new Table(
            'teacher',
            true,
            TEACHERS_REST,
            'Administrera lärare',
            '#content-main',
            ['Namn', 'Pnr', 'Epost'],
            ['name', 'pnr', 'epost'],
            {_fields: '', _sort: 'name', _skip: 0, _limit: 15},
            'name',
            '_educations',
            {name: 'Education', score: 'Score'},
            {name: EDUCATION_REST}
    );

    TABLE_ACCESS = new Table(
            'access',
            true,
            ACCESS_REST,
            'Administrera tillgång',
            '#content-main',
            ['Basicroute', 'GET', 'POST', 'PUT', 'DELETE'],
            ['basicroute', 'get_', 'post_', 'put_', 'delete_'],
            {_fields: '', _sort: 'basicroute', _skip: 0, _limit: 15},
            'basicroute'
            );
//
    TABLE_ACCESS.addSelectOptions(['0', '1', '2', '3'], 'get_');
    TABLE_ACCESS.addSelectOptions(['0', '1', '2', '3'], 'post_');
    TABLE_ACCESS.addSelectOptions(['0', '1', '2', '3'], 'put_');
    TABLE_ACCESS.addSelectOptions(['0', '1', '2', '3'], 'delete_');
//
//
    TABLE_LOGIN = new Table(
            'login',
            true,
            LOGIN_SHEMA_REST,
            'Administrera inloggningar',
            '#content-main',
            ['Pnr', 'Epost', 'Nivå', 'Lösenord'],
            ['pnr', 'epost', 'level', 'password'],
            {_fields: '', _sort: 'level', _skip: 0, _limit: 15},
            'pnr'
            );
//
    TABLE_LOGIN.addSelectOptions(['0', '1', '2', '3'], 'level');
//
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

function getUserEmail(cb) {
    $.getJSON('/useremail', function (username, textStatus, jqXHR) {
        if (username) {
            cb(username);
        } else {
            cb(false);
        }
    });
}

/**
 * .pnr, 
 * @param {type} cb
 * @returns {undefined}
 */
function getLoggedInUser(cb) {
    $.getJSON('/loggedIn', function (loggedInUser, textStatus, jqXHR) {
        if (loggedInUser) {
            cb(loggedInUser);
        } else {
            cb(false);
        }
    });
}

function getLoggedInUserName(cb) {
    getLoggedInUser(function (user) {
        STUDENT_REST.find(_find({pnr: user.pnr}), function (data, textStatus, jqXHR) {
            data[0] ? cb(data[0].name) : false;
        });

        TEACHERS_REST.find(_find({pnr: user.pnr}), function (data, textStatus, jqXHR) {
            data[0] ? cb(data[0].name) : false;
        });
    });
}

function getLoggedInEducation(cb) {
    getLoggedInUser(function (user) {
        STUDENT_REST.find(_find({pnr: user.pnr}), function (data, textStatus, jqXHR) {
            if (data[0]) {
                cb(data[0]._education.name);
            }
        });

        TEACHERS_REST.find(_find({pnr: user.pnr}), function (data, textStatus, jqXHR) {
            if (data[0]) {
                cb(data[0]._educations); // OBS! här får du tillbaka en array
            }
        });
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

function _findEduTeach(obj) {
    return "findEduTeach/" + JSON.stringify(obj);
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
            var option = $('<option value="' + obj._id + '">' + obj.name + "</option>");
            $(select).append(option);
        });
        cb(select);
    });
}

function buildComboFromArr(arr, cb) {
    var select = $('<select></select>');
    $(arr).each(function (index, item) {
        var option = $('<option value="' + item + '">' + item + "</option>");
        $(select).append(option);
    });
    cb(select);
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






