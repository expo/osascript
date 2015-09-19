let execAsync = require('exec-async');
let spawnAsync = require('@exponent/spawn-async');
let util = require('util');

function osascriptArgs(script) {
  if (!util.isArray(script)) {
    script = [script];
  }

  let args = [];
  for (let line of script) {
    args.push('-e');
    args.push(line);
  }

  return args;

}

async function osascriptExecAsync(script, opts) {
  return await execAsync('osascript', osascriptArgs(script), Object.assign({stdio: 'inherit'}, opts));
}

async function osascriptSpawnAsync(script, opts) {
  return await spawnAsync('osascript', osascriptArgs(script), opts);
}

async function isAppRunningAsync(appName) {
  let zeroMeansNo = (await osascriptExecAsync('tell app "System Events" to count processes whose name is ' + JSON.stringify(appName))).trim();
  return (zeroMeansNo !== '0');
}

async function safeIdOfAppAsync(appName) {
  try {
    return (await osascriptExecAsync('id of app "Simulator"')).trim();
  } catch (e) {
    return null;
  }
}

async function openFinderToFolderAsync(dir) {
  return await osascriptSpawnAsync([
      'tell application "Finder"',
      'open POSIX file ' + JSON.stringify(dir),
      'end tell',
  ]);
}

module.exports = {
  execAsync: osascriptExecAsync,
  isAppRunningAsync,
  openFinderToFolderAsync,
  safeIdOfAppAsync,
  spawnAsync: osascriptSpawnAsync,
}
