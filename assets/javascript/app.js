var location_name = '';

// Javascript function that wraps everything
$(document).ready(function(){

	// function find location(){
	// 	//
	// 
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
    $('#modal1').openModal();
          

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
				location: location_name,
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


		// firebase events

		// remove user data at certain time
		// grab the users section of firebase
		var usersDeleteRef = new Firebase('https://plydt.firebaseio.com/users');

		// updating the user info based on the time stored for each user
		usersDeleteRef.orderByChild('time').on('child_added', function(childSnapshot, prevChildKey) {

			// grab the objects from firebase
			var users_to_remove = childSnapshot.val();

			// create a new date with moments.js
			var newRemoveDate = moment();

			// set the time variable to unix time with the time to add added in that the user selected they will be plydting for
			var timeRemove = newRemoveDate.format('X');

			// if the time stored in firebase for each user is earlier than the current time
			if (timeRemove > users_to_remove.time) {

				// grab the name of each user
				var name_to_remove_from = childSnapshot.key();

				// target the specific user by name
				var object_to_change = usersDeleteRef.child(name_to_remove_from);

				// update the location, time and children values
				object_to_change.update({

					location: '',
					time: '',
					children: ''
				
				}); // end updated object

			} // end if

		}); // end usersRef

		
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

			// hide the pin button
			$('.pin-button').removeClass('hide');

			// remove the dynamically created select and input for the added children
			$('.child-gender').remove();
			$('.child-age').remove();

			return false;

		}); // end create user search click event

		// click event for when comments are addded
		$('#comment-button').on('click', function() {

			// get the comment to send
			var comment_to_send = $('#comment-input').val().trim();

			// reference the child comments in firebase
			var comments_ref = dataRef.child('comments/' + location_name);

			// push the comments to firebase with the local name variable assigned
			comments_ref.push({
				name: name,
				comment: comment_to_send
				
			}); // end data push

			// empty the comment input
			$('#comment-input').val('');

		}); // end comment button click event

		// click event to pull up the user form when the pin icon is pressed
		$('#pb').on('click', function() {
			
			$('#user-inputs').removeClass('hide');

			$('.pin-button').addClass('hide');

			$('#location-pin').text(location_name);

			// hides the login button
			$('#loginbutton').addClass('hide');

		}); // end click event on pin icon

		// click event to remove the user input form by pressing the x at the top right of the screen
		$('#cancel').on('click', function() {
			
			// hide the user inputs div
			$('#user-inputs').addClass('hide');

			// show the pin button again
			$('.pin-button').removeClass('hide');

			// shows the login button
			$('#loginbutton').removeClass('hide');

			// remove the dynamically created select and input for the added children
			$('.child-gender').remove();
			$('.child-age').remove();

		}); // end cancel on click event

		// click event for each parent listed for that location
		$('#plydtrs').on('click', '.parent-link', function () {

			// toggle only the specific dynamic ul element with the hide class
			$(this).children('.dynamic-ul').toggleClass('hide');

		}); // end click event on the parent link

	} // end plydt()

	plydt();

}); // end jQuery document ready

// firebase events

function fbLocationComments(location_to_pass) {

	// first we empty out the div so only the comments for that location are displayed
	$('#comment-display').empty();
	
	// grabbed the comments section of firebase to use below in the section where I'll be adding comments to the screen
	var commentsRef = new Firebase('https://plydt.firebaseio.com/comments');

	// updating comments to the screen
	commentsRef.child(location_to_pass).on('child_added', function(childSnapshot, prevChildKey) {

		// grab the objects from firebase
		var comment_to_add = childSnapshot.val();

		// add the name of who entered the comment and what their comment is. I'm ussing prepend so that the newst comment is displayed on top
		$('#comment-display').prepend('<p>' + comment_to_add.name + ': ' + comment_to_add.comment + '</p>');

	}); // dataRef for getting comments from firebase

} // end fbLocationComments()

function fbPlydtrs(location_to_pass) {

	// empty the plydtrs ul
	$('#plydtrs').empty();

	// grab the users section of firebase
	var usersRef = new Firebase('https://plydt.firebaseio.com/users');

	// updating comments to the screen
	usersRef.orderByChild('location').on('child_added', function(childSnapshot, prevChildKey) {

		// grab the objects from firebase
		var users_to_add = childSnapshot.val();

		// if the users' location equals the location name variable
		if (users_to_add.location === location_name) {

			// crate an li element
			var parent_li = $('<li>').addClass('parent-link');

			// the unix time stored in firebase
			var time_remaining = users_to_add.time;

			// current time for math purposes
			var new_date = moment().format('X');

			//takes check in time and subtracts play time. giving minutes left at the check in spot.
			var answer1 = Math.round((time_remaining - new_date) / 60);
				console.log("minutes: " + answer1);

			// insert the name of the user to the created li element
			parent_li.html('<span class="bold fake-link">' + childSnapshot.key() + '</span> has ' + answer1 + ' minutes remaining');

			// create a children ul that will be nested under the parent li element
			var children_ul = $('<ul>').addClass('dynamic-ul hide');

			// loop through the users' children
			for (var i = 0; i < users_to_add.children.length; i++) {

				// create a li element for each child of the user
				var child_li = $('<li>');

				// set the text of that li elemenmt to the gender and age of the users' child
				child_li.text(users_to_add.children[i].child_gender + ' age ' + users_to_add.children[i].child_age);

				// append the li element to the children ul that's nested under the parent li element
				children_ul.append(child_li);
			
			} // end for looop

			// append the children ul element to that particular parent
			parent_li.append(children_ul);

			// append the created li element to the ul
			$('#plydtrs').append(parent_li);

		} // end if

	}); // end userRef for getting user data from firebase

	// setTimeout function so the other scripts have time to get the users in, particularly on that first click
	setTimeout(function () {

		// get the amount of plydtrs at this location and store in variable
		var plydtrs_length = $('#plydtrs li').length;

		// get the element we will set this text to
		var num_plydtrs = $('#num-plydtrs');

		// if there are no plydtrs at this location
		if (plydtrs_length === 0) {

			// display the below text to the screen
			num_plydtrs.text('Sorry, no plydtrs at this location, but you can pin and be one for others to find');

		} // end if

		// if there is one other plydtrs at this location
		if (plydtrs_length === 1) {

			// display the below text to the screen
			num_plydtrs.text('Hooray, there is ' + plydtrs_length + ' other plydtr here');

		} // end if

		// if there is more than one plydtr at this location
		if (plydtrs_length > 1) {

			// display the below text to the screen
			num_plydtrs.text('Hooray, there are ' + plydtrs_length + ' other plydtrs here');

		} // end if
	
	}, 100); // end setTimeout
	
} // end fbPlydtrs()

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
	    styles: [
		    {
		        "featureType": "all",
		        "elementType": "geometry",
		        "stylers": [
		            {
		                "color": "#FFB5B8"
		            }
		        ]
		    },
		    {
		        "featureType": "all",
		        "elementType": "labels.text",
		        "stylers": [
		            {
		                "color": "#ee6e73"
		            },
		            {
		                "visibility": "simplified"
		            }
		        ]
		    },
		    {
		        "featureType": "landscape",
		        "elementType": "geometry.fill",
		        "stylers": [
		            {
		                "lightness": "100"
		            }
		        ]
		    },
		    {
		        "featureType": "poi",
		        "elementType": "all",
		        "stylers": [
		            {
		                "lightness": "86"
		            }
		        ]
		    },
		    {
		        "featureType": "poi",
		        "elementType": "labels.text",
		        "stylers": [
		            {
		                "lightness": "-60"
		            },
		            {
		                "visibility": "on"
		            }
		        ]
		    },
		    {
		        "featureType": "poi",
		        "elementType": "labels.text.stroke",
		        "stylers": [
		            {
		                "lightness": "89"
		            }
		        ]
		    },
		    {
		        "featureType": "poi",
		        "elementType": "labels.icon",
		        "stylers": [
		            {
		                "visibility": "on"
		            }
		        ]
		    },
		    {
		        "featureType": "poi.park",
		        "elementType": "geometry.fill",
		        "stylers": [
		            {
		                "color": "#C9FFD8"
		            },
		            {
		                "visibility": "on"
		            }
		        ]
		    },
		    {
		        "featureType": "road",
		        "elementType": "labels.icon",
		        "stylers": [
		            {
		                "visibility": "on"
		            }
		        ]
		    },
		    {
		        "featureType": "road.highway",
		        "elementType": "geometry.fill",
		        "stylers": [
		            {
		                "lightness": "46"
		            },
		            {
		                "visibility": "on"
		            }
		        ]
		    },
		    {
		        "featureType": "road.highway.controlled_access",
		        "elementType": "labels",
		        "stylers": [
		            {
		                "visibility": "simplified"
		            },
		            {
		                "hue": "#ee6e73"
		            }
		        ]
		    },
		    {
		        "featureType": "road.arterial",
		        "elementType": "all",
		        "stylers": [
		            {
		                "visibility": "simplified"
		            }
		        ]
		    },
		    {
		        "featureType": "road.arterial",
		        "elementType": "geometry.fill",
		        "stylers": [
		            {
		                "lightness": "81"
		            }
		        ]
		    },
		    {
		        "featureType": "road.local",
		        "elementType": "all",
		        "stylers": [
		            {
		                "visibility": "simplified"
		            },
		            {
		                "lightness": "49"
		            }
		        ]
		    },
		    {
		        "featureType": "road.local",
		        "elementType": "geometry.fill",
		        "stylers": [
		            {
		                "lightness": "75"
		            }
		        ]
		    },
		    {
		        "featureType": "road.local",
		        "elementType": "geometry.stroke",
		        "stylers": [
		            {
		                "lightness": "-46"
		            }
		        ]
		    },
		    {
		        "featureType": "transit",
		        "elementType": "all",
		        "stylers": [
		            {
		                "visibility": "simplified"
		            },
		            {
		                "lightness": "51"
		            }
		        ]
		    },
		    {
		        "featureType": "transit",
		        "elementType": "labels",
		        "stylers": [
		            {
		                "hue": "#ee6e73"
		            }
		        ]
		    },
		    {
		        "featureType": "water",
		        "elementType": "all",
		        "stylers": [
		            {
		                "color": "#DBE9FF"
		            },
		            {
		                "visibility": "on"
		            }
		        ]
		    }
		] // end map styles

  	}); // end map
	
	//preferred list layer
	var layer = new google.maps.FusionTablesLayer({
	      query: {
		      select: '\'Geocodable address\'',
		      from: '1Ms2J2lLiBP-qUBzMR9Rw16vL-WRWBQvTNbwaWVzM',
		  },
	      styles: [{
	      		where: 'Icon',
	  			markerOptions: {
	    			iconName: "purple_stars"
	  				},       		
	          	}]
     });

	//end preferred list layer

  	layer.setMap(map);

	
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
    	keyword: 'playgrounds'
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

    	// 	
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

      		// The location name is added to the venue-modal where the name of the location is prominently displayed
    		$('#venue-name').text(result.name);
    		// set the location_name variable
    		location_name = result.name;

    		// call the fbLocationComments function so that comments for that location are pulled
    		fbLocationComments(location_name);

    		// call the fbPlydtrs function so that only the plydtrs for that location show up
    		fbPlydtrs(location_name);

    		//hiding the welcome screen text
    		$(".introduction").addClass("hide");
    	
    	}); // end service

    	// reveal our venue modal to show comments and details of that location in firebase
    	$('#venue-modal').removeClass('hide');
  	
  	}); // end google maps marker event listner


}; // end addMarker()




	
