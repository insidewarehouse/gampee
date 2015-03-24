module.exports = function (grunt) {

	require("time-grunt")(grunt);
	require("load-grunt-tasks")(grunt);

	grunt.initConfig({
		jshint: {
			dist: {
				src: ["*.js", "test/**/*.js"],
				options: {jshintrc: true}
			},
			watch: {
				src: ["*.js", "test/**/*.js"],
				options: {jshintrc: true, force: true}
			}
		},
		"mochaTest": {
			"test": {
				options: {
					reporter: "spec"
				},
				src: ["test/**/*.js"]
			}
		},
		"watch": {
			"test": {
				files: ["**/*.js", "test/**/*.js"],
				tasks: ["jshint:watch", "test"]
			}
		}
	});

	grunt.renameTask("release", "_release");

	grunt.registerTask("default", ["jshint:dist", "test"]);
	grunt.registerTask("test", ["mochaTest"]);

	grunt.registerTask("release", function () {
		var bump = grunt.option("bump");
		if (bump != "patch" && bump != "minor" && bump != "major") grunt.fail.fatal("Please pass --bump");
		grunt.task.run(["checkbranch:master", "checkpending", "_release:" + bump]);
	});

};
