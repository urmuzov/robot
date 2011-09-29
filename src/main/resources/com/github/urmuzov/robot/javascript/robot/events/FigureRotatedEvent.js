goog.provide('robot.events.FigureRotatedEvent');

/**
 * @class
 * @constructor
 * @extends robot.events.FigureEvent
 * @param {!robot.figures.Figure} figure
 * @param {!robot.figures.FigureSnapshot} snapshotBefore
 * @param {!robot.figures.FigureSnapshot} snapshotAfter
 * @param {!robot.Rotation} rotation
 */
robot.events.FigureRotatedEvent = function(figure, snapshotBefore, snapshotAfter, rotation) {
    robot.events.FigureEvent.call(this, robot.events.FigureEventType.ROTATED, figure, snapshotBefore, snapshotAfter);

    /**
     * @type !robot.Rotation
     */
    this.rotation = rotation;
};
goog.inherits(robot.events.FigureRotatedEvent, robot.events.FigureEvent);

/**
 * @return {string}
 */
robot.events.FigureRotatedEvent.prototype.toString = function() {
    return 'FigureRotatedEvent(target[' + this.target.toString() + '])';
};