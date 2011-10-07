goog.require('robot.ExportManager');
goog.require('goog.math.Coordinate');
goog.require('robot.Direction');
goog.require('robot.Rotation');
goog.require('robot.figures.Figure');
goog.require('robot.figures.WallE');
goog.require('robot.figures.StackableFigure');
goog.require('robot.figures.SummonerFigure');

var em = robot.ExportManager.getInstance();

em.exportConstructor('goog.math.Coordinate', goog.math.Coordinate);
em.exportEnum('robot.Direction', robot.Direction)
    .exportProperties({
        'UP': robot.Direction.UP,
        'RIGHT': robot.Direction.RIGHT,
        'DOWN': robot.Direction.DOWN,
        'LEFT': robot.Direction.LEFT
    });
em.exportEnum('robot.Rotation', robot.Rotation)
    .exportProperties({
        'CLOCKWISE': robot.Rotation.CLOCKWISE,
        'COUNTERCLOCKWISE': robot.Rotation.COUNTERCLOCKWISE
    });
em.exportConstructor('robot.figures.Figure', robot.figures.Figure)
    .exportPrototypeProperties({
        'setField': robot.figures.Figure.prototype.setField,
        'move': robot.figures.Figure.prototype.move,
        'turnLeft': robot.figures.Figure.prototype.turnLeft,
        'turnRight': robot.figures.Figure.prototype.turnRight
    });
em.exportConstructor('robot.figures.WallE', robot.figures.WallE);
em.exportConstructor('robot.figures.StackableFigure', robot.figures.StackableFigure);
em.exportConstructor('robot.figures.SummonerFigure', robot.figures.SummonerFigure);

