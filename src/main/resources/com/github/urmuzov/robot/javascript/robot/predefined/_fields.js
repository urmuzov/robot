goog.provide('robot.predefined.fields');

goog.require('robot.PredefinedFields');
goog.require('robot.Field');
goog.require('goog.math');

/**
 * @return {!robot.Field}
 */
robot.predefined.fields.empty = function() {
    return new robot.Field(8, 8);
};
robot.PredefinedFields.addFieldCreator('empty-8x8', robot.predefined.fields.empty);

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
