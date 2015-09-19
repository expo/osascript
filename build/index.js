'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var osascriptExecAsync = _asyncToGenerator(function* (script, opts) {
  return yield execAsync('osascript', osascriptArgs(script), _Object$assign({ stdio: 'inherit' }, opts));
});

var osascriptSpawnAsync = _asyncToGenerator(function* (script, opts) {
  return yield spawnAsync('osascript', osascriptArgs(script), opts);
});

var isAppRunningAsync = _asyncToGenerator(function* (appName) {
  var zeroMeansNo = (yield osascriptExecAsync('tell app "System Events" to count processes whose name is ' + JSON.stringify(appName))).trim();
  return zeroMeansNo !== '0';
});

var safeIdOfAppAsync = _asyncToGenerator(function* (appName) {
  try {
    return (yield osascriptExecAsync('id of app "Simulator"')).trim();
  } catch (e) {
    return null;
  }
});

var openFinderToFolderAsync = _asyncToGenerator(function* (dir) {
  return yield osascriptSpawnAsync(['tell application "Finder"', 'open POSIX file ' + JSON.stringify(dir), 'end tell']);
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
  execAsync: osascriptExecAsync,
  isAppRunningAsync: isAppRunningAsync,
  openFinderToFolderAsync: openFinderToFolderAsync,
  safeIdOfAppAsync: safeIdOfAppAsync,
  spawnAsync: osascriptSpawnAsync
};
//# sourceMappingURL=sourcemaps/index.js.map