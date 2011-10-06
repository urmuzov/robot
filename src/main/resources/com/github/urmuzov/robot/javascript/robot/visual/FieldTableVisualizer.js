goog.provide('robot.visual.FieldTableVisualizer');

goog.require('robot.figures.StackableFigure');
goog.require('robot.events.FigureEventType');
goog.require('robot.events.FigureMovedEvent');
goog.require('robot.visual.FigureVisualizer');
goog.require('robot.visual.StackableFigureVisualizer');
goog.require('robot.visual.WallEVisualizer');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.fx.AnimationSerialQueue');
goog.require('goog.fx.dom.Slide');

/**
 * Визуализатор поля в виде HTML таблицы
 * @class
 * @constructor
 * @extends goog.Disposable
 * @param {!robot.Field} field
 */
robot.visual.FieldTableVisualizer = function(field) {
    goog.Disposable.call(this);
    /**
     * @private
     * @type number
     */
    this.animationTime_ = 1000;
    /**
     * @private
     * @type !robot.Field
     */
    this.field_ = field;
    /**
     * @private
     * @type Element
     */
    this.parentElement_ = null;
    /**
     * @private
     * @type Element
     */
    this.tableElement_ = null;
    /**
     * @private
     * @type Element
     */
    this.figuresElement_ = null;
    /**
     * @private
     * @type Element
     */
    this.containerElement_ = null;
    /**
     * @private
     * @type Array.<function(robot.visual.FieldTableVisualizer, robot.Field, robot.figures.Figure):?robot.visual.FigureVisualizer>
     */
    this.figureVisualizerCreators_ = [];
    /**
     * @private
     * @type Object.<number, robot.visual.FigureVisualizer>
     */
    this.figureVisualizersByUid_ = {};
    /**
     * @private
     * @type Array.<function()>
     */
    this.animationCreatorQueue_ = [];
    /**
     * @private
     * @type goog.fx.AnimationSerialQueue
     */
    this.animationQueue_ = null;
    /**
     * @private
     * @type goog.math.Size
     */
    this.cellSize_ = null;

    /**
     * @private
     * @type ?number
     */
    this.fieldListenKey_ = goog.events.listen(
        this.field_,
        [
            robot.events.FigureEventType.ADDED,
            robot.events.FigureEventType.MOVED,
            robot.events.FigureEventType.ROTATED,
            robot.events.FigureEventType.CRUSHED,
            robot.events.FigureEventType.UPDATED,
            robot.events.FigureEventType.REMOVED
        ],
        this.figureEventQueuePush_,
        false,
        this
    );

    this.addFigureVisualizerCreator(function(fieldVisializer, field, figure) {
        return figure instanceof robot.figures.Figure ? new robot.visual.FigureVisualizer(fieldVisializer, field, figure) : null;
    });
    this.addFigureVisualizerCreator(function(fieldVisializer, field, figure) {
        return figure instanceof robot.figures.StackableFigure ? new robot.visual.StackableFigureVisualizer(fieldVisializer, field, figure) : null;
    });
    this.addFigureVisualizerCreator(function(fieldVisializer, field, figure) {
        return figure instanceof robot.figures.WallE ? new robot.visual.WallEVisualizer(fieldVisializer, field, figure) : null;
    });
};
goog.inherits(robot.visual.FieldTableVisualizer, goog.Disposable);

/**
 * @protected
 * @type goog.debug.Logger
 */
robot.visual.FieldTableVisualizer.prototype.logger = goog.debug.Logger.getLogger('robot.visual.FieldTableVisualizer');

/**
 * Добавление функции создающей фигуры.
 * Функция должна возвращать null, если визуализатор не обрабатывает такую фигуру.
 * Также нужно учесть, что визуализаторы для общих типов фигур нужно добавлять раньше, чем для узких типов
 * @param {function(robot.visual.FieldTableVisualizer, robot.Field, robot.figures.Figure):?robot.visual.FigureVisualizer} creatorFunction
 */
robot.visual.FieldTableVisualizer.prototype.addFigureVisualizerCreator = function(creatorFunction) {
    this.figureVisualizerCreators_.push(creatorFunction);
};

/**
 * @return {number}
 */
robot.visual.FieldTableVisualizer.prototype.getAnimationTime = function() {
    return this.animationTime_;
};

/**
 * @param {number} animationTime
 */
robot.visual.FieldTableVisualizer.prototype.setAnimationTime = function(animationTime) {
    this.animationTime_ = animationTime;
};

/**
 * Получение визуализатора фигуры (и создание, если не был создан)
 * @param {!robot.figures.Figure} figure
 * @return {!robot.visual.FigureVisualizer}
 */
robot.visual.FieldTableVisualizer.prototype.getFigureVisualizer = function(figure) {
    var uid = goog.getUid(figure);
    var visual = this.figureVisualizersByUid_[uid];
    if (!goog.isDefAndNotNull(visual)) {
        for (var i = this.figureVisualizerCreators_.length - 1; i >= 0; i--) {
            visual = this.figureVisualizerCreators_[i](this, this.field_, figure);
            if (goog.isDefAndNotNull(visual)) {
                this.figureVisualizersByUid_[uid] = visual;
                break;
            }
        }
    }
    if (goog.isDefAndNotNull(visual)) {
        if (this.figuresElement_ == null) {
            throw new Error('Visualizer is not rendered yet. Can\'t render figure');
        }
        visual.render(this.figuresElement_);
        return visual;
    } else {
        throw new Error("Visualizer for " + figure.toString() + " not found");
    }
};


/**
 * Рендринг таблицы в определенный элемент
 * @param {!Element} parentElement
 */
robot.visual.FieldTableVisualizer.prototype.render = function(parentElement) {
    this.parentElement_ = parentElement;

    var field = this.field_;
    var width = field.getWidth();
    var height = field.getHeight();
    var bounds = goog.style.getBounds(this.parentElement_);
    var cellWidth = bounds.width / width;
    var cellHeight = bounds.height / height;
    // Устанавливаем размер ячейки, берем минимальное из ширины и высоты, чтобы вписаться в отведенную область
    if (cellWidth > cellHeight) {
        cellWidth = cellHeight;
    } else {
        cellHeight = cellWidth;
    }
    this.cellSize_ = new goog.math.Size(cellWidth, cellHeight);

    this.tableElement_ = goog.dom.createDom('table', {'cellspacing':0, 'cellpadding':0, 'className':'field'});
    var row;
    var cell;
    var coord;
    for (var j = 0; j < height; j++) {
        row = this.tableElement_.insertRow(j);
        row.style.height = this.cellSize_.height + 'px';
        for (var i = 0; i < width; i++) {
            cell = row.insertCell(i);
            cell.style.width = this.cellSize_.width + 'px';
            coord = new goog.math.Coordinate(i, j);
            if (field.isWallOnTop(coord)) {
                goog.dom.classes.add(cell, 'border-top');
            }
            if (field.isWallOnRight(coord)) {
                goog.dom.classes.add(cell, 'border-right');
            }
            if (field.isWallOnBottom(coord)) {
                goog.dom.classes.add(cell, 'border-bottom');
            }
            if (field.isWallOnLeft(coord)) {
                goog.dom.classes.add(cell, 'border-left');
            }
        }
    }

    this.figuresElement_ = goog.dom.createDom('div', {'className':'figures'});

    this.containerElement_ = goog.dom.createDom(
        'div',
        {'className':'field-container'},
        this.figuresElement_,
        this.tableElement_
    );

    goog.dom.appendChild(this.parentElement_, this.containerElement_);
};

/**
 * @inheritDoc
 */
robot.visual.FieldTableVisualizer.prototype.disposeInternal = function() {
    goog.dom.removeNode(this.containerElement_);
    robot.visual.FieldTableVisualizer.superClass_.disposeInternal.call(this);
    goog.dispose(this.animationQueue_);
    if (!goog.isNull(this.fieldListenKey_))
        goog.events.unlistenByKey(this.fieldListenKey_);
    delete this.field_;
    delete this.parentElement_;
    delete this.tableElement_;
    delete this.figuresElement_;
    delete this.containerElement_;
    delete this.figureVisualizerCreators_;
    delete this.figureVisualizersByUid_;
    delete this.animationCreatorQueue_;
    delete this.cellSize_;
};

/**
 * @private
 * @param {robot.events.FigureEvent} figureEvent
 */
robot.visual.FieldTableVisualizer.prototype.figureEventQueuePush_ = function(figureEvent) {
    this.animationCreatorQueue_.push(function() {
        var visual = this.getFigureVisualizer(figureEvent.figure);
        visual.attachAnimation(this.animationQueue_, this.animationTime_, figureEvent);
    });
};

/**
 * @return {goog.math.Size}
 */
robot.visual.FieldTableVisualizer.prototype.getCellSize = function() {
    return this.cellSize_;
};

/**
 * @param {goog.math.Coordinate} coordinate координата ячейки
 * @return {goog.math.Coordinate} позиция в пикселях
 */
robot.visual.FieldTableVisualizer.prototype.getCellPosition = function(coordinate) {
    var cell = this.tableElement_.rows[coordinate.y].cells[coordinate.x];
    return goog.style.getPosition(cell);
};


robot.visual.FieldTableVisualizer.prototype.play = function() {
    if (goog.isNull(this.animationQueue_)) {
        this.animationQueue_ = new goog.fx.AnimationSerialQueue();
        for (var i = 0; i < this.animationCreatorQueue_.length; i++) {
            this.animationCreatorQueue_[i].call(this);
        }
    }
    this.animationQueue_.play(true);
};
