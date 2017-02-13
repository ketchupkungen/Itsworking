$(document).ready(function() {
    displayBookingRooms();
    addEventBookingRoomChangeBtn();
    addEventBookingRoomAddBtn();
    addEventBookingEditIcon();
    addEventBookingRoomDeleteIcon();


});

function displayBookingRooms() {
	$("#content-main").empty();
	var tableTemplate = $(loadTemplate("templates/booking.html"));

	BOOKING_REST.find("", function (data, textStatus, jqXHR) {

		data.sort(function (a, b) {
			return parseFloat(a.nr) - parseFloat(b.nr);
		});

		$(data).each(function (index, value) {
			var tr = $("<tr>");
			$(tr).append("<td>" + value.nr + "</td>");
			$(tr).append("<td>" + value.size + "</td>");
			$(tr).append("<td>" + value.projector + "</td>");

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
		var nr = $("#booking-room-nr-select option:selected").text();
        var size = $("#booking-room-size-select option:selected").text();
        var projector = $("#booking-room-projector-select option:selected").text();

        var isEditAction = $(this).attr('edit');
        console.log("EditAction:", isEditAction);

        if (isEditAction === 'true') { // update
            BOOKING_REST.update(ACT_EDIT_ID, {nr: nr, size: size, projector: projector}, function (data, textStatus, jqXHR) {
                console.log("UPDATE:", data)
                displayBookingRooms();
            });
        } else { //create
            createInstanse(CLASS_REST, {nr: nr, size: size, projector: projector}, function (ok, data) {
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
        var formTemplate = $(loadTemplate("templates/bookingForm.html"));
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
                var nr = data.nr;
                var size = data.size;
                var projector = data.projector;
                console.log("EDIT:" + nr + " / " + size + " / " + projector);

                var formTemplate = $(loadTemplate("templates/bookingForm.html"));

                $(formTemplate).find('#booking-room-nr-select').val('' + nr);
                $(formTemplate).find("#booking-room-size-select").val('' + size);
                $(formTemplate).find("#booking-room-projector-select").val('' + projector);

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
