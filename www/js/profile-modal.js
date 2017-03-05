$(document).on('click','.status-menu-choice',function(){


	// Check if we are logged in and get the user info
	LOGIN_REST.find('',function(data){
	
		// The data we know about the user
		// !!!! Note login i separate collection
		// a there are no names and relations to
		// what student or teacher is actually logged in
		// (unless the relation is supposed to be identical emails in the
		// login collection and the teacher/student collections..?)
		// data.user.epost data.user.pnr data.user.level etc.
		showModal(data.user);

	});

	function showModal(userData){

		getLoggedInEducation(function (education) {
            getLoggedInUserName(function (getName) {
			
				$('body').template('profile-modal',{
					name: getName,
					birthday: userData.pnr,
					email: userData.epost,
					education: education
				});
			});
		});

		$('#profile-modal').modal('show');

	}

});
