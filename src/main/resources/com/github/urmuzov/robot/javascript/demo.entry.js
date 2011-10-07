goog.require('robot.ui.DemoUI');
goog.require('robot.ui.ExportsUI');


var demoUI;
var exportsUI;
/**
 * @export
 */
function onLoad() {
    demoUI = new robot.ui.DemoUI();
    exportsUI = new robot.ui.ExportsUI();
    goog.events.listen(goog.dom.getElement('show-exports'), goog.events.EventType.CLICK, function() {
        exportsUI.showDialog();
    });
}

