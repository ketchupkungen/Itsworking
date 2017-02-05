
$(document).ready(function () {
	console.log('Yo! DOM Ready!');


	//adds 'click' event listener for menu items
	initMenuItemClick();


});


function initMenuItemClick() {

	// click on menu item
    $('html').on('click', '.navbar-nav li', function (e) {
   		console.log('You selected menu item (object): ', e);

   		if (!e.target.id){
	   		console.log('The menu item "'+e.target.text+'" is MISSING an id!!');
   		} else{
	   		console.log('You selected menu item (id): ', e.target.id);
   		}

   		var whichTemplate = '';

   		if (e.target.id == 'profile-settings') {
   			whichTemplate = 'profileContent';
   		}

   		//!!TODO: add more menu items here


   		if (whichTemplate !== '') {
			var htmlTemplate = loadTemplate('layouts/'+whichTemplate+'.html');
			$('.header-title h1').html(e.target.text);
			$('main').html(htmlTemplate);
		}
	});

}

