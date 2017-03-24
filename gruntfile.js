module.exports = function (grunt) {
  grunt.initConfig({
    'ts': {
      dist: {
        src: ['src/**/*.ts'],
        tsconfig: 'src/tsconfig.json',
        options: {
          pretty: true
        }
      }
    },

    'pug': {
      dist: {
        options: {
          pretty: true,
          doctype: 'html',
          data: { debug: false }
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.pug','!**/partials/*'],
          dest: 'dist/',
          ext: '.html',
          extDot: 'last'
        }]
      }
    },

    'watch': {
      pug: {
        files: ['src/**/*.pug'],
        tasks: ['build:pug']
      },
      ts: {
        files: ['src/**/*.ts'],
        tasks: ['build:ts']
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-pug')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-ts')

  grunt.registerTask('build:pug', ['pug'])
  grunt.registerTask('build:ts', ['ts'])
  grunt.registerTask('build', ['build:pug', 'build:ts'])
}
