goog.provide('robot.ui.DemoUI');

goog.require('goog.dom');
goog.require('goog.debug.DivConsole');
goog.require('goog.debug.Logger');
goog.require('goog.ui.Slider');
goog.require('goog.storage.Storage');
goog.require('goog.storage.mechanism.HTML5LocalStorage');
goog.require('robot.visual.FieldTableVisualizer');
goog.require('robot.PredefinedFields');
goog.require('robot.predefined.fields');
goog.require('robot.predefined.algorithms');

/**
 * @class
 * @constructor
 */
robot.ui.DemoUI = function() {
    /**
     * @const
     * @type string
     */
    this.SELECT_NOTHING_ID = "*";
    /**
     * @private
     * @type !goog.storage.Storage
     */
    this.storage = new goog.storage.Storage(new goog.storage.mechanism.HTML5LocalStorage());
    /**
     * @private
     * @type string
     */
    this.fieldId_ = this.getStringFromStorage('fieldId', this.SELECT_NOTHING_ID);
    /**
     * @private
     * @type string
     */
    this.algorithmId_ = this.getStringFromStorage('algorithmId', this.SELECT_NOTHING_ID);
    /**
     * @private
     * @type robot.Field
     */
    this.field_ = null;
    /**
     * @private
     * @type function(!robot.Field)
     */
    this.algorithm_ = function(field) {
    };
    /**
     * @private
     * @type robot.visual.FieldTableVisualizer
     */
    this.visualizer_ = null;

    /**
     * @private
     * @type number
     */
    this.animationTime_ = this.getNumberFromStorage('animationTime', 1000);
    /**
     * @private
     * @type !ace.AceEditor
     */
    this.editor_ = this.createEditor('editor');
    /**
     * @private
     * @type !goog.ui.Slider
     */
    this.slider_ = this.createSlider('speed-slider');


    this.initFieldSelectElement('field-select');
    this.initAlgorithmSelectElement('algorithm-select');
    this.initButtons('run-original-button', 'run-editor-button');
    this.initSliderValue('speed-value');

    this.reloadField();
    this.reloadAlgorithm();
    this.updateSlider();

    new goog.debug.DivConsole(goog.dom.getElement('debug')).setCapturing(true);
};

/**
 * @protected
 * @type goog.debug.Logger
 */
robot.ui.DemoUI.prototype.logger = goog.debug.Logger.getLogger('robot.ui.DemoUI');

/**
 * @param {string} elementId
 * @return {!ace.AceEditor}
 */
robot.ui.DemoUI.prototype.createEditor = function(elementId) {
    var editor = ace.edit(elementId);
    editor.setTheme("ace/theme/twilight");
    var JavaScriptMode = require("ace/mode/javascript").Mode;
    editor.getSession().setMode(new JavaScriptMode());
    editor.setReadOnly(false);
    return editor;
};

/**
 * @param {string} elementId
 */
robot.ui.DemoUI.prototype.initFieldSelectElement = function(elementId) {
    var fieldsSelect = goog.dom.getElement(elementId);
    var fields = robot.PredefinedFields.fields;
    var selectedFieldId = this.getFieldId();
    var selectedNothing = (selectedFieldId == this.SELECT_NOTHING_ID);
    var fieldSelected = false;
    var optionSelected = false;
    for (var i in fields) {
        if (fields.hasOwnProperty(i)) {
            optionSelected = false;
            if (selectedNothing) {
                if (!fieldSelected) {
                    fieldSelected = true;
                    this.setFieldId(i);
                }
            } else {
                if (selectedFieldId == i) {
                    optionSelected = true;
                }
            }
            goog.dom.appendChild(fieldsSelect, goog.dom.createDom('option', {'value':i,'selected':optionSelected}, i));
        }
    }
    goog.events.listen(fieldsSelect, goog.events.EventType.CHANGE, goog.bind(function(e) {
        var select = e.target;
        this.setFieldId(select.options[select.selectedIndex].value);
        this.reloadField();
    }, this));
};

/**
 * @param {string} elementId
 */
robot.ui.DemoUI.prototype.initAlgorithmSelectElement = function(elementId) {
    var algorithmsSelect = goog.dom.getElement(elementId);
    var algorithms = robot.PredefinedAlgorithms.algorithms;
    var selectedAlgorithmId = this.getAlgorithmId();
    var selectedNothing = (selectedAlgorithmId == this.SELECT_NOTHING_ID);
    var algorithmSelected = false;
    var optionSelected = false;
    var predefinedAlgorithmsGroup = goog.dom.createDom('optgroup', {'label':'Predefined'});
    goog.dom.appendChild(algorithmsSelect, predefinedAlgorithmsGroup);
    for (var i in algorithms) {
        if (algorithms.hasOwnProperty(i)) {
            optionSelected = false;
            if (selectedNothing) {
                if (!algorithmSelected) {
                    algorithmSelected = true;
                    this.setAlgorithmId(i);
                }
            } else {
                if (selectedAlgorithmId == i) {
                    optionSelected = true;
                }
            }
            goog.dom.appendChild(predefinedAlgorithmsGroup, goog.dom.createDom('option', {'value':i,'selected':optionSelected}, i));
        }
    }
    var userAlgorithmsGroup = goog.dom.createDom('optgroup', {'label':'User'});
    goog.dom.appendChild(algorithmsSelect, userAlgorithmsGroup);
    goog.events.listen(algorithmsSelect, goog.events.EventType.CHANGE, goog.bind(function(e) {
        var select = e.target;
        this.setAlgorithmId(select.options[select.selectedIndex].value);
        this.reloadAlgorithm();
    }, this));
};

/**
 * @param {string} runOriginalElementId
 * @param {string} runEditorElementId
 */
robot.ui.DemoUI.prototype.initButtons = function(runOriginalElementId, runEditorElementId) {
    var runOriginalButton = goog.dom.getElement(runOriginalElementId);
    goog.events.listen(runOriginalButton, goog.events.EventType.CLICK, goog.bind(this.run, this, true));
    var runEditorButton = goog.dom.getElement(runEditorElementId);
    goog.events.listen(runEditorButton, goog.events.EventType.CLICK, goog.bind(this.run, this, false));
};

/**
 * @param {string} elementId
 * @return {!goog.ui.Slider}
 */
robot.ui.DemoUI.prototype.createSlider = function(elementId) {
    var slider = new goog.ui.Slider();
    slider.setMinimum(10);
    slider.setMaximum(2000);
    slider.setValue(this.getAnimationTime());
    slider.setMoveToPointEnabled(true);
    slider.decorate(goog.dom.getElement(elementId));
    slider.addEventListener(goog.ui.Component.EventType.CHANGE, goog.bind(function(e) {
        this.updateSlider();
    }, this));
    return slider;
};

/**
 * @param {string} elementId
 */
robot.ui.DemoUI.prototype.initSliderValue = function(elementId) {
    var speedValue = goog.dom.getElement(elementId);
    goog.events.listen(speedValue, [goog.events.EventType.CHANGE, goog.events.EventType.KEYUP], goog.bind(function(e) {
        this.slider_.setValue(goog.string.toNumber(e.target.value));
    }, this));
};

robot.ui.DemoUI.prototype.updateSlider = function () {
    this.setAnimationTime(this.slider_.getValue());
    goog.dom.getElement('speed-value').value = this.getAnimationTime();
};

robot.ui.DemoUI.prototype.reloadField = function () {
    goog.dispose(this.visualizer_);
    goog.dispose(this.field_);
    var fieldId = this.getFieldId();
    this.field_ = robot.PredefinedFields.fields[fieldId]();
    this.visualizer_ = new robot.visual.FieldTableVisualizer(this.field_);
    this.visualizer_.setAnimationTime(this.getAnimationTime());

    var visualElement = goog.dom.getElement('visual');
    if (visualElement == null) {
        throw new Error('Visual element is null');
    }
    this.visualizer_.render(visualElement);
};

robot.ui.DemoUI.prototype.reloadAlgorithm = function () {
    this.algorithm_ = robot.PredefinedAlgorithms.algorithms[this.getAlgorithmId()];
    if (this.algorithm_)
        this.editor_.getSession().setValue(this.algorithm_.toString());
};

robot.ui.DemoUI.prototype.run = function (executeOriginal) {
    if (goog.isNull(this.algorithm_)) {
        alert('Algorithm is not selected');
        return;
    }
    if (goog.isNull(this.field_)) {
        alert('Field is not selected');
        return;
    }
    if (goog.isNull(this.visualizer_)) {
        throw new Error('visualizer is null');
    }
    this.reloadField();
    try {
        if (executeOriginal) {
            this.algorithm_(this.field_);
        } else {
            // temporary set window['tmpField']
            window['tmpField'] = this.field_;
            goog.globalEval("(" + this.editor_.getSession().getValue() + ")(window['tmpField']);");
            delete window['tmpField'];
        }
    } catch (e) {
        this.logger.severe(e.toString());
    }
    this.visualizer_.play();
};

/**
 * @param {string} key
 * @param {number} defaultValue
 */
robot.ui.DemoUI.prototype.getNumberFromStorage = function(key, defaultValue) {
    var num = this.storage.get(key);
    if (goog.isDefAndNotNull(num)) {
        return Number(num);
    } else {
        this.storage.set(key, defaultValue);
        return defaultValue;
    }
};

/**
 * @param {string} key
 * @param {string} defaultValue
 */
robot.ui.DemoUI.prototype.getStringFromStorage = function(key, defaultValue) {
    var str = this.storage.get(key);
    if (goog.isDefAndNotNull(str)) {
        return String(str);
    } else {
        this.storage.set(key, defaultValue);
        return defaultValue;
    }
};

/**
 * @param {string} key
 * @param {*} value
 */
robot.ui.DemoUI.prototype.setToStorage = function(key, value) {
    this.storage.set(key, value);
};

/**
 * @return {number}
 */
robot.ui.DemoUI.prototype.getAnimationTime = function () {
    return this.animationTime_;
};

/**
 * @param {number} animationTime
 */
robot.ui.DemoUI.prototype.setAnimationTime = function (animationTime) {
    this.animationTime_ = animationTime;
    this.setToStorage('animationTime', this.animationTime_);
};

/**
 * @return {string}
 */
robot.ui.DemoUI.prototype.getFieldId = function () {
    return this.fieldId_;
};

/**
 * @param {string} fieldId
 */
robot.ui.DemoUI.prototype.setFieldId = function (fieldId) {
    this.fieldId_ = fieldId;
    this.setToStorage('fieldId', this.fieldId_);
};

/**
 * @return {string}
 */
robot.ui.DemoUI.prototype.getAlgorithmId = function () {
    return this.algorithmId_;
};

/**
 * @param {string} algorithmId
 */
robot.ui.DemoUI.prototype.setAlgorithmId = function (algorithmId) {
    this.algorithmId_ = algorithmId;
    this.setToStorage('algorithmId', this.algorithmId_);
};