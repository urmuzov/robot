goog.provide('robot.PredefinedFields');

/**
 * @type Object.<string, string>
 */
robot.PredefinedFields.fields = {};

/**
 * @param {string} id
 * @param {string} creator
 */
robot.PredefinedFields.addFieldCreator = function(id, creator) {
    robot.PredefinedFields.fields[id] = creator;
};