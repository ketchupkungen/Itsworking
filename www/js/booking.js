$(document).ready(function() {
    displayBookingRooms();
    addEventBookingRoomChangeBtn();
    addEventBookingRoomAddBtn();
    addEventBookingEditIcon();
    addEventBookingRoomDeleteIcon();
    //
    displayBookedRooms();


});

function displayBookingRooms() {
	$("#content-main").empty();
	var tableTemplate = $(loadTemplate("templates/booking/booking.html"));

	BOOKING_REST.find("", function (data, textStatus, jqXHR) {

		data.sort(function (a, b) {
			return parseFloat(a.nr) - parseFloat(b.nr);
		});

		$(data).each(function (index, value) {
			var tr = $("<tr>");
			$(tr).append("<td>" + value.room + "</td>");
			$(tr).append("<td>" + value.education + "</td>");
			$(tr).append("<td>" + value.teacher + "</td>");
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
		var room = $("#booking-room-select option:selected").text();
        var education = $("#booking-room-education-select option:selected").text();
        var teacher = $("#booking-room-teacher-select option:selected").text();
        var date = $("#booking-room-date-select option:selected").text();

        var isEditAction = $(this).attr('edit');
        console.log("EditAction:", isEditAction);

        if (isEditAction === 'true') { // update
            BOOKING_REST.update(ACT_EDIT_ID, {room: room, education: education, teacher: teacher, date:  date}, function (data, textStatus, jqXHR) {
                console.log("UPDATE:", data)
                displayBookingRooms();
            });
        } else { //create
            createInstanse(BOOKING_REST, {room: room, education: education, teacher: teacher, date:  date}, function (ok, data) {
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
        $(formTemplate).find("#booking-change-btn").attr('edit', false);
        $("#content-main").append(formTemplate);
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
                var room = data.room;
                var education = data.education;
                var teacher = data.teacher;
                var date = data.date;
                console.log("EDIT:" + room + " / " + education + " / " + teacher + " / " + date);

                var formTemplate = $(loadTemplate("templates/booking/bookingForm.html"));

                $(formTemplate).find('#booking-room-select').val('' + room);
                $(formTemplate).find("#booking-room-education-select").val('' + education);
                $(formTemplate).find("#booking-room-teacher-select").val('' + teacher);
                $(formTemplate).find("#booking-room-date-select").val('' + date);

                $(formTemplate).find("#booking-change-btn").attr('edit', true);

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

function displayBookedRooms() {
    $("#content-main").empty();
    var tableTemplate = $(loadTemplate("templates/booking/booked.html"));

    BOOKING_REST.find("", function (data, textStatus, jqXHR) {

        data.sort(function (a, b) {
            return parseFloat(a.nr) - parseFloat(b.nr);
        });

        $(data).each(function (index, value) {
            var tr = $("<tr>");
            $(tr).append("<td>" + value.room + "</td>");
            $(tr).append("<td>" + value.education + "</td>");
            $(tr).append("<td>" + value.teacher + "</td>");
            $(tr).append("<td>" + value.date + "</td>");


            $(tableTemplate).find("tbody").append(tr);
        });

        $("#content-main").append(tableTemplate);

    });

}