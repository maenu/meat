module.exports = function(grunt) {
	grunt.initConfig({
		meta: {
			package: grunt.file.readJSON('package.json'),
			src: {
				main: 'src/main',
				test: 'src/test',
			},
			lib: {
				main: 'lib/main',
				test: 'lib/test',
			},
			bin: {
				temporary: 'bin/temporary',
				plato: 'bin/plato'
			},
			doc: 'doc',
			banner: '/**\n'
					+ ' * <%= meta.package.name %> v<%= meta.package.version %>\n'
					+ ' * built on ' + '<%= grunt.template.today("dd.mm.yyyy") %>\n'
					+ ' * Copyright <%= grunt.template.today("yyyy") %> <%= meta.package.author.name %>\n'
					+ ' * licenced under MIT, see LICENSE.txt\n'
					+ ' */\n'
		},
		clean: {
			bin: 'bin',
			doc: 'doc'
		},
		watch: {
			
		},
		concat: {
			meat: {
				src: [
					'<%= meta.src.main %>/js/**/*.js'
				],
				dest: '<%= meta.bin.temporary %>/<%= meta.package.name %>.js'
			},
		},
		uglify: {
			options: {
				banner: '<%= meta.banner %>'
			},
			meat: {
				files: {
					'<%= meta.bin.temporary %>/<%= meta.package.name %>-<%= meta.package.version %>.min.js': '<%= meta.bin.temporary %>/<%= meta.package.name %>.js'
				}
			} 
		},
		yuidoc: {
			meat: {
				name: '<%= meta.package.name %>',
				description: '<%= meta.package.description %>',
				version: '<%= meta.package.version %>',
				options: {
					paths: '<%= meta.src.main %>/js',
					outdir: '<%= meta.doc %>'
				}
			}
		},
		jshint: {
			main: '<%= meta.src.main %>/js/**/*.js',
			test: '<%= meta.src.test %>/js/**/*.js',
			options: {
				// enforce
				bitwise: true,
				camelcase: true,
				curly: true,
				eqeqeq: false,
				forin: true,
				immed: true,
				indent: 4,
				latedef: true,
				newcap: true,
				noarg: true,
				noempty: true,
				nonew: true,
				plusplus: true,
				quotmark: 'single',
				undef: true,
				unused: true,
				strict: false, // i don't get it
				trailing: true,
				maxparams: 5,
				maxdepth: 3,
				maxstatements: 42,
				maxcomplexity: 5,
				maxlen: 80,
				// relax
				eqnull: true,
				laxbreak: true, // break on + etc.
				sub: true,
				// environments
				browser: false,
				globals: {
					
				}
			}
		},
		plato: {
			options : {
				complexity : {
					logicalor : true,
					switchcase : true,
					forin : true,
					trycatch : true,
					jshint: '<%= jshint.options %>'
				}
			},
			src: {
				files: {
					'<%= meta.bin.plato %>/src': '<%= meta.src.main %>/js/**/*.js',
				}
			},
			test: {
				files: {
					'<%= meta.bin.plato %>/test': '<%= meta.src.test %>/js/**/*.js',
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-plato');
	
	grunt.registerTask('check', ['plato:src', 'plato:test', 'jshint:main', 'jshint:test']);
	grunt.registerTask('doc', 'yuidoc:meat');
	grunt.registerTask('min', ['concat:meat', 'uglify:meat']);
};