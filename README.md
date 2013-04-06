# MW Simple Query

A simple javascript DOM manipulation library.

It allows convenient access to native DOM/element methods with method chaining.

This is NOT a cross-browser compatibility library like jQuery.
It works (and is tested) on current standards-compliant browsers like Firefox 19 and Chrome 25. It may work in others.


## Short introduction

If you already know jQuery, this should look familiar.

	<simple js code example>


## API

[Documentation](API.md)


## QUnit tests

Just run tests/qunit.html to run the tests in your browser.


## License

MIT License, see LICENSE.txt


## Notes

- As I tried to learn how to deal with native DOM manipulation with javascript,
  I started to developing this library. As someone well known said [the DOM is a mess](http://ejohn.org/blog/the-dom-is-a-mess/)

- If it looks to you like reinventing the wheel
  see [this link](http://www.codinghorror.com/blog/2009/02/dont-reinvent-the-wheel-unless-you-plan-on-learning-more-about-wheels.html)

- Meanwhile I use this library in a well defined environment, [node-webkit](https://github.com/rogerwang/node-webkit)
  instead of jQuery, where browser compatibility is not a necessity.

