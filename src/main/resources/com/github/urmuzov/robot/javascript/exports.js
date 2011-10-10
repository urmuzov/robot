goog.require('robot.ExportManager');
goog.require('goog.math.Coordinate');
goog.require('robot.Direction');
goog.require('robot.Rotation');
goog.require('robot.Field');
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
em.exportConstructor('robot.Field', robot.Field)
    .exportPrototypeProperties({
        'getHeight': robot.Field.prototype.getHeight,
        'getWidth': robot.Field.prototype.getWidth,
        'addFigure': robot.Field.prototype.addFigure,
        'removeFigure': robot.Field.prototype.removeFigure,
        'putWallOnRight': robot.Field.prototype.putWallOnRight,
        'putWallOnBottom': robot.Field.prototype.putWallOnBottom,
        'putWall': robot.Field.prototype.putWall
    });
em.exportConstructor('robot.figures.Figure', robot.figures.Figure)
    .exportPrototypeProperties({
        'getField': robot.figures.Figure.prototype.getField,
        'setField': robot.figures.Figure.prototype.setField,
        'getCoordinate': robot.figures.Figure.prototype.getCoordinate,
        'setCoordinate': robot.figures.Figure.prototype.setCoordinate,
        'getDirection': robot.figures.Figure.prototype.getDirection,
        'setDirection': robot.figures.Figure.prototype.setDirection,
        'moveTo': robot.figures.Figure.prototype.moveTo,
        'rotateTo': robot.figures.Figure.prototype.rotateTo,
        'move': robot.figures.Figure.prototype.move,
        'turnLeft': robot.figures.Figure.prototype.turnLeft,
        'turnRight': robot.figures.Figure.prototype.turnRight
    });
em.exportConstructor('robot.figures.WallE', robot.figures.WallE);
em.exportConstructor('robot.figures.StackableFigure', robot.figures.StackableFigure);
em.exportConstructor('robot.figures.SummonerFigure', robot.figures.SummonerFigure)
    .exportPrototypeProperties({
        'summon': robot.figures.SummonerFigure.prototype.summon,
        'dismiss': robot.figures.SummonerFigure.prototype.dismiss
    });

