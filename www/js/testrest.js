$(document).ready(function () {
    addListenerPostBtn();
    addListenerPutBtn();
    addListenerGetBtn();
    addListenerDeleteBtn();
});

//CREATE
function addListenerPostBtn() {

    //CREATE
    $("#post-btn").click(function () {
        STUDENT_REST.create({name: "pontus johansson", pnr: "850131-0737", epost: "pjohansson@gmail.com"}, function (data) {
            $('#output').text(JSON.stringify(data, null, 1));
        });
    });
}

function addListenerPutBtn() {

     //UPDATE BY QUERY
     $("#put-btn").click(function () {
        STUDENT_REST.update(_find({name:'george morge'}), {epost: 'jn@gmail.com', pnr: '450131-0737'}, function (data) {
            $('#output').text(JSON.stringify(data, null, 1));
        });
    });
    
     //UPDATE BY ID
//     $("#put-btn").click(function () {
//        STUDENT_REST.update('588bc5e9f2907a0b608a1f31',{epost: 'doe@gmail.com'}, function (data) {
//            $('#output').text(JSON.stringify(data, null, 1));
//        });
//    });
}

//GET
function addListenerGetBtn() {
    
    //GET ALL
    $("#get-btn").click(function () {
        BOOKING_REST.find('',function (data) {
            $('#output').text(JSON.stringify(data, null, 1));
        });
    });

      //GET BY ID
//    $("#get-btn").click(function () {
//        STUDENT_REST.find('588bc28d9e001a148cf713b7', function (data) {
//            $('#output').text(JSON.stringify(data, null, 1));
//        });
//    });
    
      //GET QUERY
//    $("#get-btn").click(function () {
//        STUDENT_REST.find(_find({name:'john doe'}), function (data) {
//            $('#output').text(JSON.stringify(data, null, 1));
//        });
//    });
}


function addListenerDeleteBtn() {
    //DELETE QUERY
//    $("#delete-btn").click(function () {
//        STUDENT_REST.delete(_find({name: 'george morge'}), function (data) {
//            $('#output').text(JSON.stringify(data, null, 1));
//        });
//    });
    
    //DELETE BY ID
    $("#delete-btn").click(function () {
        STUDENT_REST.delete('588bc5e9f2907a0b608a1f31', function (data) {
            $('#output').text(JSON.stringify(data, null, 1));
        });
    });
}

function _find(obj) {
    return "find/" + JSON.stringify(obj);
}

