
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
        },300)
    };

	// Send report to app
    $("#btn-send").click(function(){
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

	$("#btn-cancel").click(function(){
		showHide();
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
	    for (i = 0; i < (rows.length - 1); i++) {
	      //start by saying there should be no switching:
	      shouldSwitch = false;
	      /*Get the two elements you want to compare,
	      one from current row and one from the next:*/
	      x = rows[i].getElementsByTagName("td")[1];
	      y = rows[i + 1].getElementsByTagName("td")[1];
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


//dealing with time formating
	$('.report-time').each(function(index, el) {
		var d = new Date($(this).html())
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		var hour = d.getHours()
		var min = d.getMinutes()

		$(this).html( days[d.getDay()] + " " + hour + ":" + min)
	});

	$('.personal-report-time').each(function(index, el) {
		var unixTimestamp = parseInt($(this).html());
		var d = new Date(unixTimestamp);
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		var hour = d.getHours()
		var min = d.getMinutes()

		$(this).html( days[d.getDay()] + " " + hour + ":" + min)
	});

	//charts

	var fetchReport = function() {
		names = []
		reports = []
		var swtichStatus = $('input[name=options]:checked').val()

		$('.graph-active').each(function(index, el) {
			var name = $(this).find('.personal-reports-avatar-container').text();
			names.push(name)
			var allReports = []
			$(this).find('.personal-report').each(function(index, el) {
				var report =  parseInt($(this).text())
				allReports.push(report)
			});
			if(swtichStatus == 1) {
				var myarray = allReports;
				var new_array = [];
				myarray.reduce(function(a,b,i) { return new_array[i] = a+b; },0);
				allReports = new_array // [5, 15, 18, 20]
			}
			reports.push(allReports)
		});


		// setTimeout(function(){
		new Chartist.Line('.ct-chart', {
		  // labels: names,
		  className: 'test',
		  series: reports
		}, {
		  fullWidth: true,
		  chartPadding: {
		    right: 40
		  }
			});
		// }, 2000)
		console.log('chart loaded')
	}

	$('.mdl-layout__tab').click(function(){
		fetchReport();
	});

	$('.mdl-radio').click(function(){
		fetchReport();
	});

	$('.personal-report-table').click(function(event) {
		$(this).toggleClass('graph-active')
		fetchReport();
	});

	$('#select-all').click(function(event) {
		$('.personal-report-table').each(function(){
			$(this).removeClass('graph-active');
			$(this).toggleClass('graph-active');
		});
		fetchReport();	
	});

	$('#deselect-all').click(function(event) {
		$('.personal-report-table').each(function(){
			$(this).addClass('graph-active');
			$(this).toggleClass('graph-active');
		});
		fetchReport();	
	});

	
	//- script end




	console.log( "ready!" );
	sortTable()

});

var inputAmount = function(weather){
	var posNeg = '';
	if(weather == wet){
		posNeg = '-';
		$('#report-field')[0].value = -Math.abs($('#report-field')[0].value)
		$('.pop-up-icon').html('🌧');
		$('#btn-send').addClass('mdl-button--accent');
		$('#btn-cancel').addClass('mdl-button--accent');
	}
	else {
		$('#report-field')[0].value = Math.abs($('#report-field')[0].value)
		$('.pop-up-icon').html('☀️');
		$('#btn-send').addClass('mdl-button--colored');
		$('#btn-cancel').addClass('mdl-button--colored');
	}
	var val = $('#report-field')[0].value;
	$('#pop-up-amount').html(val +'$');
}

var showHide = function(){
	$('.pop-up').toggle()
	$('#btn-send').removeClass('mdl-button--accent');
	$('#btn-cancel').removeClass('mdl-button--accent');
	$('#btn-send').removeClass('mdl-button--colored');
	$('#btn-cancel').removeClass('mdl-button--colored');
	console.log( "showhide done" );
};

//disable btn when no input
$(document).ready(function(){
    $('.dry-wet').attr('disabled',true);
    $('#report-field').keyup(function(){
        if($(this).val().length !=0)
            $('.dry-wet').attr('disabled', false);            
        else
            $('.dry-wet').attr('disabled',true);
    })
});






