goog.provide('robot.figures.Figure');

goog.require('goog.events.EventTarget');
goog.require('robot');
goog.require('robot.Rotation');
goog.require('robot.figures.FigureSnapshot');
goog.require('robot.events.FigureEvent');
goog.require('robot.events.FigureEventType');
goog.require('robot.events.FigureMovedEvent');
goog.require('robot.events.FigureRotatedEvent');

/**
 * Класс фигуры, располагаемой на поле
 * @class
 * @constructor
 * @extends goog.events.EventTarget
 * @param {!goog.math.Coordinate} coordinate начальная позиция
 * @param {!robot.Direction} direction начальное направление
 */
robot.figures.Figure = function(coordinate, direction) {
    goog.events.EventTarget.call(this);

    /**
     * @private
     * @type robot.Field
     */
    this.field_ = null;
    /**
     * @private
     * @type !goog.math.Coordinate
     */
    this.coordinate_ = coordinate;
    /**
     * @private
     * @type !robot.Direction
     */
    this.direction_ = direction;

};
goog.inherits(robot.figures.Figure, goog.events.EventTarget);

/**
 * @protected
 * @type goog.debug.Logger
 */
robot.figures.Figure.prototype.logger_ = goog.debug.Logger.getLogger('robot.figures.Figure');

/**
 * Получение поля, которому принадлежит эта фигура
 * @return {robot.Field}
 */
robot.figures.Figure.prototype.getField = function() {
    return this.field_;
};

/**
 * Получение поля, которому принадлежит эта фигура
 * @param {robot.Field} field
 */
robot.figures.Figure.prototype.setField = function(field) {
    if (goog.isNull(field)) {
        this.field_.removeFigure(this);
        this.setParentEventTarget(null);
    } else {
        field.addFigure(this);
        this.setParentEventTarget(field);
    }
    this.field_ = field;
};

/**
 * Получение координаты
 * @return {!goog.math.Coordinate}
 */
robot.figures.Figure.prototype.getCoordinate = function() {
    return this.coordinate_.clone();
};

/**
 * Установка координаты
 * @param {!goog.math.Coordinate} coordinate
 */
robot.figures.Figure.prototype.setCoordinate = function(coordinate) {
    this.coordinate_ = coordinate;
};

/**
 * Получение направления
 * @return {!robot.Direction}
 */
robot.figures.Figure.prototype.getDirection = function() {
    return this.direction_;
};

/**
 * Установка направления
 * @param {!robot.Direction} direction
 */
robot.figures.Figure.prototype.setDirection = function(direction) {
    this.direction_ = direction;
};

/**
 * Получение направления
 * @return {!robot.figures.FigureSnapshot}
 */
robot.figures.Figure.prototype.getSnapshot = function() {
    return new robot.figures.FigureSnapshot(this.coordinate_.clone(), this.direction_);
};

/**
 * Перемещение на клетку вниз
 * @param {!robot.Direction} direction
 */
robot.figures.Figure.prototype.moveTo = function(direction) {
    var before = this.getSnapshot();
    var newCoord = before.coordinate.clone();
    if (direction == robot.Direction.DOWN) {
        newCoord.y++;
    } else if (direction == robot.Direction.UP) {
        newCoord.y--;
    } else if (direction == robot.Direction.RIGHT) {
        newCoord.x++;
    } else if (direction == robot.Direction.LEFT) {
        newCoord.x--;
    }
    this.coordinate_ = newCoord;
    var after = this.getSnapshot();
    if (this.field_.isWallOn(direction, before.coordinate)) {
        this.logger_.info("crushed " + this.toLogString());
        var ev = new robot.events.FigureMovedEvent(robot.events.FigureEventType.CRUSHED, this, before, after, direction);
        this.dispatchEvent(ev);
        this.logger_.info("dispatched " + ev.toString());
        throw new robot.WallException(direction, before.coordinate);
    }
    var ev = new robot.events.FigureMovedEvent(robot.events.FigureEventType.MOVED, this, before, after, direction);
    this.dispatchEvent(ev);
    this.logger_.info("moved " + ev.toString());
};

/**
 * Вращение до указанной стороны
 * @param {!robot.Direction} direction
 * @param {!robot.Rotation} rotation
 */
robot.figures.Figure.prototype.rotateTo = function(direction, rotation) {
    var before = this.getSnapshot();
    this.direction_ = direction;
    var after = this.getSnapshot();
    var ev = new robot.events.FigureRotatedEvent(this, before, after, rotation);
    this.dispatchEvent(ev);
    this.logger_.info("rotated " + ev.toString());
};


/**
 * Уведомление о изменении состояния фигуры
 */
robot.figures.Figure.prototype.update = function() {
    var before = this.getSnapshot();
    this.updateInternal_();
    var after = this.getSnapshot();
    var ev = new robot.events.FigureEvent(robot.events.FigureEventType.UPDATED, this, before, after);
    this.dispatchEvent(ev);
    this.logger_.info("updated " + ev.toString());
};

/**
 * @protected
 */
robot.figures.Figure.prototype.updateInternal_ = function() {
};

/**
 * @override
 * @return {string}
 */
robot.figures.Figure.prototype.toString = function() {
    return "Figure(uid[" + goog.getUid(this) + "])";
};

/**
 * @return {string}
 */
robot.figures.Figure.prototype.toLogString = function() {
    return 'uid[' + goog.getUid(this) + "] coordinate[" + this.coordinate_ + "] direction[" + this.direction_ + "]";
};

/**
 * Перемещение на одну клетку вперед
 */
robot.figures.Figure.prototype.move = function() {
    this.moveTo(this.getDirection());
};

/**
 * Поворот на 90 градусов против часовой стрелки
 */
robot.figures.Figure.prototype.turnLeft = function() {
    this.rotateTo(robot.rotateCounterclockwiseFrom(this.getDirection()), robot.Rotation.COUNTERCLOCKWISE);
};

/**
 * Поворот на 90 градусов по часовой стрелке
 */
robot.figures.Figure.prototype.turnRight = function() {
    this.rotateTo(robot.rotateClockwiseFrom(this.getDirection()), robot.Rotation.CLOCKWISE);
};
