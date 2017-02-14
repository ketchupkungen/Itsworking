$(document).ready(function() {

/*
// Opens profile-modal when clicked on "profil"
profileModal();

});
*/

function profileModal(){

	$('.modal-profile').click(function(){
		$('.overlay').fadeIn(300);
	});

	$('.close-btn').click(function(){
		$('.overlay').fadeOut(300);
	});
}

});
