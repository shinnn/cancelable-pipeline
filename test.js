'use strict';

const {PassThrough} = require('stream');

const cancelablePump = require('.');
const test = require('tape');

test('cancelablePump()', t => {
  t.plan(3);

  t.doesNotThrow(
    () => cancelablePump([new PassThrough(), new PassThrough()])(),
    'should return a function.'
  );

  const cancel = cancelablePump(new PassThrough(), new PassThrough(), err => {
    t.strictEqual(
      err,
      undefined,
      'should cancel all streams when the cancellation function is called.'
    );
  });

  cancel();

  const dest1 = new PassThrough();
  const error = new Error();

  cancelablePump(new PassThrough(), dest1, err => {
    t.strictEqual(err, error, 'should pass normal errors as it is.');
  });

  dest1.emit('error', error);
});

test('Argument validation', t => {
  t.throws(
    () => cancelablePump(),
    /^RangeError: cancelable-pump requires more than 2 streams, but got 0\.$/,
    'should throw an error when it takes no arguments.'
  );

  t.throws(
    () => cancelablePump(new PassThrough()),
    /^RangeError: cancelable-pump requires more than 2 streams, but got 1\.$/,
    'should throw an error when it takes only 1 argument.'
  );

  t.throws(
    () => cancelablePump(new PassThrough(), t.fail),
    /^RangeError: cancelable-pump requires more than 2 streams, but got 1\.$/,
    'should throw an error when the arguments include less than 2 streams.'
  );

  t.end();
});
