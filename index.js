/*!
 * cancelable-pump | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/cancelable-pump
*/
'use strict';

var pump = require('pump');

var cancel = new Error('Canceled.');

module.exports = function cancelablePump() {
  var nonCallbackArgs = Array.prototype.slice.call(arguments); // eslint-disable-line prefer-rest-params
  var callback = typeof nonCallbackArgs[nonCallbackArgs.length - 1] === 'function' ?
                 nonCallbackArgs.pop() :
                 null;

  var streams = Array.isArray(nonCallbackArgs[0]) ? nonCallbackArgs[0] : nonCallbackArgs;
  var streamCount = streams.length;

  if (streamCount < 2) {
    throw new RangeError('cancelable-pump requires more than 2 streams, but got ' + streamCount + '.');
  }

  pump(streams, function(err) {
    if (!callback) {
      return;
    }

    if (err && err !== cancel) {
      callback(err);
      return;
    }

    callback();
  });

  return function cancelStreams() {
    streams[streamCount - 1].emit('error', cancel);
  };
};

