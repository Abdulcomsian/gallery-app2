$(document).ready(function() {

	show_plans();

    $( "#countryCode" ).change(function() {
		show_plans();
	});

	$( "#countryCodeUser" ).change(function() {
		show_plans();
	});

	$( "#duration" ).change(function() {
		show_plans();
	});

	$( "#recipients" ).change(function() {
		show_plans();
	});


	if ( $('#penny').length )
	{
		$('#penny').css('cursor','pointer');

		$('#penny').click(function() {
		  	clearInterval(penny);
		  	$('#penny').hide();
		  	$('#coins_display').show();
		});

		var penny = setInterval(shake, 5000);

		
	}
});

function shake()
{
	//console.log ('shake');
	$( "#penny" ).effect( "shake", "slow", "swing", 1000 );
}
		
function show_plans() {
    $('.country_pricing').hide();
    $('.country_pricing_international').hide();

    $duration = $('#duration').val();
    $recipients = $('#recipients').val();

	
	if ($('#countryCode').val()=='Other')
	{
		$('#plan_details').hide();
	}
	else
	{
		$('#plan_details').show();
	}

	$destination = $( "#countryCode" ).val().toLowerCase();

	$origin = $("#countryCodeUser").val();

	if ($destination=='waitlist')
	{
		$('#country_pricing_' + $destination + "_international_"+$duration+"month"+$recipients).hide();
		$('#country_pricing_waitlist').show();
	}
	else
	{

		$slug = '#country_pricing_' + $( "#countryCode" ).val().toLowerCase();

		//if ($origin=='US' || $origin=='CA')
			$slug += "_";
		//else
			//$slug += "_international_";

		$slug += $duration+"month"+$recipients;

		$($slug).show();
	}

}
