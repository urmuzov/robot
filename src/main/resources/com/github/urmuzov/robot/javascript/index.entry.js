goog.require('goog.dom');
goog.require('goog.debug.DivConsole');
goog.require('robot.Field');
goog.require('robot.visual.FieldTableVisualizer');
goog.require('robot.figures.Figure');
goog.require('robot.Direction');
goog.require('robot.Rotation');
goog.require('robot.figures.WallE');
goog.require('robot.figures.StackableFigure');

var field;
var fieldVisualizer;

/**
 * @export
 */
function onLoad() {
    var outputEl = goog.dom.getElement('output');
    var debugEl = goog.dom.getElement('debug');

    new goog.debug.DivConsole(debugEl).setCapturing(true);

    var c = goog.math.Coordinate;

    field = new robot.Field(8, 8);
    field.putWall(new c(0, 0), new c(0, 3));
    field.putWall(new c(1, 1), new c(3, 1));
    fieldVisualizer = new robot.visual.FieldTableVisualizer(field);

    var logger = goog.debug.Logger.getLogger('');


    try {
        var stack = new robot.figures.StackableFigure(field, new c(0, 2), 2);
        var wallE = new robot.figures.WallE(field, new c(0, 0), robot.Direction.DOWN);
        wallE.move();
        wallE.move();
        wallE.move();
        wallE.turnLeft();
        stack.setCount(7);
        wallE.move();
        var fig = new robot.figures.Figure(field, new c(5, 5), robot.Direction.DOWN);
        wallE.turnLeft();
        wallE.move();
        wallE.turnRight();
        wallE.move();
        wallE.turnLeft();
        wallE.moveTo(robot.Direction.UP);
        wallE.moveTo(robot.Direction.RIGHT);
        wallE.moveTo(robot.Direction.LEFT);
        wallE.moveTo(robot.Direction.LEFT);
        wallE.moveTo(robot.Direction.UP);
    } catch (e) {
        logger.severe(e.toString());
        //throw e;
    }

    if (goog.isNull(outputEl)) {
        throw new Error('Can\'t render to element == null');
    }
    fieldVisualizer.render(outputEl);
    fieldVisualizer.play();
}