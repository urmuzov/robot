goog.provide('robot.ui.ExportsUI');

goog.require('robot.ExportManager');
goog.require('goog.ui.Dialog');

/**
 * @class
 * @constructor
 */
robot.ui.ExportsUI = function() {

    /**
     * @private
     * @type !goog.ui.Dialog
     */
    this.dialog_ = this.createDialog();
};

robot.ui.ExportsUI.prototype.createDialog = function() {
    var content = '';
    var em = robot.ExportManager.getInstance();
    var symbolsByType = em.getSymbolsByType();

    content += this.createContentPart('Enums', symbolsByType[robot.ExportManager.SymbolType.ENUM]);
    content += this.createContentPart('Constructors', symbolsByType[robot.ExportManager.SymbolType.CONSTRUCTOR]);
    content += this.createContentPart('Objects', symbolsByType[robot.ExportManager.SymbolType.OBJECT]);

    var dialog = new goog.ui.Dialog(undefined, true);
    dialog.setContent(content);
    dialog.setTitle('Exported Symbols');

    dialog.setButtonSet(goog.ui.Dialog.ButtonSet.createOk());

//    goog.events.listen(dialog, goog.ui.Dialog.EventType.SELECT, function(e) {
//        alert('You chose: ' + e.key);
//    });
    dialog.setModal(false);
    var dialogElement = dialog.getDialogElement();
    goog.style.setWidth(dialogElement, '430px');
    dialogElement.style.zIndex = 10000;
    return dialog;
};

/**
 * @param {string} title
 * @param {!Array.<robot.ExportManager.Symbol>} symbols
 * @return {string}
 */
robot.ui.ExportsUI.prototype.createContentPart = function (title, symbols) {
    var content = '';
    var symbol;
    var prototypeProperties;
    var staticProperties;
    if (symbols.length) {
        content += '<h2>'+title+'</h2>';
        content += '<ul>';
        for (var i = 0; i < symbols.length; i++) {
            symbol = symbols[i];
            prototypeProperties = symbol.getPrototypePropertyNames();
            staticProperties = symbol.getPropertyNames();
            content += '<li><code>'+symbol.getPublicPath()+"</code>";
            if (prototypeProperties.length) {
                content += '<br />prototype properties: [<code>'+prototypeProperties.join('</code>, <code>')+'</code>]';
            }
            if (staticProperties.length) {
                content += '<br />static properties: [<code>'+staticProperties.join('</code>, <code>')+'</code>]';
            }
            content += '</li>';
        }
        content += '</ul>';
    }
    return content;
};

robot.ui.ExportsUI.prototype.showDialog = function () {
    this.dialog_.setVisible(true);
};

