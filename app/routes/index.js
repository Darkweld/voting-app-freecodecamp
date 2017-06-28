'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var pollHandler = new PollHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/user')
		.get(function (req, res) {
		  (req.user) ? res.json(req.user) : res.json({"github": {"displayName": "Guest"}});
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/viewpolls')
		.get(pollHandler.getPolls);
		
	app.route('/viewpolls/:pollid')
		.get(pollHandler.viewPolls);
		
	app.route('/submitvote/:pollid/:pollval')
		.post(pollHandler.submitVote);
		
    app.route('/submit')
        .get(isLoggedIn, function(req, res) {
        	res.sendFile(path + '/public/submit.html');
        })
        .post(isLoggedIn, pollHandler.getPolls2);
        
    app.route('/poll')
		.get(function(req, res) {
        	res.sendFile(path + '/public/poll.html');
        });
    app.route('/delete/:pollid')
		.delete(isLoggedIn, pollHandler.deletePoll);
		
	app.route('/edit')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/edit.html');
		});
	app.route('/edit/:pollid')
		.post(isLoggedIn, pollHandler.editPoll);
	 

};
