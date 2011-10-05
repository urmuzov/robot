goog.require('goog.dom');
goog.require('goog.debug.DivConsole');
goog.require('robot.Field');
goog.require('robot.visual.FieldTableVisualizer');
goog.require('robot.figures.Figure');
goog.require('robot.Direction');
goog.require('robot.Rotation');
goog.require('robot.figures.WallE');
goog.require('robot.figures.StackableFigure');
goog.require('robot.figures.SummonerFigure');

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
        var stack = new robot.figures.StackableFigure(new c(0, 2), 2);
        var wallE = new robot.figures.WallE(new c(0, 0), robot.Direction.DOWN);
        var fig = new robot.figures.Figure(new c(5, 5), robot.Direction.DOWN);
        var summoner = new robot.figures.SummonerFigure(new c(6, 0), robot.Direction.DOWN);
        summoner.setField(field);
        summoner.summon(5);
        summoner.move();
        summoner.summon(2);
        summoner.move();
        summoner.turnLeft();
        summoner.turnLeft();
        summoner.move();
        summoner.dismiss(2);
        summoner.move();
        stack.setField(field);
        field.addFigure(wallE);
        wallE.move();
        wallE.move();
        wallE.move();
        wallE.turnLeft();
        stack.setCount(7);
        wallE.move();
        stack.setField(null);
        fig.setField(field);
        wallE.turnLeft();
        field.removeFigure(fig);
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