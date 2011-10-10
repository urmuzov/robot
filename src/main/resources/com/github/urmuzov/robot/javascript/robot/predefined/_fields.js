goog.provide('robot.predefined.fields');

goog.require('robot.PredefinedFields');
goog.require('robot.Field');
goog.require('goog.math');

/**
 * WARNING!
 * DO NOT USE MULTI-LINE STRING LITERALS IN PRODUCTION.
 * THIS CODE IS FOR TEACHING PURPOSES ONLY.
 */

robot.predefined.fields.empty = "function() {\n\
    return new robot.Field(8, 8);\n\
}";
robot.PredefinedFields.addFieldCreator('empty-8x8', robot.predefined.fields.empty);

robot.predefined.fields.first = "function() {\n\
    var c = goog.math.Coordinate;\n\
    var field = new robot.Field(8, 8);\n\
    field.putWall(new c(0, 0), new c(0, 3));\n\
    field.putWall(new c(1, 1), new c(3, 1));\n\
    return field;\n\
}";
robot.PredefinedFields.addFieldCreator('first', robot.predefined.fields.first);
