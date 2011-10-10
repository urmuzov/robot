goog.provide('robot.PredefinedPrograms');

/**
 * @type Object.<string, string>
 */
robot.PredefinedPrograms.programs = {};

/**
 * @param {string} id
 * @param {string} creator
 */
robot.PredefinedPrograms.addProgramCreator = function(id, creator) {
    robot.PredefinedPrograms.programs[id] = creator;
};