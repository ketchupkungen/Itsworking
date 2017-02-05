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

/*$.loadTemplates(["main"],runWhenTemplatesHaveLoaded1);

function runWhenTemplatesHaveLoaded1(){

	var information = {
		headline: "Schema",
		text: "text texte text textooo textatrearare text texte text textooo textatrearare text texte text textooo textatrearare."

	}

	$('.mainTemplate').template('main',information);
}*/


$('.sidebar').on('click', '<li ><a href="#">Administratör<span class="admin pull-right hidden-xs showopacity glyphicon glyphicon-cog"></span></a></li>', function(){
	$.loadTemplates(["main"],runWhenTemplatesHaveLoaded1);

	var information = {
		headline: "Schema",
		text: "text texte text textooo textatrearare text texte text textooo textatrearare text texte text textooo textatrearare."

	}

	$('.mainTemplate').template('main',information);	
	
});