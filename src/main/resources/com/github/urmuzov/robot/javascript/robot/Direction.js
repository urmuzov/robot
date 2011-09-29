goog.provide('robot.Direction');
goog.provide('robot.DirectionsArray');

/**
 * @enum string
 */
robot.Direction = {
    UP: 'UP',
    RIGHT: 'RIGHT',
    DOWN: 'DOWN',
    LEFT: 'LEFT'
};

/**
 * @const
 * @type {Array.<robot.Direction>}
 */
robot.DirectionsArray = [robot.Direction.UP, robot.Direction.RIGHT, robot.Direction.DOWN, robot.Direction.LEFT];