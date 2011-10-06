goog.provide('robot.predefined.algorithms');

goog.require('robot.PredefinedAlgorithms');
goog.require('robot.Field');
goog.require('robot.figures.WallE');
goog.require('goog.math');

/**
 * @param {!robot.Field} field
 */
robot.predefined.algorithms.demo1 = function(field) {
    var figure1 = new robot.figures.Figure(new goog.math.Coordinate(4, 1), robot.Direction.DOWN);
    var figure2 = new robot.figures.Figure(new goog.math.Coordinate(5, 2), robot.Direction.DOWN);
    figure1.setField(field);
    figure2.setField(field);

    figure1.setField(null);
    figure1.setCoordinate(new goog.math.Coordinate(6, 3));
    figure1.setField(field);

    figure2.setField(null);
    figure2.setCoordinate(new goog.math.Coordinate(6, 4));
    figure2.setField(field);

    figure1.setField(null);
    figure1.setCoordinate(new goog.math.Coordinate(5, 5));
    figure1.setField(field);

    figure2.setField(null);
    figure2.setCoordinate(new goog.math.Coordinate(4, 6));
    figure2.setField(field);

    figure1.setField(null);
    figure1.setCoordinate(new goog.math.Coordinate(3, 6));
    figure1.setField(field);

    figure2.setField(null);
    figure2.setCoordinate(new goog.math.Coordinate(2, 5));
    figure2.setField(field);

    figure1.setField(null);
    figure1.setCoordinate(new goog.math.Coordinate(1, 4));
    figure1.setField(field);

    figure2.setField(null);
    figure2.setCoordinate(new goog.math.Coordinate(1, 3));
    figure2.setField(field);

    figure1.setField(null);
    figure1.setCoordinate(new goog.math.Coordinate(2, 2));
    figure1.setField(field);

    figure2.setField(null);
    figure2.setCoordinate(new goog.math.Coordinate(3, 1));
    figure2.setField(field);

    figure1.setField(null);
    figure2.setField(null);
};
robot.PredefinedAlgorithms.addAlgorithmCreator('demo1', robot.predefined.algorithms.demo1);

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