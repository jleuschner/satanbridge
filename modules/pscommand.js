// Module PSCommand

var request = require('request');


exports.status = function () {
        return ("Alles gut!");
    };

    exports.execute = function (command, params, cb) {
    	request({
    		uri: "http://localhost:3100/command/execute/" + command,
    		method: "POST",
    		form: params
    	}, function (error, response, body) {
    		if (error) {
    			var out = {}
    			//console.log("MODUL-ERR");
    			cb(error, "{}");
    		} else {
    			//console.log("CALLBACK NoERR");
    			var out = JSON.parse(body);
    			if (out.stderr) {
    				out.output = {};
    				out.output.error = out.stderr;
    			} else {
    				out.output = {};
    				if (out.stdout) {
    					out.output = JSON.parse(out.stdout);
    				}
    			}
    			cb(error, out);
    		}
    	}
	);
    }
