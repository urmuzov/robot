goog.provide('robot.visual.StackableFigureVisualizer');

/**
 * @class
 * @constructor
 * @extends robot.visual.FigureVisualizer
 * @param {!robot.visual.FieldTableVisualizer} fieldVisualizer
 * @param {!robot.Field} field
 * @param {!robot.figures.Figure} figure
 */
robot.visual.StackableFigureVisualizer = function(fieldVisualizer, field, figure){
    robot.visual.FigureVisualizer.call(this, fieldVisualizer, field, figure);
};
goog.inherits(robot.visual.StackableFigureVisualizer, robot.visual.FigureVisualizer);

/**
 * Рендринг WallE
 * @override
 * @protected
 * @param {!robot.Direction} direction
 * @param {!Element} container
 * @param {!robot.events.FigureEvent} figureEvent
 */
robot.visual.StackableFigureVisualizer.prototype.renderFigureDirection_ = function(direction, container, figureEvent) {
    var stack = (/** @type robot.figures.StackableFigure */ this.getFigure());
    var el = goog.dom.createDom('div', {'className': 'figure-robot', 'innerHTML':'Stack:'+goog.getUid(stack)+'<br />Count:'+ figureEvent.snapshotAfter.count});
    goog.dom.appendChild(container, el);
};

