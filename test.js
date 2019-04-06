'use strict';

const {PassThrough} = require('stream');

const cancelablePipeline = require('.');
const test = require('tape');

test('cancelablePipeline()', t => {
	t.plan(3);

	t.doesNotThrow(
		() => cancelablePipeline([new PassThrough(), new PassThrough()])(),
		'should return a function.'
	);

	const cancel = cancelablePipeline(new PassThrough(), new PassThrough(), (...args) => {
		t.equal(
			args.length,
			0,
			'should cancel all streams when the cancellation function is called.'
		);
	});

	cancel();

	const dest = new PassThrough();
	const error = new Error();

	cancelablePipeline(new PassThrough(), dest, err => {
		t.equal(err, error, 'should pass normal errors as it is.');
	});

	dest.destroy(error);
});

test('Argument validation', t => {
	t.throws(
		() => cancelablePipeline(),
		/^RangeError: Expected at least 1 argument, but got no arguments\.$/u,
		'should throw an error when it takes no arguments.'
	);

	t.throws(
		() => cancelablePipeline([]),
		/^RangeError: cancelable-pipeline requires more than 2 streams, but got 0\.$/u,
		'should throw an error when it takes no streams.'
	);

	t.throws(
		() => cancelablePipeline(new PassThrough()),
		/^RangeError: cancelable-pipeline requires more than 2 streams, but got 1\.$/u,
		'should throw an error when it takes only 1 argument.'
	);

	t.throws(
		() => cancelablePipeline(new PassThrough(), t.fail),
		/^RangeError: cancelable-pipeline requires more than 2 streams, but got 1\.$/u,
		'should throw an error when the arguments include less than 2 streams.'
	);

	t.end();
});
