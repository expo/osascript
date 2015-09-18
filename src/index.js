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

module.exports = {
  osascriptExecAsync,
  osascriptSpawnAsync,
}
