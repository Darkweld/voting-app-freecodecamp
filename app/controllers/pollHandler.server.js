'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');
var ObjectId = require('mongoose').Types.ObjectId;

function PollHandler () {

	this.getPolls = function (req, res) {
		Polls
			.find({})
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result);
			});
	};

	this.getPolls2 = function (req, res) {
		var obj = {};
		for (var q in req.body) {
		if (q.includes("polloption")) obj[q] = req.body[q];
		}
		
			new Promise(function(resolve, reject){
			
			var poll = new Polls({"userid": req.user.github.id, "createdby": req.user.github.username, "pollquestion": req.body.pollquestion, "pollvalues": obj});
			poll
					.save(function (err, doc) {
					if (err) return reject(err.message);
					if (doc) resolve (doc);
					});
		})
			.then(function(value){
			Users
					.findOneAndUpdate({"github.id": req.user.github.id}, {$push: {"polls": value}})
					.exec(function (err, result) {
				if (err) { throw err; }
                return res.redirect("/poll?" + value._id);
			});
			});
};
	this.viewPolls = function(req, res) {

		Polls
		.findOne({"_id": req.params.pollid})
		.exec(function(err, result) {
			if (err || !result) return res.send("error or !data");
				var obj = result.toObject();
				obj.match = "true";
					(req.user && req.user.github.id === result.userid) ?
		    		 res.json(obj) : res.json(result);	

		});
	};
	
	this.submitVote = function(req, res) {
		
		var ipreplace=  req.ip.replace(/\./g, "_");
		var ipval = "ips." + ipreplace;
		
		Polls.findOneAndUpdate({"_id": req.params.pollid},{$set: {[ipval]:req.params.pollval}}, {new: true})
		.exec(function(err, result) {
			if (err) console.log(err.message);
			
					res.json(result);

	
	});
};



	this.deletePoll = function(req, res) {
		 new Promise(function(resolve, reject){
			Users
			.update({"_id": req.user._id}, {$pull: {"polls": {"_id": new ObjectId(req.params.pollid)}}})
			.exec(function(err, result) {
			if (err) console.log(err);
			if (result.nModified === 1) resolve("pulled");
			else reject("not pulled!");
			});
		})
		.then(function(val) {
			Polls
			.findByIdAndRemove({"_id": req.params.pollid})
			.exec(function(err, result) {
			if (err) console.log(err.message);
			return res.json(result);
		});
	});
		
	};
	this.editPoll = function(req, res) {
		
		
		Polls
			.update({'_id': req.params.pollid, 'userid': req.user.github.id}, {$set: {"pollvalues": req.body}})
			.exec(function(err, result) {
			if (err) console.log(err.message);
			return res.redirect("/poll?" + req.params.pollid);
			});
		
		
		
	};
}

module.exports = PollHandler;
