$(document).ready(function () {
    addListenerPostBtn();
    addListenerPutBtn();
    addListenerGetBtn();
    addListenerDeleteBtn();
});

//CREATE
function addListenerPostBtn() {
    $("#post-btn").click(function () {
        $.ajax({
            async: true,
            type: "POST",
            dataType: "json",
            url: "http://localhost:3000/rest/student",
            data: {name: "pontus johansson", pnr: "850131-0737", epost: "pjohansson@gmail.com"},
            success: function (data, textStatus, jqXHR) {
                $('#output').text(JSON.stringify(data,null,1));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Send message failed");
            }
        });
    });
}

//UPDATE MULTI
function addListenerPutBtn() {
    $("#put-btn").click(function () {
        $.ajax({
            async: true,
            type: "PUT",
            url: "http://localhost:3000/rest/student/find/{epost:'jdoe@gmail.com'}",
            data: {name: "jonny doue", pnr: "750121-9632"},
            success: function (data, textStatus, jqXHR) {
                $('#output').text(JSON.stringify(data,null,1));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Send message failed");
            }
        });
    });
}

//GET
function addListenerGetBtn() {
    $("#get-btn").click(function () {
        $.ajax({
            async: true,
            type: "GET",
              url: "http://localhost:3000/rest/book",
//            url: "http://localhost:3000/rest/student",
//            url: "http://localhost:3000/rest/student/find/{epost:'jdoe@gmail.com'}",
            success: function (data, textStatus, jqXHR) {
                $('#output').text(JSON.stringify(data,null,1));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Send message failed");
            }
        });
   });
}


//DELETE MULTI
function addListenerDeleteBtn() {
    $("#delete-btn").click(function () {
        $.ajax({
            async: true,
            type: "DELETE",
            url: "http://localhost:3000/rest/student/find/{epost:'jdoe@gmail.com'}",
            success: function (data, textStatus, jqXHR) {
                $('#output').text(JSON.stringify(data,null,1));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Send message failed");
            }
        });
    });
}

