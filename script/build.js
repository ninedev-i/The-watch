const electron = require('electron-connect').server.create({ stopOnClose: true });
const argv = require('minimist')(process.argv.slice(2));
const options = require('./rollup.config');
const {green, red} = require('chalk');
const waitOn = require('wait-on');
const rollup = require('rollup');
const {connect} = require('net');
const {join} = require('path');
const {URL} = require('url');
const ora = require('ora');

require('dotenv').config({ path: join(__dirname, '../.env') });

const opt = options(argv.env);
const TAG = '[script/build.js]';
const spinner = ora(`${TAG} Electron build...`);

const watchFunc = function () {
    const watcher = rollup.watch(opt);
    watcher.on('change', filename => {
      const log = green(`change -- ${filename}`);
      console.log(TAG, log);
    });
    watcher.on('event', ev => {
      if (ev.code === 'END') {
        electron.electronState === 'init' ? electron.start() : electron.restart();
      } else if (ev.code === 'ERROR') {
        console.log(ev.error);
      }
    });
}

const resource = `http://localhost:${process.env.PORT}/index.html`;

if (argv.watch) {
  waitOn({
    resources: [resource],
    timeout: 5000,
  }, err => {
    if (err) {
        const { port, hostname } = new URL(resource);
        const serverSocket = connect(port || 80, hostname, () => {
          watchFunc();
        });
        serverSocket.on('error', (e) => {
          console.log(err);
          process.exit(1);
        });
    } else {
      watchFunc();
    }
  });
} else {
  spinner.start();
  rollup.rollup(opt)
    .then(build => {
      spinner.stop();
      console.log(TAG, green('Electron build successed.'));
      build.write(opt.output);
    })
    .catch(error => {
      spinner.stop();
      console.log(`\n${TAG} ${red('Error')}\n`, error, '\n');
    });
}
