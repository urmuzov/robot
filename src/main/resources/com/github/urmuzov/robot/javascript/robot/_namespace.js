goog.provide('robot');

/**
 * @param {robot.Direction} direction
 * @return {robot.Direction}
 */
robot.rotateClockwiseFrom = function(direction) {
    var clockwiseNext = {};
    clockwiseNext[robot.Direction.UP] = robot.Direction.RIGHT;
    clockwiseNext[robot.Direction.RIGHT] = robot.Direction.DOWN;
    clockwiseNext[robot.Direction.DOWN] = robot.Direction.LEFT;
    clockwiseNext[robot.Direction.LEFT] = robot.Direction.UP;
    return clockwiseNext[direction];
};

/**
 * @param {robot.Direction} direction
 * @return {robot.Direction}
 */
robot.rotateCounterclockwiseFrom = function(direction) {
    var counterclockwiseNext = {};
    counterclockwiseNext[robot.Direction.RIGHT] = robot.Direction.UP;
    counterclockwiseNext[robot.Direction.DOWN] = robot.Direction.RIGHT;
    counterclockwiseNext[robot.Direction.LEFT] = robot.Direction.DOWN;
    counterclockwiseNext[robot.Direction.UP] = robot.Direction.LEFT;
    return counterclockwiseNext[direction];
};

/**
 *
 * @param {!robot.Direction} startDirection
 * @param {!robot.Direction} endDirection
 * @param {!robot.Rotation} rotation
 */
robot.directionStartEndToPath = function(startDirection, endDirection, rotation) {
    /**
     * @const
     */
    var sequence = [
        robot.Direction.UP,
        robot.Direction.RIGHT,
        robot.Direction.DOWN,
        robot.Direction.LEFT,
        robot.Direction.UP,
        robot.Direction.RIGHT,
        robot.Direction.DOWN
    ];
    if (rotation == robot.Rotation.COUNTERCLOCKWISE) {
        sequence.reverse();
    }
    var i = 0;
    for (; i < sequence.length && sequence[i] != startDirection; i++) {
    }
    var directionPath = [];
    for (; i < sequence.length && sequence[i] != endDirection; i++) {
        directionPath.push(sequence[i]);
    }
    directionPath.push(sequence[i]);
    return directionPath;
};