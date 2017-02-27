var STUDENT_REST = new REST('student');
var TEACHER_REST = new REST('teach');

$(document).on('click', '.radio-inline', function(event) {
    $('input[name=optradio]').change(function(){
        $('button.search-btn').attr('disabled', false);
    });
});

$(document).on('submit', '#search-form', function(event) {
    console.log(123);
    event.preventDefault();
    var searchString = $('#search-text').val();
    var searchType = $("input[name='optradio']:checked").val();
    search(searchString, searchType);
});


var dataForSearchResultTemplate;
$(document).on('click','.goto-a-search-result-page',function(){
   var no = $(this).text();
   console.log("CLICKED BUTTON",no)
   dataForSearchResultTemplate.currentPage = no/1 - 1;
   $('.resultsContainer').empty().template('person-search-results',dataForSearchResultTemplate);
});


function search(str, type) {
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

        // divide results into seperate pages of results
        var pagedResults = [];
        var itemsPerPage = 3;
        var currentPage = 0;
        while(results.length){
            pagedResults[currentPage] = pagedResults[currentPage] || [];
            pagedResults[currentPage].push(results.shift());
            if(pagedResults[currentPage].length >= itemsPerPage){
                currentPage++;
            }
        }
        console.log("PAGED RESULTS",pagedResults);

        
        dataForSearchResultTemplate = {
          pages:pagedResults, 
          currentPage: 0
        }
        $('.resultsContainer').empty().template('person-search-results',dataForSearchResultTemplate);
    });
    //alert(resourceName);
}

function display(str) {
    
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
