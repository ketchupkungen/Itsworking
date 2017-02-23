$(document).ready(function () {
    initializeHistoryRouter();
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
            "person-search-results"
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
            $(document).ready(go);
        });


function initializeHistoryRouter() {
    // '/status-link' is a href of <a> tag
    new HistoryRouter({
        '/classroom-admin': function () {
//            adminDisplayRooms();
            TABLE_ROOMS.test();
            TABLE_ROOMS.show();
        },
        '/education-admin': function () {
            adminDisplayEducations();
        },
        '/student-admin': function () {
            adminDisplayStudents();
        },
        '/teacher-admin': function () {
            TABLE_TEACHER.show();
        },
        '/access-admin': function () {
            TABLE_ACCESS.show();
            
        },
        '/login-admin': function () {
            TABLE_LOGIN.show();
        },
        '/main-link': function () {
            openLink("#content-main", "templates/main.html");
        },
        '/school-link': function () {
            openLink("#content-main", "templates/school.html");
        },
        '/profilemodal': function () {
            $('.overlay').fadeIn(300); // should we have routes for modals ????
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
        '/Profile-link': function () {
            openLink("#content-main", "templates/userProfile.html");
        },
        '/thompa': function () {
            openLinkAlternate("#content-main", "example-template", {
                name: "Kalle",
                color: "pink"
            });
        }

    });

    /*    // Example of rewriting openLink to use Thomas' templating system
     function openLinkAlternate(selector,templateName,data){
     
     
     // wait for the selector / (#content-main) to be available - ugly hack
     // what we should do is add things to dom in the right order
     if($(selector).length === 0){
     setTimeout(()=>{openLinkAlternate(selector,templateName,data)},20);
     }
     
     $(selector).empty().template(templateName,data);
     }
     */
    function openLink(contentId, templatePath) {
        $(contentId).empty();
        includeHtml(templatePath, contentId);
    }
}


function go() {
    addEventLoginBtn();
    addEventLogOutBtn();

    openFirstPage();

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

function initMenuItemClick() {

    // click on menu item
    $('html').on('click', '.navbar-nav li', function (e) {
//        console.log('You selected menu item (object): ', e);

        if (!e.target.id) {
//            console.log('The menu item "' + e.target.text + '" is MISSING an id!!');
        } else {
//            console.log('You selected menu item (id): ', e.target.id);
        }

        var whichTemplate = '';

        if (e.target.id == 'profile-settings') {
            whichTemplate = 'profileContent';
        }

        //!!TODO: add more menu items here


        if (whichTemplate !== '') {
            var htmlTemplate = loadTemplate('layouts/' + whichTemplate + '.html');
            $('.header-title h1').html(e.target.text);
            $('main').html(htmlTemplate);
        }
    });

}
