'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Poll = new Schema({
    "userid": String,
    "createdby": String,
    "pollquestion": String,
    "pollvalues": Object,
    "ips": Object
});

module.exports = mongoose.model('Poll', Poll);