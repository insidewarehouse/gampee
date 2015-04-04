// coverage setup
var path = require("path");
require('blanket')({
	pattern: [
		path.join(__dirname, "..", "index.js"),
		path.join(__dirname, "..", "lib")
	]
});
