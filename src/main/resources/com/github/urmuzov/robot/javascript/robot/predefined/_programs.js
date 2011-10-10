goog.provide('robot.predefined.programs');

goog.require('robot.PredefinedPrograms');
goog.require('robot.Field');
goog.require('robot.figures.WallE');
goog.require('goog.math');

/**
 * WARNING!
 * DO NOT USE MULTI-LINE STRING LITERALS IN PRODUCTION.
 * THIS CODE IS FOR TEACHING PURPOSES ONLY.
 */

robot.predefined.programs.demo1 = "function(field) {\n\
    var figure1 = new robot.figures.Figure(new goog.math.Coordinate(4, 1), robot.Direction.DOWN);\n\
    var figure2 = new robot.figures.Figure(new goog.math.Coordinate(5, 2), robot.Direction.DOWN);\n\
    figure1.setField(field);\n\
    figure2.setField(field);\n\
    \n\
    figure1.setField(null);\n\
    figure1.setCoordinate(new goog.math.Coordinate(6, 3));\n\
    figure1.setField(field);\n\
    \n\
    figure2.setField(null);\n\
    figure2.setCoordinate(new goog.math.Coordinate(6, 4));\n\
    figure2.setField(field);\n\
    \n\
    figure1.setField(null);\n\
    figure1.setCoordinate(new goog.math.Coordinate(5, 5));\n\
    figure1.setField(field);\n\
    \n\
    figure2.setField(null);\n\
    figure2.setCoordinate(new goog.math.Coordinate(4, 6));\n\
    figure2.setField(field);\n\
    \n\
    figure1.setField(null);\n\
    figure1.setCoordinate(new goog.math.Coordinate(3, 6));\n\
    figure1.setField(field);\n\
    \n\
    figure2.setField(null);\n\
    figure2.setCoordinate(new goog.math.Coordinate(2, 5));\n\
    figure2.setField(field);\n\
    \n\
    figure1.setField(null);\n\
    figure1.setCoordinate(new goog.math.Coordinate(1, 4));\n\
    figure1.setField(field);\n\
    \n\
    figure2.setField(null);\n\
    figure2.setCoordinate(new goog.math.Coordinate(1, 3));\n\
    figure2.setField(field);\n\
    \n\
    figure1.setField(null);\n\
    figure1.setCoordinate(new goog.math.Coordinate(2, 2));\n\
    figure1.setField(field);\n\
    \n\
    figure2.setField(null);\n\
    figure2.setCoordinate(new goog.math.Coordinate(3, 1));\n\
    figure2.setField(field);\n\
    \n\
    figure1.setField(null);\n\
    figure2.setField(null);\n\
}";
robot.PredefinedPrograms.addProgramCreator('demo1', robot.predefined.programs.demo1);

robot.predefined.programs.firstSimple = "function(field) {\n\
    var wallE = new robot.figures.WallE(new goog.math.Coordinate(0, 0), robot.Direction.DOWN);\n\
    wallE.setField(field);\n\
    wallE.move();\n\
    wallE.move();\n\
    wallE.move();\n\
    wallE.turnLeft();\n\
    wallE.move();\n\
    wallE.turnLeft();\n\
    wallE.move();\n\
    wallE.turnRight();\n\
    wallE.move();\n\
    wallE.move();\n\
    wallE.turnLeft();\n\
    wallE.move();\n\
    wallE.turnLeft();\n\
    wallE.move();\n\
    wallE.move();\n\
    wallE.turnRight();\n\
    wallE.move();\n\
}";
robot.PredefinedPrograms.addProgramCreator('first-simple', robot.predefined.programs.firstSimple);

robot.predefined.programs.firstCrash = "function(field) {\n\
    var wallE = new robot.figures.WallE(new goog.math.Coordinate(0, 0), robot.Direction.DOWN);\n\
    wallE.setField(field);\n\
    wallE.move();\n\
    wallE.move();\n\
    wallE.move();\n\
    wallE.turnLeft();\n\
    wallE.move();\n\
    wallE.turnLeft();\n\
    wallE.move();\n\
    wallE.turnRight();\n\
    wallE.move();\n\
    wallE.turnLeft();\n\
    wallE.move();\n\
    wallE.move(); // эта строка не выполнится\n\
}";
robot.PredefinedPrograms.addProgramCreator('first-crash', robot.predefined.programs.firstCrash);