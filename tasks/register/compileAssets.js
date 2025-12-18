/**
 * `tasks/register/compileAssets.js`
 *
 * ---------------------------------------------------------------
 *
 * For more information see:
 *   https://sailsjs.com/anatomy/tasks/register/compile-assets.js
 *
 */
module.exports = function (grunt) {
  grunt.registerTask('compileAssets', [
    'clean:dev',
    // 'jst:dev', // Commented out - no templates in this project
    'less:dev',
    'copy:dev'
    // 'coffee:dev' // Commented out - no CoffeeScript in this project
  ]);
};
