module.exports = function(grunt){

	grunt.initConfig({

		watch : {
			concat : {
				files : ["src/soil/*.js"],
				tasks : "concat:source"
			}

		},

		concat : {
			source : {
				src : [
					"src/soil/core.js",
					"src/soil/config.js",
					"src/soil/events.js",
					"src/soil/attributes.js",
					"src/soil/model.js",
					"src/soil/stack.js",
					"src/soil/view.js",
					"src/soil/hashchange.js"
				],
				dest : "src/soil.js"
			},
			dist : {
				src : ["src/intro.js", "src/soil.js"],
				dest : "dist/soil.js"
			},
			distMin : {
				src : ["src/intro.js", "src/soil.min.js"],
				dest : "dist/soil.min.js"
			}
		},

		min : {
			"src/soil.min.js" : ["src/soil.js"]
		}

	});

	grunt.registerTask("default", "concat:source min concat:dist concat:distMin");

};