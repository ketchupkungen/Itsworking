$(document).ready(function () {
    initializeHistoryRouter();

});

$(window).load(function () {
    addScrollTopListener();
});


$.loadTemplates(
        [
            "login",
            "basiclayout",
            "main",
            "booking",
            "search",
            "booked",
            "admin",
            "profile-modal",
            "example-template",
            "bookingForm",
            "userProfile",
            "person-search-results",
            "userProfileForm"
        ]
        , 'templates'
        , function () {
            $(document).ready(go);
        });


$.loadTemplates(
        [
            "adminAddEduForm"
        ]
        , 'templates/admin'
        , function () {
            $(document).ready();
        });


function initializeHistoryRouter() {
    // '/status-link' is a href of <a> tag
    new HistoryRouter({
        '/classroom-admin': function () {
            TABLE_ROOMS.show(true);
//            STUD_EDU_TABLE.show(true);
        },
        '/education-admin': function () {
            adminDisplayEducations();
        },
        '/student-admin': function () {
            adminDisplayStudents();
        },
        '/teacher-admin': function () {
            TABLE_TEACHER.show(true);
        },
        '/access-admin': function () {
            TABLE_ACCESS.show(true);
        },
        '/login-admin': function () {
            TABLE_LOGIN.show(true);
        },
        '/main-link': function () {
            openLink("#content-main", "templates/main.html");
        },
        '/school-link': function () {
            openLink("#content-main", "templates/school.html");
        },
        '/booking-link': function () {
            openLink("#content-main", "templates/booking/booking.html");
            displayBookingRooms();
        },
        '/search-link': function () {
            openLink("#content-main", "templates/search.html");
        },
        '/booked-link': function () {
            openLink("#content-main", "templates/booking/booked.html");
            displayBookedRooms();
        },
        '/admin-link': function () {
            openLink("#content-main", "templates/admin.html");
        },
        '/profile-status-link': function () {
            openLink("#content-main", "templates/profile-modal.html");
        },
        '/profile-link': function () {
            showUserProfile();
        },
        '/thompa': function () {
            openLinkAlternate("#content-main", "example-template", {
                name: "Kalle",
                color: "pink"
            });
        }

    });

    
    function openLink(contentId, templatePath) {
        $(contentId).empty();
        includeHtml(templatePath, contentId);
    }
}


function go() {
    addEventLoginBtn();
    addEventLogOutBtn();
    

    function addEventLogOutBtn() {
        $("body").on("click", "#log-out-btn-one", function (evt) {
            evt.preventDefault();
            logOut();
        });
    }

    function addEventLoginBtn() {
        $("body").on("click", "#login-btn", function (evt) {
            evt.preventDefault();
            var username = $("#inputEmail").val();
            var pass = $("#inputPassword").val();

            login(username, pass, function (status) {
                if (status) {
                    loggedIn();
                } else {
                    $(".wrong-credentials").css("display", "block");
                }
            });
        });
    }
}
