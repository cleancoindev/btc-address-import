const optimist = require('optimist');
const BtcClient = require('bitcoin-core');
const fs = require('fs');
const path = require('path');

const BtcImportAddressDb = require('./btcImportAddressDb.js');



let argv = optimist
  .usage('Usage: $0 -t import[export|show] [-b [beginTimeStamp](default: 1534000000, only valid when export new address.)] [-f dbFile]')
  .demand(['t'])
  .argv;

function getUrl() {
  const coinNodeConfigPath = path.join(__dirname, 'coinNodeConfig.json');
  let coinNodeString = fs.readFileSync(coinNodeConfigPath, 'utf8');
  let coinNodeConfig = JSON.parse(coinNodeString);
  return coinNodeConfig;
}

function getBtcClient() {
  let config = getUrl();
  let ipPort = config.url.split(':');
  return new BtcClient({
    network: config.network,
    host: ipPort[0],
    port: Number(ipPort[1]),
    username: config.username,
    password: config.password,
    timeout: 900000
  });
}

function main() {
  console.log('start');


  let btcClient = getBtcClient();

  let dbFile = undefined;
  if(argv.f) {
    dbFile = argv.f;
  }

  let btcImport = new BtcImportAddressDb(console, btcClient, dbFile);

  if (argv.t === 'export') {
    btcImport.exportAllBtcAddressToDb((err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('export finish!');
      }
    }, argv.b);
  } else if (argv.t === 'import') {
    btcImport.importAllBtcAddressFromDb((err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('import finish!');
      }
    });
  } else if(argv.t === 'show') {
    btcImport.showAddressInDb((err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('show finish!');
      }
    });
  } else {
    console.log('Usage: $0 -t import[export]');
  }
}

main();