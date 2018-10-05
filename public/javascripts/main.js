
$(window).on('beforeunload', function(){
  $(window).scrollTop(0);
});

$( document ).ready(function() {

	var user = document.cookie

	if(localStorage.getItem("Status")) {
        setTimeout(function(){
			var toastify = function(msg){
				var notification = document.querySelector('.mdl-js-snackbar');
				notification.MaterialSnackbar.showSnackbar(
				  {
				    message: msg
				  }
				);
			};
	        toastify('Report added: ' + localStorage.getItem("recivedReport"));
            localStorage.clear();
        },100)
    };

	// Send report to app
    $(".btn").click(function(){
    	var report = $('#report-field').val()
		$.get("/report", {report: report}, function(data) {
			console.log(data)
			if (data) {
			    localStorage.setItem("Status",data.status)
			    localStorage.setItem("recivedReport",data.recReport)
			    location.reload();
			}
			
		});
		$("#report-form").trigger('reset');
		console.log('Btn fuc done!')
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

	// Table style negative values
	$('#mainTable tr').each(function(index, el) {
		var val = $(this).find('.bal-cell').html()
		if(val < 0){
			$(this).css('color','red')
		}
	});

	$('#personal-rec tr').each(function(index, el) {
		var val = $(this).find('.bal-cell').html()
		if(val < 0){
			$(this).css('color','red')
		}
	});

	$('#lastTable tr').each(function(index, el) {
		var val = $(this).find('.bal-cell').html()
		if(val < 0){
			$(this).css('color','red')
		}
	});

	// Logout
	$('#logout').click(function(event) {
		document.cookie = document.cookie + "; expires=Thu, 18 Dec 2013 12:00:00 UTC";
		location.reload();
	});

	


	// Sorting table
	var flip = false

	var sortTable = function(flip) {
	  var table, rows, switching, i, x, y, shouldSwitch;
	  table = document.getElementById("mainTable");
	  switching = true;
	  /*Make a loop that will continue until
	  no switching has been done:*/
	  while (switching) {
	    //start by saying: no switching is done:
	    switching = false;
	    rows = table.rows;
	    /*Loop through all table rows (except the
	    first, which contains table headers):*/
	    for (i = 1; i < (rows.length - 1); i++) {
	      //start by saying there should be no switching:
	      shouldSwitch = false;
	      /*Get the two elements you want to compare,
	      one from current row and one from the next:*/
	      x = rows[i].getElementsByTagName("TD")[1];
	      y = rows[i + 1].getElementsByTagName("TD")[1];
	      //check if the two rows should switch place:
	      var a = Number(x.innerHTML)
	      var b = Number(y.innerHTML)
	      if(flip=0){
		      if (a > b) {
		        //if so, mark as a switch and break the loop:
		        shouldSwitch = true;
		        break;
		      }
		  }
		  else{
		  	if (a < b) {
		        //if so, mark as a switch and break the loop:
		        shouldSwitch = true;
		        break;
		      }
		  }


	    }
	    if (shouldSwitch) {
	      /*If a switch has been marked, make the switch
	      and mark that a switch has been done:*/
	      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
	      switching = true;
	    }
	  }
	}

	var flipSorting = function(){
		if(flip) flip=0;
		else flip=1
		sortTable(flip)
	};

	$('#balance-col').click(function(event) {
		flipSorting()
		console.log(flip)
	});

	console.log( "ready!" );
	sortTable()

});

