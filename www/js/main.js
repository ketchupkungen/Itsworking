$(document).ready(function () {
    initializeHistoryRouter();
});


$.loadTemplates([
  "login",
  "basiclayout",
  "main"
],function(){$(document).ready(go);});


function initializeHistoryRouter() {
    // '/status-link' is a href of <a> tag
    new HistoryRouter({
        '/status-link': function () {
            adminDisplayRooms();
        },
        '/options-link': function () {
            openLink("#content-main", "templates/optionsTest.html");
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

//    logOut();
     loggedIn();

    //adds 'click' event listener for menu items
    initMenuItemClick();

    function loggedIn() {
        $("body").empty();
        $('body').template('basiclayout',{email:"något@något.com"});
    }


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
                console.log("LOGIN: " + status);
                if (status) {
                    loggedIn();
                } else {
                    cannotLoggin();
                }
            });

        });
    }

    function cannotLoggin() {
        $(".wrong-credentials").css("display", "block");
    }

}

function initMenuItemClick() {

    // click on menu item
    $('html').on('click', '.navbar-nav li', function (e) {
//        console.log('You selected menu item (object): ', e);

        if (!e.target.id) {
            console.log('The menu item "' + e.target.text + '" is MISSING an id!!');
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

