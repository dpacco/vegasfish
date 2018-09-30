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

var getData = function(page, callback){
	fs.readFile('./data_papp.json', 'utf8', (err, fileContents) => {
	  if (err) {
	    console.error(err)
	    return
	  }
	  try {
	    const data = JSON.parse(fileContents)
	    dataUsers = data
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

	console.log('the cookie is ' + req.cookies.user)
	

	var page
	var pageRender = function(pageName) {
		console.log('rendering: ' + pageName)
		res.render(pageName, {
			title: 'Papp',
			users : dataUsers.users,
			selectedUser : dataUsers.users[selectedUser]
	  	});
	  	console.log('the user is: ' + dataUsers.users[selectedUser].name)
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

	var calBal = function() {
		var userName = req.cookies.user 
		var report = Number(req.query.report)

		var currentBal = Number(dataUsers.users[userName].balance)
		var newBal = (currentBal + report)

		console.log('report for: ' + dataUsers.users[userName])

		dataUsers.users[userName].balance = newBal

		let data = JSON.stringify(dataUsers);  
		fs.writeFileSync('./data_papp.json', data);
		
	}

	getData('',calBal)

	// HERE WILL BE THE FUNCTION TO CALC AND PUSH THE VALUES

});




module.exports = router;
