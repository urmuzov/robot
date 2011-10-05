goog.require('goog.dom');
goog.require('goog.debug.DivConsole');

goog.require('robot.PredefinedFields');
goog.require('robot.predefined.firstField');

/**
 * @export
 */
function onLoad() {
    new goog.debug.DivConsole(goog.dom.getElement('debug')).setCapturing(true);

    // Инициализация редактора
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    var JavaScriptMode = require("ace/mode/javascript").Mode;
    editor.getSession().setMode(new JavaScriptMode());
    editor.setReadOnly(true);

    window.alert(goog.debug.expose(robot.PredefinedFields.fields, true));

    //a.toString().replace(/^function\s*\(.*\)\s*{\s*\n/, '').replace(/}\s*\n?$/, '')
}