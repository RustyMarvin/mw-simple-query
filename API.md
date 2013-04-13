
# simple query API

## Methods on the simpleQuery object

### simpleQuery( selector [, context] )

Selects elements from the DOM and returns a simpleQuery wrapped element.

**selector** _{string}_: A string representing a CSS selector.  
**context** _{object}_: A wrapped element or dom element as context for the selection.  
**returns** _{object}_: A wrapped element.

    var h = simpleQuery('div.header');
    var e = simpleQuery('h1', h);

wraps: [document.querySelector](https://developer.mozilla.org/en-US/docs/DOM/Document.querySelector)

### simpleQuery.wrap( element )

Wraps the given wrapped element or dom element in a new wrapped element.

**element** _{object}_: A wrapped element or dom element.  
**returns** _{object}_: A wrapped element.

    var h = simpleQuery('div.header');
    var e = simpleQuery.wrap(h);


### simpleQuery.all( selector [, context] )

Selects a list of elements from the dom and returns an array of wrapped elements.

**selector** _{string}_: A string representing a CSS selector.  
**context** _{object}_: A wrapped element or dom element as context for the selection.  
**returns** _{object[]}_: An array of wrapped elements or an empty array.

    var a = simpleQuery.all('div.header');

wraps: [document.querySelectorAll](https://developer.mozilla.org/en-US/docs/DOM/Document.querySelectorAll)


### simpleQuery.create( name )

Returns a wrapped element wrapping a newly created dom element.

**name** _{string}_: A valid dom element name.  
**returns** _{object}_: A wrapped element.

    var e = simpleQuery.create('div');

wraps: [document.createElement](https://developer.mozilla.org/en-US/docs/DOM/document.createElement)


### simpleQuery.createFragment()

Returns a wrapped element wrapping a newly created document fragment.

**returns** _{object}_: A wrapped document fragment.

    var e = simpleQuery.createFragment();

wraps: [document.createDocumentFragment](https://developer.mozilla.org/en-US/docs/DOM/document.createDocumentFragment)


### simpleQuery.addCssFile( path )

Loads a css file by creating a new 'link' element and appending it to the document 'head'.

**path** _{string}_: The relative path to a css file. (the value of the 'href' attribute)  
**returns** _{object}_: A reference to the created link element. (usefull to attach a load event handler)

    var e = simpleQuery.addCssFile('css/styles.css');

info: [MDN](https://developer.mozilla.org/en-US/docs/HTML/Element/link)


### simpleQuery.addCssRule( rule )

Creates a new css rule and inserts it into the document.

**rule** _{string}_: A css rule.

    var e = simpleQuery.addCssRule('h1 { color: red; }');

wraps: [CSSStyleSheet.insertRule](https://developer.mozilla.org/en-US/docs/DOM/CSSStyleSheet/insertRule)  
info: [MDN](https://developer.mozilla.org/en-US/docs/DOM/Using_dynamic_styling_information)


### simpleQuery.onDOMReady( callback )

Adds an event listener to the document 'DOMContentLoaded' event.
The callback gets called immediately if the DOM is already ready.

**callback** _{function}_: The callback.

	simpleQuery.onDOMReady(function () { console.log('dom ready'); })

wraps: [Event DOMContentLoaded](https://developer.mozilla.org/en-US/docs/DOM/Mozilla_Event_Reference/DOMContentLoaded)  
info: [MDN](https://developer.mozilla.org/en-US/docs/DOM/document.readyState)


### simpleQuery.onLoad( callback )

Adds an event listener to the document 'load' event.
The callback gets called immediately if the document is already loaded.

**callback** _{function}_: The callback.

	simpleQuery.onLoad(function () { console.log('page loaded'); })

wraps: [Event load](https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/load)  
info: [MDN](https://developer.mozilla.org/en-US/docs/DOM/document.readyState)


### simpleQuery.toType( variable )

Returns the actual type of the given variable.  
'undefined', 'null', 'boolean', 'number', 'string', 'array', 'object', 'date', 'regexp', 'error', 'math', 'json', arguments.

**variable** _{mixed}_: Any type.  
**returns** _{string}_: The actual type of the given data.

	var t = simpleQuery.toType([]); // t contains 'array'

info: [javascriptweblog.wordpress.com](http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/)  
info: [perfectionkills.com](http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/)


## Properties of the wrapped element returned from simpleQuery methods

Work in progress...


## Methods on the wrapped element returned from simpleQuery methods

Work in progress...

