'use_strict';
const fs = require('fs');
const path = require('path');
const loki = require('lokijs');
const math = require('math');

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

class BtcImportAddressDb {
  constructor(log, btcClient, dbPath) {
    try {
      if (dbPath) {
        this.dbPath = path.join(__dirname, dbPath);;
      } else {
        this.dbPath = path.join(__dirname, 'btcImport.db');
      }

      if (!fs.existsSync(path.parse(this.dbPath).dir)) {
        mkdirsSync(path.parse(this.dbPath).dir);
      }

      this.log = log;
      this.client = btcClient;
      this.db = new loki(this.dbPath);
      this.log.info('Using database file: ' + this.dbPath);
    } catch (error) {
      log.error(error);
    }
  }

  saveAddress(address) {
    this.db.loadDatabase(null, ()=>{
      let co = this.db.addCollection('btcAddress');
      if (co.find({ address: address }).length > 0) {
        this.log.info('Address [' + address + '] is already in database.');
        return;
      } else {
        let obj = { address: address, time: math.floor(new Date().getTime() / 1000) };
        co.insert(obj);
        this.db.saveDatabase(()=>{
          this.log.info('Address [' + JSON.stringify(obj) + '] added into database.');
        });
      }
    });
  }

  async importAllBtcAddressFromDb(callback) {
    try {
      let importArray = [];

      this.db.loadDatabase(null, async (err) => {
        if (err) {
          this.log.error(err);
        }

        let co = this.db.addCollection('btcAddress');
        this.log.info('total count:' + co.data.length);
        co.data.forEach((v) => {
          let importOne = {
            "scriptPubKey": { "address": v.address },
            "timestamp": v.time,
            "label": "walletaddr_30release"
          };
          importArray.push(importOne);
        });

        console.log(importArray);

        await this.client.importMulti(importArray);

        this.log.info('importAllBtcAddressFromDb finish!');

        callback();
      });

    } catch (error) {
      log.error(error);
    }
  }

  async showAddressInDb(callback) {
    try {
        this.db.loadDatabase(null, (err) => {
          if (err) {
            this.log.error(err);
          }

          let co = this.db.addCollection('btcAddress');

          this.log.info('Addres count in db: ' + co.data.length);

          for(let i=0; i<co.data.length; i++) {
            console.log(co.data[i]);
          }
          
          callback();
        });
    } catch (error) {
      this.log.error(error);
    }
  }

  async exportAllBtcAddressToDb(callback, defaultTimeStamp) {
    try {
      let addressLists = await this.client.listAddressGroupings();
      if ((addressLists.length > 0) && (addressLists[0].length > 0)) {
        this.log.info(addressLists);

        this.db.loadDatabase(null, (err) => {
          if (err) {
            this.log.error(err);
          }

          let co = this.db.addCollection('btcAddress');

          this.log.info('Addres count in db: ' + co.data.length);

          addressLists.forEach((vv)=>{
            vv.forEach((v) => {
              if (co.find({ address: v[0] }).length > 0) {
                this.log.info('Address [' + v[0] + '] is already in database.');
                return;
              } else {
                if (!defaultTimeStamp) {
                  defaultTimeStamp = 1534000000;
                }
                let obj = { address: v[0], time: Number(defaultTimeStamp) };//start with 2018-08-11
                co.insert(obj); 
                this.log.info('Address [' + JSON.stringify(obj) + '] added into database.');
              }
            });
          });

          this.db.saveDatabase(callback);
        });

      }
    } catch (error) {
      this.log.error(error);
    }
  }
}

module.exports = BtcImportAddressDb;
