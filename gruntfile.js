module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        node: true,
        jquery: true,
        curly: false,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        forin: true,
        undef:true,
        unused: true,
        laxbreak: true,
        evil:true 
      },
      all: [
        'server/*.js',
        'server/boot/*.js'

				//'client/js/*.js'
        ]
    },
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yy-mm-dd") %> */\n'
      },
      build: {
        src: ['public/bower_components/jquery/dist/jquery.min.js',
              'public/bower_components/bootstrap/dist/js/bootstrap.min.js',
              'public/bower_components/bootbox/bootbox.js',
              'public/bower_components/bootstrapvalidator/dist/js/bootstrapValidator.min.js',
              'public/bower_components/bootstrapvalidator/dist/js/language/de_DE.js',
              'public/bower_components/summernote/dist/summernote.min.js',
              'public/bower_components/jquery-ui/ui/minified/widget.min.js',
              'public/bower_components/jquery-ui/ui/minified/effect.min.js',
              'public/bower_components/jquery-ui/ui/minified/effect-slide.min.js',
              'public/bower_components/jQuery-Mask-Plugin/dist/jquery.mask.min.js',
              'public/bower_components/tagsinput/dist/bootstrap-tagsinput.min.js',
              'public/bower_components/iCheck/icheck.min.js',
              'public/bower_components/chosen/chosen.jquery.min.js',
              'public/js/*.js'
              ],
        dest: '_tmp/j.js'
      }

    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  //grunt.registerTask('build', ['jshint','concat','uglify','cssmin','copy']);
  grunt.registerTask('default', ['jshint']);

};