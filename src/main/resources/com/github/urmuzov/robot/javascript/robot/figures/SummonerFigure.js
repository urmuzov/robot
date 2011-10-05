goog.provide('robot.figures.SummonerFigure');

goog.require('robot.figures.Figure');
goog.require('robot.figures.StackableFigure');

/**
 * @class
 * @constructor
 * @extends robot.figures.Figure
 * @param {!goog.math.Coordinate} coordinate начальная позиция
 * @param {!robot.Direction} direction начальное направление
 */
robot.figures.SummonerFigure = function(coordinate, direction) {
    robot.figures.Figure.call(this, coordinate, direction);
};
goog.inherits(robot.figures.SummonerFigure, robot.figures.Figure);

/**
 * Проверка на вызывать суммонить такую фигуру
 * @param {!robot.figures.Figure} figure
 * @return {boolean}
 */
robot.figures.SummonerFigure.prototype.canSummonOn = function(figure) {
    return figure instanceof robot.figures.StackableFigure;
};

/**
 * Вызов новой фигуры с указанным количеством
 * @param {number} count
 * @return {!robot.figures.Figure}
 */
robot.figures.SummonerFigure.prototype.summonNewFigure = function(count) {
    return new robot.figures.StackableFigure(this.getCoordinate(), count);
};

/**
 * Вызов дополнительного количества, указанной фигуры
 * @param {!robot.figures.Figure} figure
 * @param {number} count
 */
robot.figures.SummonerFigure.prototype.summonExtra = function(figure, count) {
    var f = (/** @type robot.figures.StackableFigure */ figure);
    f.setCount(f.getCount() + count);
};

/**
 * Получение количества у указанной фигуры
 * @param {!robot.figures.Figure} figure
 * @return {number}
 */
robot.figures.SummonerFigure.prototype.getCountFor = function(figure) {
    return (/** @type robot.figures.StackableFigure */ figure).getCount();
};

/**
 * Отзыв фигуры
 * @param {!robot.figures.Figure} figure
 */
robot.figures.SummonerFigure.prototype.dismissFigure = function(figure) {
    figure.setField(null);
};

/**
 * Отзыв указанного количества у фигуры
 * @param {!robot.figures.Figure} figure
 * @param {number} count
 */
robot.figures.SummonerFigure.prototype.dismissExtra = function(figure, count) {
    var f = (/** @type robot.figures.StackableFigure */ figure);
    f.setCount(f.getCount() - count);
};

/**
 * Получаем фигуру к которой можем подсуммонить на указанной позиции
 * @throws {Error} если фигура не подключена к полю или более одной фигуры к которой можно подсуммонить на указанной клетке
 * @param {?goog.math.Coordinate} coordinate
 */
robot.figures.SummonerFigure.prototype.getSummonableFigure = function(coordinate) {
    var field = this.getField();
    if (field == null) {
        throw new Error('Can\'t summon when not attached to field');
    }
    var figuresAtMyPos = field.getFiguresAt(coordinate);
    var summonableCount = 0;
    var summonableFigure = null;
    var figure;
    for (var i = 0; i < figuresAtMyPos.length; i++) {
        figure = figuresAtMyPos[i];
        if (!goog.isDefAndNotNull(figure)) {
            continue;
        }
        if (this.canSummonOn(figure)) {
            summonableCount++;
            summonableFigure = figure;
        }
        if (summonableCount > 1) {
            throw new Error('Can\'t summon. More than 1 summonable figure at this point');
        }
    }
    return summonableFigure;
};

/**
 * Суммоним указанное количество фигур
 * @throws {Error} см {@see robot.figures.SummonerFigure#getSummonableFigure}
 * @param {number} count
 */
robot.figures.SummonerFigure.prototype.summon = function(count) {
    var summonableFigure = this.getSummonableFigure(this.getCoordinate());
    if (summonableFigure == null) {
        var figure = this.summonNewFigure(count);
        figure.setField(this.getField());
    } else {
        this.summonExtra(summonableFigure, count);
    }
};

/**
 * Отзываем указанное количество фигур
 * @throws {Error} см {@see robot.figures.SummonerFigure#getSummonableFigure}
 * @param {number} count
 */
robot.figures.SummonerFigure.prototype.dismiss = function(count) {
    var summonableFigure = this.getSummonableFigure(this.getCoordinate());
    if (summonableFigure == null) {
        throw new Error('Can\'t dismiss. No summonable figures at this point');
    } else {
        var summonableFigureCount = this.getCountFor(summonableFigure);
        if (count > summonableFigureCount) {
            throw new Error('Not enough stack count');
        } else if (count = summonableFigureCount) {
            this.dismissFigure(summonableFigure);
        } else if (count < summonableFigureCount) {
            this.dismissExtra(summonableFigure, count);
        }
    }
};

