#!/bin/bash

# First, you should fill the information below ######
node_ip='127.0.0.1';#Your btc node rpc-ip
node_port=18332;    #Your btc node rpc-port
node_user='';       #Your btc node rpc-user
node_password='';   #Your btc node rpc-password
rescan_from_time=1543399060; 
# 1539000000 = 2018-10-08T12:00:00.000Z 
# You can use: date +%s to print now timestamp
# date -r timestamp to parse utc to time (Mac OS)
# date -d @timestamp to parse utc to time (Linux)
##############################################
# ATTENTION: Please make sure you are use the binary bitcoin-cli, if not this script will install a js one. 
# For js must make sure the bitcoind-rpc have "importMulti: 'obj obj'," line 220 in bitcoind-rpc/lib/index.js.
# Or you should add it manually, otherwise it will prompt 'invalid RPC method.'
##############################################


# Check the command tool exist.
if command -v bitcoin-cli >/dev/null 2>&1; then 
  echo 'Detect bitcoin-cli OK!' 
else 
  echo 'Detect bitcoin-cli Failed! Try to install...'
  if command -v yarn >/dev/null 2>&1; then 
    echo 'Detect yarn OK!' 
    yarn global add bitcoin-cli
  else 
    echo 'Detect yarn Failed! Install failed!'
    exit 1; 
  fi
  echo 'Detect bitcoin-cli OK!' 
fi

#Check the command line params.
if [ $# == 0 ] ; then 
  echo "USAGE: $0 -[command]" 
  echo " e.g.: $0 -s # Show addresses in node" 
  echo " e.g.: $0 -e [address.txt] # Export addresses to file : [address.txt](default)" 
  echo " e.g.: $0 -i # Import addresses in file : address.txt use a default timestamp." 
  exit 0; 
fi 

#Fill the default filename
if [ $# == 1 ] ; then 
  file_name="address.txt"
else
  file_name=$2
fi

#Show addresses
if [ $1 == '-s' ] ; then 
  echo "Show addresses in node:" 
  show_address=$(bitcoin-cli --rpcuser=$node_user --rpcpassword=$node_password --host=$node_ip --port=$node_port listaddressgroupings);
  address_list=$(echo "$show_address" | grep -o "\[ \'.*\',"|cut -f2 -d "'");
  echo "$address_list";
  address_count=$(echo "$address_list" | wc -l);
  echo ""
  echo "Total count:" $address_count "in" [$node_ip:$node_port]
  exit 0; 
fi 

#Export to file
if [ $1 == '-e' ] ; then 
  echo "Show addresses in node:" 
  show_address=$(bitcoin-cli --rpcuser=$node_user --rpcpassword=$node_password --host=$node_ip --port=$node_port listaddressgroupings);
  address_list=$(echo "$show_address" | grep -o "\[ \'.*\',"|cut -f2 -d "'");
  echo "$address_list";
  echo "$address_list" > $file_name
  address_count=$(echo "$address_list" | wc -l);
  echo ""
  echo "Total count:" $address_count "in" [$node_ip:$node_port]
  echo "Wrote addresses to file [" $file_name "]"
  exit 0; 
fi 

#Import from file
if [ $1 == '-i' ] ; then 
  echo "Import addresses from [" $file_name "] to" [$node_ip:$node_port]
  
  import_script="["
  while read line
  do
    import_script+="{\"scriptPubKey\":{\"address\":\"$line\"},\"timestamp\":$rescan_from_time,\"label\":\"walletaddr_30release_sh\"},"
  done < $file_name

  #The last line
  import_script+="{\"scriptPubKey\":{\"address\":\"$line\"},\"timestamp\":$rescan_from_time,\"label\":\"walletaddr_30release_sh\"}"

  import_script+="]"
  
  echo "$import_script"

  import_address=$(bitcoin-cli --rpcuser=$node_user --rpcpassword=$node_password --host=$node_ip --port=$node_port importmulti $import_script);

  echo $import_address
fi
