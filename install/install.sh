#!/bin/bash

#
# Welcome to the VirtuOps™ Pilot installer!  In this installer you will need
#
#	- A License file
#	- PHP version 5.5+, can be installed with yum, check out this page (https://webtatic.com/projects/yum-repository/)
#	- Perl version 5.8+ with JSON module (can be installed with yum).
#	- cURL, can be installed with yum as well
#	- MariaDB 10+, yum repos available (run the curl command shown on this page to install https://mariadb.com/kb/en/mariadb/mariadb-package-repository-setup-and-usage/).
#
# The installer will do the following:  
# Validate you have the right version of PHP (5.5 or higher)
# Install the database and tables for VirtuOps™ Pilot
# Update your config.ini
# 
# Do NOT move this script from this location

replaceCmd(){

        sed -i "s~$1~$2~g" $3

}

installPreReqs(){
	

	if [ "$release" == "centos6" ]; then
	yum -y install epel-release
        yum -y install curl
        yum -y install unzip
        yum -y install nginx nginx-all-modules

cat <<EOF > /etc/yum.repos.d/mariadb.repo
# MariaDB 10.2 CentOS repository list - created 2017-11-05 23:54 UTC
# http://downloads.mariadb.org/mariadb/repositories/
[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/10.2/centos6-amd64
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1
EOF
        yum update
        yum -y install MariaDB-server MariaDB-client
        yum -y install httpd

        rpm -Uvh https://mirror.webtatic.com/yum/el6/latest.rpm

        yum -y install php70w php70w-mysqlnd php70w-mcrypt php70w-pgsql php70w-opcache php70w-ldap php70w-gd php70w-bcmath php70w-cli php70w-dba

        yum -y install perl-JSON
        service httpd restart
        service mysql restart
        mysql_secure_installation
	fi

	if [ "$release" == "7" ]; then

	yum -y install epel-release
        yum -y install curl
        yum -y install unzip
        yum -y install nginx nginx-all-modules

cat <<EOF > /etc/yum.repos.d/mariadb.repo
# MariaDB 10.2 CentOS repository list - created 2017-11-06 01:04 UTC
# http://downloads.mariadb.org/mariadb/repositories/
[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/10.2/centos7-amd64
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1
EOF
        yum update
        yum -y install MariaDB-server MariaDB-client
        yum -y install httpd

	rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm

        yum -y install php70w php70w-mysqlnd php70w-mcrypt php70w-pgsql php70w-opcache php70w-ldap php70w-gd php70w-bcmath php70w-cli php70w-dba

        yum -y install perl-JSON
        service httpd restart
        service mysql restart
        mysql_secure_installation

	fi

	if [ "$release" == "ubuntu" ]; then

	apt-get update
        apt-get upgrade
        apt-get -y install curl
        apt-get -y install unzip
        echo "deb http://nginx.org/packages/ubuntu/  `lsb_release -cs` nginx" >> /etc/apt/sources.list.d/nginx.list
        curl http://nginx.org/keys/nginx_signing.key | apt-key add -
        apt-get update
        apt-get -y install mariadb-server mariadb-client
        mysql_secure_installation
        apt-get -y install apache2
        apt-get -y install php libapache2-mod-php
        apt-get -y install php5 libapache2-mod-php5
        apt-get -y install php5-mysqlnd php5-curl php5-gd php5-intl php-pear php5-imagick php5-imap php5-mcrypt php5-memcache php5-pspell php5-recode php5-sqlite php5-tidy php5-xmlrpc php5-xsl php5-apcu
        apt-get -y install php7.0-mysqlnd php7.0-curl php7.0-gd php7.0-intl php7.0-pear php7.0-imagick php7.0-imap php7.0-mcrypt php7.0-memcache php7.0-pspell php7.0-recode php7.0-sqlite php7.0-tidy php7.0-xmlrpc php7.0-xsl php7.0-apcu
        service apache2 restart
        apt-get -y install libjson-perl
        apt-get -y install perl-doc
        mysql_secure_installation

	
	fi 

	if [ "$release" == "debian" ]; then

	apt-get update
        apt-get upgrade
        apt-get -y install curl
        apt-get -y install unzip
        echo "deb http://nginx.org/packages/debian/ `lsb_release -cs` nginx" >> /etc/apt/sources.list.d/nginx.list
        echo "deb-src http://nginx.org/packages/debian/ `lsb_release -cs` nginx" >> /etc/apt/sources.list.d/nginx.list
        curl http://nginx.org/keys/nginx_signing.key | apt-key add -
        apt-get update
        apt-get -y install mariadb-server mariadb-client
        apt-get -y install apache2
        apt-get -y install php libapache2-mod-php
        apt-get -y install php5 libapache2-mod-php5
        apt-get -y install php-mysqlnd php-curl php-gd php-intl php-pear php-imagick php-imap php-mcrypt php-memcache php-pspell php-recode php-sqlite php-tidy php-xmlrpc php-xsl php-apcu
        apt-get -y install php5-mysqlnd php5-curl php5-gd php5-intl php5-pear php5-imagick php5-imap php5-mcrypt php5-memcache php5-pspell php5-recode php5-sqlite php5-tidy php5-xmlrpc php5-xsl php5-apcu
        apt-get -y install php7.0-mysqlnd php7.0-curl php7.0-gd php7.0-intl php7.0-pear php7.0-imagick php7.0-imap php7.0-mcrypt php7.0-memcache php7.0-pspell php7.0-recode php7.0-sqlite php7.0-tidy php7.0-xmlrpc php7.0-xsl php7.0-apcu
        service apache2 restart
        apt-get -y install libjson-perl
        apt-get -y install perl-doc
        mysql_secure_installation

	fi


}

startingNote(){

echo -e "\n\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<STARTING INSTALLATION>>>>>>>>>>>>>>>>>>>>>>>>>>\n\nWelcome to the VirtuOps™ Pilot installer.\n\nThis script will guide you through your installation.  It will only take a few minutes if you have all of the pre-requisites satisfied, which we will show you below or you can read about at https://www.virtuops.com/pilot-prerequisites.\n\nAfter installation, you need to get a license.txt file and put it in <web path>/app/license.txt after installation.  The license file should be in <installdir>/app/license.txt.\n\nIf you need a subscription, go to https://www.virtuops.com and select Support -> Contact Us.\n"

}

updateCron(){

cp updateactions_sh updateactions.sh

if [ $dbuser ]; then
	replaceCmd "USER" "$dbuser" "updateactions.sh"
	replaceCmd "PASS" "$dbpass" "updateactions.sh"
	replaceCmd "DB" "$db" "updateactions.sh"
else
	replaceCmd "USER" "$user" "updateactions.sh"
	replaceCmd "PASS" "$password" "updateactions.sh"
	replaceCmd "DB" "$db" "updateactions.sh"
fi


echo -e "Now we need to update cron.  We are going to add a line that updates your tasks in the actiontext section.\n"
echo -e "WE ARE SETTING UP THE CRON SCHEDULER WITH THE DEFAULT USER AND PASS.  IF YOU CHANGE THE ADMIN PASSWORD,  YOU WILL NEED TO UPDATE CRON.\n"

crontab -l > crontemp.txt

cronsize=`wc -c < crontemp.txt`

if [ $cronsize == '0' ]; then
echo "* * * * * /bin/bash ${PWD}/updateactions.sh 2> /dev/null >&1" > crontemp.txt
echo "* * * * * ${PHPPATH} ${BASEDIR}/app/server/admin/wfcron.php 'admin' 'admin' > /dev/null 2>&1" > crontemp.txt
else
sed -i -e "\$a* * * * * /bin/bash ${PWD}/updateactions.sh 2> /dev/null >&1" crontemp.txt
sed -i -e "\$a* * * * * ${PHPPATH} ${BASEDIR}/app/server/admin/wfcron.php 'admin' 'admin' 2> /dev/null >&1" crontemp.txt
fi 

crontab crontemp.txt
rm -f crontemp.txt

}

beginInstallNote() {
	echo -e "\nOk, begin installation \n"
	echo -e "\nIn order to continue, you will need to have/do the following:  \n1)  Make sure you have PHP 5.5 or higher installed AND date.timezone is set. \n2)  Have MariaDB 10.x or higher. \n3)  Have PERL 5.8 or higher and JSON module with perldoc in your path \n4)  Have unzip in your path \n5)  Have MariaDB 10.x credentials that allow you to create a database, tables, and a user. \n\n\n"
	echo -e "Have you met all of these prerequisites (y|n)? \n"

	read prereq
        if [ "$prereq" != 'y' ] && [ "$prereq" != 'Y' ] && [ "$prereq" != 'Yes' ] && [ "$prereq" != 'yes' ] && [ "$prereq" != 'YES' ]
        then
		read -p "What OS do you want to install pre-reqs for (centos6/centos7/ubuntu/debian)?" release
		installPreReqs	
	fi

}

testHTTP(){
HTTPD=`which httpd`
APACHE2=`which apache2`	
if [ ! -f $HTTPD ] && [ ! -f $APACHE2 ]; then
	echo -e "Cannot find the httpd server using 'which httpd' or 'which apache2'.  Please install httpd.\n"
else
	echo -e "Found httpd at $HTTPD$APACHE2, moving on....\n"
fi
}

testPHP(){
	echo -e "\nOk, checking PHP version now \n"
        PHPMAJ=`php -v | grep 'PHP ' | egrep 'built|cli' | awk '{print $2}' | cut -d. -f1 2> /dev/null`
        PHPMIN=`php -v | grep 'PHP ' | egrep 'built|cli' | awk '{print $2}' | cut -d. -f2 2> /dev/null`

        if [ ${PHPMAJ} -lt 5 ]
        then
                echo -e "\nYour PHP version is not at least 5.5.  Please upgrade your PHP at least 5.5.  Exiting\n";
                exit
        fi
        if [ ${PHPMAJ} -eq 5 ] && [ ${PHPMIN} -lt 5 ]
        then
                echo -e "\nYour PHP version is above 5.x, but not at least 5.5.  Please upgrade your PHP to at least 5.5.  Exiting \n";
                exit
        fi
        echo -e "\nYour PHP version is 5.5 or greater -- $PHPMAJ.$PHPMIN, we can continue \n"
}

unzipTest() {

        UNZIPPATH=`which unzip`
        if [ ! -f $UNZIPPATH ]
        then
                read -p "Please enter the full path of your unzip utility (usually /usr/bin/unzip): " UNZIPFILE
                if [ ! -f $UNZIPFILE ]
                then
                        echo -e "\nCannot find unzip utility at: ${UNZIPFILE}. Exiting\n"
                        exit
                fi
        fi
}

phpTest(){
	PHPPATH=`which php`
        if [ $? -ne 0 ]
        then
                read -p "Please enter the full path of PHP5.5+ : " PHPPATH
                $PHPPATH
                if [ $? -ne 0 ]
                then
                        echo -e "\nCannot find php at: ${PHPPATH}. Exiting\n"
                        exit
                fi
        fi
}

curlTest(){
	CURLPATH=`which curl`
        if [ ! -f ${CURLPATH} ]
        then
                read -p "Please enter the full path of curl : " CURLFILE
                if [ ! -f ${CURLFILE} ]
                then
                        echo -e "\nCannot find curl at: ${CURLFILE}. Exiting\n"
                        exit
                fi
        fi
}

perlDocTest(){
	PERLDOCPATH=`which perldoc`
        if [ ! -f $PERLDOCPATH ]
        then
                read -p "Please enter the full path of your perldoc utility (usually /usr/bin/perldoc): " PERLDOCFILE
                if [ ! -f $PERLDOCFILE ]
                then
                        echo -e "\nCannot run perldoc utility at: ${PERLDOCFILE}. Exiting\n"
                        exit
                fi
        fi
}

jsonModTest(){
	JSONMOD=`$PERLDOCPATH -l JSON`
        echo -e "Perl JSON Mod: ${JSONMOD}\n";
        if [ ${JSONMOD} == 'No documentation found for "JSON".' ]
        then
                echo -e "\nJSON PERL module not installed.  Please do a yum install or install via CPAN then rerun the installer\n"
                exit
        fi
}

setBaseDir(){
	# Put the basedir in the config.ini
	BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"
	replaceCmd "basedir = .*" "basedir = \"${BASEDIR}\"" "../app/server/config.ini"
}

setWebPath(){

	echo -e "\n";
        read -p "Please enter the full web url for this instance.  Example - http://myserver.com/pilot  Example 2 - https://mysecureserver.com/pilot  Example 3 - http://mydiffport.com:8081/pilot.  MAKE SURE TO INCLUDE THE 'pilot' SUBDIR and change it if you are installing this into somewhere different than 'pilot': " WEBURLPATH

        echo -e "\n";
        read -p "Please enter the linux user that is running the web server (usually www-data or apache):  " WEBUSER
        echo -e "\n";
        read -p "Please enter the linux group for the user that is running the web server (usually www-data or apache):  " WEBGROUP
        echo -e "\n";
        chown -R $WEBUSER:$WEBGROUP $BASEDIR
}

setReadVars(){
	replaceCmd "unzip = .*" "unzip = \"${UNZIPPATH}\"" "../app/server/config.ini"
        replaceCmd "perldoc = .*" "perldoc = \"${PERLDOCPATH}\"" "../app/server/config.ini"
        replaceCmd "php = .*" "php = \"${PHPPATH}\"" "../app/server/config.ini"
        replaceCmd "curl = .*" "curl = \"${CURLPATH}\"" "../app/server/config.ini"
        replaceCmd "weburl = .*" "weburl = \"${WEBURLPATH}\"" "../app/server/config.ini"
}

dbParams(){
		dbclient=""
		user=""
		password=""
		host=""
		port=""
		db=""

		while [ ${#dbclient} -lt 1 ]
                do
                read -p "Please enter the full path of your DB client (usually /usr/bin/mysql): " dbclient
                done

                while [ ${#user} -lt 1 ]
                do
                read -p "Please enter the DB username that will connect to the VirtuOps™ Pilot database: " user
                done

                while [ ${#password} -lt 1 ]
                do
                read -p "Please enter the DB password for ${user}: " password
                done

                while [ ${#host} -lt 1 ]
                do
                read -p "Please enter the DB hostname (localhost, IP or FQDN of DB host): " host
                done

                while [ ${#port} -lt 1 ]
                do
                read -p "Please enter the DB port (usually 3306): " port
                done

                while [ ${#db} -lt 1 ]
                do
                read -p "Please enter the Database name for VirtuOps™ Pilot (usually pilot): " db
                done
}

connectionSuccess(){
	echo -e "Connection SUCCESS!\n"
        echo -e "\nVirtuOps™ Pilot will connect to database ${db} using the following information.";
        echo -e "  Mysql client: ${dbclient}";
        echo -e "  Hostname: ${host}";
        echo -e "  DB Name: ${db}";
        echo -e "  Port: ${port}";
        echo -e "  User: ${user}";
        echo -e "  Password: ${password}";
        replaceCmd "dbname = .*" "dbname = \"${db}\"" "../app/server/config.ini"
        replaceCmd "dbhost = .*" "dbhost = \"${host}\"" "../app/server/config.ini"
        replaceCmd "dbuser = .*" "dbuser = \"${user}\"" "../app/server/config.ini"
        replaceCmd "dbpass = .*" "dbpass = \"${password}\"" "../app/server/config.ini"
        replaceCmd "dbport = .*" "dbport = \"${port}\"" "../app/server/config.ini"
	
	# updateactions_sh updates and cp to updateactions.sh

}

dbTests(){

	while ! $dbclient -u$user -p$password -h $host -P $port  -A $db -e ";"; do
	echo -e "\nWe do not have working mysql params yet, please enter them now and make sure MariaDB is installed and running\n"
		dbParams
	done

	connectionSuccess
}

dbInstall(){
	dbParams
        read -p "[OPTIONAL] If you want a different database user to access the pilot db, enter it here or just press the ENTER key to leave it blank: " dbuser

	`${dbclient} -u${user} -p${password} -e "drop database if exists ${db}"`
        if [ ! $? -eq 0 ] 
	then 
		echo -e "\nError $?: Could not remove existing database ${db}. Please examine your DB settings and run the installer again."
		exit
	fi

	`${dbclient} -u${user} -p${password} -e "create database ${db}"`
        if [ ! $? -eq 0 ]; then 
		echo -e "\nError $?: Could not create database ${db}. Please examine your DB settings and run the installer again."
		exit
	fi

	`${dbclient} -u${user} -p${password} ${db}  < pilot.sql`
         if [ ! $? -eq 0 ]; then 
		echo -e "\nError $?: Could not populate database ${db}. Please examine your DB settings and run the installer again."
	exit
	fi

        replaceCmd "dbname = .*" "dbname = \"${db}\"" "../app/server/config.ini"
        replaceCmd "dbhost = .*" "dbhost = \"${host}\"" "../app/server/config.ini"
        replaceCmd "dbuser = .*" "dbuser = \"${user}\"" "../app/server/config.ini"
        replaceCmd "dbpass = .*" "dbpass = \"${password}\"" "../app/server/config.ini"
        replaceCmd "dbport = .*" "dbport = \"${port}\"" "../app/server/config.ini"

	if [ ${dbuser} ]
	then
		read -p "[OPTIONAL] Enter the password for ${dbuser}: " dbpass
		dbSqlUpdates
	fi

	#
	# Need to do this part because mysql will only listen on the local loopback.  It will not be able to listen 
	# on any inbound traffic, which means failover and clustering won't work.
	#

	for i in `find /etc -name "*.cnf"`;  do
        	replaceCmd "bind-address" "#bind-address" $i
	done

	if [ -f /etc/init.d/mysql ]; then
		/etc/init.d/mysql restart
	else
		systemctl restart mysql
	fi

}

dbSqlUpdates(){
		replaceCmd "dbuser = .*" "dbuser = \"${dbuser}\"" "../app/server/config.ini"
                replaceCmd "dbpass = .*" "dbpass = \"${dbpass}\"" "../app/server/config.ini"

		`${dbclient} -u${user} -p${password} -e "GRANT SELECT ON ${db}.* TO '${dbuser}'@'${host}' IDENTIFIED BY '${dbpass}'"`;
                if [ ! $? -eq 0 ]; then 
			echo "\nError $?: Could not grant permissions on ${db} to ${dbuser} on host ${host}. Please examine your DB settings and run the installer again."
			exit
		fi
		`${dbclient} -u${user} -p${password} -e "GRANT INSERT ON ${db}.* TO '${dbuser}'@'${host}' IDENTIFIED BY '${dbpass}'"`;
                if [ ! $? -eq 0 ]; then 
			echo "\nError $?: Could not grant permissions on ${db} to ${dbuser} on ${host}. Please examine your DB settings and run the installer again."
			exit
		fi
		`${dbclient} -u${user} -p${password} -e "GRANT UPDATE ON ${db}.* TO '${dbuser}'@'${host}' IDENTIFIED BY '${dbpass}'"`;
                if [ ! $? -eq 0 ]; then 
			echo "\nError $?: Could not grant permissions on ${db} to ${dbuser} on ${host}. Please examine your DB settings and run the installer again."
			exit
		fi
		`${dbclient} -u${user} -p${password} -e "GRANT DELETE ON ${db}.* TO '${dbuser}'@'${host}' IDENTIFIED BY '${dbpass}'"`;
                if [ ! $? -eq 0 ]; then 
			echo "\nError $?: Could not grant permissions on ${db} to ${dbuser} on ${host}. Please examine your DB settings and run the installer again."
			exit
		fi
}

installLb(){
	
	read -p "This will install an nginx loadbalancer on this server.  It will write a new config to /etc/nginx/nginx.conf.  Continue (y/n)? " instlb

	if [ "$instlb" == "yes" ] || [ "$instlb" == "y" ] || [ "$instlb" == "Yes" ] || [ "$instlb" == "YES" ]
	then
		
	apt-get install nginx

	TESTLB=`which nginx 2> /dev/null`

		if [ -e ${TESTLB} ]
		then
			echo -e "\nThis server is now a load balancer.  Use the Admin menu to configure the load balancer as well as add cluster members\n"
			updateLbConfig
		else
			echo -e "Something went wrong with the load balancer install.  Please look at the output and try to do a yum install -y nginx.x86_64 nginx-all-modules.noarch from the command line\n"
			exit
		fi
	else
		updateCron
		finishInstall		
	fi
}

finishInstall(){
echo -e "\nCongratulations!  You have successfully installed VirtuOps™ Pilot.  Now open a browser and go to ${WEBURLPATH} to log in"
exit

}


updateLbConfig(){

	if [ -f /etc/nginx/conf.d/default.conf ];then
	mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.orig_conf
	fi

	read -p "Is this loadbalancer running http or https (http/https)? " lbproto

	while [ "$lbproto" != "https" ] && [ "$lbproto" != "HTTPS" ] && [ "$lbproto" != "http" ] && [ "$lbproto" != "HTTP" ]
	do 
	read -p "Need http or https: " lbproto
	done	

	read -p "What port should this balancer listen on? " lbport
	read -p "What is this server's hostname? " lbhost
	read -p "Where does the error log go? " lberror
	read -p "Where does the access log go? " lbaccess
	read -p "If SSL, what is the path to the SSL certificate (leave blank if not ssl)? " lbsslcert
	read -p "If SSL, what is the path to the SSL key (leave blank if not ssl)? " lbsslkey

	if [ "$lbproto" == "http" ] || [ "$lbproto" == "HTTP" ]
	then
	cp -rp lb.conf lb.conf.tmp
	replaceCmd "PORT" "${lbport}" "lb.conf.tmp"
	replaceCmd "ERROR_LOG" "${lberror}" "lb.conf.tmp"
	replaceCmd "ACC_LOG" "${lbaccess}" "lb.conf.tmp"
	replaceCmd "SERVER" "${lbhost}" "lb.conf.tmp"
	mv lb.conf.tmp /etc/nginx/nginx.conf
	fi

	if [ "$lbproto" == "https" ] || [ "$lbproto" == "HTTPS" ]
        then
	cp -rp lb.ssl.conf lb.ssl.conf.tmp
        replaceCmd "PORT" "${lbport}" "lb.ssl.conf.tmp"
        replaceCmd "ERROR_LOG" "${lberror}" "lb.ssl.conf.tmp"
        replaceCmd "ACC_LOG" "${lbaccess}" "lb.ssl.conf.tmp"
        replaceCmd "SERVER" "${lbhost}" "lb.ssl.conf.tmp"
        replaceCmd "SSL_CERT" "${lbsslcert}" "lb.ssl.conf.tmp"
        replaceCmd "SSL_KEY" "${lbsslkey}" "lb.ssl.conf.tmp"
	mv lb.ssl.conf.tmp /etc/nginx/nginx.conf
	fi

	systemctl enable nginx	
	restartLb
}

restartLb(){

if [ -e /etc/init.d/nginx ]; then
	/etc/init.d/nginx restart
	echo -e "Load balancer config updated and load balancer restarted\n"
else
	systemctl restart nginx
	echo -e "Load balancer config updated and load balancer restarted\n"
fi

}

exitInstall() {
echo -e "\nYou've chosen to exit installation. To continue installation, please run the VirtuOps™ Pilot install script again.\n"
exit
}

startingNote

echo -e "Do you wish to install VirtuOps™ Pilot on this machine (y|n)? \n"
read yn

if [ "$yn" == 'Yes' ] || [ "$yn" == 'Y' ] || [ "$yn" == 'y' ] || [ "$yn" == 'yes' ]
then 
	beginInstallNote
	testHTTP
	testPHP
	unzipTest
	phpTest
	curlTest
	perlDocTest
	jsonModTest
	setBaseDir
	setWebPath
	setReadVars

	read -p "Are you Installing a DB (y/n)?  If connecting to an existing one, type no " install
	if [ $install == 'y' ] || [ $install == 'yes' ] || [ $install == 'Yes' ] || [ $install == 'YES' ]
	then
	dbInstall
	else
	dbTests
	fi

	read -p "Is this server a load balancer (if just a cluster member, type no)? " lb
	if [ $lb == 'y' ] || [ $lb == 'yes' ] || [ $lb == 'Yes' ] || [ $lb == 'YES' ]
	then
	installLb
	updateCron
	finishInstall
	else 
	updateCron
	finishInstall
	fi

else
	exitInstall

fi

