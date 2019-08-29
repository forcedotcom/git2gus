/**
Copyright (c) 2019, salesforce.com, inc.
All rights reserved.
SPDX-License-Identifier: BSD-3-Clause
For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
 
/**
 * Gruntfile
 *
 * This Node script is executed when you run `grunt`-- and also when
 * you run `sails lift` (provided the grunt hook is installed and
 * hasn't been disabled).
 *
 * WARNING:
 * Unless you know what you're doing, you shouldn't change this file.
 * Check out the `tasks/` directory instead.
 *
 * For more information see:
 *   https://sailsjs.com/anatomy/Gruntfile.js
 */
module.exports = function(grunt) {
    var loadGruntTasks = require('sails-hook-grunt/accessible/load-grunt-tasks');

    // Load Grunt task configurations (from `tasks/config/`) and Grunt
    // task registrations (from `tasks/register/`).
    loadGruntTasks(__dirname, grunt);
};
