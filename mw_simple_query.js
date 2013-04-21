/**
 * MW Simple Query, v2.4
 *
 * Simple DOM access library.
 * Allows convenient access to native dom/element methods
 * with the advantage of method chaining.
 *
 * This is NOT a browser compatibility layer like jQuery.
 *
 * Copyright (c) 2013 Markus von der Wehd <mvdw@mwin.de>
 * MIT License, see LICENSE.txt, see http://www.opensource.org/licenses/mit-license.php
 */

(function (window) {
	'use strict';

	var document = window.document;

	var simpleQuery,
		ElementWrapper;


	// ▂▂▂▂▂▂▂ simpleQuery ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

	/**
	 * simpleQuery queries the dom and creates wrapped dom elements.
	 * @static
	 * @namespace
	 */

	/**
	 * Selects a element from the dom and returns a wrapped element.
	 * @param {string} selector				A css selector.
	 * @param {object} [context=document]	The context for the selection, a wrapped element or dom element.
	 * @returns {object}					A wrapped element. The wrapped element could be null if selector doesn't match anything.
	 */
	simpleQuery = function (selector, context) {
		if (typeof selector !== 'string') {
			throw new TypeError('simpleQuery: Invalid type for selector given!');
		}
		if (context !== undefined && typeof context !== 'object') {
			throw new TypeError('simpleQuery: Invalid type for context given!');
		}

		return new ElementWrapper(selector, context);
	};

	// ═══════ Methods ════════════════════════════════════════════════════════

	// ─────── wrapping ───────────────────────────────────────────────────────

	/**
	 * Wraps the given wrapped element or dom element in a new wrapped element.
	 * @param {object} element			A wrapped element or dom element.
	 * @returns {object}				A wrapped element.
	 */
	simpleQuery.wrap = function (element) {
		if (typeof element !== 'object') {
			throw new TypeError('simpleQuery#wrap: Invalid type given!');
		}

		return new ElementWrapper(element);
	};
	// ─────── selection ──────────────────────────────────────────────────────

	/**
	 * selects a list of elements from the dom and returns an array of wrapped elements.
	 * @param {string} selector				A css selector.
	 * @param {object} [context=document]	The context for the selection, a wrapped element or dom element.
	 * @returns {object[]}					An array of wrapped elements or an empty array.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/Document.querySelectorAll
	 */
	simpleQuery.all = function (selector, context) {
		if (typeof selector !== 'string') {
			throw new TypeError('simpleQuery#all: Invalid type for selector given!');
		}
		if (context !== undefined && typeof context !== 'object') {
			throw new TypeError('simpleQuery#all: Invalid type for context given!');
		}

		var parent = context && context._n || context || document;

		return this.toArray(parent.querySelectorAll(selector))
			.map(function (element) {
				return new ElementWrapper(element);
			});
	};

	// ─────── element creation ───────────────────────────────────────────────

	/**
	 * Creates a new dom element and returns it as a wrapped element.
	 * @param {string} name		A valid dom element name.
	 * @returns {object}		A wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/document.createElement
	 */
	simpleQuery.create = function (name) {
		if (typeof name !== 'string') {
			throw new TypeError('simpleQuery#create: Invalid type for name given!');
		}
		return new ElementWrapper(document.createElement(name));
	};

	/**
	 * Creates a document fragment and returns as a wrapped element.
	 * @returns {object}		A wrapped document fragment.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/document.createDocumentFragment
	 */
	simpleQuery.createFragment = function () {
		return new ElementWrapper(document.createDocumentFragment());
	};

	// ─────── css files/rules ────────────────────────────────────────────────

	/**
	 * Loads a css file by creating a new 'link' element and appending it to the document 'head'.
	 * @param {string} relPath		The relative path to a css file. (the content of the 'href' attribute)
	 * @returns {object}			A reference to the created link element. (usefull to attach a load event handler)
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/HTML/Element/link
	 */
	simpleQuery.addCssFile = function (relPath) {
		var e;

		if (typeof relPath !== 'string') {
			throw new TypeError('simpleQuery#addCssFile: Invalid type for path given!');
		}

		e = document.createElement('link');
		e.setAttribute('href', relPath);
		e.setAttribute('rel', 'stylesheet');
		e.setAttribute('type', 'text/css');
		document.head.appendChild(e);

		return e;
	};

	/**
	 * Holds a reference to a newly created stylesheet for further css rule insertion.
	 * Reused by .addCssRule() to avoid unnecessarily creating new stylesheets on every added css rule.
	 * @property {object}		A reference to a programmatically created stylesheet.
	 * @private
	 */
	Object.defineProperty(simpleQuery,
		'_styleSheet', {
			value: null,
			writable: true
		}
	);

	/**
	 * Creates a new css rule and inserts it into the document.
	 * @param {string} cssRule		A css rule.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/Using_dynamic_styling_information
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/CSSStylesheet
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/CSSStyleSheet/insertRule
	 */
	simpleQuery.addCssRule = function (cssRule) {
		var e;

		if (typeof cssRule !== 'string') {
			throw new TypeError('simpleQuery#addCssRule: Invalid type for cssRule given!');
		}

		if (!this._styleSheet) {
			// first call, create stylesheet
			e = document.createElement('style');
			e.setAttribute('type', 'text/css');
			document.head.appendChild(e);
			this._styleSheet = document.styleSheets[document.styleSheets.length - 1];
		}

		// add rule
		this._styleSheet.insertRule(cssRule, this._styleSheet.cssRules.length);
	};

	// ─────── events ─────────────────────────────────────────────────────────

	/**
	 * Adds an event listener to the document 'DOMContentLoaded' event.
	 * The callback gets called immediately if the DOM is already ready.
	 * @param {function} callback	The callback.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/DOMContentLoaded_(event)
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/document.readyState
	 */
	simpleQuery.onDOMReady = function (callback) {
		var listener;

		if (typeof callback !== 'function') {
			throw new TypeError('simpleQuery#onDomReady: Invalid type for callback given!');
		}

		// readyState: loading, interactive, complete
		if (document.readyState !== 'loading') {
			return callback();
		}

		listener = function () {
			document.removeEventListener('DOMContentLoaded', listener);
			callback();
		};
		document.addEventListener('DOMContentLoaded', listener, false);
	};

	/**
	 * Adds an event listener to the document 'load' event.
	 * The callback gets called immediately if the document is already loaded.
	 * @param {function} callback	The callback.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/load
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/document.readyState
	 */
	simpleQuery.onLoad = function (callback) {
		var listener;

		if (typeof callback !== 'function') {
			throw new TypeError('simpleQuery#onLoad: Invalid type for callback given!');
		}

		// readyState: loading, interactive, complete
		if (document.readyState === 'complete') {
			return callback();
		}

		listener = function () {
			window.removeEventListener('load', listener);
			callback();
		};
		window.addEventListener('load', listener, false);
	};

	// ─────── utilities ──────────────────────────────────────────────────────

	/**
	 * Returns the actual type of the given object:
	 *   'undefined', 'null', 'boolean', 'number', 'string', 'array', 'object', 
	 *   'date', 'regexp', 'error', 'math', 'json', arguments.
	 * @param {mixed} obj			Any type.
	 * @returns {string}			The actual type of the given data.
	 *
	 * @see http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
	 * @see http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
	 */
	var toTypeRE = /\s([a-zA-Z]+)/;
	simpleQuery.toType = function(obj) {
		return Object.prototype.toString.call(obj).match(toTypeRE)[1].toLowerCase();
	};


	/**
	 * Converts an array like object (e.g. a dom node list) to a real javascript array.
	 * @param {object} arrayLike	An array like object.
	 * @returns {array}				A javascript array.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/slice
	 */
	var _slice = Function.prototype.call.bind(Array.prototype.slice);
	simpleQuery.toArray = function(arrayLike) {
		if (typeof arrayLike === 'object' && 'length' in arrayLike && typeof arrayLike.length === 'number') {
			return _slice(arrayLike);
		}

		throw new TypeError('simpleQuery#toArray: Invalid type given!');
	};


	// ▂▂▂▂▂▂▂ Element Wrapper ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

	/**
	 * ElementWrapper wraps a dom element.
	 * It allows a convenient and shorter access to many dom element methods
	 * with the advantage of method chaining.
	 * @class
	 */

	/**
	 * Creates a new wrapped element, selected from the dom, from the given dom element or wrapped element.
	 * The constructor must not be called directly, it is only used by the static simpleQuery object,
	 * but the methods are all accessible by instances of this class.
	 * @param {string|object} selectorOrNode	A css selector, a dom element or a wrapped element.
	 * @param {object} [context=document]		The context for the selection, a wrapped element or dom node.
	 * @constructor
	 * @private
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/Document.querySelector
	 */
	ElementWrapper = function (selectorOrNode, context) {
		this._oldDisplay = '';
		this._events = [];

		this._n = (typeof selectorOrNode === 'string') ?
			(context && context._n || context || document).querySelector(selectorOrNode) :
			(selectorOrNode && selectorOrNode._n || selectorOrNode || null);
	};

	// ═══════ Properties ═════════════════════════════════════════════════════

	// ─────── wrapped dom element (readonly) ─────────────────────────────────

	/**
	 * Returns this wrapped dom element.
	 * @property {object} node		This wrapped dom element.
	 */
	Object.defineProperty(ElementWrapper.prototype,
		'node', { get: function () { return this._n; } }
	);

	// ─────── offset (readonly) ──────────────────────────────────────────────

	/**
	 * Returns the offset values of this wrapped element.
	 * @property {number} offsetLeft
	 * @property {number} offsetTop
	 * @property {number} offsetWidth
	 * @property {number} offsetHeight
	 * @property {number} offsetParent
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/Determining_the_dimensions_of_elements
	 */
	Object.defineProperties(ElementWrapper.prototype, {
		'offsetLeft': { get: function () { return this._n.offsetLeft; } },
		'offsetTop': { get: function () { return this._n.offsetTop; } },
		'offsetWidth': { get: function () { return this._n.offsetWidth; } },
		'offsetHeight': { get: function () { return this._n.offsetHeight; } },
		'offsetParent': { get: function () { return this._n.offsetParent; } }
	});

	// ─────── form elements (read/write) ─────────────────────────────────────

	/**
	 * Sets/gets the checked state of this wrapped element. (only usefull for <input type="radio|checkbox">).
	 * @property {boolean} checked		The checked state of this wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/HTML/Element/Input
	 */
	Object.defineProperty(ElementWrapper.prototype,
		'checked', {
			get: function () { return this._n.checked; },
			set: function (v) { this._n.checked = v; }
		}
	);

	/**
	 * Sets/gets the selected state of this wrapped element. (only usefull for <option>s inside <select>).
	 * @property {boolean} selected		The selected state of this wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/HTML/Element/Input
	 */
	Object.defineProperty(ElementWrapper.prototype,
		'selected', {
			get: function () { return this._n.selected; },
			set: function (v) { this._n.selected = v; }
		}
	);

	// ═══════ Methods ════════════════════════════════════════════════════════

	// ─────── node selection/comparison ──────────────────────────────────────

	/**
	 * Returns a new wrapped dom element, selected from the dom tree below this this wrapped element.
	 * @param {string} selector		A css selector.
	 * @returns {object}			The new selected wrapped element.
	 */
	ElementWrapper.prototype.select = function (selector) {
		if (typeof selector !== 'string') {
			throw new TypeError('simpleQuery#select: Invalid type for selector given!');
		}
		return new ElementWrapper(selector, this);
	};

	/**
	 * Returns an array of new wrapped dom elements selected from the dom tree below this this wrapped element.
	 * @param {string} selector		A css selector.
	 * @returns {object[]}			An array of wrapped elements or an empty array.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/Document.querySelectorAll
	 */
	ElementWrapper.prototype.selectAll = function (selector) {
		if (typeof selector !== 'string') {
			throw new TypeError('simpleQuery#selectAll: Invalid type for selector given!');
		}
		return simpleQuery.toArray(this._n.querySelectorAll(selector))
			.map(function (node) {
				return new ElementWrapper(node);
			});
	};

	/**
	 * Checks if this wrapped element refers to the same dom element as the given wrapped element.
	 * @param {object} node		The wrapped element to compare.
	 * @returns {boolean}		True if this wrapped element refers to the same dom element as the given one.
	 */
	ElementWrapper.prototype.sameNode = function (node) {
		if (typeof node !== 'object' || !('_n' in node)) {
			throw new TypeError('simpleQuery#sameNode: Invalid type for node given!');
		}
		return this._n === node._n;
	};

	// ─────── attributes ─────────────────────────────────────────────────────

	/**
	 * Gets an attribute value from this wrapped element.
	 * @param {string} name		The name of the attribute.
	 * @returns {string|null}	The attribute value of this wrapped element, or null if attribute doesnt exist.
	 *
	 * Sets an attribute value on this wrapped element.
	 * @param {string} name		The name of the attribute.
	 * @param {string} value	The new value of the attribute.
	 * @returns {object}		This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.getAttribute
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.setAttribute
	 */
	ElementWrapper.prototype.attrib = function (name, value) {
		if (typeof name !== 'string') {
			throw new TypeError('simpleQuery#attrib: Invalid type for name given!');
		}
		if (value === undefined) {
			return this._n.getAttribute(name);
		}

		if (typeof value !== 'string' && typeof value !== 'number') {
			throw new TypeError('simpleQuery#attrib: Invalid type for value given!');
		}
		this._n.setAttribute(name, value);

		return this;
	};

	/**
	 * Tests if an attribute exists on this wrapped element.
	 * @param {string} name		The name of the attribute to test.
	 * @returns {boolean}		True if the attribute exists on this wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.hasAttribute
	 */
	ElementWrapper.prototype.hasAttrib = function (name) {
		if (typeof name !== 'string') {
			throw new TypeError('simpleQuery#removeAttrib: Invalid type for name given!');
		}
		return this._n.hasAttribute(name);
	};

	/**
	 * Removes an attribute from this wrapped element.
	 * @param {string} name		The name of the attribute to remove.
	 * @returns {object}		This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.removeAttribute
	 */
	ElementWrapper.prototype.removeAttrib = function (name) {
		if (typeof name !== 'string') {
			throw new TypeError('simpleQuery#removeAttrib: Invalid type for name given!');
		}
		this._n.removeAttribute(name);

		return this;
	};

	// ─────── forms ──────────────────────────────────────────────────────────

	/**
	 * Gets an input elements value from this wrapped element.
	 * @returns {string}		The value of this wrapped element.
	 *
	 * Sets an input elements value on this wrapped element.
	 * @param {string} value	The new value.
	 * @returns {object}		This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/HTML/Element/Input
	 */
	ElementWrapper.prototype.value = function (value) {
		if (value === undefined) {
			return this._n.value;
		}

		if (typeof value !== 'string' && typeof value !== 'number') {
			throw new TypeError('simpleQuery#value: Invalid type for value given!');
		}
		this._n.value = value;

		return this;
	};

	/**
	 * Checks if this wrapped input element constrains are satisfied.
	 * @returns {boolean}	True if constrains are satisfied, else false.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/HTML/HTML5/Forms_in_HTML5#Constraint_Validation
	 */
	ElementWrapper.prototype.checkValidity = function () {
		return this._n.checkValidity();
	};

	/**
	 * Sets the input focus on this wrapped element.
	 * @returns {object}	This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/HTML/Element/Input
	 */
	ElementWrapper.prototype.focus = function () {
		this._n.focus();

		return this;
	};

	/**
	 * Removes the input focus from this wrapped element.
	 * @returns {object}	This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/HTML/Element/Input
	 */
	ElementWrapper.prototype.blur = function () {
		this._n.blur();

		return this;
	};

	/**
	 * Gets the 'disabled' attribute of this wrapped element. (only useful for input|button nodes)
	 * @returns {boolean}		True if this wrapped element is disabled, else false.
	 *
	 * Sets the 'disabled' attribute of this wrapped element.
	 * @param {boolean} value	True to set 'disabled' attribute on this wrapped element, false to remove it.
	 * @returns {object}		This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/HTMLInputElement
	 */
	ElementWrapper.prototype.disabled = function (value) {
		if (value === undefined) {
			return this._n.disabled;
		}
		this._n.disabled = value;

		if (typeof value !== 'boolean') {
			throw new TypeError('simpleQuery#disabled: Invalid type for value given!');
		}

		return this;
	};

	// ─────── offset / dimension / position ──────────────────────────────────

	/**
	 * Get all offset values as object from this wrapped element:
	 * offsetLeft, offsetTop, offsetWidth, offsetHeight, offsetParent.
	 * @returns {object}	Offset object: { left: {number}, top: {number}, width: {number}, height: {number}, parent: {object, dom element} }
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/Determining_the_dimensions_of_elements
	 */
	ElementWrapper.prototype.offset = function () {
		return {
			'left': this._n.offsetLeft,
			'top': this._n.offsetTop,
			'width': this._n.offsetWidth,
			'height': this._n.offsetHeight,
			'parent': this._n.offsetParent
		};
	};

	/**
	 * Sets the width of this wrapped element by setting .style.width.
	 * @param {number} width	Width in pixel.
	 * @returns {object}		This wrapped element.
	 */
	ElementWrapper.prototype.width = function (width) {
		if (typeof width !== 'number') {
			throw new TypeError('simpleQuery#width: Invalid type for width given!');
		}
		this._n.style.width = Math.round(width) + 'px';

		return this;
	};

	/**
	 * Sets the height of this wrapped element by setting .style.height.
	 * @param {number} height	Height in pixel.
	 * @returns {object}		This wrapped element.
	 */
	ElementWrapper.prototype.height = function (height) {
		if (typeof height !== 'number') {
			throw new TypeError('simpleQuery#height: Invalid type for height given!');
		}
		this._n.style.height = Math.round(height) + 'px';

		return this;
	};

	/**
	 * Sets the position of this wrapped element by setting .style.left/.top.
	 * @param {number} left		Left position in pixel.
	 * @param {number} top		Top position in pixel.
	 * @returns {object}		This wrapped element.
	 */
	ElementWrapper.prototype.position = function (left, top) {
		if (typeof left !== 'number') {
			throw new TypeError('simpleQuery#position: Invalid type for left pos given!');
		}
		if (typeof top !== 'number') {
			throw new TypeError('simpleQuery#position: Invalid type for top pos given!');
		}
		this._n.style.left = Math.round(left) + 'px';
		this._n.style.top = Math.round(top) + 'px';

		return this;
	};

	// ─────── data ───────────────────────────────────────────────────────────

	/**
	 * Gets/sets user data on this wrapped element.
	 * Note: this method may alter the key, see MDN for more info.
	 * E.g.: element.data('myKey', 1) sets element attribute data-my-key="1"
	 *
	 * Gets a single data value from this wrapped element.
	 * @param {string} data			The key.
	 * @returns {string|undefined}	The value associated with the key or undefined if key not found.
	 *
	 * Gets all data key/value pairs as object from this wrapped element.
	 * @returns {object|null}		An object containing key/value pairs or null if no data found.
	 *
	 * Sets a single data key/value pair on this wrapped element.
	 * @param {string} data			The key.
	 * @param {string} value		The new value associated with the key.
	 * @returns {object}			This wrapped element.
	 *
	 * Gets all data as object with key/value pairs from the wrapped element.
	 * @param {object} data			An object containing key/value pairs.
	 * @returns {object}			This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.dataset
	 */
	ElementWrapper.prototype.data = function (data, value) {
		var dataset = this._n.dataset,
			key,
			retData;

		// get/set single key
		if (typeof data === 'string') {
			if (value === undefined) {
				return dataset[data];
			}
			if (typeof value !== 'string' && typeof value !== 'number') {
				throw new TypeError('simpleQuery#data: Invalid type for value given!');
			}
			dataset[data] = value;
			return this;
		}

		// set values from object
		if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
			for (key in data) {
				if (typeof data[key] !== 'string' && typeof data[key] !== 'number') {
					throw new TypeError('simpleQuery#data: Invalid type for \'' + key + '\' in given object!');
				}
				dataset[key] = data[key];
			}
			return this;
		}

		// get data values as object
		if (data === undefined && value === undefined) {
			if (Object.keys(dataset).length === 0) {
				return null;
			}
			retData = {};
			for (key in dataset) {
				retData[key] = dataset[key];
			}
			return retData;
		}

		throw new TypeError('simpleQuery#data: Invalid type(s) given!');
	};

	// ─────── styles/classes ─────────────────────────────────────────────────

	/**
	 * Gets/sets styles on this wrapped element.
	 *
	 * Gets a computed style value for the given style name from this wrapped element.
	 * @param {string} name			A CSS style name.
	 * @returns {string|undefined}	The value associated with the name,
	 *								if no value then an empty string, undefined if name not found.
	 *
	 * Sets a style value on this wrapped element.
	 * @param {string} name			A CSS style name.
	 * @param {string} value		The new style value.
	 * @returns {object}			This wrapped element.
	 *
	 * Sets style name/value pairs given as object on this wrapped element.
	 * @param {object} name			A object containing CSS name/value pairs.
	 * @returns {object}			This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.style
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/window.getComputedStyle
	 */
	ElementWrapper.prototype.style = function (name, value) {
		var key;

		if (typeof name === 'string') {
			if (value === undefined) {
				// get single computed style
				return window.getComputedStyle(this._n)[name];
			}
			if (typeof value !== 'string' && typeof value !== 'number') {
				throw new TypeError('simpleQuery#style: Invalid type for value given!');
			}
			// set single style
			this._n.style[name] = value;
			return this;
		}
		if (typeof name === 'object' && name !== null && !Array.isArray(name)) {
			// set styles from object with key/value pairs
			for (key in name) {
				if (typeof name[key] !== 'string' && typeof name[key] !== 'number') {
					throw new TypeError('simpleQuery#style: Invalid type for \'' + key + '\' in given object!');
				}
				this._n.style[key] = name[key];
			}
			return this;
		}

		throw new TypeError('simpleQuery#style: Invalid type(s) given!');
	};

	/**
	 * Sets the class attribute to the given name of this wrapped element.
	 * @param {string} name			A CSS class name.
	 * @returns {object}			This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.className
	 */
	ElementWrapper.prototype.setClass = function (name) {
		if (typeof name !== 'string') {
			throw new TypeError('simpleQuery#setClass: Invalid type for name given!');
		}
		this._n.className = name;

		return this;
	};

	/**
	 * Adds a class to the list of classes of this wrapped element.
	 * @param {string} name			A CSS class name.
	 * @returns {object}			This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.classList
	 */
	ElementWrapper.prototype.addClass = function (name) {
		if (typeof name !== 'string') {
			throw new TypeError('simpleQuery#addClass: Invalid type for name given!');
		}
		this._n.classList.add(name);

		return this;
	};

	/**
	 * Removes a class from the list of classes of this wrapped element.
	 * @param {string} name			A CSS class name.
	 * @returns {object}			This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.classList
	 */
	ElementWrapper.prototype.removeClass = function (name) {
		if (typeof name !== 'string') {
			throw new TypeError('simpleQuery#removeClass: Invalid type for name given!');
		}
		this._n.classList.remove(name);

		return this;
	};

	/**
	 * Toggle the existance of a class in the list of classes of this wrapped element.
	 * @param {string} name			A CSS class name.
	 * @returns {object}			This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.classList
	 */
	ElementWrapper.prototype.toggleClass = function (name) {
		if (typeof name !== 'string') {
			throw new TypeError('simpleQuery#removeClass: Invalid type for name given!');
		}
		this._n.classList.toggle(name);

		return this;
	};

	/**
	 * Check if this wrapped elements list of classes contains a class.
	 * @param {string} name			A CSS class name.
	 * @returns {boolean}			True if class 'name' is in this wrapped elements list of classes.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.classList
	 */
	ElementWrapper.prototype.containsClass = function (name) {
		if (typeof name !== 'string') {
			throw new TypeError('simpleQuery#removeClass: Invalid type for name given!');
		}
		return this._n.classList.contains(name);
	};

	// ─────── text/html content ──────────────────────────────────────────────

	/**
	 * Gets the text content of this wrapped element.
	 * @returns {string}		The text content of this wrapped element.
	 *
	 * Sets the text content of this wrapped element.
	 * @param {string} text		The new text content of this wrapped element.
	 * @returns {object}		This wrapped element.
	 *
	 * @see	MDN https://developer.mozilla.org/en-US/docs/DOM/Node.textContent
	 */
	ElementWrapper.prototype.text = function (content) {
		if (content === undefined) {
			return this._n.textContent;
		}
		if (typeof content !== 'string' && typeof content !== 'number') {
			throw new TypeError('simpleQuery#text: Invalid type for text given!');
		}
		this._n.textContent = content;

		return this;
	};

	/**
	 * Gets the html content of this wrapped element.
	 * @returns {string}		The html content of this wrapped element.
	 *
	 * Sets the html content of this wrapped element.
	 * @param {string} html		The new html content of this wrapped element.
	 * @returns {object}		This wrapped element.
	 *
	 * @see	MDN https://developer.mozilla.org/en-US/docs/DOM/element.innerHTML
	 */
	ElementWrapper.prototype.html = function (content) {
		if (content === undefined) {
			return this._n.innerHTML;
		}
		if (typeof content !== 'string' && typeof content !== 'number') {
			throw new TypeError('simpleQuery#html: Invalid type for html given!');
		}
		this._n.innerHTML = content;

		return this;
	};

	// ─────── dom manipulation ───────────────────────────────────────────────

	/**
	 * Deletes all child elements from this wrapped element.
	 * Does NOT remove attached event handlers!
	 * @returns {object}		This wrapped element.
	 */
	ElementWrapper.prototype.empty = function () {
		this._n.innerHTML = '';

		return this;
	};

	/**
	 * Returns the given wrapped elements child node by index.
	 * Note: Includes text nodes (childNodes[index])
	 * @param {number} index	The index of this wrapped elements child to return.
	 * @returns {object}		The child as wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/Node.childNodes
	 */
	ElementWrapper.prototype.childNode = function (index) {
		if (typeof index !== 'number') {
			throw new TypeError('simpleQuery#childNode: Invalid type for index given!');
		}
		if (this._n.childNodes[index] === undefined) {
			throw new RangeError('simpleQuery#childNode: Index out of bounds!');
		}

		return new ElementWrapper(this._n.childNodes[index]);
	};

	/**
	 * Returns the given wrapped elements child element by index.
	 * Note: Does NOT include any text node (children[index])
	 * @param {number} index	The index of this wrapped elements child to return.
	 * @returns {object}		The child as wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/Element.children
	 */
	ElementWrapper.prototype.childElement = function (index) {
		if (typeof index !== 'number') {
			throw new TypeError('simpleQuery#childElement: Invalid type for index given!');
		}
		if (this._n.children[index] === undefined) {
			throw new RangeError('simpleQuery#childElement: Index out of bounds!');
		}

		return new ElementWrapper(this._n.children[index]);
	};

	/**
	 * Returns this wrapped elements child elements as array of wrapped elements.
	 * Child elements do not include any text node, only html element nodes.
	 * @returns {object}		The child elements as array of wrapped elements.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/Element.children
	 */
	ElementWrapper.prototype.childElements = function () {
		return simpleQuery.toArray(this._n.children)
			.map(function (node) {
				return new ElementWrapper(node);
			});
	};

	/**
	 * Removes the given child wrapped element/dom node from this wrapped element and returns it.
	 * @param {object} node		The child node to remove, given as wrapped element or dom element.
	 * @returns {object}		The removed child as wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/de/docs/DOM/Node.removeChild
	 */
	ElementWrapper.prototype.removeChild = function (node) {
		if (typeof node !== 'object' || node === null || Array.isArray(node)) {
			throw new TypeError('simpleQuery#removeChild: Invalid type for node given!');
		}

		return new ElementWrapper(this._n.removeChild(node._n || node));
	};

	/**
	 * Appends the given html|wrapped element|dom node to this wrapped element|document fragment child nodes list
	 * @param {string|object} content	The html, dom node or wrapped element to append.
	 * @returns {object}				This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/Node.appendChild
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.insertAdjacentHTML
	 */
	ElementWrapper.prototype.append = function (content) {
		if (typeof content === 'string') {
			this._n.insertAdjacentHTML('beforeend', content);
			return this;
		}

		if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
			this._n.appendChild(content._n || content);
			return this;
		}

		throw new TypeError('simpleQuery#append: Invalid type for content given!');
	};

	/**
	 * Prepends the given html|wrapped element|dom node to this wrapped element|document fragment child nodes list
	 * @param {string|object} content	The html, dom node or wrapped element to prepend.
	 * @returns {object}				This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/Node.insertBefore
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.insertAdjacentHTML
	 */
	ElementWrapper.prototype.prepend = function (content) {
		if (typeof content === 'string') {
			this._n.insertAdjacentHTML('afterbegin', content);
			return this;
		}

		if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
			if (this._n.hasChildNodes()) {
				this._n.insertBefore(content._n || content, this._n.firstChild);
			} else {
				this._n.appendChild(content._n || content);
			}
			return this;
		}

		throw new TypeError('simpleQuery#prepend: Invalid type for content given!');
	};

	/**
	 * Inserts the given wrapped element|dom node to this wrapped elements childs,
	 * before the given reference wrapped element|dom node.
	 * @param {object} insertNode	The dom node or wrapped element to be inserted.
	 * @param {object} refNode		The reference dom node or wrapped element.
	 * @returns {object}			This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/Node.insertBefore
	 */
	ElementWrapper.prototype.insertBefore = function (insertNode, refNode) {
		if (typeof insertNode !== 'object' || insertNode === null || Array.isArray(insertNode)) {
			throw new TypeError('simpleQuery#insertBefore: Invalid type for insert node given!');
		}
		if (typeof refNode !== 'object' || refNode === null || Array.isArray(refNode)) {
			throw new TypeError('simpleQuery#insertBefore: Invalid type for reference node given!');
		}

		this._n.insertBefore(insertNode._n || insertNode, refNode._n || refNode);

		return this;
	};

	/**
	 * Recursively removes empty text nodes (e.g. linebreaks) and comment nodes
	 * from the dom tree below this wrapped element,
	 * with the exception of text nodes containing only non-breaking space '&nbsp;' resp. '\u00A0'.
	 * Useful to minimize the number of nodes in the dom tree for faster dom traversal.
	 * @returns {object}		This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en/docs/DOM/Node.nodeType
	 */
	var _cleanupRE = /[\r\n\t ]+/g;
	var _cleanupTree = function (node) {
		var i, n;

		for (i = node.childNodes.length; i--;) {
			n = node.childNodes[i];
			switch (n.nodeType) {
			case Node.COMMENT_NODE:
				n.parentNode.removeChild(n);
				break;
			case Node.TEXT_NODE:
				if (n.textContent.replace(_cleanupRE, '') === '') {
					n.parentNode.removeChild(n);
				}
				break;
			case Node.ELEMENT_NODE:
				if (n.childNodes.length > 0) {
					_cleanupTree(n);
				}
				break;
			}
		}
	};
	ElementWrapper.prototype.cleanup = function () {
		if (this._n.childNodes.length > 0) {
			_cleanupTree(this._n);
		}

		return this;
	};

	// ─────── visibility ─────────────────────────────────────────────────────

	/**
	 * Hides this wrapped element.
	 * @param {string} [display]	The value for style.display to restore when calling .show().
	 * @returns {object}			This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/window.getComputedStyle
	 */
	ElementWrapper.prototype.hide = function (display) {
		var cs;

		if (display !== undefined && typeof display !== 'string') {
			throw new TypeError('simpleQuery#hide: Invalid type for display given!');
		}

		// already hidden?
		if (this._n.style.display === 'none') {
			return;
		}

		if (display) {
			this._oldDisplay = display;
		} else {
			cs = window.getComputedStyle(this._n).display;
			// avoid saving 'none', else element never shows up ;-)
			this._oldDisplay = (cs !== 'none' && cs !== '') ? cs : 'block';
		}

		this._n.style.display = 'none';

		return this;
	};

	/**
	 * Shows this wrapped element.
	 * @returns {object}			This wrapped element.
	 */
	ElementWrapper.prototype.show = function () {
		this._n.style.display = this._oldDisplay;

		return this;
	};

	// ─────── events ─────────────────────────────────────────────────────────

	/**
	 * Adds a 'click' event listener to this wrapped element.
	 * 'this' inside the handler is set to the dom element that triggered the event.  
	 * The handler gets the event object as parameter.
	 * @param {function} handler	The event handler.
	 * @returns {object}			This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/event
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.addEventListener
	 */
	ElementWrapper.prototype.onClick = function (handler) {
		if (typeof handler !== 'function') {
			throw new TypeError('simpleQuery#onClick: Invalid type for handler given!');
		}

		this._events.push({
			name: 'click',
			handler: handler
		});
		this._n.addEventListener('click', handler, false);

		return this;
	};

	/**
	 * Removes a 'click' event listener from this wrapped element.
	 * If no handler given, any 'click' event is removed.
	 * Note: can only remove events that are attached by this library
	 * @param {function} [handler]	The event handler.
	 * @returns {object}			This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/event
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.removeEventListener
	 */
	ElementWrapper.prototype.offClick = function (handler) {
		if (handler !== undefined && typeof handler !== 'function') {
			throw new TypeError('simpleQuery#offClick: Invalid type for handler given!');
		}

		var i,
			event;

		for (i = this._events.length; i--;) {
			event = this._events[i];
			if (event.name === 'click' && (handler === undefined || event.handler === handler)) {
				this._events.splice(i, 1);
				this._n.removeEventListener('click', event.handler, false);
			}
		}

		return this;
	};

	/**
	 * Adds an event listener to this wrapped element.
	 * 'this' inside the handler is set to the dom element that triggered the event.  
	 * The handler gets the event object as parameter.
	 * @param {string} name			The event name.
	 * @param {function} handler	The event handler.
	 * @returns {object}			This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/event
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.addEventListener
	 */
	ElementWrapper.prototype.onEvent = function (name, handler) {
		if (typeof name !== 'string') {
			throw new TypeError('simpleQuery#onEvent: Invalid type for name given!');
		}
		if (typeof handler !== 'function') {
			throw new TypeError('simpleQuery#onEvent: Invalid type for handler given!');
		}

		this._events.push({
			name: name,
			handler: handler
		});
		this._n.addEventListener(name, handler, false);

		return this;
	};

	/**
	 * Removes an event listener from this wrapped element.
	 * If no handler given, any event 'name' is removed.
	 * If no name given, any event is removed.
	 * Note: can only remove events that are attached by this library
	 * @param {string} [name]		The event name.
	 * @param {function} [handler]	The event handler.
	 * @returns {object}			This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/event
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.removeEventListener
	 */
	ElementWrapper.prototype.offEvent = function (name, handler) {
		if (name !== undefined && typeof name !== 'string') {
			throw new TypeError('simpleQuery#offEvent: Invalid type for name given!');
		}
		if (handler !== undefined && typeof handler !== 'function') {
			throw new TypeError('simpleQuery#offEvent: Invalid type for handler given!');
		}

		var i,
			event;

		for (i = this._events.length; i--;) {
			event = this._events[i];
			if ((name === undefined || event.name === name) && (handler === undefined || event.handler === handler)) {
				this._events.splice(i, 1);
				this._n.removeEventListener(event.name, event.handler, false);
			}
		}

		return this;
	};

// TODO: eventCount([name] [, handler])

	/**
	 * Triggers a 'click' event on this wrapped element.
	 * @returns {object}	This wrapped element.
	 *
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/event
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/document.createEvent
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/element.dispatchEvent
	 * @see https://github.com/bitovi/syn#readme
	 */
	ElementWrapper.prototype.triggerClick = function () {
		var click = document.createEvent('UIEvents');

		click.initEvent('click', true, true, window, 1);
		this._n.dispatchEvent(click);

		return this;
	};

	/**
	 * Adds a 'mouseover' event listener to this wrapped element
	 * and emulates 'mouseenter' behaviour.
	 * 'this' inside the handler is set to the dom element that triggered the event.  
	 * The handler gets the event object as parameter.
	 * @param {function} handler	The event handler.
	 * @returns {object}			This wrapped element.
	 *
	 * @see http://www.quirksmode.org/js/events_mouse.html#mouseover
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/event
	 */
	ElementWrapper.prototype.onMouseenter = function (handler) {
		var thisNode;

		if (typeof handler !== 'function') {
			throw new TypeError('simpleQuery#onMouseenter: Invalid type for handler given!');
		}

		thisNode = this._n;
		this._n.addEventListener('mouseover', function (e) {
			if (e.target !== thisNode || e.target === e.relatedTarget.parentNode) {
				return;
			}
			handler.call(this, e);
		}, false);

		return this;
	};

	/**
	 * Adds a 'mouseout' event listener to this wrapped element
	 * and emulates 'mouseleave' behaviour.
	 * 'this' inside the handler is set to the dom element that triggered the event.  
	 * The handler gets the event object as parameter.
	 * @param {function} handler	The event handler.
	 * @returns {object}			This wrapped element.
	 *
	 * @see http://www.quirksmode.org/js/events_mouse.html#mouseover
	 * @see MDN https://developer.mozilla.org/en-US/docs/DOM/event
	 */
	ElementWrapper.prototype.onMouseleave = function (handler) {
		var thisNode;

		if (typeof handler !== 'function') {
			throw new TypeError('simpleQuery#onMouseleave: Invalid type for handler given!');
		}

		thisNode = this._n;
		this._n.addEventListener('mouseout', function (e) {
			if (e.target !== thisNode || e.target === e.relatedTarget.parentNode) {
				return;
			}
			handler.call(this, e);
		}, false);

		return this;
	};

	// keep a reference for unit tests
	simpleQuery._ElementWrapper = ElementWrapper;


	window.simpleQuery = simpleQuery;
}(window));
