goog.provide('robot.visual.WallEVisualizer');

/**
 * @class
 * @constructor
 * @extends robot.visual.FigureVisualizer
 * @param {!robot.visual.FieldTableVisualizer} fieldVisualizer
 * @param {!robot.Field} field
 * @param {!robot.figures.Figure} figure
 */
robot.visual.WallEVisualizer = function(fieldVisualizer, field, figure){
    robot.visual.FigureVisualizer.call(this, fieldVisualizer, field, figure);
};
goog.inherits(robot.visual.WallEVisualizer, robot.visual.FigureVisualizer);

/**
 * Рендринг WallE
 * @override
 * @protected
 * @param {!robot.Direction} direction
 * @param {!Element} container
 * @param {!robot.events.FigureEvent} figureEvent
 */
robot.visual.WallEVisualizer.prototype.renderFigureDirection = function(direction, container, figureEvent) {
    var h = 'unknown';
    if (direction == robot.Direction.UP) {
        h = '&uarr;';
    } else if (direction == robot.Direction.RIGHT) {
        h = '&rarr;';
    } else if (direction == robot.Direction.DOWN) {
        h = '&darr;';
    } else if (direction == robot.Direction.LEFT) {
        h = '&larr;';
    }
    var el = goog.dom.createDom('div', {'className': 'figure-walle', 'innerHTML':'Wall-E<br />' + h});
    goog.dom.appendChild(container, el);
};

