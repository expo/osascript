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

async function openFinderToFolderAsync(dir, activate=true) {
  await osascriptSpawnAsync([
      'tell application "Finder"',
      'open POSIX file ' + JSON.stringify(dir),
      (activate && 'activate' || ''),
      'end tell',
  ]);
}

async function activateApp(appName) {
  return await osascriptSpawnAsync('tell app ' + JSON.stringify(appName) + ' to activate');
}

async function openInAtom(pth) {
  return await osascriptSpawn('tell app "Atom" to open ' + JSON.stringify(pth));
}

async function openInSublime(pth) {
  return await osascriptSpawn('tell app "Sublime Text" to open ' + JSON.stringify(pth));
}

async function chooseAppAsync(listOfAppNames) {
  let runningAwaitables = [];
  let appIdAwaitables = [];
  for (let appName of listOfAppNames) {
    runningAwaitables.push(isAppRunningAsync(appName));
    appIdAwaitables.push(safeIdOfAppAsync(appName));
  }
  let running = await Promise.all(runningAwaitables);
  let appIds = await Promise.all(appIdAwaitables);

  let i;
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

}

async function chooseEditorAppAsync() {
  return await chooseAppAsync([
    'Atom',
    'Sublime Text',
    'TextMate',
    'TextWrangler',
    'Brackets',
    'SubEthaEdit',
    'BBEdit',
    'Textastic',
    'UltraEdit',
    'MacVim',
    'CodeRunner 2',
    'CodeRunner',
    'TextEdit',
  ]);
}

async function chooseTerminalAppAsync() {
  return await chooseAppAsync([
    'iTerm',
    // 'Cathode',
    // 'Terminator',
    // 'MacTerm',
    'Terminal',
  ]);
}

module.exports = {
  activateApp,
  chooseAppAsync,
  chooseEditorAppAsync,
  chooseTerminalAppAsync,
  execAsync: osascriptExecAsync,
  isAppRunningAsync,
  openFinderToFolderAsync,
  openInAtom,
  openInSublime,
  safeIdOfAppAsync,
  spawnAsync: osascriptSpawnAsync,

}
