/**
 * MW Simple Query - QUnit tests
 *
 * Copyright (c) 2013 Markus von der Wehd <mvdw@mwin.de>
 * MIT License, see LICENSE.txt, see http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

// counts for ALL tests
QUnit.config.testTimeout = 20000;

var qfixAddHtml = function (html) {
	document.getElementById('qunit-fixture').insertAdjacentHTML('beforeend', html);
};


// simple query tests


module('simpleQuery Basic');

test('Initialization', function () {
	ok( window.simpleQuery && typeof window.simpleQuery === 'function', 'DW is initialized');
});

test('Selection', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1"></div>');

	var n = document.getElementById('id1');
	
	var $n2 = $('#id2');
	ok($n2 instanceof simpleQuery._ElementWrapper, 'Wrapper is instance of _ElementWrapper');
	ok($n2.node === null, 'IF nothing selected, wrapped element is null');
	
	var $n1 = $('#id1');
	ok($n1.node === n, 'Wrapped element is the selected DOM element');
	
	throws(
		function () { var $n = $(); },
		TypeError,
		'Throws type error if no string given for selector'
	);
	
	throws(
		function () { var $n = $('#id1', 'x'); },
		TypeError,
		'Throws type error if context given and is no object'
	);
});

module('simpleQuery Methods');

test('#wrap', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1"></div>');
	
	var n = document.getElementById('id1');
	
	var $n1 = $.wrap(n);
	ok($n1.node === n, 'Given dom element is wrapped');
	
	var $n2 = $.wrap($n1);
	ok($n2.node === $n1.node, 'Given wrapped element is wrapped again');
	
	throws(
		function () { var $n = $.wrap('x'); },
		TypeError,
		'Throws type error if no object given'
	);
});

test('#all', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div class="cl1"></div><div class="cl1"></div><div class="cl2"></div>');
	
	var ns = document.getElementsByClassName('cl1');
	
	var $ar = $.all('.cl1');
	ok(Array.isArray($ar), 'Returned wrapped elements in an array');
	ok($ar.length === 2, 'Wrapped elements count is correct');
	ok($ar[0].node === ns[0] && $ar[1].node === ns[1], 'Wrapped elements are the selected DOM elements');

	var $ax = $.all('.clx');
	ok(Array.isArray($ax), 'Returned array if selector doesnt match anything');
	ok($ax.length === 0, 'Returned empty array if selector doesnt match anything');
	
	throws(
		function () { var $n = $.all(); },
		TypeError,
		'Throws type error if no string given for selector'
	);
	
	throws(
		function () { var $n = $.all('#id1', 'x'); },
		TypeError,
		'Throws type error if context given and is no object'
	);
});

test('#create', function () {
	var $ = window.simpleQuery;
	// qfixAddHtml('<div class="id1"></div>');
	
	var $e1 = $.create('div');
	ok($e1.node.nodeType === 1, 'Returned wrapped element wraps a dom element');
	ok($e1.node.nodeName === 'DIV', 'Returned wrapped elements node name equals the given name');

	throws(
		function () { var $n = $.create(); },
		TypeError,
		'Throws type error if no string given for creation'
	);
});

test('#fromHtml', function () {
	var $ = window.simpleQuery;

	var $e1 = $.fromHtml('<div id="id1"><p>content</p></div>');
	ok($e1.node.nodeType === 1, 'Returned wrapped element wraps a dom element');
	ok($e1.node.nodeName === 'DIV', 'Returned wrapped elements node name matches given html');
	ok($e1.node.id === 'id1', 'Returned wrapped elements node id matches given html');

	var $e2 = $e1.select('p');
	ok($e2.node.nodeName === 'P', 'Returned wrapped elements child node name matches given html');
	ok($e2.node.textContent === 'content', 'Returned wrapped elements child nodes content matches given html');

	throws(
		function () { var $e1 = $.fromHtml(); },
		TypeError,
		'Throws type error if no string given'
	);

});

test('#createFragment', function () {
	var $ = window.simpleQuery;
	// qfixAddHtml('<div class="id1"></div>');
	
	var $e1 = $.createFragment();
	ok($e1.node.nodeType === 11, 'Returned wrapped element wraps a document fragment');
});

test('#remove', function () {
	var $ = window.simpleQuery;
	qfixAddHtml('<div id="id1"><span id="s1">First</span><span id="s2">Second</span></div>');

	var $e = $('#id1');
	var n1 = document.getElementById('s1');
	var $n1 = $e.select('#s1');
	var n2 = document.getElementById('s2');
	var $n2 = $e.select('#s2');
	var c;
	var $c;

	throws(
		function () { $e.remove(); },
		TypeError,
		'Throws type error if no object for child node given'
	);

	$c = $.remove($n1);
	ok($c.node === n1, 'Removed node (wrapped element) returned');
	ok($c === $n1, 'Removed node (wrapped element) returned same instance as given');
	ok($e.childElements().length === 1, 'Remaining child count ok');

	c = $e.select('#s2').node;
	$c = $.remove(c);
	ok($c.node === n2, 'Removed node (dom element) returned');
	ok($c !== $n2, 'Removed node (dom element) returned, new wrapped element created');
	ok($e.childElements().length === 0, 'Remaining child count ok');
});

module('simpleQuery Utilities');

test('#toType', function () {
	var $ = window.simpleQuery;
	// qfixAddHtml('<div class="id1"></div>');

	throws(
		function () { $.toType(); },
		TypeError,
		'Throws type error if no argument given'
	);

	// 'undefined', 'null', 'boolean', 'number', 'string', 'array', 'object', 'date', 'regexp', 'error', 'math', 'json', 'arguments'.

	var t;
	strictEqual($.toType(t), 'undefined', 'Type \'undefined\' ok');
	t = null;
	strictEqual($.toType(t), 'null', 'Type \'null\' ok');
	t = true;
	strictEqual($.toType(t), 'boolean', 'Type \'boolean\' ok');
	t = 123;
	strictEqual($.toType(t), 'number', 'Type \'number\' ok');
	t = 'abc';
	strictEqual($.toType(t), 'string', 'Type \'string\' ok');
	t = [];
	strictEqual($.toType(t), 'array', 'Type \'array\' ok');
	t = {};
	strictEqual($.toType(t), 'object', 'Type \'object\' ok');
	t = new Date();
	strictEqual($.toType(t), 'date', 'Type \'date\' ok');
	t = /\d+/;
	strictEqual($.toType(t), 'regexp', 'Type \'regexp\' ok');
	t = new Error('Test');
	strictEqual($.toType(t), 'error', 'Type \'error\' ok');
	t = Math;
	strictEqual($.toType(t), 'math', 'Type \'math\' ok');
	t = JSON;
	strictEqual($.toType(t), 'json', 'Type \'json\' ok');
	t = (function () { return arguments; }());
	strictEqual($.toType(t), 'arguments', 'Type \'arguments\' ok');

});

test('#toArray', function () {
	var $ = window.simpleQuery;
	// qfixAddHtml('<div class="id1"></div>');

	throws(
		function () { $.toArray(); },
		TypeError,
		'Throws type error if no array like object given'
	);

	var al = { 0: 'a', 1: 'b', length: 2};
	var a = $.toArray(al);
	ok(Array.isArray(a), 'Returned value is a javascript array');
	ok(a[0] === 'a' && a[1] === 'b' && a.length === 2, 'Returned arrays contents match array like objects content');
});

// iframe/async tests -------------------------------------------------------------

module('simpleQuery CSS');

test('#addCssFile / error', function () {
	var $ = window.simpleQuery;
	
	throws(
		function () { $.addCssFile(1); },
		TypeError,
		'Throws type error if no string given as file path'
	);
});

asyncTest('#addCssFile / async', 4, function () {
	var counter = 0;
	var timerId;

	var onMessage = function (event) {
		window.clearTimeout(timerId);
		window.removeEventListener('message', onMessage, false);

		var d = event.data;
		ok(d.cssCount === 1, 'Css file appended to document');
		ok(d.linkHref === 'qunit_iframe.css', 'Head link element href attribute is set correctly');
		ok(d.linkRel === 'stylesheet', 'Head link element rel attribute is set correctly');
		ok(d.linkType === 'text/css', 'Head link element type attribute is set correctly');

		start();
	};
	window.addEventListener('message', onMessage, false);

	timerId = window.setTimeout(function () {
		window.removeEventListener('message', onMessage, false);
		ok(false, 'Event timeout!');
		start();
	}, 2000);

	qfixAddHtml('<iframe id="iframe1" src="data/qunit_iframe_1.html"></iframe>');
});

test('#addCssRule / error', function () {
	var $ = window.simpleQuery;
	
	throws(
		function () { $.addCssRule(1); },
		TypeError,
		'Throws type error if no string given as css rule'
	);
});

asyncTest('#addCssRule / async', 14, function () {
	var timerId;

	var onMessage = function (event) {
		window.clearTimeout(timerId);
		window.removeEventListener('message', onMessage, false);

		var iframe = document.getElementById('iframe1'),
			iWin = iframe.contentWindow,
			iDoc = iframe.contentDocument,
			i$ = iframe.contentWindow.simpleQuery;

		// tests
		var cssRule1 = '.cl1 { width: 100px; height: 110px; }',
			cssRule2 = '.cl2 { width: 200px; height: 220px; }',
			cssCountBefore = iDoc.styleSheets.length;

		i$.addCssRule(cssRule1);

		ok(iDoc.styleSheets.length - cssCountBefore === 1, 'New stylesheet appended to document');

		var sheet = iDoc.styleSheets[iDoc.styleSheets.length - 1];
		ok(i$._styleSheet === sheet, 'Appended stylesheet stored internally');
		ok(sheet.cssRules.length === 1, 'First CSS rule appended');

		i$.addCssRule(cssRule2);

		ok(sheet.cssRules.length === 2, 'Second CSS rule appended');
		ok(i$._styleSheet === sheet, 'Internally stored stylesheet still equals document stylesheet');
		ok(iDoc.styleSheets.length - cssCountBefore === 1, 'Document still contains only one stylesheet');

		var r1 = sheet.cssRules[0],
			r2 = sheet.cssRules[1];

		ok(r1.selectorText === '.cl1', 'First rule selector is correct');
		ok(r2.selectorText === '.cl2', 'Second rule selector is correct');

		ok(r1.style.length === 2, 'First rules style property count is correct');
		ok(r2.style.length === 2, 'Second rules style property count is correct');

		ok('width' in r1.style && r1.style.getPropertyValue('width') === '100px', 'First rules first style property is set correctly');
		ok('height' in r1.style && r1.style.getPropertyValue('height') === '110px', 'First rules second style property is set correctly');
		ok('width' in r2.style && r2.style.getPropertyValue('width') === '200px', 'Second rules first style property is set correctly');
		ok('height' in r2.style && r2.style.getPropertyValue('height') === '220px', 'Second rules second style property is set correctly');

		start();
	};
	window.addEventListener('message', onMessage, false);

	timerId = window.setTimeout(function () {
		window.removeEventListener('message', onMessage, false);
		ok(false, 'Event timeout!');
		start();
	}, 2000);

	qfixAddHtml('<iframe id="iframe1" src="data/qunit_iframe_4.html"></iframe>');
});

test('#removeCssRules / error', function () {
	var $ = window.simpleQuery;

	throws(
		function () { $.removeCssRules(); },
		TypeError,
		'Throws type error if no string given'
	);
});

asyncTest('#removeCssRules / async', 4, function () {
	var timerId;

	var onMessage = function (event) {
		window.clearTimeout(timerId);
		window.removeEventListener('message', onMessage, false);

		var iframe = document.getElementById('iframe1'),
			iWin = iframe.contentWindow,
			iDoc = iframe.contentDocument,
			i$ = iframe.contentWindow.simpleQuery,
			idx1,
			idx2;

		var addRules = [
			'.cl1 { color: #FF0000; }',
			'.cl1 > span { color: #00FF00; }',
			'.cl1:hover { color: #0000FF; }',
			'.cl2 { color: #FFFF00; }',
			'.cl2 { font-size: 14px; }',
			'.cl3 { color: #00FFFF; }',
		];
		addRules.forEach(function (rule) { i$.addCssRule(rule); });

		var cssRules = iDoc.styleSheets[iDoc.styleSheets.length - 1].cssRules;

		i$.removeCssRules('.cl1');
		ok(cssRules.length === addRules.length - 1, 'Single css rule removed');
		ok(cssRules[0].selectorText === '.cl1 > span', 'First css rule changed index');

		i$.removeCssRules('.cl2');
		ok(cssRules.length === addRules.length - 3, 'Multiple css rules removed');

		i$.removeCssRules('.cl4');
		ok(cssRules.length === addRules.length - 3, 'Rss rule not found raises no error');

		start();
	};
	window.addEventListener('message', onMessage, false);

	timerId = window.setTimeout(function () {
		window.removeEventListener('message', onMessage, false);
		ok(false, 'Event timeout!');
		start();
	}, 2000);

	qfixAddHtml('<iframe id="iframe1" src="data/qunit_iframe_4.html"></iframe>');
});


module('simpleQuery Events');

test('#onDOMReady / error', function () {
	var $ = window.simpleQuery;
	// qfixAddHtml('<div class="id1"></div>');
	
	throws(
		function () { $.onDomReady('x'); },
		TypeError,
		'Throws type error if no function given as callback'
	);
});

asyncTest('#onDOMReady / async', 2, function () {
	var counter = 0;
	var timerId;

	var onMessage = function (event) {
		switch (event.data) {
		case 'START':
			counter += 1;
			ok(counter === 1, 'Initialized');
			break;
		case 'DOM_READY':
			counter += 1;
			ok(counter === 2, 'onDOMReady fired');
			break;
		}

		if (counter === 2) {
			window.clearTimeout(timerId);
			window.removeEventListener('message', onMessage, false);
			start();
		}
	};
	window.addEventListener('message', onMessage, false);

	timerId = window.setTimeout(function () {
		window.removeEventListener('message', onMessage, false);
		ok(false, 'Event timeout!');
		start();
	}, 2000);

	qfixAddHtml('<iframe id="iframe1" src="data/qunit_iframe_2.html"></iframe>');
});

test('#onLoad / error', function () {
	var $ = window.simpleQuery;
	
	throws(
		function () { $.onLoad('x'); },
		TypeError,
		'Throws type error if no function given as callback'
	);
});

asyncTest('#onLoad / async', 2, function () {
	var counter = 0;
	var timerId;

	var onMessage = function (event) {
		switch (event.data) {
		case 'START':
			counter += 1;
			ok(counter === 1, 'Initialized');
			break;
		case 'LOADED':
			counter += 1;
			ok(counter === 2, 'onLoad fired');
			break;
		}

		if (counter === 2) {
			window.clearTimeout(timerId);
			window.removeEventListener('message', onMessage, false);
			start();
		}
	};
	window.addEventListener('message', onMessage, false);

	timerId = window.setTimeout(function () {
		window.removeEventListener('message', onMessage, false);
		ok(false, 'Event timeout!');
		start();
	}, 2000);

	qfixAddHtml('<iframe id="iframe1" src="data/qunit_iframe_3.html"></iframe>');
});
