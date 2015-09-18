'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var osascriptExecAsync = _asyncToGenerator(function* (script, opts) {
  return yield execAsync('osascript', osascriptArgs(script), _Object$assign({ stdio: 'inherit' }, opts));
});

var osascriptSpawnAsync = _asyncToGenerator(function* (script, opts) {
  return yield spawnAsync('osascript', osascriptArgs(script), opts);
});

var execAsync = require('exec-async');
var spawnAsync = require('@exponent/spawn-async');
var util = require('util');

function osascriptArgs(script) {
  if (!util.isArray(script)) {
    script = [script];
  }

  var args = [];
  for (var line of script) {
    args.push('-e');
    args.push(line);
  }

  return args;
}

module.exports = {
  osascriptExecAsync: osascriptExecAsync,
  osascriptSpawnAsync: osascriptSpawnAsync
};
//# sourceMappingURL=sourcemaps/index.js.map