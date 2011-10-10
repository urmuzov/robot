goog.provide('robot.ui.FunctionEditor');

goog.require('goog.events.EventTarget');
goog.require('goog.functions');

/**
 * @class
 * @constructor
 * @extends goog.events.EventTarget
 * @param {(function():Object.<string, string>|Object.<string, string>)} predefinedFunctions
 * @param {(function():Object.<string, string>|Object.<string, string>)} userFunctions
 * @param {string} selectedId
 * @param {Element} saveAsElement
 * @param {Element} saveElement
 * @param {Element} removeElement
 * @param {Element} runOriginalElement
 * @param {Element} runEditorElement
 * @param {Element} editorElement
 * @param {Element} selectElement
 */
robot.ui.FunctionEditor = function(predefinedFunctions, userFunctions, selectedId, saveAsElement, saveElement, removeElement, runOriginalElement, runEditorElement, editorElement, selectElement) {
    goog.events.EventTarget.call(this);
    /**
     * @const
     * @type string
     */
    this.USER_FUNCTION_PREFIX = "user:";
    /**
     * @private
     * @type function():Object.<string, string>
     */
    this.getPredefinedFunctions = goog.isFunction(predefinedFunctions) ? predefinedFunctions : goog.bind(goog.functions.identity, window, predefinedFunctions);
    /**
     * @private
     * @type function():Object.<string, string>
     */
    this.getUserFunctions = goog.isFunction(userFunctions) ? userFunctions : goog.bind(goog.functions.identity, window, userFunctions);
    /**
     * @private
     * @type Element
     */
    this.saveAsElement_ = saveAsElement;
    goog.events.listen(this.saveAsElement_, goog.events.EventType.CLICK, goog.bind(this.dispatchEvent, this, robot.ui.FunctionEditor.EventType.SAVE_AS_CLICK));
    goog.events.listen(this.saveAsElement_, goog.events.EventType.CLICK, goog.bind(this.saveAs, this));
    /**
     * @private
     * @type Element
     */
    this.saveElement_ = saveElement;
    goog.events.listen(this.saveElement_, goog.events.EventType.CLICK, goog.bind(this.dispatchEvent, this, robot.ui.FunctionEditor.EventType.SAVE_CLICK));
    goog.events.listen(this.saveElement_, goog.events.EventType.CLICK, goog.bind(this.save, this));
    /**
     * @private
     * @type Element
     */
    this.removeElement_ = removeElement;
    goog.events.listen(this.removeElement_, goog.events.EventType.CLICK, goog.bind(this.dispatchEvent, this, robot.ui.FunctionEditor.EventType.REMOVE_CLICK));
    goog.events.listen(this.removeElement_, goog.events.EventType.CLICK, goog.bind(this.remove, this));
    /**
     * @private
     * @type Element
     */
    this.runOriginalElement_ = runOriginalElement;
    goog.events.listen(this.runOriginalElement_, goog.events.EventType.CLICK, goog.bind(this.dispatchEvent, this, robot.ui.FunctionEditor.EventType.RUN_ORIGINAL_CLICK));
    /**
     * @private
     * @type Element
     */
    this.runEditorElement_ = runEditorElement;
    goog.events.listen(this.runEditorElement_, goog.events.EventType.CLICK,  goog.bind(this.dispatchEvent, this, robot.ui.FunctionEditor.EventType.RUN_EDITOR_CLICK));
    /**
     * @private
     * @type !ace.AceEditor
     */
    this.editor_ = this.createEditor(editorElement);
    /**
     * @private
     * @type Element
     */
    this.selectElement_ = selectElement;
    this.updateSelectElement(selectedId);
    goog.events.listen(this.selectElement_, goog.events.EventType.CHANGE, goog.bind(function(e) {
        var select = e.target;
        this.setSelectedId(select.options[select.selectedIndex].value);
        this.reloadFunction();
        this.updateButtons();
    }, this));

    this.updateButtons();
    this.reloadFunction();
};
goog.inherits(robot.ui.FunctionEditor, goog.events.EventTarget);

/**
 * @enum {string}
 */
robot.ui.FunctionEditor.EventType = {
    SAVE_AS_CLICK:'saveas',
    SAVE_CLICK:'save',
    REMOVE_CLICK:'remove',
    RUN_ORIGINAL_CLICK:'runorig',
    RUN_EDITOR_CLICK:'runedit',
    SELECTION_CHANGE: 'selchg',
    FUNCTION_SAVE: 'funcsave',
    FUNCTION_REMOVE: 'funcrm'
};


/**
 * @param {Element} element
 * @return {!ace.AceEditor}
 */
robot.ui.FunctionEditor.prototype.createEditor = function(element) {
    if (!element.id) {
        element.id = goog.events.getUniqueId('editor');
    }
    var editor = ace.edit(element.id);
    editor.setTheme("ace/theme/twilight");
    var JavaScriptMode = require("ace/mode/javascript").Mode;
    editor.getSession().setMode(new JavaScriptMode());
    editor.setReadOnly(false);
    return editor;
};

/**
 * @param {Array.<string>} keys
 * @param {string} keyPrefix
 * @return {!Object.<string, string>}
 */
robot.ui.FunctionEditor.prototype.createOptionsMap = function(keys, keyPrefix) {
    var out = {};
    for (var i = 0; i < keys.length; i++) {
        out[keyPrefix + keys[i]] = keys[i];
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
robot.ui.FunctionEditor.prototype.createOptGroup = function(label, optionsMap, selectedId, selectFirstIfNothingSelected) {
    var selectedNothing = (selectedId == robot.ui.DemoUI.SELECT_NOTHING_ID);
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
 * @param {string=} opt_selectedId
 */
robot.ui.FunctionEditor.prototype.updateSelectElement = function(opt_selectedId) {
    goog.dom.removeChildren(this.selectElement_);

    var selectedId = goog.isDef(opt_selectedId) ? opt_selectedId : this.getSelectedId();

    var predefinedGroup = this.createOptGroup(
        'Predefined',
        this.createOptionsMap(goog.object.getKeys(this.getPredefinedFunctions()), ''),
        selectedId,
        true
    );
    goog.dom.appendChild(this.selectElement_, predefinedGroup);

    var userGroup = this.createOptGroup(
        'User',
        this.createOptionsMap(goog.object.getKeys(this.getUserFunctions()), this.USER_FUNCTION_PREFIX),
        selectedId,
        false
    );
    goog.dom.appendChild(this.selectElement_, userGroup);

};

robot.ui.FunctionEditor.prototype.updateButtons = function () {
    var userProgram = (this.userFunctionIdToName(this.getSelectedId()) in this.getUserFunctions());
    this.removeElement_.disabled = !userProgram;
    this.saveElement_.disabled = !userProgram;
};

robot.ui.FunctionEditor.prototype.reloadFunction = function () {
    var func = this.getFunction(true);
    if (func)
        this.setEditorValue(func.toString());
};



robot.ui.FunctionEditor.prototype.saveAs = function () {
    var name = window.prompt('Enter program name:');
    if (name) {
        this.dispatchEvent(new robot.ui.FunctionEditor.SaveEvent(name, this.userFunctionNameToId(name)));
        this.updateSelectElement();
        this.setSelectedId(this.userFunctionNameToId(name));
    }
};

robot.ui.FunctionEditor.prototype.save = function () {
    var selectedId = this.getSelectedId();
    this.dispatchEvent(new robot.ui.FunctionEditor.SaveEvent(this.userFunctionIdToName(selectedId), selectedId));
};

robot.ui.FunctionEditor.prototype.remove = function () {
    var selectedId = this.getSelectedId();
    if (!this.isUserFunctionId(selectedId)) {
        throw new Error('Can\'t remove predifined function');
    }
    this.dispatchEvent(robot.ui.FunctionEditor.EventType.FUNCTION_REMOVE);
    var options = goog.dom.getElementsByTagNameAndClass('option', undefined, this.selectElement_);
    for (var i = 0; i < options.length; i++) {
        if (options[i].value == selectedId) {
            goog.dom.removeNode(options[i]);
            break;
        }
    }
    this.setSelectedId(robot.ui.DemoUI.SELECT_NOTHING_ID);
    this.updateSelectElement();
    this.updateButtons();
    this.reloadFunction();
};

/**
 * @return {string}
 */
robot.ui.FunctionEditor.prototype.getSelectedId = function() {
    if (this.selectElement_.selectedIndex == -1) {
        return robot.ui.DemoUI.SELECT_NOTHING_ID;
    }
    return this.selectElement_.options[this.selectElement_.selectedIndex].value;
};

/**
 * @param {string} functionId
 */
robot.ui.FunctionEditor.prototype.setSelectedId = function (functionId) {
    var options = goog.dom.getElementsByTagNameAndClass('option', undefined, this.selectElement_);
    for (var i = 0; i < options.length; i++) {
        if (options[i].value == functionId) {
            this.selectElement_.selectedIndex = i;
            break;
        }
    }
    this.dispatchEvent(robot.ui.FunctionEditor.EventType.SELECTION_CHANGE);
};

/**
 * @return {string}
 */
robot.ui.FunctionEditor.prototype.getEditorValue = function () {
    return this.editor_.getSession().getValue();
};

/**
 * @param {string} editorValue
 */
robot.ui.FunctionEditor.prototype.setEditorValue = function (editorValue) {
    this.editor_.getSession().setValue(editorValue);
};

/**
 * @param {string} str
 * @return {Function}
 */
robot.ui.FunctionEditor.prototype.stringToFunction = function (str) {
    var id = goog.events.getUniqueId("tmpFunction");
    goog.globalEval("window['" + id + "'] = (" + str + ");");
    var func = window[id];
    delete window[id];
    return func;
};

/**
 * @param {boolean} getOriginal
 * @return {Function}
 */
robot.ui.FunctionEditor.prototype.getFunction = function (getOriginal) {
    if (!getOriginal) {
        return this.stringToFunction(this.getEditorValue());
    }
    var selectedId = this.getSelectedId();
    if (this.isUserFunctionId(selectedId)) {
        return this.stringToFunction(this.getUserFunctions()[this.userFunctionIdToName(selectedId)]);
    } else {
        return this.stringToFunction(this.getPredefinedFunctions()[selectedId]);
    }
};


/**
 * @param {string} userFunctionId
 * @return {string}
 */
robot.ui.FunctionEditor.prototype.userFunctionIdToName = function (userFunctionId) {
    return goog.string.remove(userFunctionId, this.USER_FUNCTION_PREFIX);
};

/**
 * @param {string} userFunctionName
 * @return {string}
 */
robot.ui.FunctionEditor.prototype.userFunctionNameToId = function (userFunctionName) {
    return this.USER_FUNCTION_PREFIX + userFunctionName;
};


/**
 * @param {string} functionId
 * @return {boolean}
 */
robot.ui.FunctionEditor.prototype.isUserFunctionId = function (functionId) {
    return goog.string.startsWith(functionId, this.USER_FUNCTION_PREFIX);
};

/**
 * @constructor
 * @extends {goog.events.Event}
 * @param {string} name
 * @param {Object=} opt_target
 */
robot.ui.FunctionEditor.SaveEvent = function(name, id, opt_target) {
    goog.events.Event.call(this, robot.ui.FunctionEditor.EventType.FUNCTION_SAVE, opt_target);

    /**
     * @type string
     */
    this.functionName = name;
    /**
     * @type string
     */
    this.functionId = id;
};
goog.inherits(robot.ui.FunctionEditor.SaveEvent, goog.events.Event);


