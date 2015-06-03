module.exports = function(grunt) {
	grunt.initConfig({
		meta: {
			package: grunt.file.readJSON('package.json'),
			src: {
				main: 'src/main',
				test: 'src/test',
			},
			bin: 'bin',
			doc: 'doc',
			banner: '/**\n'
					+ ' * <%= meta.package.name %> v<%= meta.package.version %>\n'
					+ ' * built on ' + '<%= grunt.template.today("dd.mm.yyyy") %>\n'
					+ ' * Copyright <%= grunt.template.today("yyyy") %> <%= meta.package.author.name %>\n'
					+ ' * licenced under MIT, see LICENSE.txt\n'
					+ ' */\n'
		},
		peg: {
			meat : {
				src: '<%= meta.src.main %>/pegjs/meat.pegjs',
				dest: '<%= meta.bin %>/parser.js',
				options: {
					exportVar: 'parser'
				}
			}
		},
		connect: {
			example: {
				options: {
					port: 8080,
					base: '.',
					keepalive: true
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-peg');
	
	grunt.registerTask('build-example', ['peg:meat', 'connect:example']);
};
