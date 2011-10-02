goog.provide('robot.figures.WallE');

goog.require('robot');

/**
 * @class
 * @constructor
 * @extends robot.figures.Figure
 * @param {!goog.math.Coordinate} coordinate начальная позиция
 * @param {!robot.Direction} direction начальное направление
 */
robot.figures.WallE = function(coordinate, direction) {
    robot.figures.Figure.call(this, coordinate, direction);
};
goog.inherits(robot.figures.WallE, robot.figures.Figure);

robot.figures.WallE.prototype.move = function() {
    this.moveTo(this.getDirection());
};

robot.figures.WallE.prototype.turnLeft = function() {
    this.rotateTo(robot.rotateCounterclockwiseFrom(this.getDirection()), robot.Rotation.COUNTERCLOCKWISE);
};

robot.figures.WallE.prototype.turnRight = function() {
    this.rotateTo(robot.rotateClockwiseFrom(this.getDirection()), robot.Rotation.CLOCKWISE);
};
