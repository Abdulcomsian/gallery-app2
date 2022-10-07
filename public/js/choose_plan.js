var duration;
var current_medium;

function duration_change() {
	
   	if ($('#duration').hasClass('active')) {
   		duration = 12;
   	} else {
   		if ($('#6months').length)
				duration = 6;
			else
				duration = 1;
   	}

   	show_plans(true);
}

$(document).ready(function() {

	$( "#countryCode" ).change(function() {
    	update_plan_selections();
		show_plans();
	});

	$( "#countryCodeUser" ).change(function() {
		update_plan_selections();
		show_plans();
	});

	set_current_medium();

	if ($( "#frequency" ).length) {

		if ($('#6months').length || $('#duration').hasClass('active') )
		{
			$('#duration').addClass('active');


			duration = 12;
		}
		else 
			duration = 1;



	
		$('#duration').on('click', function(event){

		 	event.preventDefault();
		   
		  	$(this).toggleClass('active');
		   	duration_change();

		});
		 
		show_plans();

	    

		$( "#recipients" ).change(function() {
			show_plans();
			update_plan_selections();
		});

		$( "#frequency" ).change(function() {
			show_plans();
			update_plan_selections();
		});

		$( "#family" ).change(function() {
			show_plans();
		});


		$(function(){
		  $('#autorenew').on('click', function(event){

		    event.preventDefault();

		    $(this).toggleClass('active');
		   

		   	if ($(this).hasClass('active'))
		   		auto_renew_val = 'false';
		   	else
		   		auto_renew_val = 'true';
		   	
		   	$.ajax({ 
			    type: 'POST', 
			    url: "/plan_auto_renew", 
			    dataType: 'json',
			    data: { auto_renew: auto_renew_val, subscription:  $('input[name=subscription]').val() },
			    success: function (data) { 
			       
			    }
			});        
		  });

		});

		if ( !$('#buttons_by_href').length ) {
			for (i=0; i < 4; i++) {

				$(slug).find(".pricing_"+i).find(".signup_btn").on('click', function(event){

						event.preventDefault();

						$(".signup_btn").addClass('disabled');
						$('#signup_spinner').show();
			        	
			        	

				 		$('#fader').show();
				   	
				   	 	$.ajax({ 
						    type: 'POST', 
						    url: "/change_plan_and_pay", 
						    dataType: 'json',
						    data: { subscription: $('input[name=subscription]').val(), medium: current_medium, photos: $(this).data('photos'), recipients:  recipients,  duration:  duration,  frequency:  frequency },
						    success: function (data) { 


						    	

						    	if (data.payment) {
							    	$('#fader').hide();
							    	$(".signup_btn").removeClass('disabled');
									$('#signup_spinner').hide();
							      	$("#payment_submit").trigger('click');
							    } else {
							    	location.href = "/onboarding/" + $('input[name=subscription]').val() + "/album";
							    }
						    },
						    error: function(XMLHttpRequest, textStatus, errorThrown) {
							    //alert (errorThrown);
						  	}
						});  
				});
			}
		}
	}

	

});

function update_plan_selections () {
	
	
	
	$.ajax({ 
	    type: 'POST', 
	    url: "/update_plan_selections", 
	    dataType: 'json',
	    data: { countryCode: $('#countryCode').val(), countryCodeUser:  $('#countryCodeUser').val(), 
	    frequency:  $('#frequency').val(), recipients:  $('#recipients').val() },
	    success: function (data) { 
	       
	    }
	});  

	set_current_medium(); 
}

function set_current_medium()
{
	if ( $('#countryCodeUser').val() != 'international' ) {
		$('#by_sms').show();
		$('#by_email').hide();
		current_medium = 'sms';
	} else {
		$('#by_sms').hide();
		$('#by_email').show();
		current_medium = 'email';
	}      

}

		
function show_plans(duration_changed=false) {

	if ($('#recipients').val()==1) {
		$('#who_live').html("who lives in"); 
	} else {
		$('#who_live').html("who live in"); 
	}

	if ($( "#frequency" ).length) {
	
		frequency = $( "#frequency" ).val().toLowerCase();

		if (!duration_changed && frequency>30) {
			$('#duration').removeClass('active');
			
			duration_change();
			return;
		} 

		if (frequency>30) {
			$('#duration_inner').addClass('hide');
		} else {
			$('#duration_inner').removeClass('hide');
		}

	    $('.country_pricing').hide();
	    $('.country_pricing_international').hide();

	   	
	    recipients = $('#recipients').val();


		if ($('#countryCode').val()=='international') {
			$('#plan_details').hide();
		}
		else {
			$('#plan_details').show();
		}

		destination = $( "#countryCode" ).val().toLowerCase();
		

		origin = $("#countryCodeUser").val();

		sms = origin.toLowerCase()=='us' || origin.toLowerCase()=='ca';

		$('.pricing-column').removeClass('billing_centered');

		
		all = $('.pricing-container').hide();

		if (origin=='US') {
			$('.usd').hide();
			
		}
		else {
			$('.usd').show();
			
			
		}

		offset = 0;


		if (destination!='us' && destination!='overseas') {
			offset = 2;
		}

		

		if (sms)
			medium = 'sms';
		else
			medium = 'email';


		if (frequency==30) {
			frequency_label = "once per month";

		} else if (frequency<30) {

			if (frequency==7) {
				frequency_label = "every week";
			} else if (frequency==14) { 
				frequency_label = "every 2 weeks";
			} else if (frequency==21) { 
				frequency_label = "every 3 weeks";
			}
		} else {
			months = parseInt(frequency / 30);

			frequency_label = "every " + months + " months";
		}

		$('.duration').html(frequency_label);

		$('.duration_billed').addClass('hide');

		if ((duration==1&&frequency<=14) || frequency>=60) {
			
				$('.duration_billed').removeClass('hide');
		
		}

		
		
	 
		slug = "#pricing_" + medium;
		
		$('#country').val(destination.toUpperCase());

		$(slug).show();

		recipients = $('#recipients').val();
		

		for (i=0; i < 4; i++) {

			photos = $(slug).find(".pricing_"+i).data('photos');
			price = $(slug).find(".pricing_"+i).data('price') + +offset;

			if (medium=='email'){
				price = $(slug).find(".pricing_"+i).data('price_email') + +offset;
			}




			if (frequency<30) {
				weeks = frequency / 7;
	            discount = (4 - weeks)/2;

	            if (medium == 'email') {
	                if (weeks==3) 
	                	discount = 0;
	                else if (weeks==2)
	                	discount = 0.50;
	                else if (weeks==1)
	                	discount = 1.00;
	            }

	            price = price - discount;


			} else if (frequency>30) {

				if (medium == 'sms') {

					months = parseInt(frequency / 30)-1;


					price = +price + +months;

				}
			}

			

			price = (price * recipients);

			

			if (sms) {
				price = price - ((recipients-1)*1.5);
			} 

			price = Math.round(price*2)/2 - 0.01
			
			if (duration>=6) {

				duration_months = 11;

				if (duration==6)
					duration_months = 6;

				if (frequency==30) {
					
					price = price * duration_months;
				}
				else if (frequency==21) {
					
			

					price = price * ( 49 / 3);
				}
				else if (frequency==14) {
					
					price = price * (duration_months * 2);
				} else if (frequency==7) {
					
					price = price * (duration_months * 4);
				} 
			}
			else
				price = price * duration;

			

			price = Math.round(price*2)/2 - 0.01
			weeks = Math.floor(30/frequency);

			price_monthly = price * weeks;

			price_monthly = Math.round(price_monthly*2)/2 - 0.01

			$(slug).find(".pricing_"+i).find(".plan-price").html("$" + (price));

			duration_label = '';
			
			if (duration==1) {
				duration_label = "Billed monthly ($" + price_monthly + ")";
				
			} if (frequency>=60) {

				duration_label = "Per shipment";
				
			}

			if (photos==25) {
				duration_label = '(' + duration_label.toLowerCase() + ')';
			}

			$(slug).find(".pricing_"+i).find(".duration_billed").html(duration_label);

			plan_slug = $(slug).find(".pricing_"+i).data('photos') + '/' + origin + '/' + destination + '/' + recipients + '/' + duration;

			// Route::get('change/{subscription}/{photos}/{origin}/{desination}/{recipients}/{duration}/{medium}/{frequency}', 'SiteController@change_subscription');


			label = "Send " + photos + " Photos";

			$(slug).find(".pricing_"+i).find(".signup_btn").removeClass('disabled');

			if (~window.location.href.indexOf("payment")) {
				//label = "Choose plan";

				href = false;

			} else if (~window.location.href.indexOf("gift")) {
				label  = "Buy now";
				href = '/gift/buy/' + plan_slug + '/' + frequency;
			} else if (~window.location.href.indexOf("billing"))  {

				var pathArray = window.location.pathname.split('/');

				label = "Switch";

				if ($('#current_plan_photos').length)
					plan_slug += '/' + medium;


				plan_slug += '/' + frequency;

				href = '/change/' + pathArray[2] + '/' + plan_slug;

				disable = false;

				if ( $('#current_plan_photos').val() == photos &&
					 $('#current_plan_medium').val() == medium &&
					 $('#current_plan_destination').val().toLowerCase() == destination &&
					 $('#current_plan_recipients').val().toLowerCase() == recipients &&
					 $('#current_plan_duration').val().toLowerCase() == duration && $('#current_plan_frequency').val().toLowerCase() == frequency )
				  {
					
					label  = "Your plan";
					
					disable = true;

				}

				if (!disable) {

					disable = $('#current_on_gift_card').length;
				}

				if (disable) {
					$(slug).find(".pricing_"+i).find(".signup_btn").addClass('disabled');
				}
				



			} else  {
				href = '/new/' + plan_slug;
			}

			if (href) {

				$(slug).find(".pricing_"+i).find(".signup_link").attr("href", (href).toLowerCase());
			}
			

			$(slug).find(".pricing_"+i).find(".signup_btn").html(label);
		}


		
		if (~window.location.href.indexOf("billing")) {
			
			$('.pricing-column').removeClass('col-lg-4');
			$('.pricing-column').addClass('billing_centered');
		} 

		if (sms) {
			$('.send_by').html ("by text message or email");
		} else {
			$('.send_by').html ("by email");
		}
	}
}