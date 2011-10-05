goog.provide('robot.PredefinedAlgorithms');

/**
 * @type Object.<string, function(!robot.Field)>
 */
robot.PredefinedAlgorithms.algorithms = {};

/**
 * @param {string} id
 * @param {function(!robot.Field)} creator
 */
robot.PredefinedAlgorithms.addAlgorithmCreator = function(id, creator) {
    robot.PredefinedAlgorithms.algorithms[id] = creator;
};