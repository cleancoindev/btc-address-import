# BTC Address Import and Export Tools

Btc Address Export means ([Btc Node] -> [LocalDb File]) from Btc node to local db file.

Btc Address Import means ([LocalDb File] -> [Btc Node]) from local db file to Btc node. 

We have three main function:

1. Export: [Btc Node] -> [LocalDb File]
2. Import: [LocalDb File] -> [Btc Node]
3. Show: Show addresses and timestamp in local db file.
------------
## First: Config in coinNodeConfig.json File.
-------------

````
{
  "url":"127.0.0.1:8332",
  "network":"mainnet",
  "username":"",
  "password":""
}
````

As above the url is btc node's address and port.

The network fill mainnet or testnet.

And fill the username and password of btc node rpc.

------------
## Second: Try to Export from an exist node.
------------

Use the command below to export addresses to local db file.

````
node -t export -f test.db

start
Using database file: /Users/molin/workspace/btc-address-import/test.db
[ [ [ '12KB7eQnfi3frX4fxA2NtCS1KzhDL75DBg', 0.01, '' ] ],
  [ [ '14p1T4TqKzUDhbe4YjLUwKWp2vprWH6VBS', 0.0072349, '' ] ],
  [ [ '1D1pqFX6zm9rVEwquZbdmHwAYYeCCVm6dE',
      0.0236448,
      'walletaddr_30release' ] ],
  [ [ '1FZeVAnjdTK4Upu3b1CjhvwkrgfzvF6YUS', 0.0106125, '' ] ],
  [ [ '1Gisb7SesumKajcF7NTxA8QvDwnvQykiiX', 0.01, '' ] ],
  [ [ '1H5LY3EK2s6wB4YPwUjai6bqixhFPB9tTh', 0.0098223, '' ] ],
  [ [ '1LcyJgYXRBNE8hTVrj3ef5p8rGdNApxLRf', 0.01, '' ] ] ]
Addres count in db: 0
Address [{"address":"12KB7eQnfi3frX4fxA2NtCS1KzhDL75DBg","time":1534000000,"meta":{"revision":0,"created":1541406400337,"version":0},"$loki":1}] added into database.
Address [{"address":"14p1T4TqKzUDhbe4YjLUwKWp2vprWH6VBS","time":1534000000,"meta":{"revision":0,"created":1541406400337,"version":0},"$loki":2}] added into database.
Address [{"address":"1D1pqFX6zm9rVEwquZbdmHwAYYeCCVm6dE","time":1534000000,"meta":{"revision":0,"created":1541406400338,"version":0},"$loki":3}] added into database.
Address [{"address":"1FZeVAnjdTK4Upu3b1CjhvwkrgfzvF6YUS","time":1534000000,"meta":{"revision":0,"created":1541406400338,"version":0},"$loki":4}] added into database.
Address [{"address":"1Gisb7SesumKajcF7NTxA8QvDwnvQykiiX","time":1534000000,"meta":{"revision":0,"created":1541406400338,"version":0},"$loki":5}] added into database.
Address [{"address":"1H5LY3EK2s6wB4YPwUjai6bqixhFPB9tTh","time":1534000000,"meta":{"revision":0,"created":1541406400338,"version":0},"$loki":6}] added into database.
Address [{"address":"1LcyJgYXRBNE8hTVrj3ef5p8rGdNApxLRf","time":1534000000,"meta":{"revision":0,"created":1541406400355,"version":0},"$loki":7}] added into database.
export finish!
````

---------
## Thirdly: Show and View the addresses in local db file.
---------

````
node index.js -t show -f test.db

start
Using database file: /Users/molin/workspace/btc-address-import/test.db
Addres count in db: 7
{ address: '12KB7eQnfi3frX4fxA2NtCS1KzhDL75DBg',
  time: 1534000000,
  meta: { revision: 0, created: 1541406400337, version: 0 },
  '$loki': 1 }
{ address: '14p1T4TqKzUDhbe4YjLUwKWp2vprWH6VBS',
  time: 1534000000,
  meta: { revision: 0, created: 1541406400337, version: 0 },
  '$loki': 2 }
{ address: '1D1pqFX6zm9rVEwquZbdmHwAYYeCCVm6dE',
  time: 1534000000,
  meta: { revision: 0, created: 1541406400338, version: 0 },
  '$loki': 3 }
{ address: '1FZeVAnjdTK4Upu3b1CjhvwkrgfzvF6YUS',
  time: 1534000000,
  meta: { revision: 0, created: 1541406400338, version: 0 },
  '$loki': 4 }
{ address: '1Gisb7SesumKajcF7NTxA8QvDwnvQykiiX',
  time: 1534000000,
  meta: { revision: 0, created: 1541406400338, version: 0 },
  '$loki': 5 }
{ address: '1H5LY3EK2s6wB4YPwUjai6bqixhFPB9tTh',
  time: 1534000000,
  meta: { revision: 0, created: 1541406400338, version: 0 },
  '$loki': 6 }
{ address: '1LcyJgYXRBNE8hTVrj3ef5p8rGdNApxLRf',
  time: 1534000000,
  meta: { revision: 0, created: 1541406400355, version: 0 },
  '$loki': 7 }
show finish

````

### You can manual change the db file by any text editor in json language. 

---------
## Fourthly: Import from the db file to btc node.
---------

````
node index.js -t import -f testnet.db

start
Using database file: /Users/molin/workspace/btc-address-import/testnet.db
total count:1
[ { scriptPubKey: { address: 'mzdneiM8dMSqw2mX8GQQo2aR63wG78EG6B' },
    timestamp: 1539000000,
    label: 'walletaddr_30release' } ]
importAllBtcAddressFromDb finish!
import finish!
````
