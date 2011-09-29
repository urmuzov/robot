goog.provide('robot.WallException');

goog.require('robot.Direction');

/**
 * @class
 * @constructor
 * @extends Error
 * @param {robot.Direction} direction
 * @param {goog.math.Coordinate} coordinate
 */
robot.WallException = function(direction, coordinate) {
    /**
     * @private
     * @type goog.math.Coordinate
     */
    this.coordinate_ = coordinate;
    /**
     * @private
     * @type robot.Direction
     */
    this.direction_ = direction;
};
goog.inherits(robot.WallException, Error);

/**
 * Приведение к строке
 * @return {string}
 */
robot.WallException.prototype.toString = function() {
    return 'Can\'t move ' + this.direction_ + ' from (' + this.coordinate_.x + ", " + this.coordinate_.y + ')';
};