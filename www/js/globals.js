var LOGIN_STATUS = 0; // 0 = logged out, 1 = logged in
var ACCESS_LEVEL = 0; // 1 = student, 2 = teacher, 3 = admin
//
var STUDENT_REST = new REST('student');
var EDUCATION_REST = new REST('edu');
var TEACHERS_REST = new REST('teach');
var BOOKING_REST = new REST('book');
var CLASS_REST = new REST('class');
var LOGIN_SHEMA_REST = new REST('shemalogin'); // make adjustments to the shema, not the login operations
//
var LOGIN_REST = new REST('login'); // FOR THE LOGIN OPERATIONS

function EXAMPLE_LOGIN() {
     //LOGIN/CREATE/POST
    LOGIN_REST.create({username: "gmor@gmail.com", password: "0000"}, function (data, textStatus, jqXHR) {
        if(!data.error){
            LOGIN_STATUS = 1;
            ACCESS_LEVEL = data.user.level;
        }else{
            LOGIN_STATUS = 0;
        }
    });
    
    //LOGOUT/DELETE/
    LOGIN_REST.delete('', function (data, textStatus, jqXHR) {
        LOGIN_STATUS = 0;
        ACCESS_LEVEL = 0;
    });
}

function EXAMPLE_CRUD() {
    //CREATE/POST
    STUDENT_REST.create({name: "pontus johansson", pnr: "850131-0737", epost: "pjohansson@gmail.com"}, function (data, textStatus, jqXHR) {
    });

    //==========================================================================

    //UPDATE/PUT BY QUERY
    STUDENT_REST.update(_find({name: 'george morge'}), {epost: 'jn@gmail.com', pnr: '450131-0737'}, function (data, textStatus, jqXHR) {
    });

    //UPDATE/PUT BY ID
    STUDENT_REST.update('588bc5e9f2907a0b608a1f31', {epost: 'doe@gmail.com'}, function (data, textStatus, jqXHR) {
    });

    //==========================================================================

    //GET ALL
    BOOKING_REST.find('', function (data, textStatus, jqXHR) {       
    });

    //GET BY ID
    STUDENT_REST.find('588bc28d9e001a148cf713b7', function (data, textStatus, jqXHR) {
    });

    //GET BY QUERY
    STUDENT_REST.find(_find({name: 'john doe'}), function (data, textStatus, jqXHR) {
    });

    //GET SPEICEAL QUERY; GET ALL STUDENTS WITH EDUCATION X
    STUDENT_REST.find(_findEduStud({name: 'suw16'}), function (data, textStatus, jqXHR) {
    });
    
    //GET SPEICEAL QUERY; GET ALL BOOKINGS FOR EDUCATION X
    BOOKING_REST.find(_findEduBook({name:'suw18'}), function (data, textStatus, jqXHR) {
    });
 
    //==========================================================================

    //DELETE QUERY
    STUDENT_REST.delete(_find({name: 'george morge'}), function (data, textStatus, jqXHR) {
    });

    //DELETE BY ID
    STUDENT_REST.delete('588bc5e9f2907a0b608a1f31', function (data, textStatus, jqXHR) {
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


