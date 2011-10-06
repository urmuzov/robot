goog.provide('robot.visual.FigureVisualizer');

goog.require('robot.events.FigureEventType');
goog.require('goog.events.Event');

/**
 * @class
 * @constructor
 * @param {!robot.visual.FieldTableVisualizer} fieldVisualizer
 * @param {!robot.Field} field
 * @param {!robot.figures.Figure} figure
 */
robot.visual.FigureVisualizer = function(fieldVisualizer, field, figure) {
    /**
     * @private
     * @type !robot.visual.FieldTableVisualizer
     */
    this.fieldVisualizer_ = fieldVisualizer;
    /**
     * @private
     * @type !robot.Field
     */
    this.field_ = field;
    /**
     * @private
     * @type !robot.figures.Figure
     */
    this.figure_ = figure;

    /**
     * @private
     * @type Element
     */
    this.figureWrapperEl_ = goog.dom.createDom('div', {'className':'figure-wrapper'});
    goog.style.setSize(this.figureWrapperEl_, this.fieldVisualizer_.getCellSize());

    /**
     * @private
     * @type Object.<robot.Direction, Element>
     */
    this.figureElsByDirection_ = {};
};

/**
 * @protected
 * @type goog.debug.Logger
 */
robot.visual.FigureVisualizer.prototype.logger = goog.debug.Logger.getLogger('robot.visual.FigureVisualizer');

/**
 * @return {!robot.visual.FieldTableVisualizer}
 */
robot.visual.FigureVisualizer.prototype.getFieldVisualizer = function() {
    return this.fieldVisualizer_;
};
/**
 * @return {!robot.Field}
 */
robot.visual.FigureVisualizer.prototype.getField = function() {
    return this.field_;
};
/**
 * @return {!robot.figures.Figure}
 */
robot.visual.FigureVisualizer.prototype.getFigure = function() {
    return this.figure_;
};
/**
 * @param {!Element} container
 */
robot.visual.FigureVisualizer.prototype.render = function(container) {
    goog.dom.appendChild(container, this.figureWrapperEl_);
};

/**
 * @param {!goog.fx.AnimationQueue} animationQueue
 * @param {number} animationTime
 * @param {!robot.events.FigureEvent} figureEvent
 */
robot.visual.FigureVisualizer.prototype.attachAnimation = function(animationQueue, animationTime, figureEvent) {
    var eventType = figureEvent.type;
    if (eventType == robot.events.FigureEventType.ADDED) {
        this.attachAddedAnimation(animationQueue, animationTime, figureEvent);
    } else if (eventType == robot.events.FigureEventType.MOVED) {
        this.attachMovedAnimation(animationQueue, animationTime, figureEvent);
    } else if (eventType == robot.events.FigureEventType.ROTATED) {
        if (!(figureEvent instanceof robot.events.FigureRotatedEvent)) {
            throw new Error('FigureVisualizer need instance of robot.events.FigureRotatedEvent for rotation');
        }
        this.attachRotatedAnimation(animationQueue, animationTime, (/** @type !robot.events.FigureRotatedEvent */figureEvent));
    } else if (eventType == robot.events.FigureEventType.CRUSHED) {
        this.attachCrushedAnimation(animationQueue, animationTime, figureEvent);
    } else if (eventType == robot.events.FigureEventType.UPDATED) {
        this.attachUpdatedAnimation(animationQueue, animationTime, figureEvent);
    } else if (eventType == robot.events.FigureEventType.REMOVED) {
        this.attachRemovedAnimation(animationQueue, animationTime, figureEvent);
    } else {
        throw new Error("FieldTableVisualizer can't process event type '" + eventType + "'");
    }
};
/**
 * @param {!goog.fx.AnimationQueue} animationQueue
 * @param {number} animationTime
 * @param {!robot.events.FigureEvent} figureEvent
 */
robot.visual.FigureVisualizer.prototype.attachAddedAnimation = function(animationQueue, animationTime, figureEvent) {
    this.fillFigureWrapper(figureEvent);
    var coordinate = figureEvent.snapshotAfter.coordinate;
    var direction = figureEvent.snapshotAfter.direction;
    var pixelPosition = this.fieldVisualizer_.getCellPosition(coordinate);
    var animation = new goog.fx.dom.FadeIn(this.figureElsByDirection_[direction], animationTime);
    animation.addEventListener(goog.fx.Transition.EventType.BEGIN, function() {
        goog.style.setPosition(this.figureWrapperEl_, pixelPosition);
    }, false, this);
    animationQueue.add(animation);
    this.logger.info("Animation FadeIn pixelPosition: " + pixelPosition);
};

/**
 * @param {!goog.fx.AnimationQueue} animationQueue
 * @param {number} animationTime
 * @param {!robot.events.FigureEvent} figureEvent
 */
robot.visual.FigureVisualizer.prototype.attachMovedAnimation = function(animationQueue, animationTime, figureEvent) {
    var oldCoordXY = this.fieldVisualizer_.getCellPosition(figureEvent.snapshotBefore.coordinate);
    var newCoordXY = this.fieldVisualizer_.getCellPosition(figureEvent.snapshotAfter.coordinate);
    animationQueue.add(new goog.fx.dom.Slide(this.figureWrapperEl_, [oldCoordXY.x, oldCoordXY.y], [newCoordXY.x, newCoordXY.y], animationTime));
    this.logger.info("Animation Move: from " + oldCoordXY + " to " + newCoordXY);
};

/**
 * @param {!goog.fx.AnimationQueue} animationQueue
 * @param {number} animationTime
 * @param {!robot.events.FigureRotatedEvent} figureRotatedEvent
 */
robot.visual.FigureVisualizer.prototype.attachRotatedAnimation = function(animationQueue, animationTime, figureRotatedEvent) {
    var directionPath = robot.directionStartEndToPath(
        figureRotatedEvent.snapshotBefore.direction,
        figureRotatedEvent.snapshotAfter.direction,
        figureRotatedEvent.rotation
    );
    for (var i = 0; i < directionPath.length - 1; i++) {
        var animationStep = new goog.fx.AnimationParallelQueue();
        var figurePrevEl = this.figureElsByDirection_[directionPath[i]];
        var figureNextEl = this.figureElsByDirection_[directionPath[i + 1]];
        animationStep.add(new goog.fx.dom.FadeOut(figurePrevEl, animationTime));
        animationStep.add(new goog.fx.dom.FadeIn(figureNextEl, animationTime));
        animationQueue.add(animationStep);
    }
    this.logger.info("Animation Rotated");
};

/**
 * @param {!goog.fx.AnimationQueue} animationQueue
 * @param {number} animationTime
 * @param {!robot.events.FigureEvent} figureEvent
 */
robot.visual.FigureVisualizer.prototype.attachCrushedAnimation = function(animationQueue, animationTime, figureEvent) {
    var figureEl = this.figureElsByDirection_[figureEvent.snapshotAfter.direction];
    var bgColor = goog.color.hexToRgb(goog.color.parse(goog.style.getBackgroundColor(figureEl)).hex);
    var redColor = [255,0,0];
    animationQueue.add(new goog.fx.dom.BgColorTransform(figureEl, bgColor, redColor, animationTime / 3));
    animationQueue.add(new goog.fx.dom.BgColorTransform(figureEl, redColor, bgColor, animationTime / 3));
    animationQueue.add(new goog.fx.dom.BgColorTransform(figureEl, bgColor, redColor, animationTime / 3));
    animationQueue.add(new goog.fx.dom.BgColorTransform(figureEl, redColor, bgColor, animationTime / 3));
    animationQueue.add(new goog.fx.dom.BgColorTransform(figureEl, bgColor, redColor, animationTime / 3));
    this.logger.info("Animation Crush");
};

/**
 * @param {!goog.fx.AnimationQueue} animationQueue
 * @param {number} animationTime
 * @param {!robot.events.FigureEvent} figureEvent
 */
robot.visual.FigureVisualizer.prototype.attachUpdatedAnimation = function(animationQueue, animationTime, figureEvent) {
    var directionElsBackup = goog.object.getValues(this.figureElsByDirection_);
    var oldFigureEl = this.figureElsByDirection_[figureEvent.snapshotBefore.direction];
    this.fillFigureWrapper(figureEvent);
    var newFigureEl = this.figureElsByDirection_[figureEvent.snapshotAfter.direction];

    var fadeOut = new goog.fx.dom.Fade(oldFigureEl, 1, 0.5, animationTime / 2);
    var fadeIn = new goog.fx.dom.Fade(newFigureEl, 0.5, 1, animationTime / 2);
    animationQueue.add(fadeOut);
    animationQueue.add(fadeIn);

    fadeIn.addEventListener(goog.fx.Transition.EventType.BEGIN, function() {
        for (var i = 0; i < directionElsBackup.length; i++) {
            goog.dom.removeNode(directionElsBackup[i]);
        }
    }, false, this);


    this.logger.info("Animation Update");
};

/**
 * @param {!goog.fx.AnimationQueue} animationQueue
 * @param {number} animationTime
 * @param {!robot.events.FigureEvent} figureEvent
 */
robot.visual.FigureVisualizer.prototype.attachRemovedAnimation = function(animationQueue, animationTime, figureEvent) {
    var oldFigureEl = this.figureElsByDirection_[figureEvent.snapshotBefore.direction];

    var fadeOut = new goog.fx.dom.Fade(oldFigureEl, 1, 0, animationTime);
    animationQueue.add(fadeOut);

    var directionEls = goog.object.getValues(this.figureElsByDirection_);
    fadeOut.addEventListener(goog.fx.Transition.EventType.END, function() {
        for (var i = 0; i < directionEls.length; i++) {
            goog.dom.removeNode(directionEls[i]);
        }
        this.figureElsByDirection_ = {};
    }, false, this);


    this.logger.info("Animation Removed");
};

/**
 * Заполнение враппера элементами для вида во всех направлениях
 * @protected
 * @param {!robot.events.FigureEvent} figureEvent
 */
robot.visual.FigureVisualizer.prototype.fillFigureWrapper = function(figureEvent) {
    var figureEl;
    var directions = robot.DirectionsArray;
    this.figureElsByDirection_ = {};
    for (var i = 0; i < directions.length; i++) {
        figureEl = this.createFigureDirectionElement(directions[i], figureEvent);
        this.figureElsByDirection_[directions[i]] = figureEl;
        goog.dom.appendChild(this.figureWrapperEl_, figureEl);
    }
};

/**
 * Создание элемента, для вида в одном направлении
 * @protected
 * @param {!robot.Direction} direction
 * @param {!robot.events.FigureEvent} figureEvent
 * @return {!Element}
 */
robot.visual.FigureVisualizer.prototype.createFigureDirectionElement = function(direction, figureEvent) {
    var figureEl = goog.dom.createDom('div');
    goog.style.setOpacity(figureEl, 0);
    goog.style.setSize(figureEl, this.fieldVisualizer_.getCellSize());
    this.renderFigureDirection(direction, figureEl, figureEvent);
    return figureEl;
};
/**
 * Рендринг фигуры
 * @protected
 * @param {!robot.Direction} direction
 * @param {!Element} container
 * @param {!robot.events.FigureEvent} figureEvent
 */
robot.visual.FigureVisualizer.prototype.renderFigureDirection = function(direction, container, figureEvent) {
    var h = 'unknown';
    if (direction == robot.Direction.UP) {
        h = '&uarr;';
    } else if (direction == robot.Direction.RIGHT) {
        h = '&rarr;';
    } else if (direction == robot.Direction.DOWN) {
        h = '&darr;';
    } else if (direction == robot.Direction.LEFT) {
        h = '&larr;';
    }
    var el = goog.dom.createDom('div', {'innerHTML':'figure:' + goog.getUid(this.figure_) + "<br />" + h});
    goog.dom.appendChild(container, el);
};
