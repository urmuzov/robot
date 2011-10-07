goog.provide('robot.ExportManager');

/**
 * @class
 * @constructor
 */
robot.ExportManager = function() {
    /**
     * @private
     * @type !Array.<robot.ExportManager.Symbol>
     */
    this.symbols_ = [];
};
goog.addSingletonGetter(robot.ExportManager);

/**
 * @param {string} publicPath
 * @param {*} object
 * @param {robot.ExportManager.SymbolType} type
 * @return {!robot.ExportManager.Symbol}
 */
robot.ExportManager.prototype.exportSymbol = function(publicPath, object, type) {
    var symbolObj = new robot.ExportManager.Symbol(this, publicPath, object, type);
    this.symbols_.push(symbolObj);
    return symbolObj;
};

/**
 * @param {string} publicPath
 * @param {*} object
 * @return {!robot.ExportManager.Symbol}
 */
robot.ExportManager.prototype.exportConstructor = function(publicPath, object) {
    return this.exportSymbol(publicPath, object, robot.ExportManager.SymbolType.CONSTRUCTOR);
};


/**
 * @param {string} publicPath
 * @param {*} object
 * @return {!robot.ExportManager.Symbol}
 */
robot.ExportManager.prototype.exportEnum = function(publicPath, object) {
    return this.exportSymbol(publicPath, object, robot.ExportManager.SymbolType.ENUM);
};


/**
 * @param {string} publicPath
 * @param {*} object
 * @return {!robot.ExportManager.Symbol}
 */
robot.ExportManager.prototype.exportObject = function(publicPath, object) {
    return this.exportSymbol(publicPath, object, robot.ExportManager.SymbolType.OBJECT);
};

/**
 * @return {!Array.<robot.ExportManager.Symbol>}
 */
robot.ExportManager.prototype.getSymbols = function() {
    return this.symbols_;
};

/**
 * @return {!Object.<robot.ExportManager.SymbolType, !Array.<robot.ExportManager.Symbol>>}
 */
robot.ExportManager.prototype.getSymbolsByType = function() {
    var out = {};
    var objects = [];
    var enums = [];
    var constructors = [];
    out[robot.ExportManager.SymbolType.OBJECT] = objects;
    out[robot.ExportManager.SymbolType.ENUM] = enums;
    out[robot.ExportManager.SymbolType.CONSTRUCTOR] = constructors;

    var symbol;
    for (var i = 0; i < this.symbols_.length; i++) {
        symbol = this.symbols_[i];
        out[symbol.getType()].push(symbol);
    }

    return out;
};


/**
 * @enum {string}
 */
robot.ExportManager.SymbolType = {
    OBJECT: 'object',
    CONSTRUCTOR: 'constructor',
    ENUM: 'enum'
};

/**
 * @class
 * @constructor
 * @param {!robot.ExportManager} manager
 * @param {string} publicPath
 * @param {*} object
 * @param {!robot.ExportManager.SymbolType} type
 */
robot.ExportManager.Symbol = function(manager, publicPath, object, type) {
    /**
     * @private
     * @type !robot.ExportManager
     */
    this.manager_ = manager;
    /**
     * @private
     * @type string
     */
    this.publicPath_ = publicPath;
    /**
     * @private
     * @type *
     */
    this.object_ = object;
    /**
     * @private
     * @type !robot.ExportManager.SymbolType
     */
    this.type_ = type;
    /**
     * @private
     * @type !Object.<string, *>
     */
    this.properties_ = {};
    /**
     * @private
     * @type !Object.<string, *>
     */
    this.prototypeProperties_ = {};
    goog.exportSymbol(this.publicPath_, this.object_);
};

/**
 * @param {string} propertyName
 * @param {*} object
 * @return {!robot.ExportManager.Symbol} this
 */
robot.ExportManager.Symbol.prototype.exportProperty = function(propertyName, object) {
    this.properties_[propertyName] = object;
    goog.exportProperty((/** @type Object */ this.object_), propertyName, object);
    return this;
};

/**
 * @param {Object.<string, *>} propertiesMap
 * @return {!robot.ExportManager.Symbol} this
 */
robot.ExportManager.Symbol.prototype.exportProperties = function(propertiesMap) {
    for (var i in propertiesMap) {
        if (propertiesMap.hasOwnProperty(i)) {
            this.exportProperty(i, propertiesMap[i]);
        }
    }
    return this;
};

/**
 * @param {string} propertyName
 * @param {*} object
 * @return {!robot.ExportManager.Symbol} this
 */
robot.ExportManager.Symbol.prototype.exportPrototypeProperty = function(propertyName, object) {
    if (this.type_ == robot.ExportManager.SymbolType.ENUM) {
        throw new Error("Enum can't have prototype properties");
    }
    this.prototypeProperties_[propertyName] = object;
    goog.exportProperty((/** @type Object */ this.object_).prototype, propertyName, object);
    return this;
};

/**
 * @param {Object.<string, *>} propertiesMap
 * @return {!robot.ExportManager.Symbol} this
 */
robot.ExportManager.Symbol.prototype.exportPrototypeProperties = function(propertiesMap) {
    for (var i in propertiesMap) {
        if (propertiesMap.hasOwnProperty(i)) {
            this.exportPrototypeProperty(i, propertiesMap[i]);
        }
    }
    return this;
};

/**
 * @return {!robot.ExportManager.SymbolType}
 */
robot.ExportManager.Symbol.prototype.getType = function() {
    return this.type_;
};


/**
 * @return {string}
 */
robot.ExportManager.Symbol.prototype.getPublicPath = function() {
    return this.publicPath_;
};


/**
 * @return {!Array.<string>}
 */
robot.ExportManager.Symbol.prototype.getPropertyNames = function() {
    return goog.object.getKeys(this.properties_);
};

/**
 * @return {!Array.<string>}
 */
robot.ExportManager.Symbol.prototype.getPrototypePropertyNames = function() {
    return goog.object.getKeys(this.prototypeProperties_);
};
