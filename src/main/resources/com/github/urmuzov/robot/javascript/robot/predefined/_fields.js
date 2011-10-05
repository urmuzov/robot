goog.provide('robot.predefined.fields');

goog.require('robot.PredefinedFields');
goog.require('robot.Field');
goog.require('goog.math');

/**
 * @return {!robot.Field}
 */
robot.predefined.fields.first = function() {
    var c = goog.math.Coordinate;
    var field = new robot.Field(8, 8);
    field.putWall(new c(0, 0), new c(0, 3));
    field.putWall(new c(1, 1), new c(3, 1));
    return field;
};
robot.PredefinedFields.addFieldCreator('first', robot.predefined.fields.first);

/**
 * @return {!robot.Field}
 */
robot.predefined.fields.second = function() {
    var c = goog.math.Coordinate;
    var field = new robot.Field(8, 8);
    field.putWall(new c(0, 0), new c(0, 3));
    field.putWall(new c(1, 1), new c(3, 1));
    return field;
};
robot.PredefinedFields.addFieldCreator('second', robot.predefined.fields.second);