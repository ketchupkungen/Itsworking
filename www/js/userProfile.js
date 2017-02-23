function showUserProfile(){

	// Check if we are logged in and get the user info
	LOGIN_REST.find('',function(data){

		getProfileData(data.user);

	});

	function getProfileData(userData){

		$('#content-main').empty().template('userProfile',{
			name: "?",
			birthday: userData.pnr,
			email: userData.epost,
			education: "?",
		});
	}
}