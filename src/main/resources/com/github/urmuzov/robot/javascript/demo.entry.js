goog.require('robot.ui.DemoUI');
goog.require('robot.ui.ExportsUI');


var demoUI;
var exportsUI;
/**
 * @export
 */
function onLoad() {
    var debugDialog = new robot.ui.ExportsUI.Dialog();
    debugDialog.setTitle('Debug');
    debugDialog.setContent('<div id="debug" style="height: 640px; height: 480px; font-size: 70%; overflow-y: scroll;"></div>');
    goog.events.listen(goog.dom.getElement('show-debug'), goog.events.EventType.CLICK, function() {
        debugDialog.setVisible(true);
    });
    debugDialog.setButtonSet(goog.ui.Dialog.ButtonSet.createOk());
    debugDialog.render();

    demoUI = new robot.ui.DemoUI();

    // Ace editor can't render correctly to elements (or parent elements)
    // with style="display: none;"
    var fieldTab = goog.dom.getElement('field-tab');
    fieldTab.style.visibility = 'visible';
    fieldTab.style.display = 'none';

    exportsUI = new robot.ui.ExportsUI();
    goog.events.listen(goog.dom.getElement('show-exports'), goog.events.EventType.CLICK, function() {
        exportsUI.showDialog();
    });
}

