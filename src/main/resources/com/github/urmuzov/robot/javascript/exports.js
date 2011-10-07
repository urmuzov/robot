goog.require('goog.math.Coordinate');
goog.exportSymbol('goog.math.Coordinate', goog.math.Coordinate);

goog.require('robot.Direction');
goog.exportSymbol('robot.Direction', robot.Direction);
goog.exportSymbol('robot.Direction.UP', robot.Direction.UP);
goog.exportSymbol('robot.Direction.RIGHT', robot.Direction.RIGHT);
goog.exportSymbol('robot.Direction.DOWN', robot.Direction.DOWN);
goog.exportSymbol('robot.Direction.LEFT', robot.Direction.LEFT);

goog.require('robot.Rotation');
goog.exportSymbol('robot.Rotation', robot.Rotation);
goog.exportSymbol('robot.Rotation.CLOCKWISE', robot.Rotation.CLOCKWISE);
goog.exportSymbol('robot.Rotation.COUNTERCLOCKWISE', robot.Rotation.COUNTERCLOCKWISE);

goog.require('robot.figures.Figure');
goog.exportSymbol('robot.figures.Figure', robot.figures.Figure);
goog.exportProperty(robot.figures.Figure.prototype, 'setField', robot.figures.Figure.prototype.setField);
goog.exportProperty(robot.figures.Figure.prototype, 'move', robot.figures.Figure.prototype.move);
goog.exportProperty(robot.figures.Figure.prototype, 'turnLeft', robot.figures.Figure.prototype.turnLeft);
goog.exportProperty(robot.figures.Figure.prototype, 'turnRight', robot.figures.Figure.prototype.turnRight);

goog.require('robot.figures.WallE');
goog.exportSymbol('robot.figures.WallE', robot.figures.WallE);

goog.require('robot.figures.StackableFigure');
goog.exportSymbol('robot.figures.StackableFigure', robot.figures.StackableFigure);

goog.require('robot.figures.SummonerFigure');
goog.exportSymbol('robot.figures.SummonerFigure', robot.figures.SummonerFigure);
