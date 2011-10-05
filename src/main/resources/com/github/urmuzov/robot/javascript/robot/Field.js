goog.provide('robot.Field');
goog.provide('robot.Field.WallPosition');

goog.require('robot.WallException');
goog.require('robot.Direction');
goog.require('robot.events.FigureEvent');
goog.require('robot.events.FigureMovedEvent');
goog.require('robot.events.FigureRotatedEvent');
goog.require('robot.figures.Figure');
goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

/**
 * @class
 * @constructor
 * @extends goog.events.EventTarget
 * @param {number} width
 * @param {number} height
 */
robot.Field = function(width, height) {
    goog.events.EventTarget.call(this);
    this.width_ = width;
    this.height_ = height;
    this.walls_ = robot.Field.generateEmptyField(width, height);
    this.figures_ = [];

    this.logger_.info("created " + width + "x" + height);
};
goog.inherits(robot.Field, goog.events.EventTarget);

/**
 * @protected
 * @type goog.debug.Logger
 */
robot.Field.prototype.logger_ = goog.debug.Logger.getLogger('robot.Field');

/**
 * Положение стены у ячейки
 * @enum {number}
 */
robot.Field.WallPosition = {
    RIGHT: 1,
    BOTTOM: 2
};

/**
 * Генерирование пустого поля нужного размера
 * @static
 * @param {number} width
 * @param {number} height
 * @return {Array.<Array.<number>>}
 */
robot.Field.generateEmptyField = function(width, height) {
    var field = [];
    var column;
    for (var i = 0; i < width; i++) {
        column = [];
        for (var j = 0; j < height; j++) {
            column.push(0);
        }
        field.push(column)
    }
    return field;
};

/**
 * Получение количества ячеек в строке
 * @return {number}
 */
robot.Field.prototype.getWidth = function() {
    return this.width_;
};

/**
 * Получение количества ячеек в столбце
 * @return {number}
 */
robot.Field.prototype.getHeight = function() {
    return this.height_;
};

/**
 * Получение "сырого" значения стен ячейки
 * @private
 * @param {goog.math.Coordinate} coordinate
 * @return {number} значение или -1 если ячейка за границами
 */
robot.Field.prototype.getWallValue_ = function(coordinate) {
    if (goog.isDef(this.walls_[coordinate.x])) {
        if (goog.isDef(this.walls_[coordinate.x][coordinate.y])) {
            return this.walls_[coordinate.x][coordinate.y];
        } else {
            return -1;
        }
    } else {
        return -1;
    }
};

/**
 * Установка "сырого" значения стены
 * @throws {Error} если координаты выходят за границы
 * @private
 * @param {goog.math.Coordinate} coordinate
 * @param {number} value
 */
robot.Field.prototype.setWallValue_ = function(coordinate, value) {
    if (goog.isDef(this.walls_[coordinate.x])) {
        if (goog.isDef(this.walls_[coordinate.x][coordinate.y])) {
            this.walls_[coordinate.x][coordinate.y] = value;
        } else {
            throw new Error("There is no square (" + coordinate.x + ";" + coordinate.y + ")");
        }
    } else {
        throw new Error("There is no column (" + coordinate.x + ")");
    }
};

/**
 * Установка стены справа от ячейки
 * @throws {Error} если координаты выходят за границы
 * @see robot.Field#setWallValue_
 * @see robot.Field#getWallValue_
 * @param {goog.math.Coordinate} coordinate
 */
robot.Field.prototype.putWallOnRight = function(coordinate) {
    this.setWallValue_(coordinate, this.getWallValue_(coordinate) | robot.Field.WallPosition.RIGHT);
};

/**
 * Установка стены снизу от ячейки
 * @throws {Error} если координаты выходят за границы
 * @see robot.Field#setWallValue_
 * @see robot.Field#getWallValue_
 * @param {goog.math.Coordinate} coordinate
 */
robot.Field.prototype.putWallOnBottom = function(coordinate) {
    this.setWallValue_(coordinate, this.getWallValue_(coordinate) | robot.Field.WallPosition.BOTTOM);
};

/**
 * Устанавливает вертикальную стену.
 * Стена ставится СПРАВА от указанных координат
 * Стена ставится СНИЗУ от указанных координат
 * @throws {Error} если координаты выходят за границы
 * @see robot.Field#putWallOnRight
 * @param {goog.math.Coordinate} start
 * @param {goog.math.Coordinate} end
 */
robot.Field.prototype.putWall = function(start, end) {
    for (var i = start.y; i < end.y; i++) {
        this.putWallOnRight(new goog.math.Coordinate(start.x, i));
    }
    for (var i = start.x; i < end.x; i++) {
        this.putWallOnBottom(new goog.math.Coordinate(i, start.y));
    }
};
/**
 * Проверяет есть ли стена справа
 * @throws {Error} если координаты выходят за границы
 * @param {goog.math.Coordinate} coordinate
 * @return {boolean}
 */
robot.Field.prototype.isWallOnRight = function(coordinate) {
    var value = this.getWallValue_(coordinate);
    return Boolean(value & robot.Field.WallPosition.RIGHT) || coordinate.x == (this.width_ - 1);
};

/**
 * Проверяет есть ли стена снизу
 * @throws {Error} если координаты выходят за границы
 * @param {goog.math.Coordinate} coordinate
 * @return {boolean}
 */
robot.Field.prototype.isWallOnBottom = function(coordinate) {
    var value = this.getWallValue_(coordinate);
    return Boolean(value & robot.Field.WallPosition.BOTTOM) || coordinate.y == (this.height_ - 1);
};

/**
 * Проверяет есть ли стена слева
 * @throws {Error} если координаты выходят за границы
 * @param {goog.math.Coordinate} coordinate
 * @return {boolean}
 */
robot.Field.prototype.isWallOnLeft = function(coordinate) {
    if (coordinate.x == 0) {
        return true;
    }
    return this.isWallOnRight(new goog.math.Coordinate(coordinate.x - 1, coordinate.y));
};

/**
 * Проверяет есть ли стена сверху
 * @throws {Error} если координаты выходят за границы
 * @param {goog.math.Coordinate} coordinate
 * @return {boolean}
 */
robot.Field.prototype.isWallOnTop = function(coordinate) {
    if (coordinate.y == 0) {
        return true;
    }
    return this.isWallOnBottom(new goog.math.Coordinate(coordinate.x, coordinate.y - 1));
};

/**
 * Проверяет есть ли стена
 * @throws {Error} если координаты выходят за границы
 * @param {robot.Direction} direction
 * @param {goog.math.Coordinate} coordinate
 * @return {boolean}
 */
robot.Field.prototype.isWallOn = function(direction, coordinate) {
    if (direction == robot.Direction.RIGHT) {
        return this.isWallOnRight(coordinate);
    }
    if (direction == robot.Direction.LEFT) {
        return this.isWallOnLeft(coordinate);
    }
    if (direction == robot.Direction.DOWN) {
        return this.isWallOnBottom(coordinate);
    }
    if (direction == robot.Direction.UP) {
        return this.isWallOnTop(coordinate);
    }
    return true;
};

/**
 * Добавляет фигуру на поле
 * @param {robot.figures.Figure} figure
 */
robot.Field.prototype.addFigure = function(figure) {
    if (goog.array.indexOf(this.figures_, figure) != -1) {
        return;
    }
    this.figures_.push(figure);
    figure.setField(this);
    var ev = new robot.events.FigureEvent(robot.events.FigureEventType.ADDED, figure, figure.getSnapshot(), figure.getSnapshot());
    this.dispatchEvent(ev);
    this.logger_.info("added " + ev.toString());

};

/**
 * Удаление фигуры с поля
 * @param {robot.figures.Figure} figure
 */
robot.Field.prototype.removeFigure = function(figure) {
    if (goog.array.indexOf(this.figures_, figure) == -1) {
        return;
    }
    goog.array.remove(this.figures_, figure);
    figure.setField(null);
    this.field_ = null;
    var ev = new robot.events.FigureEvent(robot.events.FigureEventType.REMOVED, figure, figure.getSnapshot(), figure.getSnapshot());
    this.dispatchEvent(ev);
    this.logger_.info("removed " + ev.toString());
};



/**
 * Добавляет фигуру на поле
 * @return {Array.<robot.figures.Figure>}
 */
robot.Field.prototype.getFigures = function() {
    return this.figures_;
};

/**
 * Получение массива фигур находящихся в определенной точке поля
 * @param {goog.math.Coordinate} coordinate
 * @return {!Array.<robot.figures.Figure>}
 */
robot.Field.prototype.getFiguresAt = function(coordinate) {
    var out = [];
    var figure;
    for (var i = 0; i < this.figures_.length; i++) {
        figure = this.figures_[i];
        if (goog.math.Coordinate.equals(figure.getCoordinate(), coordinate)) {
            out.push(figure);
        }
    }
    return out;
};

///**
// * @override
// */
//robot.Field.prototype.toString = function() {
//    var out = "  ";
//    for (var i = 0; i < this.width_; i++) {
//        out += i + " ";
//    }
//    out += "\n";
//
//    for (var j = 0; j < this.height_; j++) {
//        out += j + " ";
//        for (var i = 0; i < this.width_; i++) {
//            out += this.getWallValue_(new goog.math.Coordinate(i, j)) + " ";
//        }
//        out += "\n";
//    }
//    return out;
//};

