goog.provide('robot.events.FigureMovedEvent');

/**
 * @class
 * @constructor
 * @extends robot.events.FigureEvent
 * @param {!robot.events.FigureEventType} type
 * @param {!robot.figures.Figure} figure
 * @param {!robot.figures.FigureSnapshot} snapshotBefore
 * @param {!robot.figures.FigureSnapshot} snapshotAfter
 * @param {!robot.Direction} direction
 */
robot.events.FigureMovedEvent = function(type, figure, snapshotBefore, snapshotAfter, direction) {
    if (type != robot.events.FigureEventType.MOVED && type != robot.events.FigureEventType.CRUSHED) {
        throw new Error('robot.events.FigureMovedEvent can be constructed with MOVED or CRUSHED type');
    }
    robot.events.FigureEvent.call(this, type, figure, snapshotBefore, snapshotAfter);

    /**
     * @type !robot.Direction
     */
    this.direction = direction;
};
goog.inherits(robot.events.FigureMovedEvent, robot.events.FigureEvent);

/**
 * @return {string}
 */
robot.events.FigureMovedEvent.prototype.toString = function() {
    return 'FigureMovedEvent(target[' + this.target.toString() + '])';
};