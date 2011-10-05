goog.require('goog.dom');
goog.require('goog.debug.DivConsole');
goog.require('goog.debug.Logger');

goog.require('robot.visual.FieldTableVisualizer');
goog.require('robot.PredefinedFields');
goog.require('robot.predefined.fields');
goog.require('robot.predefined.algorithms');

/**
 * @type goog.debug.Logger
 */
var logger = null;
/**
 * @type ?string
 */
var fieldId = null;
/**
 * @type ?string
 */
var algorithmId = null;
/**
 * @type robot.Field
 */
var field = null;
/**
 * @type function(!robot.Field)
 */
var algorithm = function(field) {
};
/**
 * @type robot.visual.FieldTableVisualizer
 */
var visualizer = null;

/**
 * @type ace.AceEditor
 */
var editor = null;

/**
 * @export
 */
function onLoad() {
    logger = goog.debug.Logger.getLogger('');
    new goog.debug.DivConsole(goog.dom.getElement('debug')).setCapturing(true);

    editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    var JavaScriptMode = require("ace/mode/javascript").Mode;
    editor.getSession().setMode(new JavaScriptMode());
    editor.setReadOnly(false);

    var fieldsSelect = goog.dom.getElement('field-select');
    var fields = robot.PredefinedFields.fields;
    var fieldSelected = false;
    var fldId;
    for (var i in fields) {
        if (fields.hasOwnProperty(i)) {
            fieldsSelect.options[fieldsSelect.options.length] = new Option(i, i);
            if (!fieldSelected) {
                fieldSelected = true;
                fldId = i;
            }
        }
    }
    goog.events.listen(fieldsSelect, goog.events.EventType.CHANGE, function(e) {
        var select = e.target;
        update(select.options[select.selectedIndex].value, algorithmId);
    });

    var algorithmsSelect = goog.dom.getElement('algorithm-select');
    var algorithms = robot.PredefinedAlgorithms.algorithms;
    var algorithmSelected = false;
    var algId;
    for (var i in algorithms) {
        if (algorithms.hasOwnProperty(i)) {
            algorithmsSelect.options[algorithmsSelect.options.length] = new Option(i, i);
            if (!algorithmSelected) {
                algorithmSelected = true;
                algId = i;
            }
        }
    }
    goog.events.listen(algorithmsSelect, goog.events.EventType.CHANGE, function(e) {
        var select = e.target;
        update(fieldId, select.options[select.selectedIndex].value);
    });

    var runButton = goog.dom.getElement('run-button');
    goog.events.listen(runButton, goog.events.EventType.CLICK, run);

    update(fldId, algId);
}

function update(fId, algId) {
    if (algorithmId == null || algId != algorithmId) {
        algorithmId = algId;
        algorithm = robot.PredefinedAlgorithms.algorithms[algorithmId];
        editor.getSession().setValue(algorithm.toString());
    }

    goog.dispose(visualizer);
    goog.dispose(field);
    fieldId = fId;
    field = robot.PredefinedFields.fields[fId]();
    visualizer = new robot.visual.FieldTableVisualizer(field);

    var visualElement = goog.dom.getElement('visual');
    if (visualElement == null) {
        throw new Error('Visual element is null');
    }
    visualizer.render(visualElement);
}

function run() {
    if (goog.isNull(algorithm)) {
        alert('Algorithm is not selected');
        return;
    }
    if (goog.isNull(field)) {
        alert('Field is not selected');
        return;
    }
    if (goog.isNull(visualizer)) {
        throw new Error('visualizer is null');
    }
    update(fieldId, algorithmId);
    try {
        // temporary set window['field']
        window['field'] = field;
        goog.globalEval("(" + editor.getSession().getValue() + ")(window['field']);");
        delete window['field'];
        //algorithm(field);
    } catch (e) {
        logger.severe(e.toString());
        throw e;
    }
    visualizer.play();
}