$(document).ready(function () {
    addEventBookingRoomChangeBtn();
    addEventBookingRoomAddBtn();
    addEventBookingEditIcon();
    addEventBookingRoomDeleteIcon();

    $('body').on('click','#abort-booking',function(e){
        e.preventDefault();
        $('#booking-form').remove();
    });

});

/////////////////////////////////////////////////////////////////////////////////

// The booking system

function displayBookingRooms() {
    $("#content-main").empty();
    var tableTemplate = $(loadTemplate("templates/booking/booking.html"));

    BOOKING_REST.find("", function (data, textStatus, jqXHR) {

        console.log("Data", data);

        $(data).each(function (index, value) {
            var tr = $('<tr class="debug" data-booking-id="' + value._id + '">');
                
                $(tr).append("<td>" + value.classroom + "</td>");
                $(tr).append("<td>" + value.education + "</td>");
                $(tr).append("<td>" + value.name + "</td>");
                $(tr).append("<td>" + value.date + "</td>");
                
                var tdEdit = $("<td>" + "<img src='images/edit.png' class='basic-icon booking-edit-icon'>" + "</td>");
                $(tdEdit).data("_id", value._id);
                $(tr).append(tdEdit);

                var tdDelete = $("<td>" + "<img src='images/delete.png' class='basic-icon booking-delete-icon'>" + "</td>");
                $(tdDelete).data("_id", value._id);
                $(tdDelete).data("tr", tr);
                $(tr).append(tdDelete);
            

            $(tableTemplate).find("tbody").append(tr);
        });

        $("#content-main").append(tableTemplate);

    });

}

function addEventBookingRoomChangeBtn() {
    $('body').on("click", "#booking-change-room-btn", function (e) {
        e.preventDefault();
        var classroom = $("#booking-room-select option:selected").text();
        var education = $("#booking-room-education-select option:selected").text();
        var name = $("#booking-room-teacher-select option:selected").text();
        var date = $("#booking-room-date").val();

        var isEditAction = $(this).attr('edit');
        console.log("EditAction:", isEditAction);

        if (isEditAction === 'true') { // update
            //getUserName(function (name){
            BOOKING_REST.update(ACT_EDIT_ID, {classroom: classroom, education: education, name: name, date: date}, function (data, textStatus, jqXHR) {
                console.log("UPDATE:", data)
                displayBookingRooms();
            });
           
        } else { //create
            console.log("CREATE NEW");
            createInstanse(BOOKING_REST, {classroom: classroom, education: education, name: name, date: date}, function (ok, data) {
                if (ok) {
                    displayBookingRooms();
                }
            });
        }

    });
}

function addEventBookingRoomAddBtn() {
    $('body').on("click", "#booking-add-room-btn", function () {
        $('.booking-add-room-form').remove();

        var formTemplate = $(loadTemplate("templates/booking/bookingForm.html"));

        fillCheckBoxes(formTemplate);

        $("#content-main").append(formTemplate);
    });
}

function fillCheckBoxes(formTemplate){
    EDUCATION_REST.find('', function (data, textStatus, jqXHR) {
           //var educationCheckbox = $('#booking-room-education-select');
           var educationCheckbox = $(formTemplate).find('#booking-room-education-select');
           
            $(data).each(function (index, value) {
                var opt = $("<option value=" + value._id + ">" + value.name + "</option>");
                $(educationCheckbox).append(opt);
            });
            
    });

    TEACHERS_REST.find('', function (data, textStatus, jqXHR) {
       var teacherCheckbox = $('#booking-room-teacher-select');
       
        $(data).each(function (index, value) {
            var opt = $("<option value=" + value._id + ">" + value.name + "</option>");
            $(teacherCheckbox).append(opt);
        });
        
    });

    
}

var ACT_EDIT_ID;

function addEventBookingEditIcon() {
    $('body').on("click", ".booking-edit-icon", function () {
        $('.booking-add-room-form').remove();

        var parent = $(this).parent();
        ACT_EDIT_ID = $(parent).data('_id');

        findById(BOOKING_REST, ACT_EDIT_ID, function (data, ok) {
            if (ok) {
                var classroom = data.classroom;
                var education = data.education;
                var name = data.name;
                var date = data.date;
                console.log("EDIT:" + classroom + " / " + education + " / " + name + " / " + date);

                var formTemplate = $(loadTemplate("templates/booking/bookingForm.html"));

                fillCheckBoxes(formTemplate);

                $(formTemplate).find('#booking-room-select').val(classroom);
                $(formTemplate).find("#booking-room-education-select").val(education);
                $(formTemplate).find("#booking-room-teacher-select").val(name);
                $(formTemplate).find("#booking-room-date").val(date);

                $(formTemplate).find("#booking-change-room-btn").attr('edit', 'true');

                $("#content-main").append(formTemplate);
            }

        });

    });
}

function addEventBookingRoomDeleteIcon() {
    $('body').on("click", ".booking-delete-icon", function () {
        $('.booking-add-room-form').remove();

        var parent = $(this).parent();
        var id = $(parent).data('_id');
        console.log("ID:", id);

        deleteById(BOOKING_REST, id, function (ok) {
            if (ok) {
                var row = $(parent).data('tr');
                $(row).remove();
            }
        });
    });
}


////////////////////////////////////////////////////////////////////////////////

//Shows booked rooms in booked

function displayBookedRooms() {
    $("#content-main").empty();
    var tableTemplate = $(loadTemplate("templates/booking/booked.html"));

    BOOKING_REST.find("", function (data, textStatus, jqXHR) {

        $(data).each(function (index, value) {
            var tr = $("<tr>");
            $(tr).append("<td>" + value.classroom + "</td>");
            $(tr).append("<td>" + value.education + "</td>");
            $(tr).append("<td>" + value.name + "</td>");
            $(tr).append("<td>" + value.date + "</td>");  //+ value.date +


            $(tableTemplate).find("tbody").append(tr);
        });

        $("#content-main").append(tableTemplate);

    });

}
