#!/usr/bin/env node
const Rsync = require('rsync')
const exec = require('child_process').exec
const chokidar = require('chokidar')

const WATCH_IGNORE = ['*.swp', '.*']

const rsync = new Rsync()
  .flags('rtvul')
  .set('delete')
  .set('exclude-from', 'sync_exclude.txt')
  .source('src/')
  .destination('dist')


function getBabelCmd(path) {
  let cmd = ''
  if (path) {
    cmd = 'node ./node_modules/babel-cli/bin/babel.js ' + path + ' -d dist'
  } else {
    cmd = 'node ./node_modules/babel-cli/bin/babel.js src -d dist'
  }

  return cmd
}

function watchAndBuild() {
  const watcher = chokidar.watch('src', {
    ignored: WATCH_IGNORE,
    awaitWriteFinish: true
  })
  watcher.on('ready', ()=>{
    watcher.on('add', (path) => {
      console.log('watch file change ' + path)
      build(path)
    })
    watcher.on('change', (path) => {
      console.log('watch file change ' + path)
      build(path)
    })
  })
}

function build(path) {
  rsync.execute((err, code, cmd) => {
    if (err) {
      console.log('sync file fail:\n' + err)
    } else {
      console.log('sync file success')
      if (path && !path.endsWith('.js')) {
        // js not change, pass run babel
      } else {
        const cmd = getBabelCmd(path)
        console.log(cmd)
        exec(cmd, (err, stdout, stderr) => {
          if (err) {
            console.log('run babel fail:\n' + err + '\n' + stdout + '\n' + stderr)
          }
        })
      }
    }
  })
}

const cmd = process.argv[2]
if (cmd == 'build') {
  build()
} else if (cmd == 'watch') {
  watchAndBuild()
}
