function showUserProfile() {

    // Check if we are logged in and get the user info
    LOGIN_REST.find('', function (data) {

        getProfileData(data.user);
        loadUserFormTemplate();
        updateUserProfileForm();
        $('body').on('click','.profile-exit-btn',function(e){
        e.preventDefault();
        $('#userProfileForm').remove();
        getProfileData(data.user);
        
        });
    });
    // ==============================-> Input logged in useds information
    function getProfileData(userData) {
        getLoggedInEducation(function (education) {
            getLoggedInUserName(function (getName) {

                $('#content-main').empty().template('userProfile', {
                    name: getName,
                    birthday: userData.pnr,
                    email: userData.epost,
                    education: education
                });
            });
        });
    }
    // ==============================-> Empty content-main and load Forms
    function loadUserFormTemplate() {

        $('body').on("click", ".profile-change-btn", function () {
            $("#content-main").empty();
            var formTemplate = $(loadTemplate("templates/userProfileForm.html"));
            $("#content-main").append(formTemplate);

        });
    }
    // ==============================-> Display form and adds updated text
    function updateUserProfileForm() {

        $('body').on("click", ".profile-save-btn", function (e) {
            e.preventDefault();
            var name = $("#changeUserName").val();
            var email = $("#changeUserEmail").val();
            getUserEmail(function (getEmail) {
//                STUDENT_REST.update(_find({epost: getEmail}), {epost: email, name: name}, function (data, textStatus, jqXHR) {
//                    console.log("SAVE:", data);
//                    showUserProfile();
//                });
                TEACHERS_REST.update(_find({epost: getEmail}), {epost: email, name: name}, function (data, textStatus, jqXHR) {
                    console.log("SAVE:", data);
                    showUserProfile();
                });
            });
        });
    }
}











