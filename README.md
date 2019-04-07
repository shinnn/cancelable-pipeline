# cancelable-pipeline

[![npm version](https://img.shields.io/npm/v/cancelable-pipeline.svg)](https://www.npmjs.com/package/cancelable-pipeline)
[![Build Status](https://travis-ci.com/shinnn/cancelable-pipeline.svg?branch=master)](https://travis-ci.com/shinnn/cancelable-pipeline)
[![codecov](https://codecov.io/gh/shinnn/cancelable-pipeline/branch/master/graph/badge.svg)](https://codecov.io/gh/shinnn/cancelable-pipeline)

Cancelable [`stream.pipeline()`](https://nodejs.org/api/stream.html#stream_stream_pipeline_streams_callback)

```javascript
const {createReadStream, createWriteStream, promises: {stat}} = require('fs');
const cancelablePipeline = require('cancelable-pipeline');

cancelablePipeline(createReadStream('1GB-file.txt'), createWriteStream('dest0'), async () => {
  (await stat('dest0')).size; //=> 1000000000;
});

const cancel = cancelablePipeline(createReadStream('1GB-file.txt'), createWriteStream('dest1'), async () => {
  (await stat('dest1')).size; //=> 263192576, or something else smaller than 1000000000
});

setTimeout(() => cancel(), 1000);
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install cancelable-pipeline
```

## API

```javascript
const cancelablePipeline = require('cancelable-pipeline');
```

### cancelablePipeline(*stream0* [, *stream1*, *stream2*, ...] [, *callback*])

*stream0*, *stream1*, *stream2*, ...: [`Stream`](https://nodejs.org/api/stream.html#stream_stream)  
*callback*: `Function`  
Return: `Function`

### cancelablePipeline(*streams* [, *callback*])

*streams*: `Stream[]`  
*callback*: `Function`  
Return: `Function`

The API is almost the same as [`stream.pipeline()`](https://nodejs.org/api/stream.html#stream_stream_pipeline_streams_callback). The only difference is *cancelable-pipeline* returns a `Function` which destroys all the piped `Stream`s without passing any errors to the callback.

```javascript
const cancel = cancelablePipeline([src, transform, anotherTransform, dest], err => {
  err; //=> undefined
});

cancel();
```

## License

[ISC License](./LICENSE) © 2017 - 2019 Shinnosuke Watanabe
