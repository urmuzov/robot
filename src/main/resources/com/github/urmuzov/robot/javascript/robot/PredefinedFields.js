goog.provide('robot.PredefinedFields');

/**
 * @type Object.<string, function():!robot.Field>
 */
robot.PredefinedFields.fields = {};

/**
 * @param {string} id
 * @param {function():!robot.Field} creator
 */
robot.PredefinedFields.addFieldCreator = function(id, creator) {
    robot.PredefinedFields.fields[id] = creator;
};