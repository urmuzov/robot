goog.provide('robot.predefined.algorithms');

goog.require('robot.PredefinedAlgorithms');
goog.require('robot.Field');
goog.require('robot.figures.WallE');
goog.require('goog.math');

/**
 * @param {!robot.Field} field
 */
robot.predefined.algorithms.firstSimple = function(field) {
    var wallE = new robot.figures.WallE(new goog.math.Coordinate(0, 0), robot.Direction.DOWN);
    wallE.setField(field);
    wallE.move();
    wallE.move();
    wallE.move();
    wallE.turnLeft();
    wallE.move();
    wallE.turnLeft();
    wallE.move();
    wallE.turnRight();
    wallE.move();
    wallE.move();
    wallE.turnLeft();
    wallE.move();
    wallE.turnLeft();
    wallE.move();
    wallE.move();
    wallE.turnRight();
    wallE.move();
};
robot.PredefinedAlgorithms.addAlgorithmCreator('first-simple', robot.predefined.algorithms.firstSimple);

/**
 * @param {!robot.Field} field
 */
robot.predefined.algorithms.firstCrash = function(field) {
    var wallE = new robot.figures.WallE(new goog.math.Coordinate(0, 0), robot.Direction.DOWN);
    wallE.setField(field);
    wallE.move();
    wallE.move();
    wallE.move();
    wallE.turnLeft();
    wallE.move();
    wallE.turnLeft();
    wallE.move();
    wallE.turnRight();
    wallE.move();
    wallE.turnLeft();
    wallE.move();
    wallE.move(); // эта строка не выполнится
};
robot.PredefinedAlgorithms.addAlgorithmCreator('first-crash', robot.predefined.algorithms.firstCrash);