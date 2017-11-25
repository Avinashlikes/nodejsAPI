var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userModel = new Schema({
    Name : {type: String},
    Password : {type : String}
});

module.exports = mongoose.model('User', userModel);