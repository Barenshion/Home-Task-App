/*
---------------------------------------------------FETCHING LOCATION NAMES TO TABLE------------------------------------------------------
*/


$(document).ready(function(){
	fetch_country_data();
});

var array_data_holder;
var current_page = 1;
var items_per_page = 6;
var str_capital, str_country;	

function fetch_country_data(){
	$.ajax({
		url: 'https://countriesnow.space/api/v0.1/countries/capital',
		type: 'GET',
		dataType: 'JSON',
		success: function(data){
			$("#country-data-table").show();
			array_data_holder = data.data;
			var data_size = array_data_holder.length;
			document.getElementById('loading-css').remove();

			show_pagination_items(1);
		},
		error: function(err){
			console.log("Something went wrong here: " + err);
		}
	});
}
	
function calculate_num_pages(){
	return Math.ceil(Object.keys(array_data_holder).length/items_per_page);
}


function show_pagination_items(page_num){
	button_prev_att();
	var page_span 	= document.getElementById("page");
	document.getElementById('info-body').innerHTML = "";

		var condition = page_num* items_per_page;
		for (var i = (page_num-1) * items_per_page; i < condition; i++) {
			try{
				document.getElementById("page-nav").style.display = "block";
				var data_country = array_data_holder[i].name;
			
				$('#info-body').append(`
		 			<tr class="table-secondary" onclick="get_attributes(this)" data-id="`+i+`"> 
		 		 		<td> `+ data_country +`</td>
		 		 	</tr>`)
				var string_span = page_num + " of " + calculate_num_pages();
				page_span.value = string_span;

			}
			catch (e){
				button_disabled(document.getElementById("btn_next"));
			}
		}
}

function button_prev_att(){
	var btn = document.getElementById("btn_prev");
	document.getElementById("btn_next").disabled = false;
	return (current_page == 1) ? button_disabled(btn) : button_enable(btn);
}

function button_disabled(btn){
	return btn.disabled = true;
}

function button_enable(btn){
	return btn.disabled = false;
}

function prev_page(){
	if (current_page > 1) {
	    current_page--;
	    show_pagination_items(current_page);
	}
}

function next_page(){
	if (current_page < calculate_num_pages()) {
	    current_page++;
	    show_pagination_items(current_page);
	    }
	}


/*
-----------------------------------------FETCHING THE WEATHER INFO---------------------------------------------------------- 
*/	

// const dotenv = require('dotenv').config();

function get_attributes(data){

	$('#info-body tr').click(function(e) {
    	$('#info-body tr').removeClass('selected');
    $(this).addClass('selected');
	});

	var pos = parseInt(data.getAttribute('data-id'));
	var loc = array_data_holder[pos].name;
	$.ajax({
		url: 'https://api.openweathermap.org/data/2.5/weather?q='+loc+'&APPID=65011fa4d03e747d5269d1582a7b7a54&units=metric',
		type: 'POST',
		dataType: 'JSON',
		success: function(data){
			document.getElementById('id-description').hidden = false;
			document.getElementById('id-description').innerText = data.weather[0].description;
			document.getElementById('id-icon').src = "https://openweathermap.org/img/wn/" +  data.weather[0].icon + ".png";
			document.getElementById('id-country').innerText = loc;
			document.getElementById('id-celsius').innerText = JSON.stringify(data.main.temp) + "°C";
			document.getElementById('id-humidity').innerText = "Humidity: " + JSON.stringify(data.main.humidity) + "%";
			document.getElementById('id-speed').innerText = "Wind Speed: " + JSON.stringify(data.wind.speed) + "km/h"


			let results = document.getElementsByClassName('info');
			
			for (var i = 0; i < results.length; i++) {
				results[i].classList.remove('loading');
			}
		
		},
		error: function(err){
			let results = document.getElementsByClassName('info');
			
			for (var i = 0; i < results.length; i++) {
				results[i].classList.add('loading');
			}
			document.getElementById('id-country').innerText = err.responseJSON.message + ". Try other locations.";
		}
	});
	return true;
}


