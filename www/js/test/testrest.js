$(document).ready(function () {
    addListenerPostBtn();
    addListenerPutBtn();
    addListenerGetBtn();
    addListenerDeleteBtn();

    addListenerLoginBtn();
    addListenerLogoutBtn();
    
    addListenerCheckSessionBtn();
    addListenerGetLoginStatusBtn();
});

//CREATE
function addListenerPostBtn() {

    //CREATE
    $("#post-btn").click(function () {
        STUDENT_REST.create({name: "pontus johansson", pnr: "850131-0737", epost: "pjohansson@gmail.com"}, function (data, textStatus, jqXHR) {
            $('#output').text(JSON.stringify(data, null, 1));
        });
    });
    
    //CREATE
//    $("#post-btn").click(function () {
//        LOGIN_SHEMA_REST.create({pnr: "850131-0737", epost: "gmor@gmail.com",password:"0000",level:"1"}, function (data, textStatus, jqXHR) {
//            $('#output').text(JSON.stringify(data, null, 1));
//        });
//    });
}

function addListenerPutBtn() {

    //UPDATE BY QUERY
    $("#put-btn").click(function () {
        STUDENT_REST.update(_find({name: 'george morge'}), {epost: 'jn@gmail.com', pnr: '450131-0737'}, function (data, textStatus, jqXHR) {
            $('#output').text(JSON.stringify(data, null, 1));
        });
    });

    //UPDATE BY ID
//     $("#put-btn").click(function () {
//        STUDENT_REST.update('588bc5e9f2907a0b608a1f31',{epost: 'doe@gmail.com'}, function (data, textStatus, jqXHR) {
//            $('#output').text(JSON.stringify(data, null, 1));
//        });
//    });
}

//GET
function addListenerGetBtn() {

    //GET ALL
    $("#get-btn").click(function () {
        STUDENT_REST.find('',function (data, textStatus, jqXHR) {
            $('#output').text(JSON.stringify(data, null, 1));
        });
    });

    //GET BY ID
//    $("#get-btn").click(function () {
//        STUDENT_REST.find('588efbc10d75430c98ba4b39', function (data, textStatus, jqXHR) {
//            $('#output').text(JSON.stringify(data, null, 1));
//        });
//    });

    //GET QUERY
//    $("#get-btn").click(function () {
//        STUDENT_REST.find(_find({name:'john doe'}), function (data, textStatus, jqXHR) {
//            $('#output').text(JSON.stringify(data, null, 1));
//        });
//    });

    //GET - SPECIAL QUERY - GET STUDENTS FOR EDUCATION X
//    $("#get-btn").click(function () {
//        STUDENT_REST.find(_findEduStud({name: 'suw18'}), function (data, textStatus, jqXHR) {
//            $('#output').text(JSON.stringify(data, null, 1));
//        });
//    });

    //GET - SPECIAL QUERY - GET BOOKINGS FOR EDUCATION X
//     $("#get-btn").click(function () {
//        BOOKING_REST.find(_findEduBook({name:'suw18'}), function (data, textStatus, jqXHR) {
//            $('#output').text(JSON.stringify(data, null, 1));
//        });
//    });
}


function addListenerDeleteBtn() {
    //DELETE QUERY
    $("#delete-btn").click(function () {
        STUDENT_REST.delete(_find({name: 'george morge'}), function (data, textStatus, jqXHR) {
            $('#output').text(JSON.stringify(data, null, 1));
        });
    });

    //DELETE BY ID
//    $("#delete-btn").click(function () {
//        STUDENT_REST.delete('588bc5e9f2907a0b608a1f31', function (data, textStatus, jqXHR) {
//            $('#output').text(JSON.stringify(data, null, 1));
//        });
//    });
}

function _find(obj) {
    return "find/" + JSON.stringify(obj);
}

function _findEduStud(obj) {
    return "findEduStud/" + JSON.stringify(obj);
}

function _findEduBook(obj) {
    return "findEduBook/" + JSON.stringify(obj);
}

//==============================================================================

function addListenerCheckSessionBtn() {
    //CHECK SESSION
    $("#check-session-btn").click(function () {
        $.getJSON('/checksession',function (data, textStatus, jqXHR){
            $('#output').text(JSON.stringify(data, null, 1));
        });
    });
}

function addListenerLoginBtn() {
    //LOGIN/POST/CREATE
    //pass: 0000 = 60048db7dc9ca2f753b4e5d87f33162844f1210d
    $("#login-btn").click(function () {
        
        LOGIN_REST.create({username: "jdoe@gmail.com", password: "0000"}, function (data, textStatus, jqXHR) {
            $('#output').text(JSON.stringify(data, null, 1));
            if(!data.error){
                console.log("LOGGED IN, ACCESS_LEVEL:" + data.user.level);
            }else{
                console.log("LOGG IN FAILED");
            }
        });
    });
}

function addListenerLogoutBtn() {
    //LOGOUT/DELETE/
    $("#logout-btn").click(function () {
        LOGIN_REST.delete('', function (data, textStatus, jqXHR) {
            $('#output').text(JSON.stringify(data, null, 1));
        });
    });
}

function addListenerGetLoginStatusBtn() {
    //GET STATUS/GET/FIND
    $("#check-session-status-btn").click(function () {
        LOGIN_REST.find('', function (data, textStatus, jqXHR) {
            $('#output').text(JSON.stringify(data, null, 1));           
        });
    });
}
