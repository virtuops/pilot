#!/bin/bash

#
# 
# Do NOT move this script from this location
#
# dbfailover.sh script.  Copyright MKAdvantage, Inc. 2017.  All Rights Reserved
#
#

replaceCmd(){
        sed -i "s~$1~$2~g" $3
}

startingNote(){
echo -e "\n\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<STARTING INSTALLATION>>>>>>>>>>>>>>>>>>>>>>>>>>\n\nWelcome to the VirtuOps™ DB Failover script.\n\nThis script will guide you through setting up master-master failover between two MariaDB instances.  It will only take a few minutes if you have all of the pre-requisites satisfied, which we will show you below or you can read about at https://www.virtuops.com/nochero-prerequisites.\n\nThis script needs to be run in two places.  It needs to be run on the first master DB and then on the second master DB.  For this to work, you will need the following:\n\n1)  Two installed VirtuOps™ databases on two separate VMs/servers\n2)  Connectivity between the two databases on the database ports (usually 3306, but you need to check if they have changed\n3)  DB credentials for a db user that can create a replication user and establish replication on both servers.\n4)  Your two master dbs must have the same name for the VirtuOps™ database that you are going to replicate in master-master mode.\n\n"
}

getCnfVars(){

while [ ${#serverid} -lt 1 ]
do
echo -e "Give this DB Instance a numeric ID.  NOTE:  REMEMBER THIS NUMBER.  YOUR FAILOVER SERVER NEEDS A DIFFERENT ID (usually one higher).\n  For instance, if this server id is 1, make your backup 2.\n\n"
read -p "Server ID: " serverid
done

while [ ${#binlog} -lt 1 ]
do
echo -e "\nNeed a log bin location.  Usually something like /var/log/mysql/mariadb-bin\n"
read -p "Bin log: " binlog
done

while [ ${#binlogindex} -lt 1 ]
do
echo -e "\nNeed a log bin index location.  Usually something like /var/log/mysql/mariadb-bin.index\n"
read -p "Bin log index: " binlogindex
done

while [ ${#relaylog} -lt 1 ]
do
echo -e "\nNeed a relay log location.  Usually something like /var/log/mysql/relay-bin\n"
read -p "Relay log: " relaylog
done

while [ ${#relaylogindex} -lt 1 ]
do
echo -e "\nNeed a relay log index location.  Usually something like /var/log/mysql/relay-bin.index\n"
read -p "Relay log index: " relaylogindex
done

while [ ${#dbname} -lt 1 ]
do
echo -e "\nNeed the name of the VirtuOps™ database that we will replicate.  NOTE:  THIS NEEDS TO BE THE SAME ON BOTH SERVERS!!!  Check your config.ini if you don't remember.\n"
read -p "VirtuOps™ DB name: " dbname 
done

echo "Params read in, thanks\n";

}

stopMysql(){
	if [ -f /etc/init.d/mysql ]; then
		/etc/init.d/mysql stop
	else 
		systemctl stop mysql
	fi
}

startMysql(){
	if [ -f /etc/init.d/mysql ]; then
		/etc/init.d/mysql start
	else 
		systemctl start mysql
	fi
}

getMysqlConn(){

read -p "Where is your mysql client (press enter for /usr/bin/mysql): " dbclient
read -p "What is the mysql root user name (press enter for root): " user
read -p "What is the mysql root password: " password
read -p "Which mysql host are we setting up (fqdn/IP/localhost etc): " host
read -p "What port is mysql on: " port

dbclient=${dbclient:-'/usr/bin/mysql'}
user=${user:-'root'}

}

createReplUser(){

read -p "What is replication user name for this server: " repluser
read -p "What is replication password  for this server: " replpass
$dbclient -u$user -p"$password" -h $host -P $port  -e "create user '"$repluser"'@'%' identified by '"$replpass"'"
$dbclient -u$user -p"$password" -h $host -P $port  -e "grant replication slave on *.* to '"$repluser"'@'%'"

}

getMasterStatus(){

masterstat=`$dbclient -u$user -p$password -h $host -P $port  -e 'show master status \G'`

echo -e "\nHere is your master file and position, keep these somewhere handy for your other master server.\n"
echo "$masterstat"
echo -e "\nYou will need these when you start the slave on the other server.\n"

read -p "Do you have the master file name and master position from the other server? " hasmaster

if [ "$hasmaster" == "yes" ] || [ "$hasmaster" == "y" ] || [ "$hasmaster" == "Yes" ] || [ "$hasmaster" == "YES" ];then
getMysqlConn
updateSlave
else
exitInstall
fi
}

updateSlave() {

echo -e "\nGreat, let's get started updating the slave\n"
echo -e "First, I am going to stop the slave on this machine\n"
stopslave=`$dbclient -u$user -p"$password" -h $host -P $port  -e 'stop slave \G'`
echo -e "Ok, slave stopped.\n"
echo -e "Now, I need to ask a few questions about the other server you configured.\n"
read -p "What is the hostname of the other server (cannot be localhost, must be an IP or hostname and make sure you can route to this host): " otherhost
read -p "What is the replication user of the other server : " otherrepluser
read -p "What is the replication password of the other server : " otherreplpass
read -p "What is the master log file of the other server : " othermasterlog
read -p "What is the master log position of the other server : " othermasterpos


changemaster=`$dbclient -u$user -p"$password" -h $host -P $port -e "CHANGE MASTER TO MASTER_HOST='$otherhost', MASTER_USER='$otherrepluser', MASTER_PASSWORD='$otherreplpass', MASTER_LOG_FILE='$othermasterlog', MASTER_LOG_POS=$othermasterpos"`;

startslave=`$dbclient -u$user -p"$password" -h $host -P $port  -e 'start slave \G'`

echo -e "Slave updated on this machine to point to other master\n"

masterstatus=`$dbclient -u$user -p"$password" -h $host -P $port  -e 'show master status \G'`

echo -e "Master status is $masterstatus\n"

echo -e "\n\n"

echo -e "Use the master details to go update the other server.  If this is your second server, you only need to update the slave on the first server.\n"

}

updateCnfConfig(){
	cp my.cnf my.cnf.tmp
	replaceCmd "SERVERID" "${serverid}" "my.cnf.tmp"
	replaceCmd "LOG_BIN" "${binlog}" "my.cnf.tmp"
	replaceCmd "BINDEX" "${binlogindex}" "my.cnf.tmp"
	replaceCmd "RELAY_LOG" "${relaylog}" "my.cnf.tmp"
	replaceCmd "RINDEX" "${relaylogindex}" "my.cnf.tmp"
	replaceCmd "NOCHERODB" "${dbname}" "my.cnf.tmp"
	cp my.cnf.tmp /etc/my.cnf
}

exitInstall() {
echo -e "\nYou are exiting this installation. Thanks for stopping by!\n"
exit
}

startingNote

read -p "Are you just updating the slave on this machine (y|n)? " slaveyn

if [ "$slaveyn" == 'Yes' ] || [ "$slaveyn" == 'Y' ] || [ "$slaveyn" == 'y' ] || [ "$slaveyn" == 'yes' ]; then
getMysqlConn
updateSlave
exitInstall
else
	read -p "Do you wish to set up a replication master on this machine?  KEEP IN MIND, THIS WILL OVERWRITE YOUR my.cnf file (y|n)? " yn

	if [ "$yn" == 'Yes' ] || [ "$yn" == 'Y' ] || [ "$yn" == 'y' ] || [ "$yn" == 'yes' ]
	then
	stopMysql
	getMysqlConn
	getCnfVars
	updateCnfConfig
	startMysql
	createReplUser
	getMasterStatus
	exitInstall
	else
	exitInstall
	fi
fi
