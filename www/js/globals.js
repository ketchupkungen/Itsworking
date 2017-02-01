var STUDENT_REST = new REST('student');
var EDUCATION_REST = new REST('edu');
var TEACHERS_REST = new REST('teach');
var BOOKING_REST = new REST('book');
var CLASS_REST = new REST('class');
var LOGIN_SHEMA_REST = new REST('shemalogin'); // make adjustments to the shema, not the login operations
//
var LOGIN_REST = new REST('login'); // FOR THE LOGIN OPERATIONS

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

function EXAMPLE() {
    //CREATE/POST
    STUDENT_REST.create({name: "pontus johansson", pnr: "850131-0737", epost: "pjohansson@gmail.com"}, function (data) {
    });

    //==========================================================================

    //UPDATE/PUT BY QUERY
    STUDENT_REST.update(_find({name: 'george morge'}), {epost: 'jn@gmail.com', pnr: '450131-0737'}, function (data) {
    });

    //UPDATE/PUT BY ID
    STUDENT_REST.update('588bc5e9f2907a0b608a1f31', {epost: 'doe@gmail.com'}, function (data) {
    });

    //==========================================================================

    //GET ALL
    BOOKING_REST.find('', function (data) {       
    });

    //GET BY ID
    STUDENT_REST.find('588bc28d9e001a148cf713b7', function (data) {
    });

    //GET BY QUERY
    STUDENT_REST.find(_find({name: 'john doe'}), function (data) {
    });

    //GET SPEICEAL QUERY; GET ALL STUDENTS WITH EDUCATION X
    STUDENT_REST.find(_findEduStud({name: 'suw16'}), function (data) {
    });
    
    //GET SPEICEAL QUERY; GET ALL BOOKINGS FOR EDUCATION X
    BOOKING_REST.find(_findEduBook({name:'suw18'}), function (data) {
    });
 
    //==========================================================================

    //DELETE QUERY
    STUDENT_REST.delete(_find({name: 'george morge'}), function (data) {
    });

    //DELETE BY ID
    STUDENT_REST.delete('588bc5e9f2907a0b608a1f31', function (data) {
    });

}

function EXAMPLE_LOGIN() {
     //LOGIN/CREATE/POST
    LOGIN_REST.create({username: "gmor@gmail.com", password: "0000"}, function (data) {
    });
}
