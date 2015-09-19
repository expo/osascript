'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

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
  var activate = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  yield osascriptSpawnAsync(['tell application "Finder"', 'open POSIX file ' + JSON.stringify(dir), activate && 'activate' || '', 'end tell']);
});

var activateApp = _asyncToGenerator(function* (appName) {
  return yield osascriptSpawnAsync('tell app ' + JSON.stringify(appName) + ' to activate');
});

var openInAtom = _asyncToGenerator(function* (pth) {
  return yield osascriptSpawn('tell app "Atom" to open ' + JSON.stringify(pth));
});

var openInSublime = _asyncToGenerator(function* (pth) {
  return yield osascriptSpawn('tell app "Sublime Text" to open ' + JSON.stringify(pth));
});

var chooseAppAsync = _asyncToGenerator(function* (listOfAppNames) {
  var runningAwaitables = [];
  var appIdAwaitables = [];
  for (var appName of listOfAppNames) {
    runningAwaitables.push(isAppRunningAsync(appName));
    appIdAwaitables.push(safeIdOfAppAsync(appName));
  }
  var running = yield _Promise.all(runningAwaitables);
  var appIds = yield _Promise.all(appIdAwaitables);

  var i = undefined;
  for (i = 0; i < listOfAppNames.length; i++) {
    if (running[i]) {
      return listOfAppNames[i];
    }
  }

  for (i = 0; i < listOfAppNames.length; i++) {
    if (!!appIds[i]) {
      return listOfAppNames[i];
    }
  }

  return null;
});

var chooseEditorAppAsync = _asyncToGenerator(function* () {
  return yield chooseAppAsync(['Atom', 'Sublime Text', 'TextMate', 'TextWrangler', 'Brackets', 'SubEthaEdit', 'BBEdit', 'Textastic', 'UltraEdit', 'MacVim', 'CodeRunner 2', 'CodeRunner', 'TextEdit']);
});

var chooseTerminalAppAsync = _asyncToGenerator(function* () {
  return yield chooseAppAsync(['iTerm',
  // 'Cathode',
  // 'Terminator',
  'MacTerm', 'Terminal']);
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
  activateApp: activateApp,
  chooseAppAsync: chooseAppAsync,
  chooseEditorAppAsync: chooseEditorAppAsync,
  chooseTerminalAppAsync: chooseTerminalAppAsync,
  execAsync: osascriptExecAsync,
  isAppRunningAsync: isAppRunningAsync,
  openFinderToFolderAsync: openFinderToFolderAsync,
  openInAtom: openInAtom,
  openInSublime: openInSublime,
  safeIdOfAppAsync: safeIdOfAppAsync,
  spawnAsync: osascriptSpawnAsync

};
//# sourceMappingURL=sourcemaps/index.js.map