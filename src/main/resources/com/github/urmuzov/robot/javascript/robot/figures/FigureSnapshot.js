goog.provide('robot.figures.FigureSnapshot');

/**
 * @class
 * @constructor
 * @param {!goog.math.Coordinate} coordinate
 * @param {!robot.Direction} direction
 */
robot.figures.FigureSnapshot = function(coordinate, direction) {
    /**
     * @type !goog.math.Coordinate
     */
    this.coordinate = coordinate;
    /**
     * @type !robot.Direction
     */
    this.direction = direction;

};

/**
 * @param {!robot.figures.FigureSnapshot} previousSnapshot
 * @return {Object.<string, *>}
 */
robot.figures.FigureSnapshot.prototype.getDifferenceFrom = function(previousSnapshot) {
    var diff = {};
    if (goog.math.Coordinate.equals(this.coordinate, previousSnapshot.coordinate)) {
        diff['fromCoordinate'] = this.coordinate;
        diff['toCoordinate'] = previousSnapshot.coordinate;
    }
    if (this.direction != previousSnapshot.direction) {
        diff['fromDirection'] = this.direction;
        diff['toDirection'] = previousSnapshot.direction;
    }
    return diff;
};