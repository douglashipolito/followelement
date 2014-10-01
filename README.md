# followelement

It allows to observe changes on an element

## About

A JavaScript library by Douglas Hipolito.

See the [project homepage](http://douglashipolito.github.io/followelement).

## Installation

Using Bower:

    bower install followelement

Or grab the [source](https://github.com/douglashipolito/followelement/dist/followelement.js) ([minified](https://github.com/douglashipolito/followelement/dist/followelement.min.js)).

## Usage

Basic usage is as follows:

    var test = followElement('.test-1', {
                  context: 'body',
                  debug: true
                })
                .insert(function () {
                  console.log('on insert');
                })
                .remove(function () {
                  console.log('on remove');
                })
                .appear(function () {
                  console.log('on appear');
                })
                .disappear(function () {
                  console.log('on disappear');
                });

For advanced usage, see the documentation.

## Documentation

Start with `docs/MAIN.md`.

## Contributing

We'll check out your contribution if you:

* Provide a comprehensive suite of tests for your fork.
* Have a clear and documented rationale for your changes.
* Package these up in a pull request.

We'll do our best to help you out with any contribution issues you may have.

## License

MIT. See `LICENSE.txt` in this directory.
