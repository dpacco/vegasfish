


$( document ).ready(function() {

	var user = document.cookie

	// Send report to app
    $(".btn").click(function(){
    	var report = $('#report-field').val()
		$.get("/report", {report: report}, function(data) {
		});
		$("#report-form").trigger('reset');
	});

    // LOGIN: select user 

	$(".mdl-menu__item").click(function(){
		var selectedUser = this.id
		console.log('client sends: ' + selectedUser)
		document.cookie = 'user=' + selectedUser;

		$.get("/", {
			selectedUser: selectedUser
			}, 
			function(data) {
				success: location.reload();
		});

	})

	// Logout
	$('#logout').click(function(event) {
		document.cookie = document.cookie + "; expires=Thu, 18 Dec 2013 12:00:00 UTC";
		location.reload();
	});

	console.log( "ready!" );

});



