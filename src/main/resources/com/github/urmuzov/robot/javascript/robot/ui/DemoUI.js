goog.provide('robot.ui.DemoUI');

goog.require('goog.dom');
goog.require('goog.dom.dataset');
goog.require('goog.debug.DivConsole');
goog.require('goog.debug.Logger');
goog.require('goog.ui.Slider');
goog.require('goog.ui.TabBar');
goog.require('goog.ui.decorate');
goog.require('goog.storage.Storage');
goog.require('goog.storage.mechanism.HTML5LocalStorage');
goog.require('bootstrap.Tabs');
goog.require('bootstrap.Tab');
goog.require('robot.visual.FieldTableVisualizer');
goog.require('robot.PredefinedFields');
goog.require('robot.predefined.fields');
goog.require('robot.predefined.programs');
goog.require('robot.ui.FunctionEditor');

/**
 * @class
 * @constructor
 */
robot.ui.DemoUI = function() {
    /**
     * @private
     * @type !goog.storage.Storage
     */
    this.storage = new goog.storage.Storage(new goog.storage.mechanism.HTML5LocalStorage());
    /**
     * @private
     * @type Object
     */
    this.userPrograms_ = this.getObjectFromStorage('userPrograms', {});
    /**
     * @private
     * @type Object
     */
    this.userFields_ = this.getObjectFromStorage('userFields', {});
    /**
     * @private
     * @type robot.Field
     */
    this.field_ = null;
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
     * @type !goog.ui.Slider
     */
    this.slider_ = this.createSlider('speed-slider');
    this.initSliderValue('speed-value');

    /**
     * @private
     * @type robot.ui.FunctionEditor
     */
    this.programEditor_ = new robot.ui.FunctionEditor(
        robot.PredefinedPrograms.programs,
        goog.bind(this.getUserPrograms, this),
        this.getStringFromStorage('programId', robot.ui.DemoUI.SELECT_NOTHING_ID),
        goog.dom.getElement('program-save-as'),
        goog.dom.getElement('program-save'),
        goog.dom.getElement('program-remove'),
        goog.dom.getElement('program-run-original-button'),
        goog.dom.getElement('program-run-editor-button'),
        goog.dom.getElement('program-editor'),
        goog.dom.getElement('program-select')
    );
    this.programEditor_.addEventListener(robot.ui.FunctionEditor.EventType.SELECTION_CHANGE,
        function(e) {
            this.setToStorage('programId', (/** @type robot.ui.FunctionEditor */ e.target).getSelectedId());
        }, false, this
    );
    this.programEditor_.addEventListener(robot.ui.FunctionEditor.EventType.FUNCTION_SAVE,
        function(e) {
            var functionEditor = (/** @type robot.ui.FunctionEditor */ e.target);
            var programText = functionEditor.getEditorValue();
            var name = e.functionName;
            this.saveUserProgram(name, programText);
            this.showSuccessMessage("Program '"+name+"' saved!");
        }, false, this
    );
    this.programEditor_.addEventListener(robot.ui.FunctionEditor.EventType.FUNCTION_REMOVE,
        function(e) {
            var functionEditor = (/** @type robot.ui.FunctionEditor */ e.target);
            var name = functionEditor.userFunctionIdToName(functionEditor.getSelectedId());
            var userAlgos = this.getUserPrograms();
            delete userAlgos[name];
            this.setUserPrograms(userAlgos);
            this.showSuccessMessage("Program '"+name+"' removed!");
        }, false, this
    );
    goog.events.listen(this.programEditor_, [robot.ui.FunctionEditor.EventType.RUN_EDITOR_CLICK, robot.ui.FunctionEditor.EventType.RUN_ORIGINAL_CLICK],
        function(e) {
            try {
                var functionEditor = (/** @type robot.ui.FunctionEditor */ e.target);
                this.reloadField(true);
                functionEditor.getFunction(e.type == robot.ui.FunctionEditor.EventType.RUN_ORIGINAL_CLICK)(this.field_);
            } catch (ex) {
                this.logger.severe("Program execution error", ex);
            }
            this.visualizer_.play();
        }, false, this
    );

    /**
     * @private
     * @type robot.ui.FunctionEditor
     */
    this.fieldEditor_ = new robot.ui.FunctionEditor(
        robot.PredefinedFields.fields,
        goog.bind(this.getUserFields, this),
        this.getStringFromStorage('fieldId', robot.ui.DemoUI.SELECT_NOTHING_ID),
        goog.dom.getElement('field-save-as'),
        goog.dom.getElement('field-save'),
        goog.dom.getElement('field-remove'),
        goog.dom.getElement('field-run-original-button'),
        goog.dom.getElement('field-run-editor-button'),
        goog.dom.getElement('field-editor'),
        goog.dom.getElement('field-select')
    );
    this.fieldEditor_.addEventListener(robot.ui.FunctionEditor.EventType.SELECTION_CHANGE,
        function(e) {
            this.setToStorage('fieldId', (/** @type robot.ui.FunctionEditor */ e.target).getSelectedId());
            this.reloadField(true);
        }, false, this
    );
    this.fieldEditor_.addEventListener(robot.ui.FunctionEditor.EventType.FUNCTION_SAVE,
        function(e) {
            var functionEditor = (/** @type robot.ui.FunctionEditor */ e.target);
            var fieldCode = functionEditor.getEditorValue();
            var name = e.functionName;
            this.saveUserField(name, fieldCode);
            this.showSuccessMessage("Field '"+name+"' saved!");
        }, false, this
    );
    this.fieldEditor_.addEventListener(robot.ui.FunctionEditor.EventType.FUNCTION_REMOVE,
        function(e) {
            var functionEditor = (/** @type robot.ui.FunctionEditor */ e.target);
            var name = functionEditor.userFunctionIdToName(functionEditor.getSelectedId());
            var userFields = this.getUserFields();
            delete userFields[name];
            this.setUserFields(userFields);
            this.showSuccessMessage("Field '"+name+"' removed!");
        }, false, this
    );
    goog.events.listen(this.fieldEditor_, [robot.ui.FunctionEditor.EventType.RUN_EDITOR_CLICK, robot.ui.FunctionEditor.EventType.RUN_ORIGINAL_CLICK],
        function(e) {
            this.reloadField(e.type == robot.ui.FunctionEditor.EventType.RUN_ORIGINAL_CLICK);
        }, false, this
    );

    this.reloadField(true);
    this.updateSlider();

    /**
     * @private
     * @type goog.ui.TabBar
     */
    this.tabs_ = (/** @type goog.ui.TabBar */goog.ui.decorate(goog.dom.getElement('tabs')));
    goog.events.listen(this.tabs_, [goog.ui.Component.EventType.UNSELECT, goog.ui.Component.EventType.SELECT], function(e) {
        var tab = (/** @type goog.ui.Tab */ e.target);
        var tabElement = tab.getElement();
        var tabPanelId = goog.dom.dataset.get(tabElement, 'tabPanelId');
        var tabPanelElement = goog.dom.getElement(tabPanelId);
        goog.style.showElement(tabPanelElement, e.type == goog.ui.Component.EventType.SELECT);
    });

    //Hide messages on any action
    goog.events.listen(this.tabs_, goog.ui.Component.EventType.ACTION, this.hideAllMessages, false, this);

    new goog.debug.DivConsole(goog.dom.getElement('debug')).setCapturing(true);
    goog.debug.LogManager.getRoot().addHandler(goog.bind(/** @param {goog.debug.LogRecord} logRecord */ function(logRecord) {
        var level = logRecord.getLevel();
        if (level.value >= goog.debug.Logger.Level.SEVERE.value) {
            var exception = logRecord.getException();
            var text = logRecord.getMessage() + (exception && exception.message ? ' (' + exception.message + ')' : '');
            this.showErrorMessage(text.substring(0, 50));
        }
    }, this));
};

/**
 * @const
 * @type string
 */
robot.ui.DemoUI.SELECT_NOTHING_ID = "___";


/**
 * @protected
 * @type goog.debug.Logger
 */
robot.ui.DemoUI.prototype.logger = goog.debug.Logger.getLogger('robot.ui.DemoUI');

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

/**
 * @param {boolean} runOriginal
 */
robot.ui.DemoUI.prototype.reloadField = function (runOriginal) {
    goog.dispose(this.visualizer_);
    goog.dispose(this.field_);
    try {
        var fieldCreator = this.fieldEditor_.getFunction(runOriginal);
        this.field_ = fieldCreator();
        this.visualizer_ = new robot.visual.FieldTableVisualizer(this.field_);
        this.visualizer_.setAnimationTime(this.getAnimationTime());

        var visualElement = goog.dom.getElement('visual');
        if (visualElement == null) {
            throw new Error('Visual element is null');
        }
        this.visualizer_.render(visualElement);
    } catch (e) {
        this.logger.severe('Field creation error', e);
    }
};

robot.ui.DemoUI.prototype.saveUserProgram = function (name, programText) {
    var userAlgos = this.getUserPrograms();
    userAlgos[name] = programText;
    this.setUserPrograms(userAlgos);
};

robot.ui.DemoUI.prototype.saveUserField = function (name, fieldCode) {
    var userFields = this.getUserFields();
    userFields[name] = fieldCode;
    this.setUserFields(userFields);
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
 * @return {Object}
 */
robot.ui.DemoUI.prototype.getUserPrograms = function () {
    return this.userPrograms_;
};

/**
 * @param {Object} userPrograms
 */
robot.ui.DemoUI.prototype.setUserPrograms = function (userPrograms) {
    this.userPrograms_ = userPrograms;
    this.setToStorage('userPrograms', this.userPrograms_);
};

/**
 * @return {Object}
 */
robot.ui.DemoUI.prototype.getUserFields = function () {
    return this.userFields_;
};

/**
 * @param {Object} userFields
 */
robot.ui.DemoUI.prototype.setUserFields = function (userFields) {
    this.userFields_ = userFields;
    this.setToStorage('userFields', this.userFields_);
};

/**
 * @param {string} message
 */
robot.ui.DemoUI.prototype.showErrorMessage = function (message) {
    this.hideAllMessages();
    var alertEl = goog.dom.getElement('error-alert');
    var messageEl = goog.dom.getElement('error-message');
    messageEl.innerHTML = message;
    goog.style.showElement(alertEl, true);
};

robot.ui.DemoUI.prototype.hideErrorMessage = function () {
    var alertEl = goog.dom.getElement('error-alert');
    goog.style.showElement(alertEl, false);
};

/**
 * @param {string} message
 */
robot.ui.DemoUI.prototype.showSuccessMessage = function (message) {
    this.hideAllMessages();
    var alertEl = goog.dom.getElement('success-alert');
    var messageEl = goog.dom.getElement('success-message');
    messageEl.innerHTML = message;
    goog.style.showElement(alertEl, true);
};

robot.ui.DemoUI.prototype.hideSuccessMessage = function () {
    var alertEl = goog.dom.getElement('success-alert');
    goog.style.showElement(alertEl, false);
};


robot.ui.DemoUI.prototype.hideAllMessages = function () {
    this.hideErrorMessage();
    this.hideSuccessMessage();
};


