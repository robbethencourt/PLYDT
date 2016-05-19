// Javascript function that wraps everything
$(document).ready(function(){

	function plydt() {

		// drop the firebase onto the dataRef variable to use throughout my js
		var dataRef = new Firebase('https://plydt.firebaseio.com/');

		// variables
		var name = 'Parents Name';
		var parent_gender = '';
		var child_gender = '';
		var age = 0;
		var coordinates = [];
		var timestamp = null;
		var chatroom_name = '';

		// variable for chatroom comments
		var comment = '';


		// functions

		function createUser() {

			// all these values need to be pulled from the form
			var user = {
				username: name,
				parent_gender: parent_gender,
				children: [{
					child_gender: child_gender,
					age: age
				}],
				location: coordinates,
				time: timestamp,
				chatrooms: [{
					chatroom: chatroom_name
				}]
			} // end user object

			// grabbing the users section from firebase
			usersRef = dataRef.child('users/' + name);

			// setting the user section in firebase to the user object we create with the form
			usersRef.ref().set(user);
			
		} // end createUser()

		/*
		// click events

		// search button click event to bring up search input modal
		$('#search').on('click', function() {



		});

		// pin button click event to bring up pin input modal
		$('#pin').on('click', function() {

			

		});

		// create user button click event if they are searching
		$('#create-user-search').on('click', function() {
			
			createUser();

			return false;

		}); // end create user search click event

		// create user button click event if they are pinning
		$('#create-user-pin').on('click', function() {
			
			createUser();

			return false;

		}); // end create user search click event
		*/

		createUser();

	} // end plydt()

	plydt();

}); // end jQuery document ready