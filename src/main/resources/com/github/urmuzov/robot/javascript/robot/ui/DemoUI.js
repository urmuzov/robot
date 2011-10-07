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
    this.SELECT_NOTHING_ID = "___";
    /**
     * @const
     * @type string
     */
    this.USER_ALGORITHM_PREFIX = "user:";
    /**
     * @private
     * @type !goog.storage.Storage
     */
    this.storage = new goog.storage.Storage(new goog.storage.mechanism.HTML5LocalStorage());
    /**
     * @private
     * @type Object
     */
    this.userAlgorithms_ = this.getObjectFromStorage('userAlgorithms', {});
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
    /**
     * @private
     * @type Element
     */
    this.algorithmsSelect_ = goog.dom.getElement('algorithm-select');
    this.updateAlgorithmSelectElement();
    /**
     * @private
     * @type Element
     */
    this.fieldsSelect_ = goog.dom.getElement('field-select');
    this.updateFieldSelectElement();

    this.initSliderValue('speed-value');

    /**
     * @private
     * @type Element
     */
    this.runOriginalButton_ = goog.dom.getElement('run-original-button');
    goog.events.listen(this.runOriginalButton_, goog.events.EventType.CLICK, goog.bind(this.run, this, true));
    /**
     * @private
     * @type Element
     */
    this.runEditorButton_ = goog.dom.getElement('run-editor-button');
    goog.events.listen(this.runEditorButton_, goog.events.EventType.CLICK, goog.bind(this.run, this, false));
    /**
     * @private
     * @type Element
     */
    this.saveAsButton_ = goog.dom.getElement('save-as');
    goog.events.listen(this.saveAsButton_, goog.events.EventType.CLICK, goog.bind(this.saveAs, this));
    /**
     * @private
     * @type Element
     */
    this.saveButton_ = goog.dom.getElement('save');
    goog.events.listen(this.saveButton_, goog.events.EventType.CLICK, goog.bind(this.save, this));
    /**
     * @private
     * @type Element
     */
    this.removeButton_ = goog.dom.getElement('remove');
    goog.events.listen(this.removeButton_, goog.events.EventType.CLICK, goog.bind(this.remove, this));

    this.reloadField();
    this.reloadAlgorithm();
    this.updateSlider();
    this.updateButtons();

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

robot.ui.DemoUI.prototype.updateFieldSelectElement = function() {
    var predefinedFieldsGroup = this.createOptGroup(
        'Predefined',
        this.createOptionsMap(goog.object.getKeys(robot.PredefinedFields.fields), ''),
        this.getFieldId(),
        true
    );
    goog.dom.appendChild(this.fieldsSelect_, predefinedFieldsGroup);
    this.setFieldId(this.fieldsSelect_.options[this.fieldsSelect_.selectedIndex].value);

    goog.events.listen(this.fieldsSelect_, goog.events.EventType.CHANGE, goog.bind(function(e) {
        var select = e.target;
        this.setFieldId(select.options[select.selectedIndex].value);
        this.reloadField();
    }, this));
};

robot.ui.DemoUI.prototype.updateAlgorithmSelectElement = function() {
    goog.dom.removeChildren(this.algorithmsSelect_);

    var predefinedAlgorithmsGroup = this.createOptGroup(
        'Predefined',
        this.createOptionsMap(goog.object.getKeys(robot.PredefinedAlgorithms.algorithms), ''),
        this.getAlgorithmId(),
        true
    );
    goog.dom.appendChild(this.algorithmsSelect_, predefinedAlgorithmsGroup);

    var userAlgorithmsGroup = this.createOptGroup(
        'User',
        this.createOptionsMap(goog.object.getKeys(this.getUserAlgorithms()), this.USER_ALGORITHM_PREFIX),
        this.getAlgorithmId(),
        false
    );
    goog.dom.appendChild(this.algorithmsSelect_, userAlgorithmsGroup);

    this.setAlgorithmId(this.algorithmsSelect_.options[this.algorithmsSelect_.selectedIndex].value);

    goog.events.listen(this.algorithmsSelect_, goog.events.EventType.CHANGE, goog.bind(function(e) {
        var select = e.target;
        this.setAlgorithmId(select.options[select.selectedIndex].value);
        this.reloadAlgorithm();
        this.updateButtons();
    }, this));
};

/**
 * @param {Array.<string>} keys
 * @param {string} keyPrefix
 * @return {!Object.<string, string>}
 */
robot.ui.DemoUI.prototype.createOptionsMap = function(keys, keyPrefix) {
    var out = {};
    for (var i = 0; i < keys.length; i++) {
        out[keyPrefix+keys[i]] = keys[i];
    }
    return out;
};
/**
 * @param {string} label
 * @param {!Object.<string, string>} optionsMap
 * @param {string} selectedId
 * @param {boolean} selectFirstIfNothingSelected
 * @return {!Element}
 */
robot.ui.DemoUI.prototype.createOptGroup = function(label, optionsMap, selectedId, selectFirstIfNothingSelected) {
    var selectedNothing = (selectedId == this.SELECT_NOTHING_ID);
    var firstSelected = false;
    var currentOptionSelected = false;
    var optGroupEl = goog.dom.createDom('optgroup', {'label':label});
    for (var i in optionsMap) {
        if (optionsMap.hasOwnProperty(i)) {
            currentOptionSelected = false;
            if (selectedNothing) {
                if (!firstSelected && selectFirstIfNothingSelected) {
                    firstSelected = true;
                    currentOptionSelected = true;
                }
            } else {
                if (selectedId == i) {
                    currentOptionSelected = true;
                }
            }
            goog.dom.appendChild(optGroupEl, goog.dom.createDom('option', {'value':i,'selected':currentOptionSelected}, optionsMap[i]));
        }
    }
    return optGroupEl;
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

robot.ui.DemoUI.prototype.updateButtons = function () {
    var userAlgorithm = (this.userAlgorithmIdToName(this.getAlgorithmId()) in this.getUserAlgorithms());
    this.removeButton_.disabled = !userAlgorithm;
    this.saveButton_.disabled = !userAlgorithm;
};

robot.ui.DemoUI.prototype.reloadField = function () {
    goog.dispose(this.visualizer_);
    goog.dispose(this.field_);
    var fieldId = this.getFieldId();
    var fieldCreator = robot.PredefinedFields.fields[fieldId];
    this.field_ = fieldCreator();
    this.visualizer_ = new robot.visual.FieldTableVisualizer(this.field_);
    this.visualizer_.setAnimationTime(this.getAnimationTime());

    var visualElement = goog.dom.getElement('visual');
    if (visualElement == null) {
        throw new Error('Visual element is null');
    }
    this.visualizer_.render(visualElement);
};

robot.ui.DemoUI.prototype.reloadAlgorithm = function () {
    var algId = this.getAlgorithmId();
    if (this.isUserAlgorithmId(algId)) {
        this.algorithm_ = (/** @type function (robot.Field) */this.stringToFunction(this.getUserAlgorithms()[this.userAlgorithmIdToName(algId)]));
    } else {
        this.algorithm_ = robot.PredefinedAlgorithms.algorithms[algId];
    }
    if (this.algorithm_)
        this.setEditorValue(this.algorithm_.toString());
};

/**
 * @param {boolean} executeOriginal
 */
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
            var alg = this.stringToFunction(this.getEditorValue());
            alg(this.field_);
        }
    } catch (e) {
        this.logger.severe(e.toString());
        //throw e;
    }
    this.visualizer_.play();
};

robot.ui.DemoUI.prototype.saveUserAlgorithm = function (name, algorithmText) {
    var userAlgos = this.getUserAlgorithms();
    userAlgos[name] = algorithmText;
    this.setUserAlgorithms(userAlgos);
};

robot.ui.DemoUI.prototype.saveAs = function () {
    var name = window.prompt('Enter algorithm name:');
    if (name) {
        var algorithmText = this.getEditorValue();
        this.saveUserAlgorithm(name, algorithmText);
        this.setAlgorithmId(this.userAlgorithmNameToId(name));
        this.updateAlgorithmSelectElement();
    }
};

robot.ui.DemoUI.prototype.save = function () {
    var name = this.userAlgorithmIdToName(this.getAlgorithmId());
    var algorithmText = this.getEditorValue();
    this.saveUserAlgorithm(name, algorithmText);
};

robot.ui.DemoUI.prototype.remove = function () {
    var userAlgos = this.getUserAlgorithms();
    delete userAlgos[this.userAlgorithmIdToName(this.getAlgorithmId())];
    this.setUserAlgorithms(userAlgos);
    this.setAlgorithmId(this.SELECT_NOTHING_ID);
    this.updateAlgorithmSelectElement();
    this.reloadAlgorithm();
    this.updateButtons();
};

/**
 * @param {string} key
 * @param {number} defaultValue
 */
robot.ui.DemoUI.prototype.getNumberFromStorage = function(key, defaultValue) {
    return Number(this.getObjectFromStorage(key, (/** @type Object */defaultValue)));
};

/**
 * @param {string} key
 * @param {string} defaultValue
 */
robot.ui.DemoUI.prototype.getStringFromStorage = function(key, defaultValue) {
    return String(this.getObjectFromStorage(key, (/** @type Object */defaultValue)));
};

/**
 * @param {string} key
 * @param {Object} defaultValue
 */
robot.ui.DemoUI.prototype.getObjectFromStorage = function(key, defaultValue) {
    var str = this.storage.get(key);
    if (goog.isDefAndNotNull(str)) {
        return str;
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

/**
 * @return {Object}
 */
robot.ui.DemoUI.prototype.getUserAlgorithms = function () {
    return this.userAlgorithms_;
};

/**
 * @param {Object} userAlgorithms
 */
robot.ui.DemoUI.prototype.setUserAlgorithms = function (userAlgorithms) {
    this.userAlgorithms_ = userAlgorithms;
    this.setToStorage('userAlgorithms', this.userAlgorithms_);
};


/**
 * @return {string}
 */
robot.ui.DemoUI.prototype.getEditorValue = function () {
    return this.editor_.getSession().getValue();
};

/**
 * @param {string} editorValue
 */
robot.ui.DemoUI.prototype.setEditorValue = function (editorValue) {
    this.editor_.getSession().setValue(editorValue);
};

/**
 * @param {string} userAlgorithmId
 * @return {string}
 */
robot.ui.DemoUI.prototype.userAlgorithmIdToName = function (userAlgorithmId) {
    return goog.string.remove(userAlgorithmId, this.USER_ALGORITHM_PREFIX);
};

/**
 * @param {string} userAlgorithmName
 * @return {string}
 */
robot.ui.DemoUI.prototype.userAlgorithmNameToId = function (userAlgorithmName) {
    return this.USER_ALGORITHM_PREFIX + userAlgorithmName;
};


/**
 * @param {string} algorithmId
 * @return {boolean}
 */
robot.ui.DemoUI.prototype.isUserAlgorithmId = function (algorithmId) {
    return goog.string.startsWith(algorithmId, this.USER_ALGORITHM_PREFIX);
};

/**
 * @param {string} str
 * @return {Function}
 */
robot.ui.DemoUI.prototype.stringToFunction = function (str) {
    var id = goog.events.getUniqueId("tmpFunction");
    goog.globalEval("window['"+id+"'] = (" + str + ");");
    var func = window[id];
    delete window[id];
    return func;
};