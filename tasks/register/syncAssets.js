/**
 * `tasks/register/syncAssets.js`
 *
 * ---------------------------------------------------------------
 *
 * For more information see:
 *   https://sailsjs.com/anatomy/tasks/register/sync-assets.js
 *
 */
module.exports = function(grunt) {
  grunt.registerTask('syncAssets', [
    // 'jst:dev', // Commented out - no templates in this project
    'less:dev',
    'sync:dev'
    // 'coffee:dev' // Commented out - no CoffeeScript in this project
  ]);
};
