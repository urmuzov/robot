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

    var dialog = new robot.ui.ExportsUI.Dialog();
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
        content += '<h4>'+title+'</h4>';
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

/**
 * @class
 * @constructor
 * @extends goog.ui.Dialog
 */
robot.ui.ExportsUI.Dialog = function() {
    goog.ui.Dialog.call(this, 'modal');
};
goog.inherits(robot.ui.ExportsUI.Dialog, goog.ui.Dialog);

/**
 * @suppress {accessControls}
 */
robot.ui.ExportsUI.Dialog.prototype.createDom = function() {
  goog.ui.ModalPopup.prototype.createDom.call(this);
  var element = this.getElement();
  goog.asserts.assert(element, 'getElement() returns null');

  var dom = this.getDomHelper();
  this.titleEl_ = dom.createDom('div',
      {'className': 'modal-header', 'id': this.getId()},
      this.titleCloseEl_ = dom.createDom('a', {'className':'close', 'href':'javascript:;'}, '×'),
      this.titleTextEl_ = dom.createDom('h3', undefined, this.title_)),
  goog.dom.append(element, this.titleEl_,
      this.contentEl_ = dom.createDom('div', 'modal-body'),
      this.buttonEl_ = dom.createDom('div', 'modal-footer'));

  this.titleId_ = this.titleEl_.id;
  goog.dom.a11y.setRole(element, 'dialog');
  goog.dom.a11y.setState(element, 'labelledby', this.titleId_ || '');
  // If setContent() was called before createDom(), make sure the inner HTML of
  // the content element is initialized.
  if (this.content_) {
    this.contentEl_.innerHTML = this.content_;
  }
  goog.style.showElement(this.titleCloseEl_, this.hasTitleCloseButton_);

  // Render the buttons.
  if (this.buttons_) {
    this.buttons_.attachToElement(this.buttonEl_);
    var buttons = this.buttons_.getAllButtons();
      for (var i = 0; i < buttons.length; i++) {
          goog.dom.classes.add(buttons[i], 'btn');
      }
  }
  goog.style.showElement(this.buttonEl_, !!this.buttons_);
  this.setBackgroundElementOpacity(this.backgroundElementOpacity_);
};
