$(document).ready(function () {
    
    go();
});



function go() {
    addEventLoginBtn();

    logOut(function () {
        includeHtml("templates/login.html", "body");
    });
    
    

    function loggedIn() {
        $("body").empty();
        includeHtml("templates/basiclayout.html", "body");
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



