goog.provide('robot.figures.StackableFigure');

goog.require('robot.Direction');
goog.require('robot.figures.Figure');
goog.require('robot.figures.StackableFigureSnapshot');

/**
 * @class
 * @constructor
 * @extends robot.figures.Figure
 * @param {!goog.math.Coordinate} coordinate начальная позиция
 * @param {number=} opt_count количество блоков в ячейке
 */
robot.figures.StackableFigure = function(coordinate, opt_count) {
    /**
     * @private
     * @type number
     */
    this.count_ = goog.isDef(opt_count) ? opt_count : 1;

    robot.figures.Figure.call(this, coordinate, robot.Direction.DOWN);
};
goog.inherits(robot.figures.StackableFigure, robot.figures.Figure);

/**
 * @protected
 * @type goog.debug.Logger
 */
robot.figures.StackableFigure.prototype.logger_ = goog.debug.Logger.getLogger('robot.figures.StackableFigure');

/**
 * @param {number} count
 */
robot.figures.StackableFigure.prototype.setCount = function(count) {
    this.logger_.info("Setting Count: uid[" + goog.getUid(this) + "] from " + this.count_ + " to " + count);
    this.count_ = count;
    this.update();
};

/**
 * @return {number}
 */
robot.figures.StackableFigure.prototype.getCount = function() {
    return this.count_;
};

/**
 * @override
 * @return {string}
 */
robot.figures.StackableFigure.prototype.toString = function() {
    return "StackableFigure(uid[" + goog.getUid(this) + "])";
};

/**
 * @override
 * @return {!robot.figures.StackableFigureSnapshot}
 */
robot.figures.StackableFigure.prototype.getSnapshot = function() {
    return new robot.figures.StackableFigureSnapshot(this.getCoordinate(), this.getDirection(), this.count_);
};
/**
 * @override
 * @return {string}
 */
robot.figures.StackableFigure.prototype.toLogString = function() {
    return robot.figures.Figure.prototype.toLogString.call(this) + " count[" + this.count_ + "]";
};

