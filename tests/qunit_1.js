/**
 * MW Simple Query - QUnit tests
 *
 * Copyright (c) 2013 Markus von der Wehd <mvdw@mwin.de>
 * MIT License, see LICENSE.txt, see http://www.opensource.org/licenses/mit-license.php
 */

var qfixAddHtml = function (html) {
	document.getElementById('qunit-fixture').insertAdjacentHTML('beforeend', html);
};


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

test('#createFragment', function () {
	var $ = window.simpleQuery;
	// qfixAddHtml('<div class="id1"></div>');
	
	var $e1 = $.createFragment();
	ok($e1.node.nodeType === 11, 'Returned wrapped element wraps a document fragment');
});

// iframe/async tests -------------------------------------------------------------

module('simpleQuery CSS');

var qfixAddIframeOnLoad = function (src, callback) {
	document.getElementById('qunit-fixture').insertAdjacentHTML('beforeend', '<iframe id="iframe1" src="' + src + '"></iframe>');
	var iframe = document.getElementById('iframe1');

	var iframeLoad = function () {
		iframe.contentWindow.removeEventListener('load', iframeLoad);

		callback(iframe.contentWindow, iframe.contentDocument, iframe.contentWindow.simpleQuery);
	};

	iframe.contentWindow.addEventListener('load', iframeLoad);
};

var callDelayed = function (callback) {
	window.setTimeout(function () {
		callback();
	}, 50);
};


asyncTest('#addCssFile', 4, function () {
	qfixAddIframeOnLoad('data/qunit_iframe_1.html', function (window, document, $) {
		// window|document|$ are the iframe ones and intentionally shadowed
		var cssFile = 'qunit_iframe.css',
			cssCountBefore = document.styleSheets.length,
			cssCountAfter;

		// on chrome, document.styleSheets.length gets updated after stylesheet is loaded
		var e = $.addCssFile(cssFile);
		var listener = function () {
			e.removeEventListener('load', listener);

			cssCountAfter = document.styleSheets.length;
			ok(cssCountBefore === 0 && cssCountAfter === 1, 'Css file appended to document');

			var lnk = document.getElementsByTagName('link')[0];
			ok(lnk.href.substr(-1 * cssFile.length) === cssFile, 'Head link element href attribute is set correctly');
			ok(lnk.rel === 'stylesheet', 'Head link element rel attribute is set correctly');
			ok(lnk.type === 'text/css', 'Head link element type attribute is set correctly');

			start();
		};
		e.addEventListener('load', listener);
	});
});


test('#addCssRule / error', function () {
	var $ = window.simpleQuery;
	// qfixAddHtml('<div class="id1"></div>');
	
	throws(
		function () { $.addCssRule(1); },
		TypeError,
		'Throws type error if no string given as css rule'
	);
});

asyncTest('#addCssRule / async', 15, function () {
	qfixAddIframeOnLoad('data/qunit_iframe_1.html', function (window, document, $) {
		// window|document|$ are the iframe ones and intentionally shadowed
		var cssRule1 = '.cl1 { width: 100px; height: 110px; }',
			cssRule2 = '.cl2 { width: 200px; height: 220px; }',
			cssCountBefore = document.styleSheets.length,
			cssCountAfter;

		$.addCssRule(cssRule1);
		cssCountAfter = document.styleSheets.length;
		ok(cssCountBefore === 0 && cssCountAfter === 1, 'Stylesheet appended to document');
		ok(document.styleSheets[0].cssRules.length === 1, 'First CSS rule appended');
		ok($._styleSheet === document.styleSheets[0], 'Appended stylesheet stored internally');

		$.addCssRule(cssRule2);
		ok($._styleSheet.cssRules.length === 2, 'Second CSS rule appended internally');
		ok(document.styleSheets[0].cssRules.length === 2, 'Second CSS rule appended to documents stylesheet');

		ok($._styleSheet === document.styleSheets[0], 'Internally stored stylesheet still equals document stylesheet');
		ok(document.styleSheets.length === 1, 'Document still contains only one stylesheet');

		var r1 = document.styleSheets[0].cssRules[0],
			r2 = document.styleSheets[0].cssRules[1];

		ok(r1.selectorText === '.cl1', 'First rule selector is correct');
		ok(r2.selectorText === '.cl2', 'Second rule selector is correct');

		ok(r1.style.length === 2, 'First rules style property count is correct');
		ok(r2.style.length === 2, 'Second rules style property count is correct');

		ok('width' in r1.style && r1.style.getPropertyValue('width') === '100px', 'First rules first style property is set correctly');
		ok('height' in r1.style && r1.style.getPropertyValue('height') === '110px', 'First rules second style property is set correctly');
		ok('width' in r2.style && r2.style.getPropertyValue('width') === '200px', 'Second rules first style property is set correctly');
		ok('height' in r2.style && r2.style.getPropertyValue('height') === '220px', 'Second rules second style property is set correctly');

		start();
	});
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
	qfixAddIframeOnLoad('data/qunit_iframe_2.html', function (window, document, $) {
		// window|document|$ are the iframe ones and intentionally shadowed
		ok(window.TEST && window.TEST.step1 === 'loading', 'Initialized');
		ok(window.TEST && window.TEST.step2 === 'interactive', 'onDOMReady fired');
	
		start();
	});
});

test('#onLoad / error', function () {
	var $ = window.simpleQuery;
	// qfixAddHtml('<div class="id1"></div>');
	
	throws(
		function () { $.onLoad('x'); },
		TypeError,
		'Throws type error if no function given as callback'
	);
});

asyncTest('#onLoad / async', 2, function () {
	qfixAddIframeOnLoad('data/qunit_iframe_3.html', function (window, document, $) {
		// window|document|$ are the iframe ones and intentionally shadowed
		ok(window.TEST && window.TEST.step1 === 'loading', 'Initialized');

		// the iframes onLoad fires BEFORE the iframe documents onLoad fires!
		// so we have to delay the test
		callDelayed(function () {
			ok(window.TEST && window.TEST.step2 === 'complete', 'onLoad fired');
		
			start();
		});
	});
});
