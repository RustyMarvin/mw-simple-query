# MW Simple Query

A simple javascript DOM manipulation library.

It allows convenient access to native DOM/element methods with method chaining.

This is NOT a cross-browser compatibility library like jQuery.  
It works (and is tested) on current standards-compliant browsers like Firefox 19 and Chrome 25.  
It may work in others.


## Short introduction

If you already know jQuery, this should look familiar.

	<!doctype html>
	<html>
	<head>
		<meta charset="utf-8">
		<title>Demo</title>
	</head>
	<body>
		<h1>Demo</h1>
		<script src="mw_simple_query.js"></script>
		<script>
		(function ($) {
			$.onDOMReady(function () {
				$('h1').style('cursor', 'pointer').onClick(function (elem) { $.wrap(this).style('color', 'red'); });
			});
		}(window.simpleQuery));
		</script>
	</body>
	</html>


## API

[API Documentation](API.md)


## QUnit tests

Just run tests/qunit.html to run the tests in your browser.  
They run fine in current versions of Firefox and Webkit based browsers.  
In Opera the library seems to run fine, but there are problems with the unit tests.


## License

MIT License, see LICENSE.txt


## Notes

- As soon as I tried to learn how to deal with native DOM manipulation with javascript, I started to developing this library.  
  As someone well known said, [the DOM is a mess](http://ejohn.org/blog/the-dom-is-a-mess/).

- If it looks like reinventing the wheel
  see [this link](http://www.codinghorror.com/blog/2009/02/dont-reinvent-the-wheel-unless-you-plan-on-learning-more-about-wheels.html).

- I use this library instead of jQuery in a well defined environment, [node-webkit](https://github.com/rogerwang/node-webkit), where browser compatibility is not a necessity.

