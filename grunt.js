module.exports = function(grunt){

	grunt.initConfig({

		concat : {
			"dist/soil.js" : ["src/header.js", "src/soil.js"],
			"dist/soil.min.js" : ["src/header.js", "src/soil.min.js"]
		},

		min : {
			"src/soil.min.js" : ["src/soil.js"]
		}

	});

	grunt.registerTask("default", "min concat");

};