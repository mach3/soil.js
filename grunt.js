module.exports = function(grunt){

	grunt.initConfig({

		meta : {
			banner : grunt.file.read("src/intro.js")
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
			}
		},

		min : {
			"src/soil.min.js" : ["<banner>", "src/soil.js"]
		},

		watch : {
			concat : {
				files : ["src/soil/*.js"],
				tasks : "concat:source"
			}
		}
		
	});

	grunt.registerTask("default", "concat:source concat:dist min");

};
