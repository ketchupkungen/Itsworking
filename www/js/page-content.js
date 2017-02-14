/*

$.loadTemplates(["extra"],runWhenTemplatesHaveLoaded);

function runWhenTemplatesHaveLoaded(){

	var things = {
		headline: "Cool",
		text: "This is a cool text.",
		pets: ["Rabbit", "Cat" ]
	}

	$('.testIncludeTemplate').template('extra',things);

}
*/

/*
$.loadTemplates(["main"],runWhenTemplatesHaveLoaded1);

function runWhenTemplatesHaveLoaded1(){

	var information = {
		headline: "Något",
		text: "Shankle sirloin venison, porchetta spare ribs shoulder sausage turducken pig short ribs landjaeger pancetta andouille. Turkey tri-tip cupim capicola ham, pig ham hock. Sirloin burgdoggen doner t-bone strip steak, ribeye beef bacon turkey shankle pork chop meatloaf shoulder. Meatball t-bone corned beef cupim short ribs tri-tip meatloaf. Kielbasa swine ball tip strip steak fatback, frankfurter pork pig ham hock spare ribs alcatra porchetta. Burgdoggen hamburger chuck ground round. Shankle kevin tri-tip short loin ball tip."

	}

	$('.mainTemplate').template('main',information);
}
*/







/*
$('.sidebar').on('click', '<li ><a href="#">Administratör<span class="admin pull-right hidden-xs showopacity glyphicon glyphicon-cog"></span></a></li>', function(){
	$.loadTemplates(["main"],runWhenTemplatesHaveLoaded1);

	var information = {
		headline: "Schema",
		text: "text texte text textooo textatrearare text texte text textooo textatrearare text texte text textooo textatrearare."

	}

	$('.mainTemplate').template('main',information);	
	
});*/
/*
$.loadTemplates(["main"],runWhenTemplatesHaveLoaded1);

function runWhenTemplatesHaveLoaded1(){

	var information = {
		headline: "Något",
		text: "Shankle sirloin venison, porchetta spare ribs shoulder sausage turducken pig short ribs landjaeger pancetta andouille. Turkey tri-tip cupim capicola ham, pig ham hock. Sirloin burgdoggen doner t-bone strip steak, ribeye beef bacon turkey shankle pork chop meatloaf shoulder. Meatball t-bone corned beef cupim short ribs tri-tip meatloaf. Kielbasa swine ball tip strip steak fatback, frankfurter pork pig ham hock spare ribs alcatra porchetta. Burgdoggen hamburger chuck ground round. Shankle kevin tri-tip short loin ball tip."

	}

	$('.mainTemplate').template('main',information);
}*/



// Create som new rest entitites
// (also see classes/rest-entity.class.js)
/*var Kitten = new RestEntity('kitten');
var Owner = new RestEntity('owner');*/
var Login = new RestEntity('login');

// Some utility methods for forms
var formHelpers = new FormHelpers();

// Load html templates
// (also see libs/template.jquery.js)
console.log("HEJ OCH HÅ")
$.loadTemplates([
  /*'header',
  'modal',
  'navbar',
  'restTestOutput',
  'tableFromObject',
  'formFromObject',
  'main'*/
],start);

// Set up client side routes
new Router({
  '/': ()=>{$('.main-content').html('start');},
  '/start': ()=>{
    $('.main-content').html('start');
  },
  '/rest-test': ()=>{
    // Run the rest tests
    new RestTests();
   },
  '/about': ()=>{
    $('.main-content').html('about');
  }
});

// Start the app
function start(){
  // Wait for DOM ready
  $(()=>{
    // Create the main navbar
    new MainNavbar();
  });
}
