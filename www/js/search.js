var STUDENT_REST = new REST('student');
var TEACHER_REST = new REST('teach');

$(document).on('submit', '#search-form', function(event) {
    // console.log(123);
    event.preventDefault();
    var searchString = $('#search-text').val();
    var searchType = $("input[name='optradio']:checked").val();
    search(searchString, searchType);
});

function search(str, type){
    var resourceName = type + '_REST';
    window[resourceName].find('', function (data, textStatus, jqXHR) {

        console.log(data);
        var results = data.filter(function (item){
            str = str.toLowerCase();
            item.name = item.name.toLowerCase();
            if (item.name.indexOf(str) > -1){
                return true;
            }
            item.epost = item.epost.toLowerCase();
            if (item.epost.indexOf(str) > -1){
                return true;
            }
        });
        console.log(results);
    });
    //alert(resourceName);
}

/*function TEACHER_REST(){
    alert('lärare');
}

function STUDENT_REST(){
    alert('elever');
}

function searchFor(str, type) {
    
    //lookitup
    alert(str+type);
}*/

/* <---- OLD CODE ---->
$(document).ready(function() {

    initEvents();

});

function initEvents() {

    $("#searchButton").on("click", function() {

        var $btn = $(this).button("loading");
        $("#searchField").attr("disabled", true);

    });

    $(".inputContainer").hover(function() {

        $(this).stop().animate({
            borderBottomWidth: "4px"
        }, {
            duration: 170,
            complete: function() {}
        });

    }, function() {

        $(this).stop().animate({
            borderBottomWidth: "2px"
        }, {
            duration: 170,
            complete: function() {}
        });

    });

}

function enableInput() {

    $("#searchButton").button("loading");
    $("#searchField").attr("disabled", false);

}
*/
