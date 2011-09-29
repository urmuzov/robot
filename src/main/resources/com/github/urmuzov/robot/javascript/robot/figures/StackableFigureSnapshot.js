goog.provide('robot.figures.StackableFigureSnapshot');

goog.require('robot.figures.FigureSnapshot');

/**
 * @class
 * @constructor
 * @extends robot.figures.FigureSnapshot
 * @param {!goog.math.Coordinate} coordinate
 * @param {!robot.Direction} direction
 * @param {number} count
 */
robot.figures.StackableFigureSnapshot = function(coordinate, direction, count) {
    robot.figures.FigureSnapshot.call(this, coordinate, direction);
    /**
     * @type number
     */
    this.count = count;

};
goog.inherits(robot.figures.StackableFigureSnapshot, robot.figures.FigureSnapshot);

/**
 * @param {!robot.figures.StackableFigureSnapshot} previousSnapshot
 * @return {Object.<string, *>}
 */
robot.figures.StackableFigureSnapshot.prototype.getDifferenceFrom = function(previousSnapshot) {
    var diff = robot.figures.FigureSnapshot.prototype.getDifferenceFrom.call(this, previousSnapshot);
    if (this.count != previousSnapshot.count) {
        diff['fromCount'] = this.count;
        diff['toCount'] = previousSnapshot.count;
    }
    return diff;
};