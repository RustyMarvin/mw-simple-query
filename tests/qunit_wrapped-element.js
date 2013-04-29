/**
 * MW Simple Query - QUnit tests
 *
 * Copyright (c) 2013 Markus von der Wehd <mvdw@mwin.de>
 * MIT License, see LICENSE.txt, see http://www.opensource.org/licenses/mit-license.php
 */


'use strict';


// wrapped element tests


module('Wrapped Elements Properties');

test('Offsets', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" style="position:absolute;left:100px;top:110px;width:120px;height:130px;"></div>');

	var f = document.getElementById('qunit-fixture');
	var n = document.getElementById('id1');

	var $e = $('#id1');

	ok($e.offsetLeft === n.offsetLeft, 'offsetLeft ok');
	ok($e.offsetTop === n.offsetTop, 'offsetTop ok');
	ok($e.offsetWidth === n.offsetWidth, 'offsetWidth ok');
	ok($e.offsetHeight === n.offsetHeight, 'offsetHeight ok');
	ok($e.offsetParent === n.offsetParent && $e.offsetParent === f, 'offsetParent ok');
});

test('Form element checked', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<form id="fo1"><input type="checkbox" id="cb1" name="cb1" value="cb1" /><input type="checkbox" id="cb2" name="cb2" value="cb2" checked="checked" /></form>');

	var cb1 = document.getElementById('cb1'),
		cb2 = document.getElementById('cb2');

	var $cb1 = $('#cb1'),
		$cb2 = $('#cb2');

	ok($cb1.checked === false && $cb1.checked === cb1.checked, 'Get checkbox default not checked');
	ok($cb2.checked === true && $cb2.checked === cb2.checked, 'Get checkbox default checked');

	$cb1.checked = true;
	ok($cb1.checked === true && $cb1.checked === cb1.checked, 'Set checkbox checked (default not checked)');

	$cb2.checked = false;
	ok($cb2.checked === false && $cb2.checked === cb2.checked, 'Set checkbox unchecked (default checked)');
});

test('Form element selected', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<form id="fo1"><select id="sl1" name="sl1"><option id="op1" value="op1">op1</option><option id="op2" value="op2" selected="selected">op2</option></select></form>');

	var sl1 = document.getElementById('sl1');
	var $op1 = $('#op1'),
		$op2 = $('#op2');

	ok($op1.selected === false && $op1.selected === sl1.options[0].selected, 'Get option default not selected');
	ok($op2.selected === true && $op2.selected === sl1.options[1].selected, 'Get option default selected');

	$op1.selected = true; // sets op2 selected to false

	ok($op1.selected === true && $op1.selected === sl1.options[0].selected, 'Get option selected (default not selected)');
	ok($op2.selected === false && $op2.selected === sl1.options[1].selected, 'Get option not selected (default selected)');
});

module('Wrapped Elements Methods');

test('#select / Select below element', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1"><span id="id1cl1" class="cl1"></span><span id="id1cl2" class="cl2"></span></div><div id="id2"><span id="id2cl1" class="cl1"></span><span id="id2cl2" class="cl2"></span></div>');
	
	var id1cl1 = document.getElementById('id1cl1');
	var $id1 = $('#id1');
	
	throws(
		function () { var $cl1 = $id1.select(); },
		TypeError,
		'Throws type error if no string given for selector'
	);
	
	var $cl1 = $id1.select('.cl1'); // span with same class exists in id2
	ok($cl1.node === id1cl1, 'Select element below element');
});

test('#selectAll / Select below element', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1"><span id="id1cl1" class="cl1"></span><span id="id1cl2" class="cl2"></span></div><div id="id2"><span id="id2cl1" class="cl1"></span><span id="id2cl2" class="cl2"></span></div>');
	
	var id1cl1 = document.getElementById('id1cl1');
	var id1cl2 = document.getElementById('id1cl2');
	var $id1 = $('#id1');
	
	throws(
		function () { var $ar = $id1.selectAll(); },
		TypeError,
		'Throws type error if no string given for selector'
	);
	
	var $ar = $id1.selectAll('span');
	ok(Array.isArray($ar), 'Returned wrapped elements in an array');
	ok($ar.length === 2, 'Wrapped elements count is correct');
	ok($ar[0].node === id1cl1 && $ar[1].node === id1cl2, 'Wrapped elements are the selected DOM elements');

	var $ax = $id1.selectAll('.clx');
	ok(Array.isArray($ax), 'Returned array if selector doesnt match anything');
	ok($ax.length === 0, 'Returned empty array if selector doesnt match anything');
});

test('#sameNode', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" class="cl1"></div><div id="id2" class="cl2"></div>');
	
	var $id1 = $('#id1');
	var $cl1 = $('.cl1');
	var $id2 = $('#id2');
	
	throws(
		function () { var b = $id1.sameNode('x'); },
		TypeError,
		'Throws type error if no wrapper given'
	);
	
	ok(!$id1.sameNode($id2), 'Wrapped element wraps not the same dom element as given');
	ok($id1.sameNode($cl1), 'Wrapped element wraps same dom element as given');
});

module('Wrapped Element Attributes');

test('#attrib', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" title="title1"></div>');
	
	var id1 = document.getElementById('id1');
	var $id1 = $('#id1');
	
	throws(
		function () { var e = $id1.attrib(); },
		TypeError,
		'Throws type error if no string as name given'
	);

	ok($id1.attrib('unknown') === null, 'Returns null while geting non existing attribute');
	ok($id1.attrib('title') === 'title1', 'Returns attribute');

	throws(
		function () { $id1.attrib('title', []); },
		TypeError,
		'Throws type error if no string|number as value given'
	);

	$id1.attrib('title', 'titleNew');
	ok($id1.attrib('title') === 'titleNew' && $id1.attrib('title') === id1.getAttribute('title'), 'Sets existing attribute');

	$id1.attrib('title', '');
	ok($id1.attrib('title') === '' && $id1.attrib('title') === id1.getAttribute('title'), 'Sets existing attribute to empty value');

	$id1.attrib('name', 'nameNew');
	ok($id1.attrib('name') === 'nameNew' && $id1.attrib('name') === id1.getAttribute('name'), 'Sets new attribute');
});

test('#hasAttrib', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" title="title1"></div>');
	
	var id1 = document.getElementById('id1');
	var $id1 = $('#id1');
	
	throws(
		function () { var e = $id1.attrib(); },
		TypeError,
		'Throws type error if no string as name given'
	);

	ok($id1.hasAttrib('unknown') === false, 'Returns false for non existing attribute');
	ok($id1.hasAttrib('title') === true, 'Returns true for existing attribute with value');

	id1.setAttribute('title', '');
	ok($id1.hasAttrib('title') === true, 'Returns true for existing empty attribute');
});

test('#removeAttrib', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<button id="id1" title="title1" disabled>CLickMe</button>');
	
	var id1 = document.getElementById('id1');
	var $id1 = $('#id1');
	
	throws(
		function () { var e = $id1.attrib(); },
		TypeError,
		'Throws type error if no string as name given'
	);

	ok($id1.removeAttrib('unknown'), 'Does nothing if attribute does not exist');
	$id1.removeAttrib('title');
	ok(id1.hasAttribute('title') === false, 'Removes existing attribute with value');

	$id1.removeAttrib('disabled');
	ok($id1.hasAttrib('disabled') === false, 'Removes existing attribute without value');
});

module('Wrapped Element Forms');

test('#value', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<form id="fo1"><input type="text" id="in1" value="in1" /></form>');

	var in1 = document.getElementById('in1');
	var $in1 = $('#in1');

	ok($in1.value() === in1.value, 'Get input value');

	throws(
		function () { var e = $in1.value([]); },
		TypeError,
		'Throws type error if no string as name given'
	);

	$in1.value('new1');
	ok(in1.value === 'new1', 'Set input value');
});

test('#checkValidity', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<form id="fo1"><input type="text" id="in1" value="in1" required /></form>');

	var in1 = document.getElementById('in1');
	var $in1 = $('#in1');

	ok($in1.checkValidity(), 'Input has valid value');

	$in1.value('');
	ok(!$in1.checkValidity(), 'Input has invalid value');
});

test('#focus / #blur', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<form id="fo1"><input type="text" id="in1" value="in1" /></form>');

	var in1 = document.getElementById('in1');
	var $in1 = $('#in1');

	$in1.focus();
	ok(document.activeElement === in1, 'Input has focus');

	$in1.blur();
	ok(document.activeElement === document.body, 'Input has no focus');
});

test('#disabled', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<form id="fo1"><input type="text" id="in1" value="in1" /></form>');

	var in1 = document.getElementById('in1');
	var $in1 = $('#in1');

	ok(!$in1.disabled(), 'Input is enabled');

	throws(
		function () { var e = $in1.disabled('x'); },
		TypeError,
		'Throws type error if no boolean as value given'
	);

	$in1.disabled(true);
	ok(in1.disabled, 'Input is disabled');
});

module('Wrapped Element Dimensions/Position');

test('#offset', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" style="position:absolute;left:100px;top:110px;width:120px;height:130px;"></div>');

	var f = document.getElementById('qunit-fixture');
	var n = document.getElementById('id1');
	var $e = $('#id1');

	var o = $e.offset();

	ok(typeof o === 'object', 'Offset is of type object');
	ok(o.left === n.offsetLeft, 'left ok');
	ok(o.top === n.offsetTop, 'top ok');
	ok(o.width === n.offsetWidth, 'width ok');
	ok(o.height === n.offsetHeight, 'height ok');
	ok(o.parent === n.offsetParent && o.parent === f, 'parent ok');
});

test('#width', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" style="position:absolute;left:100px;top:110px;width:120px;height:130px;"></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	throws(
		function () { $e.width(); },
		TypeError,
		'Throws type error if no number given'
	);

	$e.width(200);
	ok(n.style.width === '200px', 'Width is set correctly');
});

test('#height', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" style="position:absolute;left:100px;top:110px;width:120px;height:130px;"></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	throws(
		function () { $e.width(); },
		TypeError,
		'Throws type error if no number given'
	);

	$e.height(200);
	ok(n.style.height === '200px', 'Height is set correctly');
});

test('#position', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" style="position:absolute;left:100px;top:110px;width:120px;height:130px;"></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	throws(
		function () { $e.position(210, 'x'); },
		TypeError,
		'Throws type error if no number for left pos given'
	);
	throws(
		function () { $e.position('x', 220); },
		TypeError,
		'Throws type error if no number for top pos given'
	);

	$e.position(210, 220);
	ok(n.style.left === '210px', 'Left is set correctly');
	ok(n.style.top === '220px', 'Top is set correctly');
});

module('Wrapped Element Data');

test('#data', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1"></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');
	var d;

	d = $e.data();
	ok(d === null, 'Get all data returns null if no data present');

	d = $e.data('nothing');
	ok(d === undefined, 'Non existing data key returns undefined');

	$e.data('myKey', 'myValue');
	ok(n.dataset.myKey === 'myValue', 'Data set single key/value');

	d = $e.data('myKey');
	ok(d === 'myValue', 'Get data single key returns value');

	d = $e.data();
	ok(Object.keys(d).length === 1 && d.myKey === 'myValue', 'Get all data as object');

	$e.data({ key1: 'val1', key2: 'val2' });
	ok(Object.keys(n.dataset).length === 3 && n.dataset.key1 === 'val1' && n.dataset.key2 === 'val2', 'Set data with object');

	throws(
		function () { $e.data([]); },
		TypeError,
		'Throws type error if no string|object for first param given'
	);
	throws(
		function () { $e.data('key', []); },
		TypeError,
		'Throws type error if string as key and no string|number for value given'
	);
	throws(
		function () { $e.data({ key: [] }); },
		TypeError,
		'Throws type error if object given and no string|number as value inside object'
	);
});

module('Wrapped Element Style / Classname');

test('#style', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" style="position:absolute;left:100px;top:110px;width:120px;height:130px;"></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');
	var s;

	throws(
		function () { var s = $e.style(); },
		TypeError,
		'Throws type error if no string for name given'
	);
	throws(
		function () { var s = $e.style('left', []); },
		TypeError,
		'Throws type error if no string or number for value given'
	);
	throws(
		function () { $e.style({ left: [] }); },
		TypeError,
		'Throws type error if object given and no string|number as value inside object'
	);

	s = $e.style('left');
	ok(window.getComputedStyle(n)['left'] === s, 'Get style correctly');

	$e.style('left', '200px');
	ok(window.getComputedStyle(n)['left'] === '200px', 'Set style correctly');

	$e.style({ left: '210px' });
	ok(window.getComputedStyle(n)['left'] === '210px', 'Set style with object correctly');
});

test('#setClass', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" class="cl1"></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	throws(
		function () { $e.setClass(); },
		TypeError,
		'Throws type error if no string as name given'
	);

	$e.setClass('cl2');
	ok(n.className === 'cl2', 'Set class correctly');
});

test('#addClass', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" class="cl1"></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	throws(
		function () { $e.addClass(); },
		TypeError,
		'Throws type error if no string as name given'
	);

	$e.addClass('cl2');
	ok(n.className === 'cl1 cl2', 'Add class correctly');
});

test('#addClasses', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" class="cl1"></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	throws(
		function () { $e.addClass(); },
		TypeError,
		'Throws type error if no array as parameter given'
	);

	throws(
		function () { $e.addClass([0]); },
		TypeError,
		'Throws type error if parameter array contains other type than string'
	);

	$e.addClasses([]);
	ok(n.className === 'cl1', 'Empty parameter array handled without error');

	$e.addClasses(['cl2']);
	ok(n.className === 'cl1 cl2', 'Added single class correctly');

	$e.addClasses(['cl3', 'cl4']);
	ok(n.className === 'cl1 cl2 cl3 cl4', 'Added multiple classes correctly');
});

test('#removeClass', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" class="cl1 cl2"></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	throws(
		function () { $e.removeClass(); },
		TypeError,
		'Throws type error if no string as name given'
	);

	$e.removeClass('cl1');
	ok(n.className === 'cl2', 'Remove class correctly');
});

test('#removeClasses', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" class="cl1 cl2 cl3 cl4"></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	throws(
		function () { $e.removeClass(); },
		TypeError,
		'Throws type error if no array as parameter given'
	);

	throws(
		function () { $e.removeClass([0]); },
		TypeError,
		'Throws type error if parameter array contains other type than string'
	);

	$e.removeClasses([]);
	ok(n.className === 'cl1 cl2 cl3 cl4', 'Empty parameter array handled without error');

	$e.removeClasses(['cl5']);
	ok(n.className === 'cl1 cl2 cl3 cl4', 'Removing non-existent class handled without error');

	$e.removeClasses(['cl1']);
	ok(n.className === 'cl2 cl3 cl4', 'Removed single class correctly');

	$e.removeClasses(['cl2', 'cl3']);
	ok(n.className === 'cl4', 'Removed multiple classes correctly');
});

test('#toggleClass', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" class="cl1 cl2"></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	throws(
		function () { $e.toggleClass(); },
		TypeError,
		'Throws type error if no string as name given'
	);

	$e.toggleClass('cl1');
	ok(n.className === 'cl2', 'Toggle class (remove) correctly');

	$e.toggleClass('cl1');
	ok(n.className === 'cl2 cl1', 'Toggle class (add) correctly');
});

test('#containsClass', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1" class="cl1 cl2"></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	throws(
		function () { $e.containsClass(); },
		TypeError,
		'Throws type error if no string as name given'
	);

	ok($e.containsClass('cl2'), 'Contains class returns true if class exists');
	ok(!$e.containsClass('cl3'), 'Contains class returns false if class not exists');
});

module('Wrapped Element Text/Html');

test('#text', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1"></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');
	var s;

	throws(
		function () { $e.text([]); },
		TypeError,
		'Throws type error if no string or number for content given'
	);

	s = $e.text();
	ok(s === '', 'Returns empty string on empty element');

	$e.text('Test Text');
	ok(n.textContent === 'Test Text', 'Sets text content correctly');

	s = $e.text();
	ok(s === 'Test Text', 'Gets text content correctly');
});

test('#html', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1"></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');
	var s;

	throws(
		function () { $e.html([]); },
		TypeError,
		'Throws type error if no string or number for content given'
	);

	s = $e.html();
	ok(s === '', 'Returns empty string on empty element');

	$e.html('Test Text');
	ok(n.innerHTML === 'Test Text', 'Sets text content correctly');

	s = $e.html();
	ok(s === 'Test Text', 'Gets text content correctly');

	$e.html('Test <span>Text</span>');
	ok(n.innerHTML === 'Test <span>Text</span>', 'Sets html content correctly');

	s = $e.html();
	ok(s === 'Test <span>Text</span>', 'Gets html content correctly');
});

module('Wrapped Element DOM Manipulation');

test('#empty', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1">Hello <span>World</span></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	$e.empty();
	ok(n.innerHTML === '', 'Deletes all content correctly');

});

test('#childNode', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1"><p>First</p><p>Second</p></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');
	var c;

	throws(
		function () { $e.childNode(); },
		TypeError,
		'Throws type error if no number for index given'
	);

	throws(
		function () { $e.childNode(2); },
		RangeError,
		'Throws range error if index out of bounds'
	);

	c = $e.childNode(1);
	ok(c.node.innerHTML === 'Second', 'Returned child node correctly');
});

test('#childElement', function () {
	var $ = window.simpleQuery;
	// includes text nodes
	qfixAddHtml('<div id="id1">\n<span id="s1">First</span>\n<span id="s2">Second</span>\n</div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');
	var c;

	throws(
		function () { $e.childElement(); },
		TypeError,
		'Throws type error if no number for index given'
	);

	throws(
		function () { $e.childElement(2); },
		RangeError,
		'Throws range error if index out of bounds'
	);

	c = $e.childElement(1);
	ok(c.node.innerHTML === 'Second', 'Returned child node correctly');
});

test('#childElements', function () {
	var $ = window.simpleQuery;
	// includes text nodes
	qfixAddHtml('<div id="id1">\n<span id="s1">First</span>\n<span id="s2">Second</span>\n</div><div id="id2">\n</div>');

	var a;

	a = $('#id2').childElements();
	ok(a.length === 0, 'Returned empty array if no child elements');

	a = $('#id1').childElements();
	ok(a.length === 2, 'Returned array length correctly');
	ok(a[0].node.innerHTML === 'First', 'Returned first child element correctly');
	ok(a[1].node.innerHTML === 'Second', 'Returned second child element correctly');
});

test('#removeChild', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1"><span id="s1">First</span><span id="s2">Second</span></div>');

	var n1 = document.getElementById('s1');
	var n2 = document.getElementById('s2');
	var $e = $('#id1');
	var c;
	var $c;

	throws(
		function () { $e.removeChild(); },
		TypeError,
		'Throws type error if no object for child node given'
	);

	$c = $e.removeChild($e.select('#s1'));
	ok($c.node === n1, 'Removed child (wrapped element) returned');
	ok($e.childElements().length === 1, 'Remaining child count ok');

	c = $e.select('#s2').node;
	$c = $e.removeChild(c);
	ok($c.node === n2, 'Removed child (dom element) returned');
	ok($e.childElements().length === 0, 'Remaining child count ok');
});

test('#append', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1"><span>First</span></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	throws(
		function () { $e.append(); },
		TypeError,
		'Throws type error if no string, Wrapped element or DOM element given'
	);

	$e.append('<span>Text1</span>');
	ok(n.innerHTML === '<span>First</span><span>Text1</span>', 'Append HTML ok');
	n.removeChild(n.lastElementChild);

	$e.append($.create('p').text('Text2').node);
	ok(n.innerHTML === '<span>First</span><p>Text2</p>', 'Append DOM element ok');
	n.removeChild(n.lastElementChild);

	$e.append($.create('div').text('Text3'));
	ok(n.innerHTML === '<span>First</span><div>Text3</div>', 'Append wrapped element ok');
});

test('#prepend', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1"><span>First</span></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	throws(
		function () { $e.prepend(); },
		TypeError,
		'Throws type error if no string, Wrapped element or DOM element given'
	);

	$e.prepend('<span>Text1</span>');
	ok(n.innerHTML === '<span>Text1</span><span>First</span>', 'Prepend HTML ok');
	n.removeChild(n.firstElementChild);

	$e.prepend($.create('p').text('Text2').node);
	ok(n.innerHTML === '<p>Text2</p><span>First</span>', 'Prepend DOM element ok');
	n.removeChild(n.firstElementChild);

	$e.prepend($.create('div').text('Text3'));
	ok(n.innerHTML === '<div>Text3</div><span>First</span>', 'Prepend wrapped element ok');
});

test('#insertBefore', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1"><span>First</span><span>Second</span></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');
	var $r;

	throws(
		function () { $e.insertBefore(null, $.create('span')); },
		TypeError,
		'Throws type error if no Wrapped element or DOM element given for insert node'
	);
	throws(
		function () { $e.insertBefore($.create('span'), null); },
		TypeError,
		'Throws type error if no Wrapped element or DOM element given for reference node'
	);

	$r = $e.childElement(1);

	$e.insertBefore($.create('p').text('Text1').node, $r.node);
	ok(n.innerHTML === '<span>First</span><p>Text1</p><span>Second</span>', 'Insert DOM element before DOM element ok');
	n.removeChild(n.firstElementChild.nextElementSibling);

	$e.insertBefore($.create('p').text('Text2'), $r.node);
	ok(n.innerHTML === '<span>First</span><p>Text2</p><span>Second</span>', 'Insert wrapped element before DOM element ok');
	n.removeChild(n.firstElementChild.nextElementSibling);

	$e.insertBefore($.create('p').text('Text3').node, $r);
	ok(n.innerHTML === '<span>First</span><p>Text3</p><span>Second</span>', 'Insert DOM element before wrapped element ok');
	n.removeChild(n.firstElementChild.nextElementSibling);

	$e.insertBefore($.create('p').text('Text4'), $r);
	ok(n.innerHTML === '<span>First</span><p>Text4</p><span>Second</span>', 'Insert wrapped element before wrapped element ok');
});

test('#cleanup', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1">\n<!-- comment --><span>text</span>\n<span>&nbsp;</span>\n</div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	$e.cleanup();
	ok(n.childNodes.length === 2, 'Cleaned up elements child count ok.');
	ok(n.innerHTML === '<span>text</span><span>&nbsp;</span>', 'Cleaned up elements content ok.');
});

module('Wrapped Element Visibility');

test('#show / #hide', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1"><div>Text1</div><span>Text2</span><p>Text3</p></div>');

	var n = document.getElementById('id1');
	var $e;

	throws(
		function () { $e.hide(1); },
		TypeError,
		'Throws type error if old display value given and is not a string'
	);

	$e = $('#id1').select('div').hide();
	ok(window.getComputedStyle(n.children[0]).display === 'none', 'Div is hidden');
	ok($e._oldDisplay === 'block', 'Old display state stored ok');

	$e.show();
	ok(window.getComputedStyle(n.children[0]).display === 'block', 'Div is shown, display restored');

	$e = $('#id1').select('span').hide();
	ok(window.getComputedStyle(n.children[1]).display === 'none', 'Span is hidden');
	ok($e._oldDisplay === 'inline', 'Old display state stored ok');

	$e.show();
	ok(window.getComputedStyle(n.children[1]).display === 'inline', 'Span is shown, display restored');

	$e = $('#id1').select('p').hide('inline-block');
	ok(window.getComputedStyle(n.children[2]).display === 'none', 'P is hidden, old display value given');
	ok($e._oldDisplay === 'inline-block', 'Old display state stored ok');

	$e.show();
	ok(window.getComputedStyle(n.children[2]).display === 'inline-block', 'P is shown, display restored');
});

module('Wrapped Element Events');

var triggerEvent = function (eventName, node) {
	var event = document.createEvent('UIEvents');

	event.initEvent(eventName, true, true, window, 1);
	node.dispatchEvent(event);
};
var triggerMouseEvent = function (eventName, node, relTarget, clX, clY) {
	var event = document.createEvent('MouseEvent');

	event.initMouseEvent(eventName, true, true, window, 0, 0, 0, (clX || 0), (clY || 0), false, false, false, false, 0, relTarget);
	node.dispatchEvent(event);
};
// helper to test wrapped elements internally stored event data
var _eventsData = function (index, userName, userHandler, domName) {
	var userOk = this._events[index].userName === userName && this._events[index].userHandler === userHandler,
		domOk = this._events[index].domName === (domName || userName);

	return (userOk && domOk);
};
var _eventsLength = function (len) {
	return (this._events.length === len);
};

// TODO: _addEventListener
// => test extensively! other methods rely on this
// -- use 'offEvent', 'onEvent' as a starting point

// TODO: _removeEventListener
// -- see above

// => because all other methods use the private ._addEventListener/._removeEventListener methods
//    the tests for the other event methods (with the exception of eventCount/triggerClick)
//    could be way shorter or simplified!

test('_addEventListener / _removeEventListener - single', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1">Text Content</div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');
	// we have to use 'bind' because _addEventListener is a static method and only used internally with '.call(this, ...)'
	var _addEventListener = $._ElementWrapper._addEventListener.bind($e);
	var _removeEventListener = $._ElementWrapper._removeEventListener.bind($e);
	// bind helper to $e
	var _evData = _eventsData.bind($e);
	var _evLength = _eventsLength.bind($e);

	var counter = 0;
	var handlerThis = null;
	var handlerEvent = null;
	var handler = function (event) {
		counter += 1;
		handlerThis = this;
		handlerEvent = event;
	};

	_addEventListener('click', handler);

	ok(_evData(0, 'click', handler) && _evLength(1), 'Event handler internally stored in wrapped element');

	triggerEvent('click', $e.node);
	ok(counter === 1, 'Event attached and handled');
	ok(handlerThis === n, 'Event handler \'this\' is set to the dom element');
	ok(handlerEvent.type === 'click', 'Event object given to handler, event type checked');

	_removeEventListener('click', handler);

	ok(_evLength(0), 'Event handler internally removed from wrapped element');

	triggerEvent('click', $e.node);
	ok(counter === 1, 'Event not handled after removal');
});

test('_addEventListener / _removeEventListener - multiple', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1">Text Content</div>');

	var $e = $('#id1');
	// we have to use 'bind' because _addEventListener is a static method and only used internally with '.call(this, ...)'
	var _addEventListener = $._ElementWrapper._addEventListener.bind($e);
	var _removeEventListener = $._ElementWrapper._removeEventListener.bind($e);
	// bind helper to $e
	var _evData = _eventsData.bind($e);
	var _evLength = _eventsLength.bind($e);

	var counterA,
		counterB,
		counterC;
	var handlerA = function (event) { counterA += 1; },
		handlerB = function (event) { counterB += 1; },
		handlerC = function (event) { counterC += 1; };

	// add
	_addEventListener('click', handlerA);
	_addEventListener('mouseover', handlerB);
	_addEventListener('click', handlerC);

	ok(_evData(0, 'click', handlerA) && _evData(1, 'mouseover', handlerB) && _evData(2, 'click', handlerC) && _evLength(3), 'Event handler A+B+C internally stored in wrapped element');

	// remove by name/handler
	_removeEventListener('mouseover', handlerB);

	counterA = 0;
	counterB = 0;
	counterC = 0;
	triggerEvent('click', $e.node);
	triggerEvent('mouseover', $e.node);

	ok(_evData(0, 'click', handlerA) && _evData(1, 'click', handlerC) && _evLength(2), 'Event handler B internally removed by name/handler from wrapped element');
	ok(counterA === 1 && counterB === 0 && counterC === 1, 'Event handler B removed by name/handler from dom element');

	// remove by name
	_removeEventListener('click');

	counterA = 0;
	counterB = 0;
	counterC = 0;
	triggerEvent('click', $e.node);
	triggerEvent('mouseover', $e.node);

	ok(_evLength(0), 'Event handler A+C internally removed by name from wrapped element');
	ok(counterA === 0 && counterB === 0 && counterC === 0, 'Event handler A+C removed by name from dom element');

	// remove all
	_addEventListener('click', handlerA);
	_addEventListener('mouseover', handlerB);
	_addEventListener('click', handlerC);
	_removeEventListener();

	counterA = 0;
	counterB = 0;
	counterC = 0;
	triggerEvent('click', $e.node);
	triggerEvent('mouseover', $e.node);

	ok(_evLength(0), 'All event handler internally removed by name from wrapped element');
	ok(counterA === 0 && counterB === 0 && counterC === 0, 'All event handler removed by name from dom element');
});

test('#onClick', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1">Text Content</div>');

	var $e = $('#id1');

	var _removeEventListener = $._ElementWrapper._removeEventListener.bind($e);
	var _evData = _eventsData.bind($e);
	var _evLength = _eventsLength.bind($e);

	throws(
		function () { $e.onClick(); },
		TypeError,
		'Throws type error if handler is not a function'
	);

	var counter;
	var handler = function (event) { counter += 1; };

	$e.onClick(handler);
	ok(_evData(0, 'click', handler) && _evLength(1), 'Event handler \'click\' internally stored in wrapped element');

	counter = 0;
	triggerEvent('click', $e.node);
	ok(counter === 1, 'Event \'click\' attached and handled');

	_removeEventListener('click', handler);
});

test('#offClick', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1">Text Content</div>');

	var $e = $('#id1');

	var _evData = _eventsData.bind($e);
	var _evLength = _eventsLength.bind($e);

	throws(
		function () { $e.offClick(null); },
		TypeError,
		'Throws type error if handler is not a function'
	);

	var counterA,
		counterB;
	var handlerA = function (event) { counterA += 1; },
		handlerB = function (event) { counterB += 1; };

	// remove by handler
	$e.onClick(handlerA);
	$e.onClick(handlerB);

	$e.offClick(handlerA);
	ok(_evData(0, 'click', handlerB) && _evLength(1), 'Event A \'click\' removed from wrapped element');

	counterA = 0;
	counterB = 0;
	triggerEvent('click', $e.node);
	ok(counterA === 0 && counterB === 1, 'Event A \'click\' not handled after removal');

	$e.offClick(handlerB);
	ok(_evLength(0), 'Event B \'click\' removed from wrapped element');

	counterA = 0;
	counterB = 0;
	triggerEvent('click', $e.node);
	ok(counterA === 0 && counterB === 0, 'Event B \'click\' not handled after removal');

	// remove all handlers
	$e.onClick(handlerA);
	$e.onClick(handlerB);

	$e.offClick();
	ok(_evLength(0), 'All events \'click\' removed from wrapped element');

	counterA = 0;
	counterB = 0;
	triggerEvent('click', $e.node);
	ok(counterA === 0 && counterB === 0, 'All events \'click\' not handled after removal');
});

test('#onMouseenter', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="outer"><div id="id1"><div id="inner">Text Content</div></div></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	var _removeEventListener = $._ElementWrapper._removeEventListener.bind($e);
	var _evData = _eventsData.bind($e);
	var _evLength = _eventsLength.bind($e);

	throws(
		function () { $e.onMouseenter(); },
		TypeError,
		'Throws type error if handler is not a function'
	);

	var counter;
	var handlerThis = null;
	var handlerEvent = null;
	var handler = function (event) {
		counter += 1;
		handlerThis = this;
		handlerEvent = event;
	};

	// add
	$e.onMouseenter(handler);
	ok(_evData(0, 'mouseenter', handler, 'mouseover') && _evLength(1), 'Event handler \'mouseenter\' internally stored in wrapped element');

	// outer div -> test div, should trigger
	counter = 0;
	triggerMouseEvent('mouseover', n, $('#outer').node);
	ok(counter === 1, 'Event \'mouseenter\' attached and triggered (outer div to test div)');
	ok(handlerThis === n, 'Event handler \'this\' is set to dom element');
	ok(handlerEvent.type === 'mouseover', 'Event object given to handler, event type checked');

	// inner div -> test div, should NOT trigger
	counter = 0;
	triggerMouseEvent('mouseover', n, $('#inner').node);
	ok(counter === 0, 'Event \'mouseenter\' correctly NOT triggered (inner div to test div)');

	// test if event data correctly stored by removal and trigger
	_removeEventListener('mouseenter', handler);
	counter = 0;
	triggerMouseEvent('mouseover', n, $('#outer').node);
	ok(_evLength(0), 'Event handler internally removed from wrapped element');
	ok(counter === 0, 'Event \'mouseenter\' not handled after removal');
});

test('#offMouseenter', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="outer"><div id="id1"><div id="inner">Text Content</div></div></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	var _evData = _eventsData.bind($e);
	var _evLength = _eventsLength.bind($e);

	throws(
		function () { $e.offMouseenter(null); },
		TypeError,
		'Throws type error if handler is not a function'
	);

	var counterA,
		counterB;
	var handlerA = function (event) { counterA += 1; },
		handlerB = function (event) { counterB += 1; };

	// prepare
	$e.onMouseenter(handlerA);
	$e.onMouseenter(handlerB);

	// remove by handler
	$e.offMouseenter(handlerA);
	ok(_evData(0, 'mouseenter', handlerB, 'mouseover') && _evLength(1), 'Event handler A internally removed by handler from wrapped element');

	counterA = 0;
	counterB = 0;
	triggerMouseEvent('mouseover', $e.node, $('#outer').node);
	ok(counterA === 0 && counterB === 1, 'Event handler A removed by handler from dom element');

	// prepare
	$e.onMouseenter(handlerA);

	// remove all
	$e.offMouseenter();
	ok(_evLength(0), 'All event handler internally removed from wrapped element');

	counterA = 0;
	counterB = 0;
	triggerMouseEvent('mouseover', $e.node, $('#outer').node);
	ok(counterA === 0 && counterB === 0, 'All event handler removed from dom element');
});

test('#onMouseleave', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="outer"><div id="id1"><div id="inner">Text Content</div></div></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	var _removeEventListener = $._ElementWrapper._removeEventListener.bind($e);
	var _evData = _eventsData.bind($e);
	var _evLength = _eventsLength.bind($e);

	throws(
		function () { $e.onMouseleave(); },
		TypeError,
		'Throws type error if handler is not a function'
	);

	var counter;
	var handlerThis = null;
	var handlerEvent = null;
	var handler = function (event) {
		counter += 1;
		handlerThis = this;
		handlerEvent = event;
	};

	// add
	$e.onMouseleave(handler);
	ok(_evData(0, 'mouseleave', handler, 'mouseout') && _evLength(1), 'Event handler \'mouseleave\' internally stored in wrapped element');

	// outer div -> test div, should trigger
	counter = 0;
	triggerMouseEvent('mouseout', n, $('#outer').node);
	ok(counter === 1, 'Event \'mouseleave\' attached and triggered (outer div to test div)');
	ok(handlerThis === n, 'Event handler \'this\' is set to dom element');
	ok(handlerEvent.type === 'mouseout', 'Event object given to handler, event type checked');

	// inner div -> test div, should NOT trigger
	counter = 0;
	triggerMouseEvent('mouseout', n, $('#inner').node);
	ok(counter === 0, 'Event \'mouseleave\' correctly NOT triggered (inner div to test div)');

	// test if event data correctly stored by removal and trigger
	_removeEventListener('mouseleave', handler);
	counter = 0;
	triggerMouseEvent('mouseout', n, $('#outer').node);
	ok(_evLength(0), 'Event handler internally removed from wrapped element');
	ok(counter === 0, 'Event \'mouseleave\' not handled after removal');
});

test('#offMouseleave', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="outer"><div id="id1"><div id="inner">Text Content</div></div></div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	var _evData = _eventsData.bind($e);
	var _evLength = _eventsLength.bind($e);

	throws(
		function () { $e.offMouseleave(null); },
		TypeError,
		'Throws type error if handler is not a function'
	);

	var counterA,
		counterB;
	var handlerA = function (event) { counterA += 1; },
		handlerB = function (event) { counterB += 1; };

	// prepare
	$e.onMouseleave(handlerA);
	$e.onMouseleave(handlerB);

	// remove by handler
	$e.offMouseleave(handlerA);
	ok(_evData(0, 'mouseleave', handlerB, 'mouseout') && _evLength(1), 'Event handler A internally removed by handler from wrapped element');

	counterA = 0;
	counterB = 0;
	triggerMouseEvent('mouseout', $e.node, $('#outer').node);
	ok(counterA === 0 && counterB === 1, 'Event handler A removed by handler from dom element');

	// prepare
	$e.onMouseleave(handlerA);

	// remove all
	$e.offMouseleave();
	ok(_evLength(0), 'All event handler internally removed from wrapped element');

	counterA = 0;
	counterB = 0;
	triggerMouseEvent('mouseout', $e.node, $('#outer').node);
	ok(counterA === 0 && counterB === 0, 'All event handler removed from dom element');
});

test('#onEvent', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1">Text Content</div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	var _removeEventListener = $._ElementWrapper._removeEventListener.bind($e);
	var _evData = _eventsData.bind($e);
	var _evLength = _eventsLength.bind($e);

	throws(
		function () { $e.onEvent(null, function () {}); },
		TypeError,
		'Throws type error if event name is not a string'
	);
	throws(
		function () { $e.onEvent('click', null); },
		TypeError,
		'Throws type error if handler is not a function'
	);

	var counter = 0;
	var handlerThis = null;
	var handlerEvent = null;
	var handler = function (event) {
		counter += 1;
		handlerThis = this;
		handlerEvent = event;
	};

	$e.onEvent('click', handler);
	ok(_evData(0, 'click', handler) && _evLength(1), 'Event handler internally stored in wrapped element');

	triggerEvent('click', $e.node);
	ok(counter === 1, 'Event attached and handled');
	ok(handlerThis === n, 'Event handler \'this\' is set to the dom element');
	ok(handlerEvent.type === 'click', 'Event object given to handler, event type checked');

	_removeEventListener('click', handler);
	ok(_evLength(0), 'Event handler internally removed from wrapped element');

	triggerEvent('click', $e.node);
	ok(counter === 1, 'Event not handled after removal');
});

test('#offEvent', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1">Text Content</div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	var _evData = _eventsData.bind($e);
	var _evLength = _eventsLength.bind($e);

	throws(
		function () { $e.offEvent(null, function () {}); },
		TypeError,
		'Throws type error if event name is not a string'
	);
	throws(
		function () { $e.offEvent('click', null); },
		TypeError,
		'Throws type error if handler is not a function'
	);

	var counterA,
		counterB,
		counterC;
	var handlerA = function (event) { counterA += 1; },
		handlerB = function (event) { counterB += 1; },
		handlerC = function (event) { counterC += 1; };

	// add
	$e.onEvent('click', handlerA);
	$e.onEvent('mouseover', handlerB);
	$e.onEvent('click', handlerC);

	ok(_evData(0, 'click', handlerA) && _evData(1, 'mouseover', handlerB) && _evData(2, 'click', handlerC) && _evLength(3), 'Event handler A+B+C internally stored in wrapped element');

	// remove by name/handler
	$e.offEvent('mouseover', handlerB);

	counterA = 0;
	counterB = 0;
	counterC = 0;
	triggerEvent('click', $e.node);
	triggerEvent('mouseover', $e.node);

	ok(_evData(0, 'click', handlerA) && _evData(1, 'click', handlerC) && _evLength(2), 'Event handler B internally removed by name/handler from wrapped element');
	ok(counterA === 1 && counterB === 0 && counterC === 1, 'Event handler B removed by name/handler from dom element');

	// remove by name
	$e.offEvent('click');

	counterA = 0;
	counterB = 0;
	counterC = 0;
	triggerEvent('click', $e.node);
	triggerEvent('mouseover', $e.node);

	ok(_evLength(0), 'Event handler A+C internally removed by name from wrapped element');
	ok(counterA === 0 && counterB === 0 && counterC === 0, 'Event handler A+C removed by name from dom element');

	// remove all
	$e.onEvent('click', handlerA);
	$e.onEvent('mouseover', handlerB);
	$e.onEvent('click', handlerC);

	$e.offEvent();
	counterA = 0;
	counterB = 0;
	counterC = 0;
	triggerEvent('click', $e.node);
	triggerEvent('mouseover', $e.node);

	ok(_evLength(0), 'All event handler internally removed by name from wrapped element');
	ok(counterA === 0 && counterB === 0 && counterC === 0, 'All event handler removed by name from dom element');
});

test('#eventCount', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1">Text Content</div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	throws(
		function () { $e.eventCount(null, function () {}); },
		TypeError,
		'Throws type error if event name is not a string'
	);
	throws(
		function () { $e.eventCount('click', null); },
		TypeError,
		'Throws type error if handler is not a function'
	);

	var counterA = 0,
		counterB = 0,
		counterC = 0;
	var handlerA = function (event) { counterA += 1; },
		handlerB = function (event) { counterB += 1; },
		handlerC = function (event) { counterC += 1; };

	$e.onEvent('click', handlerA);
	$e.onEvent('click', handlerB);
	$e.onEvent('mouseover', handlerC);

	ok($e.eventCount('click', handlerA) === 1, 'Event count by name/handler ok');
	ok($e.eventCount('click') === 2, 'Event count by name ok');
	ok($e.eventCount() === 3, 'All events count ok');

	$e.offEvent();
});

test('#triggerClick', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1">Text Content</div>');

	var n = document.getElementById('id1');
	var $e = $('#id1');

	var clicked = 0;
	var handler = function () { clicked += 1; };

	n.addEventListener('click', handler, false);

	$e.triggerClick();
	ok(clicked === 1, 'Event \'click\' triggered');

	n.removeEventListener('click', handler, false);
});

