goog.provide('robot.PredefinedPrograms');

/**
 * @type Object.<string, function(!robot.Field)>
 */
robot.PredefinedPrograms.programs = {};

/**
 * @param {string} id
 * @param {function(!robot.Field)} creator
 */
robot.PredefinedPrograms.addProgramCreator = function(id, creator) {
    robot.PredefinedPrograms.programs[id] = creator;
};