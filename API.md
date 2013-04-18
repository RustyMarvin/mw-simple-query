
# simple query API

* [Methods on the simpleQuery object](#simple-query)
* [Properties of the wrapped element](#wrapped-element-properties)
* [Methods on the wrapped element](#wrapped-element-methods)


<hr>


## Methods on the simpleQuery object

<a name="simple-query"></a>
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

info: [MDN link](https://developer.mozilla.org/en-US/docs/HTML/Element/link)


### simpleQuery.addCssRule( rule )

Creates a new css rule and inserts it into the document.

**rule** _{string}_: A css rule.

    var e = simpleQuery.addCssRule('h1 { color: red; }');

wraps: [CSSStyleSheet.insertRule](https://developer.mozilla.org/en-US/docs/DOM/CSSStyleSheet/insertRule)  
info: [MDN dynamic styling](https://developer.mozilla.org/en-US/docs/DOM/Using_dynamic_styling_information)


### simpleQuery.onDOMReady( callback )

Adds an event listener to the document 'DOMContentLoaded' event.
The callback gets called immediately if the DOM is already ready.

**callback** _{function}_: The callback.

	simpleQuery.onDOMReady(function () { console.log('dom ready'); })

wraps: [Event DOMContentLoaded](https://developer.mozilla.org/en-US/docs/DOM/Mozilla_Event_Reference/DOMContentLoaded)  
info: [MDN document.readyState](https://developer.mozilla.org/en-US/docs/DOM/document.readyState)


### simpleQuery.onLoad( callback )

Adds an event listener to the document 'load' event.
The callback gets called immediately if the document is already loaded.

**callback** _{function}_: The callback.

	simpleQuery.onLoad(function () { console.log('page loaded'); })

wraps: [Event load](https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/load)  
info: [MDN document.readyState](https://developer.mozilla.org/en-US/docs/DOM/document.readyState)


### simpleQuery.toType( variable )

Returns the actual type of the given variable.  
'undefined', 'null', 'boolean', 'number', 'string', 'array', 'object', 'date', 'regexp', 'error', 'math', 'json', arguments.

**variable** _{mixed}_: Any type.  
**returns** _{string}_: The actual type of the given data.

	var t = simpleQuery.toType([]); // t contains 'array'

info: [javascriptweblog.wordpress.com](http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/)  
info: [perfectionkills.com](http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/)


### simpleQuery.toArray( arrayLike )

Converts an array like object (e.g. a dom node list) to a real javascript array.

**arrayLike** _{object}_: An array like object.  
**returns** _{array}_: A javascript array.

	var a = simpleQuery.toArray( {0:'a', 1:'b', length:2} ); // a contains ['a', 'b']

info: [MDN Array.slice](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/slice)


<a name="wrapped-element-properties"></a>
## Properties of the wrapped element returned from simpleQuery methods


### .node

_{object} readonly_: The wrapped DOM element.


### .offsetLeft, .offsetTop, .offsetWidth, .offsetHeight

_{number} readonly_: The offset values of the wrapped element.


### .offsetParent

_{object} readonly_: The offset parent of the wrapped element.


### .checked

_{boolean}_: The checked state of the wrapped element.  
Only usefull for `<input type="radio|checkbox">`.


### .selected

_{boolean}_: The selected state of the wrapped element.  
Only usefull for `<option>` elements inside `<select>`.


<a name="wrapped-element-methods"></a>
## Methods on the wrapped element returned from simpleQuery methods


### .select( selector )

Selects a dom element from the tree below this wrapped element and returns a new wrapped dom element, similar to `simpleQuery( selector [, context] )`.

**selector** _{string}_: A string representing a CSS selector.  
**returns** _{object}_: The wrapped element.

    var d = simpleQuery('div.header');
    var h = d.select('h1'); // h contains the first <h1> wrapped element found inside <div class="header>...</div>

wraps: [document.querySelector](https://developer.mozilla.org/en-US/docs/DOM/Document.querySelector)


### .selectAll( selector )

Returns an array of new wrapped dom elements selected from the dom tree below this this wrapped element, similar to `simpleQuery.all( selector [, context] )`.

**selector** _{string}_: A string representing a CSS selector.  
**returns** _{array}_: An array of wrapped elements or an empty array.

    var d = simpleQuery('div.header');
    var a = d.select('span'); // h contains an array of all <span> wrapped elements found inside <div class="header>...</div>

wraps: [document.querySelectorAll](https://developer.mozilla.org/en-US/docs/DOM/Document.querySelectorAll)


### .sameNode( node )

Checks if this wrapped element refers to the same dom element as the given wrapped element.

**node** _{object}_: The wrapped element to compare with.  
**returns** _{boolean}_: True if this wrapper refers to the same dom element as the given one.

    var e = simpleQuery('div.header');
    var b = simpleQuery('div.header').sameNode(e); // b contains true


### .attrib( name [, value] )

**.attrib(name)**  
Gets an attribute value from the wrapped element.

**name** _{string}_: The name of the attribute to get.  
**returns** _{string|null}_: The attribute value of the wrapped element, or null if attribute doesnt exist.

    var t = simpleQuery('div.header').attrib('title'); // t contains the title attributes value

**.attrib(name, value)**  
Sets an attribute value on the wrapped element.

**name** _{string}_: The name of the attribute.  
**value** _{string}_: The new value of the attribute.  
**returns** _{object}_: The wrapped element.

    simpleQuery('div.header').attrib('title', 'My Header');

wraps: [element.getAttribute](https://developer.mozilla.org/en-US/docs/DOM/element.getAttribute)  
wraps: [element.setAttribute](https://developer.mozilla.org/en-US/docs/DOM/element.setAttribute)


### .hasAttrib( name )

Tests if an attribute exists on the wrapped element.

**name** _{string}_: The name of the attribute to test.  
**returns** _{boolean}_: True if the attribute exists on this wrapped element.

    var b = simpleQuery('div.header').hasAttrib('title'); // b contains true if title attribute exists

wraps: [element.hasAttribute](https://developer.mozilla.org/en-US/docs/DOM/element.hasAttribute)


### .removeAttrib( name )

Removes an attribute from the wrapped element.

**name** _{string}_: The name of the attribute to remove.  
**returns** _{object}_: The wrapped element.

    simpleQuery('div.header').removeAttrib('title');

wraps: [element.removeAttribute](https://developer.mozilla.org/en-US/docs/DOM/element.removeAttribute)


### .value( [value] )


**.value()**  
Gets an input elements value from the wrapped element.

**returns** _{string}_: The value of the wrapped element.

    var v = simpleQuery('input[name=myInput]').value();

**.value(value)**  
Sets an input elements value on the wrapped element.

**value** _{string}_: The new value.  
**returns** _{object}_: The wrapped element.

	simpleQuery('input[name=myInput]').value('abc');

info: [MDN input element](https://developer.mozilla.org/en-US/docs/HTML/Element/Input)


### .checkValidity()

Checks if the wrapped input element constrains are satisfied.

**returns** _{boolean}_: True if constrains are satisfied, else false.

    var v = simpleQuery('input[name=myInput]').checkValidity();

info: [MDN Constraint_Validation](https://developer.mozilla.org/en-US/docs/HTML/HTML5/Forms_in_HTML5#Constraint_Validation)


### .focus()

Sets the input focus on the wrapped element.

**returns** _{object}_: The wrapped element.

info: [MDN input element](https://developer.mozilla.org/en-US/docs/HTML/Element/Input)


### .blur()

Removes the input focus from the wrapped element.

**returns** _{object}_: The wrapped element.

info: [MDN input element](https://developer.mozilla.org/en-US/docs/HTML/Element/Input)


### .disabled( [status] )

**.disabled()**  
Gets the 'disabled' attribute of the wrapped element. (only useful for input|button nodes)

**returns** _{boolean}_: The value of the wrapped element.

    var v = simpleQuery('input[name=myInput]').disabled();

**.disabled(status)**  
Sets the 'disabled' attribute of the wrapped element.

**status** _{boolean}_: True to set 'disabled' attribute on the wrapped element, false to remove it.  
**returns** _{object}_: The wrapped element.

	simpleQuery('input[name=myInput]').disabled(true); // the input element is now disabled

info: [MDN input element](https://developer.mozilla.org/en-US/docs/HTML/Element/Input)


### .offset()

Get all offset values as object from the wrapped element:  
offsetLeft, offsetTop, offsetWidth, offsetHeight, offsetParent.

**returns** _{object}_: Offset object.

offset object: { left: _{number}_, top: _{number}_, width: _{number}_, height: _{number}_, parent: _{object, dom element}_ }

    var t = simpleQuery('div.header').offset().top; // l contains offset top {number}

info: [MDN element dimensions](https://developer.mozilla.org/en-US/docs/Determining_the_dimensions_of_elements)


### .width( value ) / .height( value )

Sets the width/height of the wrapped element by setting .style.width/.height.

**value** _{number}_: Width/height in pixel.  
**returns** _{object}_: The wrapped element.

    simpleQuery('div.header').width(200).height(50);

info: [MDN element dimensions](https://developer.mozilla.org/en-US/docs/Determining_the_dimensions_of_elements)


### .position( left, top )

Sets the position of this wrapped element by setting .style.left/.top.

**left** _{number}_: Left position in pixel.  
**top** _{number}_: Top position in pixel.  
**returns** _{object}_: The wrapped element.

    simpleQuery('div.header').position(200, 100);

info: [MDN element dimensions](https://developer.mozilla.org/en-US/docs/Determining_the_dimensions_of_elements)


### .data( [key] [, value] )

Gets/sets user data on the wrapped element by using the element.dataset methods.  
This means that .data() adds/changes/removes 'data-*' attributes and possibly alters the key.  
E.g. element.data('myKey', 1) sets element attribute data-my-key="1"  
More info at MDN: [element.dataset](https://developer.mozilla.org/en-US/docs/DOM/element.dataset)

**.data(key)**  
Gets a single data value from the wrapped element.

**key** _{string}_: The key.  
**returns** _{string|undefined}_: The value associated with the key, or undefined if key not found.

	var v = simpleQuery('div.header').data('myKey');

**.data(key, value)**  
Sets a single data key/value pair on the wrapped element.

**key** _{string}_: The key.  
**value** _{string}_: The new value associated with the key.  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').data('myKey', 'myValue');

**.data()**  
Gets all data as object with key/value pairs from the wrapped element.

**returns** _{object|null}_: A object containing key/value pairs or null if no data found.

	var o = simpleQuery('div.header').data();

**.data(obj)**  
Sets data key/value pairs given as object on the wrapped element.

**obj** _{object}_: A object containing key/value pairs.  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').data({ firstKey: 'firstValue', secondKey: 'secondValue' });

wraps: [element.dataset](https://developer.mozilla.org/en-US/docs/DOM/element.dataset)


### .style( name [, value] ) / .style( obj )

**.style(name)**  
Gets a computed style value for the given name from the wrapped element.

**name** _{string}_: A CSS style name.  
**returns** _{string|undefined}_: The value associated with the style name, an empty string if no value found, undefined if name not found.

	var v = simpleQuery('div.header').style('width'); // v contains computed style for 'width', e.g. '100px'

**.style(name, value)**  
Sets a style value on the wrapped element.

**name** _{string}_: A CSS style name.  
**value** _{string}_: The new style value.  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').style('color', 'red');

**.style(obj)**  
Sets style name/value pairs given as object on the wrapped element.

**obj** _{object}_: A object containing CSS name/value pairs.  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').style({ color: 'red', fontSize: '16px' });

info: [MDN window.getComputedStyle](https://developer.mozilla.org/en-US/docs/DOM/window.getComputedStyle)
info: [MDN element.style](https://developer.mozilla.org/en-US/docs/DOM/element.style)


### .setClass( name )

Sets the class attribute to the given name of the wrapped element.

**name** _{string}_: A CSS class name.  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').setClass('myClass');

wraps: [element.className](https://developer.mozilla.org/en-US/docs/DOM/element.className)


### .addClass( name ) / .removeClass( name )

Adds/removes a class to/from the list of classes of the wrapped element.

**name** _{string}_: A CSS class name.  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').addClass('myClass');  
	simpleQuery('div.header').removeClass('myClass');

wraps: [element.classList](https://developer.mozilla.org/en-US/docs/DOM/element.classList)


### .toggleClass( name )

Toggle the existance of a class in the list of classes of the wrapped element.

**name** _{string}_: A CSS class name.  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').toggleClass('myClass');

wraps: [element.className](https://developer.mozilla.org/en-US/docs/DOM/element.className)


### .containsClass( name )

Checks if the wrapped elements list of classes contains the class.

**name** _{string}_: A CSS class name.  
**returns** _{boolean}_: True if class 'name' is in the wrapped elements list of classes.

	var h = simpleQuery('div.header').containsClass('myClass');

wraps: [element.className](https://developer.mozilla.org/en-US/docs/DOM/element.className)


### .text( [content] )

**.text()**  
Gets the text content of the wrapped element.

**returns** _{string}_: The text content of this wrapped element.

	var t = simpleQuery('div.header').text();

**.text(content)**  
Sets the text content of the wrapped element.

**content** _{string}_: The new text content.  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').text('new text');

wraps: [Node.textContent](https://developer.mozilla.org/en-US/docs/DOM/Node.textContent)


### .html ( [content] )

**.html()**  
Gets the html content of the wrapped element.

**returns** _{string}_: The html content of this wrapped element.

	var t = simpleQuery('div.header').html();

**.html(content)**  
Sets the html content of the wrapped element.

**content** _{string}_: The new html content.  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').html('<p>new html</p>');

wraps: [element.innerHTML](https://developer.mozilla.org/en-US/docs/DOM/element.innerHTML)


### .empty()

Deletes all child elements from the wrapped element.  
Note: Does NOT remove attached event handlers.

**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').empty();


### .childNode( index )

Returns the wrapped elements child node by index.  
Note: Child nodes includes text nodes created by linebreaks.

**index** _{number}_: The index of this wrapped elements child node to return.  
**returns** _{object}_: The child node as wrapped element.

wraps: [Node.childNodes](https://developer.mozilla.org/en-US/docs/DOM/Node.childNodes)

	var c = simpleQuery('div.header').childNode(0);


### .childElement( index )

Returns the wrapped elements child element by index.  
Note: Child elements do not include any text node, only html element nodes.

**index** _{number}_: The index of this wrapped elements child element to return.  
**returns** _{object}_: The child element as wrapped element.

	var c = simpleQuery('div.header').childElement(0);

wraps: [Element.children](https://developer.mozilla.org/en-US/docs/DOM/Element.children)


### .childElements()

Returns the wrapped elements child elements as array of wrapped elements.  
Note: Child elements do not include any text node, only html element nodes.

**returns** _{array}_: The child elements as array of wrapped elements.

	var a = simpleQuery('div.header').childElements();

wraps: [Element.children](https://developer.mozilla.org/en-US/docs/DOM/Element.children)


### .removeChild( node )

**node** _{object}_: The child node to remove, given as wrapped element or dom element.  
**returns** _{object}_: The removed child node wrapped element.

	var h = simpleQuery('div.header');
	h.removeChild(h.select('span.message'));

wraps: [Node.removeChild](https://developer.mozilla.org/de/docs/DOM/Node.removeChild)


### .append( content )

Appends the given html/wrapped element/dom node to the end of the wrapped element child nodes list.

**content** _{string|object}_: The html, dom node or wrapped element to append.  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').append('<p>text</p>');

wraps: [Node.appendChild](https://developer.mozilla.org/en-US/docs/DOM/Node.appendChild)  
wraps: [element.insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/DOM/element.insertAdjacentHTML)


### .prepend( content )

Prepends the given html/wrapped element/dom node to the front of the wrapped element child nodes list.

**content** _{string|object}_: The html, dom node or wrapped element to prepend.  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').prepend('<p>text</p>');

wraps: [Node.insertBefore](https://developer.mozilla.org/en-US/docs/DOM/Node.insertBefore)  
wraps: [element.insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/DOM/element.insertAdjacentHTML)


### .insertBefore( insertNode, refNode)

Inserts the given wrapped element/dom node into this wrapped elements childs,  
before the given reference wrapped element/dom node.

**insertNode** _{object}_: The dom node or wrapped element to be inserted.  
**refNode** _{object}_: The reference dom node or wrapped element.  
**returns** _{object}_: The wrapped element.

	var h = simpleQuery('div.header');
	var n1 = simpleQuery.create('<p>').text('world');
	h.append(n);
	var n2 = simpleQuery.create('<p>').text('hello');
	h.insertBefore(n2, n1); // inserts paragraph 'hello' before paragraph 'world'

wraps: [Node.insertBefore](https://developer.mozilla.org/en-US/docs/DOM/Node.insertBefore)


### .cleanup()

Recursively removes empty text nodes (e.g. linebreaks) and comment nodes from the dom tree below the wrapped element,  
with the exception of text nodes containing only non-breaking space `&nbsp;` resp. `'\u00A0'`.  
Useful to minimize the number of nodes in the dom tree for faster dom traversal.

**returns** _{object}_: The wrapped element.

	simpleQuery('body').cleanup();

info: [Node.nodeType](https://developer.mozilla.org/en/docs/DOM/Node.nodeType)


### .hide( [display] )

Hides the wrapped element by setting style.display to 'none'.

**display** _{string}_: Optional, The value for style.display to restore when calling .show().  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').hide();


### .show()

Shows/unhides the wrapped element by restoring style.display to the previous state.

**returns** _{object}_: The wrapped element.


### .onClick( handler )

Adds a 'click' event listener to the wrapped element.  
'this' inside the handler is set to the dom element that triggered the event.  
The handler gets the event object as parameter.

**handler** _{function}_: The 'click' event handler.  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').onClick(function () { $.wrap(this).style(color: 'red'); });

wraps: [element.addEventListener](https://developer.mozilla.org/en-US/docs/DOM/element.addEventListener)  
info: [Event object](https://developer.mozilla.org/en-US/docs/DOM/event)  


### .onEvent( name, handler )

Adds an event listener to the wrapped element.  
'this' inside the handler is set to the dom element that triggered the event.  
The handler gets the event object as parameter.

**name** _{string}_: The event name.  
**handler** _{function}_: The event handler.  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').onEvent('click', function () { $.wrap(this).style(color: 'red'); });

wraps: [element.addEventListener](https://developer.mozilla.org/en-US/docs/DOM/element.addEventListener)  
info: [Event object](https://developer.mozilla.org/en-US/docs/DOM/event)  


### .triggerClick()

Triggers a 'click' event on the wrapped element.

**returns** _{object}_: The wrapped element.

	simpleQuery('div.header').triggerClick();

wraps: [document.createEvent](https://developer.mozilla.org/en-US/docs/DOM/document.createEvent)  
wraps: [element.dispatchEvent](https://developer.mozilla.org/en-US/docs/DOM/element.dispatchEvent)


### .onMouseenter( handler ) / .onMouseleave( handler )

Adds a 'mouseenter'/'mouseleave' event listener to the wrapped element.  
Note: Actually a 'mouseover'/'mouseout' event listener is attached and 'mouseenter'/'mouseleave' behaviour is emulated.

**handler** _{function}_: The event handler.  
**returns** _{object}_: The wrapped element.

	simpleQuery('div.header')
		.onMouseenter(function () { $.wrap(this).style(color: 'red'); })
		.onMouseleave(function () { $.wrap(this).style(color: 'black'); });

info: [www.quirksmode.org](http://www.quirksmode.org/js/events_mouse.html#mouseover)  
info: [Event object](https://developer.mozilla.org/en-US/docs/DOM/event)

