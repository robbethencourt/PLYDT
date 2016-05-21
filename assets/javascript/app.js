// Javascript function that wraps everything
$(document).ready(function(){

	//map
	function initMap() {
        var mapDiv = document.getElementById('map');
        var map = new google.maps.Map(mapDiv, {
          center: {lat: 44.540, lng: -78.546},
          zoom: 8
        });
      }

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
			function initMap() {
			    var mapDiv = document.getElementById('map');
			    var map = new google.maps.Map(mapDiv, {
			      center: {lat: 44.540, lng: -78.546},
			      zoom: 8
			    });
			  }

			$('#map').append(map);
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