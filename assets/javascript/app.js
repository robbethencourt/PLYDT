// Javascript function that wraps everything
$(document).ready(function(){

	// function find location(){
	// 	//
	// }


	function plydt() {

		// drop the firebase onto the dataRef variable to use throughout my js
		var dataRef = new Firebase('https://plydt.firebaseio.com/');

		// variables
		var name = '';
		var parent_gender = '';
		var child_gender = [];
		var child_age = [];
		var coordinates = [];
		var timestamp = null;
		var chatroom_name = '';
		var child = {};

		// variable for chatroom comments
		var comment = '';


		// functions

		//map functions

			// var map;
			// var service;
			// var infowindow;

			// function initialize() {
			//   var pyrmont = new google.maps.LatLng(-44.540,-78.546);

			//   map = new google.maps.Map(document.getElementById('map'), {
			//       center: pyrmont,
			//       zoom: 8
			//     });

			//   var request = {
			//     location: pyrmont,
			//     radius: '50000',
			//     keyword: 'kids play area near me'
			//   };

			//   service = new google.maps.places.PlacesService(map);
			//   service.textSearch(request, callback);
			// }

			// function callback(results, status) {
			//   if (status == google.maps.places.PlacesServiceStatus.OK) {
			//     for (var i = 0; i < results.length; i++) {
			//       var place = results[i];
			//       createMarker(results[i]);
			//     }
			//   }
			// }
			// function createMarker(place) {
			// 	var placeLoc = place.geometry.location;
			// 	var marker = new google.maps.Marker({
			// 	map: map,
			// 	position: place.geometry.location
			// 	});

			// 	google.maps.event.addListener(marker, 'click', function() {
			// 	infowindow.setContent(place.name);
			// 	infowindow.open(map, this);
			// 	});
			// 	}
			
		//end map functions

		function addChildDisplays(num_child) {
			
			// loop through the number of children selected to create the usre inputs for each one
			for (var i = 1; i < num_child; i++) {
				
				// create a label for each child
				var child_label = $('<label>').text('Child ' + i);

				// create a select element for the child's gender
				var child_select = $('<select>').addClass('browser default child-gender').attr('id', 'childgender-' + i);

				// create to options for gir and boy and append to our select element
				$('<option>').val('girl').text('girl').appendTo(child_select);
				$('<option>').val('boy').text('boy').appendTo(child_select);

				// create an input wih type text for the child's age
				var child_input_age = $('<input>').addClass('child-age').attr('type', 'number').attr('placeholder', 'Age').attr('id', 'childage-' + i);

				// append label, select and input elements to the child-input divs
				child_label.appendTo('#child-inputs');
				child_select.appendTo('#child-inputs');
				child_input_age.appendTo('#child-inputs');


			} // end for loop

		} // end addChildDisplay()

		function createUser(name_to_pass, parent_gender_to_pass, child_gender_array, child_age_array, time_to_pass) {

			// add the username to the nav section
			$('#name-nav').text(name);

			// create a children array to hold each of the child object the for loop below creates
			var children = [];

			// for loop creates a separate child object for each child. We loop through based on the gener array length
			for (var i = 0; i < child_gender_array.length; i++) {

				// create the child object for this instance to grab data from the i index in both the gender and age arrays
				child = {
					child_gender: child_gender_array[i],
					child_age: child_age_array[i]
				} // end child object

				// push each child object created tot he children array, which will get set in the user object below
				children.push(child);
				
			}// end for loop

			// all these values need to be pulled from the form
			var user = {
				username: name_to_pass,
				parent_gender: parent_gender_to_pass,
				children: children,
				location: coordinates,
				time: time_to_pass,
				chatrooms: [{
					chatroom: chatroom_name
				}]
			} // end user object

			// grabbing the users section from firebase
			usersRef = dataRef.child('users/' + name);

			// setting the user section in firebase to the user object we create with the form
			usersRef.ref().set(user);

			$('#user-inputs').addClass('hide');
			
		} // end createUser()

		
		// click events

		// search button click event to bring up search input modal
		$('#search').on('click', function() {

			// display the user-inputs forn
			$('#user-inputs').removeClass('hide');

			// hide the current button and the pin button
			$(this).addClass('hide');
			$('#pin').addClass('hide');

		}); // end search button click event

		// pin button click event to bring up pin input modal
		$('#pin').on('click', function() {

			// display the user-inputs form
			$('#user-inputs').removeClass('hide');

			// hide the current button and the search button
			$(this).addClass('hide');
			$('#search').addClass('hide');

		}); // end pin button click event

		// change event handler for selecting number of childrn
		$('#child-count').change(function() {
			
			// get the value of the selection made. Need to convert into an integer to add it so that the displays and ids the addChildDisplays function creates beginn with 1 and not 0
			var child_count = parseInt($(this).val()) + 1;

			// call the function that will display the number of inputs based on the value of number of children. That value is being passed to the function we're calling
			addChildDisplays(child_count);

		});

		// create user button click event if they are searching
		$('#create-user').on('click', function() {

			// set the name variable to what the user entered
			name = $('#username').val().trim();

			// set the parent gender
			parent_gender = $('#parent-gender').val();

			// store all the child genders into this array
			child_gender = $('.child-gender').map(function() {
				return this.value;
			}).get();

			// store all the age genders into this array
			child_age = $('.child-age').map(function() {
				return this.value;
			}).get();

			// set the amount of time they will be using the app
			var time_to_add = $('#time').val();

			// create a new date with moments.js
			var newDate = moment();

			// set the time variable to unix time with the time to add added in that the user selected they will be plydting for
			time = newDate.add(time_to_add, 'minutes').format('X');
			
			// call the createUser function and pass the value of the elements we got on this click event
			createUser(name, parent_gender, child_gender, child_age, time);

			return false;

		}); // end create user search click event

		/* create user button click event if they are pinning
		$('#create-user-pin').on('click', function() {

			console.log(this);
			
			createUser();

			return false;

		}); // end create user search click event
		*/

		//createUser();

		

	} // end plydt()

	plydt();

}); // end jQuery document ready

// Google maps functions needs to live outside the jQuery document ready function as it was causing a delay on the initMap() and having it not available when google maps was ready for it

// map variables
var map;
var infoWindow;
var service;

// map functions
function initMap() {

	// new google map
	map = new google.maps.Map(document.getElementById('map'), {

		// this is where to store the coordinates
		center: {lat: 28.744563499999998, lng: -81.30536049999999},
		// deals wtih the area the map displays
 		zoom: 13,
 		// map speicific styles
	    styles: [{
	      	stylers: [{ visibility: 'simplified' }]
	    }, {
	      	elementType: 'labels',
	      	stylers: [{ visibility: 'off' }]
	    }]

  	}); // end map

  	infoWindow = new google.maps.InfoWindow();
  	service = new google.maps.places.PlacesService(map);

  	// The idle event is a debounced event, so we can query & listen without
  	// throwing too many requests at the server.
  	map.addListener('idle', performSearch);

} // end initMap()

function performSearch() {

	// request object that takes the keywords for our search
  	var request = {
    	bounds: map.getBounds(),
    	keyword: 'parks'
  	};

  	// service is using the request and callback functions
  	service.radarSearch(request, callback);

} // end performSearch()

function callback(results, status) {

	// if there is no google map return an error
  	if (status !== google.maps.places.PlacesServiceStatus.OK) {
    	console.error(status);
    	return;
  	} // end if

  	// loop through the google map search results and display with markers to the map
  	for (var i = 0, result; result = results[i]; i++) {

    	addMarker(result);

  	} // end for loop

} // end callback()

function addMarker(place) {

	// variable marker that plots the google places info
  	var marker = new google.maps.Marker({

    	map: map,
    	position: place.geometry.location,
    	icon: {
    		// this is where we change the icon image to display on the map
      		url: 'http://maps.gstatic.com/mapfiles/circle.png',
      		anchor: new google.maps.Point(10, 10),
      		scaledSize: new google.maps.Size(10, 17)
    	} // end icon

  	}); // end marker

  	// event listener on the markers so we can pull info once a user clicks on it
  	marker.addListener('click', function() {

  		// removing the hide class from venue-modal so the details of that location are visible
    	//$('#venue-modal').removeClass('hide');

    	// this keyword gives us the google places object that we'll need to pull data from
    	//console.log(this);
  	
  	}); // end marker event listner

	// google maps event listner that brings up the google maps info as a pop-up on the map when icon is clicked
  	google.maps.event.addListener(marker, 'click', function() {

    	service.getDetails(place, function(result, status) {

    		// check to make sure there is a google maps places and return errors if not
      		if (status !== google.maps.places.PlacesServiceStatus.OK) {
        		console.error(status);
        		return;
    		} // end if

    		// the details that are being passed to the pop-up on google maps
      		infoWindow.setContent(result.name);
      		infoWindow.open(map, marker);
    	
    	}); // end service

    	$('#venue-modal').removeClass('hide');

    	console.log(this);
  	
  	}); // end google maps marker event listner

} // end addMarker()