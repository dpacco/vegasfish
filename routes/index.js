var express = require('express');
var router = express.Router();
var fs = require('fs');
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var cookieParser = require('cookie-parser')

var $ = jQuery = require('jquery')(window);

router.use(cookieParser())

/* Get user details */
var dataUsers
var mainImg 

var getData = function(page, callback){
	fs.readFile('./data_papp.json', 'utf8', (err, fileContents) => {
	  if (err) {
	    console.error(err)
	    return
	  }
	  try {
	    const data = JSON.parse(fileContents)
	    dataUsers = data
	    mainImg = dataUsers['main-image']
	    callback(page)
	  } catch(err) {
	    console.error(err)
	  }
	})
}

/* GET home page. */

router.get('/', function(req, res, next) {

// Decide if user already login before

	var selectedUser = req.cookies.user
	var teamBalance = 0;

	function getTeamBal() {
		var keys = Object.keys(dataUsers.users);
		for (var i = 0; i < keys.length ;++i) {
			var key = keys[i]
			var val = dataUsers.users[key].balance;
			teamBalance += val
		}
	}

	getData('', getTeamBal)


	console.log('the cookie is ' + req.cookies.user)

	var page
	var pageRender = function(pageName) {
		console.log('rendering: ' + pageName)
		res.render(pageName, {
			title: 'Vegas 2019',
			users : dataUsers.users,
			selectedUser : dataUsers.users[selectedUser],
			teamBalance : teamBalance,
			mainImg: mainImg
	  	});
	  	console.log('Done pageRender')
	};

	if(selectedUser !== undefined){
		page = 'index'
		getData(page, pageRender)
	}
	else {
		page = 'login'
		console.log('ELSE the user is: ' + selectedUser)
		getData(page, pageRender)
	}
});


/* GET report */
router.get('/report', function(req, res, next) {

	var calBal = function(page) {
		var date = new Date();
		var timestamp = date.getTime();
		var userName = req.cookies.user 
		var report = Number(req.query.report)

		var currentBal = Number(dataUsers.users[userName].balance)
		var newBal = (currentBal + report)

		console.log('report for: ' + userName)

		dataUsers.users[userName].balance = newBal
		dataUsers.users[userName].reports.push({timestamp,report})

		let data = JSON.stringify(dataUsers);  
		fs.writeFileSync('./data_papp.json', data);

		res.send({status:'success', recReport: report})

		// console.log('Start rendering success ' + page)
		// res.render(page, {
		// 	title: 'Papp'
	 //  	});
		
	}
	
	getData('success',calBal)

	// HERE WILL BE THE FUNCTION TO CALC AND PUSH THE VALUES

});

/* GET success page */
router.get('/success', function(req, res, next) {
	res.render('success', {
		title: 'You are fish!'
  	});
  	console.log('Done rendering success')
});


module.exports = router;


























