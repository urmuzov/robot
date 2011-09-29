goog.provide('robot.events.FigureEvent');

goog.require('robot.figures.FigureSnapshot');
goog.require('robot.events.FigureEventType');

/**
 * @class
 * @constructor
 * @extends goog.events.Event
 * @param {!robot.events.FigureEventType} type
 * @param {!robot.figures.Figure} figure
 * @param {!robot.figures.FigureSnapshot} snapshotBefore
 * @param {!robot.figures.FigureSnapshot} snapshotAfter
 */
robot.events.FigureEvent = function(type, figure, snapshotBefore, snapshotAfter) {
    goog.events.Event.call(this, type, figure);

    /**
     * PS знаю, что то же самое хранится в this.target, но убей не хочется каждый раз приводить типы при работе с target
     * @type !robot.figures.Figure
     */
    this.figure = figure;
    /**
     * @type !robot.figures.FigureSnapshot
     */
    this.snapshotBefore = snapshotBefore;
    /**
     * @type !robot.figures.FigureSnapshot
     */
    this.snapshotAfter = snapshotAfter;
};
goog.inherits(robot.events.FigureEvent, goog.events.Event);

/**
 * @return {string}
 */
robot.events.FigureEvent.prototype.toString = function() {
    return 'FigureEvent(target[' + this.target.toString() + '], difference[' + goog.debug.expose(this.snapshotAfter.getDifferenceFrom(this.snapshotBefore)) + '])';
};