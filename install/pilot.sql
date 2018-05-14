-- MySQL dump 10.16  Distrib 10.1.10-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: __DB__
-- ------------------------------------------------------
-- Server version	10.1.10-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `__DB__`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `__DB__` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `__DB__`;

--
-- Table structure for table `auth_servers`
--

DROP TABLE IF EXISTS `auth_servers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_servers` (
  `host` varchar(64) NOT NULL,
  `port` int(11) NOT NULL,
  `organization` varchar(64) NOT NULL,
  `type` varchar(24) NOT NULL,
  PRIMARY KEY (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_servers`
--

LOCK TABLES `auth_servers` WRITE;
/*!40000 ALTER TABLE `auth_servers` DISABLE KEYS */;
INSERT INTO `auth_servers` VALUES ('',0,'','ldap');
/*!40000 ALTER TABLE `auth_servers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_perms`
--

DROP TABLE IF EXISTS `group_perms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_perms` (
  `groupid` varchar(48) NOT NULL,
  `permission` varchar(48) NOT NULL,
  `value` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_perms`
--

LOCK TABLES `group_perms` WRITE;
/*!40000 ALTER TABLE `group_perms` DISABLE KEYS */;
INSERT INTO `group_perms` VALUES ('admingroup','deleteproblems',1),('admingroup','resolveproblems',1),('admingroup','unresolveproblems',1);
/*!40000 ALTER TABLE `group_perms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_runbooks`
--

DROP TABLE IF EXISTS `group_runbooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_runbooks` (
  `groupid` varchar(128) NOT NULL,
  `runbookid` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_runbooks`
--

LOCK TABLES `group_runbooks` WRITE;
/*!40000 ALTER TABLE `group_runbooks` DISABLE KEYS */;
INSERT INTO `group_runbooks` VALUES ('admingroup','NHP'),('admingroup','WFTasks');
/*!40000 ALTER TABLE `group_runbooks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `groupid` varchar(48) NOT NULL,
  `groupname` varchar(48) NOT NULL,
  PRIMARY KEY (`groupid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES ('admingroup','Admin Group');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logs` (
  `logdate` datetime DEFAULT NULL,
  `logmsg` mediumtext,
  `debuglevel` int(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `runbooks`
--

DROP TABLE IF EXISTS `runbooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `runbooks` (
  `runbookid` varchar(128) NOT NULL,
  `runbookname` varchar(128) NOT NULL,
  `runbookdescription` text,
  PRIMARY KEY (`runbookid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `runbooks`
--

LOCK TABLES `runbooks` WRITE;
/*!40000 ALTER TABLE `runbooks` DISABLE KEYS */;
INSERT INTO `runbooks` VALUES ('WFTasks','WF Tasks','Tasks that pertain to all workflows');
/*!40000 ALTER TABLE `runbooks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_logs`
--

DROP TABLE IF EXISTS `task_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task_logs` (
  `taskname` varchar(128) DEFAULT NULL,
  `runbookid` varchar(128) DEFAULT NULL,
  `username` varchar(48) DEFAULT NULL,
  `actionfilename` varchar(128) DEFAULT NULL,
  `taskstarttime` datetime DEFAULT NULL,
  `tasktime` float(12,6) DEFAULT NULL,
  `taskserial` varchar(48) NOT NULL,
  `taskpid` int(8) DEFAULT NULL,
  `taskstatus` varchar(24) DEFAULT NULL,
  `taskexit` varchar(64) DEFAULT NULL,
  `taskoutput` mediumtext,
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `taskerror` mediumtext,
  `taskmetadata` mediumtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `taskserial` (`taskserial`)
) ENGINE=InnoDB AUTO_INCREMENT=261 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_logs`
--

LOCK TABLES `task_logs` WRITE;
/*!40000 ALTER TABLE `task_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_runbooks`
--

DROP TABLE IF EXISTS `task_runbooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task_runbooks` (
  `taskname` varchar(128) NOT NULL,
  `runbookid` varchar(128) NOT NULL,
  `taskorder` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_runbooks`
--

LOCK TABLES `task_runbooks` WRITE;
/*!40000 ALTER TABLE `task_runbooks` DISABLE KEYS */;
INSERT INTO `task_runbooks` VALUES ('VP Read Data','WFTasks',1),('VP Email Task','WFTasks',2),('VP Ping Device','WFTasks',3),('VP Empty File','WFTasks',4),('VP REST Query','WFTasks',5),('VP DNS Device','WFTasks',6),('VP Count File Rows','WFTasks',7),('VP Write To File','WFTasks',8),('VP MySQL Query','WFTasks',9);
/*!40000 ALTER TABLE `task_runbooks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `taskname` varchar(128) NOT NULL,
  `urlparams` varchar(1024) DEFAULT NULL,
  `userparams` varchar(1024) DEFAULT NULL,
  `actiontext` mediumtext NOT NULL,
  `actionlanguage` varchar(24) DEFAULT NULL,
  `actionfilename` varchar(128) DEFAULT NULL,
  `taskdescription` mediumtext,
  `datatype` varchar(24) DEFAULT NULL,
  `jprop` varchar(512) DEFAULT NULL,
  `fieldseparator` varchar(8) DEFAULT NULL,
  `recordseparator` varchar(8) DEFAULT NULL,
  `outputfields` mediumtext,
  `outputactions` mediumtext,
  PRIMARY KEY (`taskname`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES ('VP Count File Rows','filename','','#\r\n#\r\n#  Writes data to a file for later use, one line at a time.\r\n#\r\n#\r\n\r\nuse strict;\r\nuse warnings;\r\nuse JSON;\r\nuse Getopt::Long;\r\n\r\nmy $filename=\'\';\r\nmy %output;\r\n\r\nGetOptions(\r\n        \"filename=s\" => \\$filename\r\n        );\r\n\r\nopen (FILEDATA,\"$filename\") || die \"{\\\"status\\\":\\\"Cannot open or write to \".$filename.\"\\\"}\\n\";\r\n\r\nfor (<FILEDATA>) {\r\n$output{\'status\'} = \"$.\";\r\n}\r\n\r\nmy $json = encode_json(\\%output);\r\nprint $json;\r\nclose (FILEDATA);\r\n','perl','countfilerows.pl','Synopsis:  Utility that counts rows of data in a file.\r\n\r\nInput param:  \r\nfilename = File name to count rows.  MAKE SURE that the file is readable by the web server user\r\n\r\nOutput param:  status\r\nOutput values:  <integer value of rows>, <error, something like Cannot read...>\r\n\r\nSample Params Config (fill in over on the left): \r\n{\r\n\"filename\":\"/var/www/html/nochero/tmp/files/cooloutput.txt\"\r\n}','JSON','','','','#ID, TYPE, PARAM, REQUIRED, CAPTION, STYLE\r\nfilename, text,  true, true, Filename, style=\"width: 300px\"\r\nstatus,  text,  false, true, Status, style=\"width: 300px\"',''),('VP Create Dir','dirname','','#\r\n#\r\n# Makes a directory\r\n#\r\n\r\nuse strict;\r\nuse warnings;\r\nuse Data::Dumper;\r\nuse JSON;\r\nuse File::Path qw(make_path);\r\nuse Getopt::Long;\r\n\r\n\r\nmy %output;\r\nmy ($status,$dirname);\r\n\r\nGetOptions(\r\n                \"dirname=s\" => \\$dirname\r\n        );\r\n\r\nmy @created = make_path($dirname);\r\n\r\n$output{\'createdir\'} = \\@created;\r\n\r\nmy $json = encode_json(\\%output);\r\nprint $json;\r\n','perl','createdir.pl','Synopsis:  Creates a directory\r\n\r\nInput params: \r\ndirname = full path to the new dir you want to create\r\n\r\nOutput param:  status\r\n\r\nOutput values:  OK, FAIL\r\n\r\nSample Params Config (fill in over on the left): \r\n{\r\n\"dirname\":\"/var/www/html/pilotv2/tmp/files/newdir\"\r\n}','JSON','','','','',''),('VP DB2 Query','host,user,password,database,query,port,queryoutput,db2lib,ldlibrarypath,db2home','','#\r\n# Using a SQL query as input, this action needs to output a single row of data that will be stored in \"output\".\r\n#\r\n=begin REMOVE THIS WHEN YOU HAVE DB2 drivers installed and you have your Apache SetEnv LD_LIBRARY_PATH pointed at the db2 driver libs\r\nuse strict;\r\nuse warnings;\r\nuse Data::Dumper;\r\nuse JSON;\r\nuse DBI;\r\nuse DBD::DB2;\r\nuse Getopt::Long;\r\n\r\nmy %output;\r\nmy ($status,$user,$password,$database,$query,$host,$port,$queryoutput,$arrayname,$db2home,$db2lib,$ldlibrarypath);\r\n\r\nGetOptions(\r\n                \"user=s\" => \\$user,\r\n                \"password=s\" => \\$password,\r\n                \"database:s\" => \\$database,\r\n                \"host=s\" => \\$host,\r\n                \"query=s\" => \\$query,\r\n                \"port:s\" => \\$port,\r\n                \"queryoutput:s\" => \\$queryoutput,\r\n                \"arrayname=s\" => \\$arrayname,\r\n                \"db2home=s\" => \\$db2home,\r\n                \"db2lib=s\" => \\$db2lib,\r\n                \"ldlibrarypath=s\" => \\$ldlibrarypath,\r\n        );\r\n\r\n$ENV{\'DB2LIB\'} = $db2lib;\r\n$ENV{\'DB2_HOME\'} = $db2home;\r\n$ENV{\'LD_LIBRARY_PATH\'} = $ldlibrarypath;\r\n\r\n\r\nopen (FILEDATA,\"+> $queryoutput\") || die \"Cannot open file.\";\r\n\r\nmy $dsn = \"DATABASE=$database; HOSTNAME=$host; PORT=$port; PROTOCOL=TCPIP; UID=$user; PWD=$password;\";\r\n\r\nprint \"$dsn\\n\";\r\nmy $dbh = DBI->connect(\"dbi:DB2:$dsn\", $user, $password) || die \"Connection failed with error: $DBI::errstr\";\r\n\r\nmy $sth = $dbh->prepare($query);\r\n$sth->execute();\r\n\r\nmy @data;\r\nif ($sth->errstr()) {\r\n        $output{\'status\'} = $sth->errstr();\r\n} else {\r\n        $output{\'status\'} = \'OK\';\r\n        while(my $ref = $sth->fetchrow_hashref)\r\n        {\r\n        push (@data, $ref);\r\n        }\r\n}\r\n\r\n$output{\"$arrayname\"} = \\@data;\r\nmy $data = encode_json(\\@data);\r\nprint FILEDATA ($data);\r\n\r\nmy $json = encode_json(\\%output);\r\nprint $json;\r\nclose (FILEDATA);\r\n=end REMOVE THIS WHEN YOU HAVE DB2 drivers installed and DBD::DB2 installed properly.','perl','db2query.pl','Synopsis:  Performs query of DB2.  Note, you must have DB2 drivers that you are properly licensed\r\nfor in order to use this task.  DBD::DB2 is required however it is not pre-loaded with VirtuOps \r\nPilot.  To install DB2 drivers and to install DBD::DB2 module, go to \r\nhttp://www-01.ibm.com/support/docview.wss?rs=71&uid=swg21297335\r\n\r\nInput params: \r\nuser = string for the DB2 user credentials\r\npassword = string for the DB2 Password credentials\r\ndatabase = database you are connecting to (usually the Schema, like DB2INST1\r\ndb2lib = Full path to your DB2LIB dir\r\ndb2home = Full path to the drivers for db2\r\nldlibrarypath = The LD_LIBRARY_PATH ENV variable that includes\r\narrayname = Name of the returned array that will become part of the workflow variables (wfv)\r\nhost = db2 host \r\nport = db2 port \r\nquery = db2 query  \r\nqueryoutput = For select statements, store the output in a file.  \r\n\r\nOutput param:  status\r\n\r\nOutput values:  OK,<db2 error code>\r\n\r\nSample Params Config (fill in over on the left): \r\n{\r\n\"user\":\"user\",\r\n\"password\":\"pass\",\r\n\"database\":\"schema\",\r\n\"db2lib\":\"/path/to/db2/libs\",\r\n\"db2home\":\"/path/to/db2/drivers\",\r\n\"ldlibrarypath\":\"/path/to/libs/including/db2/libs\",\r\n\"host\":\"corpmysql.company.com\",\r\n\"arrayname\":\"db2output\",\r\n\"port\":\"50000\",\r\n\"query\":\"select * from sometable where somecolumn LIKE somevalue\",\r\n\"queryoutput\":\"/var/www/html/pilot/tmp/files/someoutput.txt\"\r\n}','JSON','','','','',''),('VP DNS Device','host','','#\r\n#\r\n# DNS FORM for NOC HERO\r\n\r\n\r\nuse strict;\r\nuse warnings;\r\nuse Net::DNS;\r\nuse Getopt::Long;\r\nuse JSON;\r\n\r\nmy $host=\'\';\r\nmy $res;\r\nmy %output;\r\n\r\nGetOptions(\"host=s\" => \\$host);\r\n$res = Net::DNS::Resolver->new();\r\nmy $reply = $res->search($host);\r\n\r\nif ($reply) {\r\n        foreach my $rr ($reply->answer) {\r\n\r\n        next unless $rr->type eq \"A\" || $rr->type eq \"PTR\";\r\n\r\n                if ($rr->type eq \"A\") {\r\n                my $ipaddr = $rr->address;\r\n                $output{\'host\'} = $host;\r\n                $output{\'status\'} = \"IP: $ipaddr\";\r\n                } elsif ($rr->type eq \"PTR\") {\r\n                my $name = $rr->ptrdname;\r\n                $output{\'host\'} = $host;\r\n                $output{\'status\'} = \"Name: $name\";\r\n\r\n                }\r\n\r\n        }\r\n} else {\r\n        $output{\'host\'} = $host;\r\n        $output{\'status\'} = \"QUERY FAILED!\";\r\n}\r\n\r\nmy $result = encode_json(\\%output);\r\nprint $result;\r\n','perl','dnsdevice.pl','Synopsis:  Perform DNS Query and get a result back.\r\n\r\nInput param:  host\r\nInput value expected:  FQDN or IP address\r\n\r\nOutput param:  status\r\nOutput values:  IP: <IP address>, Name:<FQDN>, QUERY FAILED!\r\n\r\nSample Params Config (fill in over on the left): \r\n{\r\n\"host\":\"10.23.16.193\"\r\n}','JSON','','','','#ID, TYPE, PARAM, REQUIRED, CAPTION, STYLE\r\nhost, text,  true, true, Host, style=\"width: 300px\"\r\nstatus,  text,  false, true, Status, style=\"width: 300px\"',''),('VP Email Task','smtpuser,smtppassword,smtpport,smtpserver,recipient,subject,body','','#\r\n# Sends secure email using SMTPS.  Must have Net::SMTPS loaded and accessible to the web server user\r\n# Form requires recipient,subject,body and message fields.  The message field will catch errors\r\n# \r\n#\r\n\r\nuse strict;\r\nuse warnings;\r\nuse JSON;\r\nuse Getopt::Long;\r\nuse Net::SMTPS;\r\n\r\nmy ($smtpserver, $smtpport, $smtpuser, $smtppassword, $recipient,$subject,$body);\r\n\r\nmy $debugerr;\r\nmy $debugout;\r\nmy %output;\r\n\r\nGetOptions(\r\n        \"smtpserver=s\" => \\$smtpserver,\r\n        \"smtpport=s\" => \\$smtpport,\r\n        \"smtpuser=s\" => \\$smtpuser,\r\n        \"smtppassword=s\" => \\$smtppassword,\r\n        \"recipient=s\" => \\$recipient,\r\n		\"subject=s\" => \\$subject,\r\n		\"body=s\" => \\$body\r\n		);\r\n\r\nif (! $recipient || ! $subject || ! $body)\r\n{\r\n  $output{\'status\'} = \"You need a recipient, subject and body\";\r\n  \r\n} \r\n\r\n#my $smtpserver = \'smtp.gmail.com\';\r\n#my $smtpport = 587;\r\n#my $smtpuser   = \'<<<<USER THAT CAN LOG INTO SMTP SERVER>>>>>\';\r\n#my $smtppassword = \'<<<<USER PASSWORD>>>>>\';\r\n\r\nmy $smtp = Net::SMTPS->new($smtpserver, Port=>$smtpport, doSSL => \'starttls\', Timeout => 10, Debug => 0);\r\n\r\ndie \"Could not connect to server!\\n\" unless $smtp;\r\n\r\n$smtp->auth($smtpuser, $smtppassword);\r\n$smtp->mail(\'support@virtuops.com\');\r\n$smtp->to($recipient);\r\n$smtp->data();\r\n$smtp->datasend(\"Subject: $subject\");\r\n$smtp->datasend(\"\\n\");\r\n$smtp->datasend(\"$body\");\r\n$smtp->datasend(\"\\n\");\r\n$smtp->dataend();\r\nmy @msgs = $smtp->message();\r\n$smtp->quit;\r\n\r\n\r\nforeach my $msg (@msgs) {\r\n        if ($msg =~ /OK/) {\r\n                $output{\'status\'} = \"Message Sent\";\r\n        } else {\r\n				$output{\'status\'} = \"FAILURE:  Message Not Sent\";\r\n		}\r\n}\r\n\r\nmy $json = encode_json(\\%output);\r\nprint $json;\r\n','perl','email.pl','Synopsis:  Send an Email using SMTPS.  All fields are mandatory or your email will fail.\r\n\r\nInput params:  smtpuser,smtppassword,smtpserver,smtpport,recipient,subject,body\r\nInput values expected:\r\n   smtpuser = user that can log into email and send email (the sender)\r\n   smtppassword = user password\r\n   smtpserver = the mail server (something like smtp.gmail.com)\r\n   smtpport = secure port used (587 works on gmail as of 2017)\r\n   recipient = email address of person receiving email\r\n   subject = email subjectline\r\n   body = body of email\r\n\r\nOutput param:  status\r\nOutput values:  Message Sent, FAILURE:  Message Not Sent\r\n\r\nSample Params Config (fill in over on the left): \r\n{\r\n\"smtpuser\":\"me@company.com\",\r\n\"smtppassword\":\"em@1lp@55w0rd\",\r\n\"smtpserver\":\"smtp.gmail.com\",\r\n\"smtpport\":\"587\",\r\n\"recipient\":\"you@othercompany.com\",\r\n\"subject\":\"Some Email Subject\",\r\n\"body\":\"Here is an explanation of what is going on, I can really tell you a lot here.....\"\r\n}','JSON','','','','#ID, TYPE, PARAM, REQUIRED, CAPTION, STYLE\r\nstatus,  text,  false, true, Status:, style=\"width: 300px\"',''),('VP Empty File','filename','','#\r\n#\r\n#  Empties a file.   USE WITH CAUTION.  TEST THIS IN DEVELOPMENT FIRST\r\n#\r\n#\r\n\r\nuse strict;\r\nuse warnings;\r\nuse JSON;\r\nuse Getopt::Long;\r\n\r\nmy $filename=\'\';\r\nmy %output;\r\n\r\nGetOptions(\r\n        \"filename=s\" => \\$filename,\r\n        );\r\n\r\nopen (FILEDATA,\"+> $filename\") || die \"{\\\"status\\\":\\\"Cannot open or write to \".$filename.\"\\\"}\\n\";\r\n\r\n$output{\'status\'} = \'emptied\';\r\n$output{\'filename\'} = $filename;\r\nmy $json = encode_json(\\%output);\r\nprint $json;\r\n\r\nclose (FILEDATA);\r\n','perl','emptyfile.pl','Synopsis:  Empties a file.  Good if you want to clear a file you were writing to.   \r\nUSE CAUTION.  THIS EMPTIES A FILE.  TEST THIS IN DEV FIRST.\r\n\r\nInput param:  \r\nfilename = File name to empty.  MAKE SURE that the file is writable by the web server user\r\n\r\nOutput param:  status\r\nOutput values:  emptied, <error, something like Cannot write to...>\r\n\r\nSample Params Config (fill in over on the left): \r\n{\r\n\"filename\":\"/var/www/html/pilot/tmp/files/cooloutput.txt\",\r\n}','JSON','','','','#ID, TYPE, PARAM, REQUIRED, CAPTION, STYLE\r\nfilename, text,  true, true, Filename, style=\"width: 300px\"\r\nstatus,  text,  false, true, Status, style=\"width: 300px\"',''),('VP Generic Task','taskpath,arguments,arrayname,cmdoutput','','#\r\n#\r\n# Runs a generic command from the command line\r\n\r\nuse strict;\r\nuse warnings;\r\nuse Data::Dumper;\r\nuse JSON;\r\nuse Getopt::Long;\r\n\r\n\r\nmy %output;\r\nmy ($status,$taskpath,$arrayname,$arguments,$cmdoutput);\r\n\r\nGetOptions(\r\n                \"taskpath=s\" => \\$taskpath,\r\n                \"arguments:s\" => \\$arguments,\r\n                \"arrayname:s\" => \\$arrayname,\r\n                \"cmdoutput:s\" => \\$cmdoutput\r\n        );\r\n        \r\nif (length($cmdoutput) > 0){\r\n    open (CMDOUTPUT,\"+> $cmdoutput\") || die \"Cannot open generic task\";\r\n}\r\n\r\nmy $cmd = $taskpath;\r\n\r\nmy @args = split(\',\',$arguments);\r\n\r\nforeach my $arg (@args) {\r\n    \r\n    $cmd .= \" \".$arg.\" \";\r\n}\r\n\r\nmy $cmdout = `$cmd`;\r\n\r\n$output{\"$arrayname\"} = $cmdout;\r\n\r\nif (length($cmdoutput) > 0){\r\n    print CMDOUTPUT $cmdout;\r\n    close(CMDOUTPUT);\r\n}\r\n\r\nmy $json = encode_json(\\%output);\r\nprint $json;\r\n','perl','generictask.pl','Synopsis:  Runs a script from the command line\r\n\r\nInput params: \r\ntaskpath = full path to the task you want to run\r\narguments = arguments you want to pass to your task (optional)\r\narrayname = name of the array you want to hold JSON output that gets added to the wfv (optional)\r\ncmdoutput = file name you want to send output to (optional)\r\n\r\nOutput param:  status\r\n\r\nOutput values:  OK, FAIL\r\n\r\nSample Params Config (fill in over on the left): \r\n{\r\n\"taskpath\":\"/var/www/html/pilotv2/tmp/files/taskname.sh\",\r\n\"arguments\":\"something,something else,anotherthing,one more thing\",\r\n\"arrayname\":\"someoptionaloutput\",\r\n\"cmdoutput\":\"/var/www/html/pilot/tmp/files/someout.txt\"\r\n}','JSON','','','','',''),('VP MySQL Query','host,user,password,database,query,port,queryoutput,arrayname','','#\r\n#\r\n# Using a SQL query as input, this action needs to output a single row of data that will be stored in \"output\".\r\n#\r\n\r\nuse strict;\r\nuse warnings;\r\nuse Data::Dumper;\r\nuse JSON;\r\nuse DBI;\r\nuse DBD::mysql;\r\nuse Getopt::Long;\r\n\r\nmy %output;\r\nmy ($status,$user,$password,$arrayname,$database,$query,$host,$port,$queryoutput);\r\n\r\nGetOptions(\r\n                \"user=s\" => \\$user,\r\n                \"password=s\" => \\$password,\r\n                \"database:s\" => \\$database,\r\n                \"host=s\" => \\$host,\r\n                \"arrayname:s\" => \\$arrayname,\r\n                \"query=s\" => \\$query,\r\n                \"port:s\" => \\$port,\r\n                \"queryoutput:s\" => \\$queryoutput\r\n        );\r\n\r\nopen (FILEDATA,\"+> $queryoutput\") || die \"Cannot open file.\";\r\n\r\nmy $dbh = DBI->connect(\"DBI:mysql:database=$database;host=$host;port=$port\",\"$user\",\"$password\");\r\n\r\nmy $sth = $dbh->prepare($query);\r\n$sth->execute();\r\n\r\nmy @data;\r\nmy $count=0;\r\nif ($sth->errstr()) {\r\n        $output{\'status\'} = $sth->errstr();\r\n} else {\r\n        $output{\'status\'} = \'OK\';\r\n        while(my $ref = $sth->fetchrow_hashref)\r\n        {\r\n        push (@data, $ref);\r\n        $count++;\r\n        }\r\n}\r\n\r\n$dbh->disconnect;\r\n\r\nmy $meta = $arrayname.\"_meta\";\r\n$output{\"$arrayname\"} = \\@data;\r\n$output{\"$meta\"}{\"count\"} = $count;\r\nmy $data = encode_json(\\@data);\r\nprint FILEDATA ($data);\r\n\r\nmy $json = encode_json(\\%output);\r\nprint $json;\r\nclose (FILEDATA);','perl','mysqlquery.pl','Synopsis:  Performs query of MySQL, MariaDB or Aurora DB (MySQL).\r\n\r\nInput params: \r\nuser = string for the MySQL user credentials\r\npassword = string for the MySQL Password credentials\r\ndatabase = database you are connecting to  \r\nhost = mysql host \r\nport = mysql port \r\nquery = mysql query  \r\nqueryoutput = For select statements, store the output for use later.  \r\n\r\nOutput param:  status\r\n\r\nOutput values:  OK,<mysql error code>\r\n\r\nSample Params Config (fill in over on the left): \r\n{\r\n\"user\":\"mysqluser\",\r\n\"password\":\"mysqlpass\",\r\n\"database\":\"somedb\",\r\n\"host\":\"corpmysql.company.com\",\r\n\"port\":\"3306\",\r\n\"query\":\"select * from sometable where somecolumn LIKE somevalue\",\r\n\"queryoutput\":\"/var/www/html/pilot/tmp/files/someoutput.txt\"\r\n},\r\n	','JSON','','','','#ID, TYPE, PARAM, REQUIRED, CAPTION, STYLE\r\nstatus,  text,  false, true, Status, style=\"width: 300px\"',''),('VP Ping Device','host','','#\r\n# Ping a single device, bring back alive\r\n# Uses TCP Ping by default\r\n#\r\n\r\nuse strict;\r\nuse warnings;\r\nuse Net::Ping;\r\nuse Getopt::Long;\r\nuse JSON;\r\n\r\nmy $host=\'\';\r\nmy %output;\r\nGetOptions(\"host=s\" => \\$host);\r\n\r\n\r\nmy $p = Net::Ping->new();\r\nif ($p->ping($host)) {\r\n$output{\'host\'} = $host;\r\n$output{\'status\'} = \'alive\';\r\n} else {\r\n$output{\'host\'} = $host;\r\n$output{\'status\'} = \'unreachable\';\r\n}\r\n$p->close();\r\n\r\nmy $result = encode_json(\\%output);\r\n\r\nprint $result;\r\n','perl','ping.pl','Synopsis:  Ping a device and get a result back.\r\n\r\nInput param:  host\r\nInput value expected:  hostname or IP address\r\n\r\nOutput param:  status\r\nOutput values:  alive, unreachable\r\n\r\nSample Params Config (fill in over on the left): \r\n{\r\n\"host\":\"10.23.16.193\"\r\n}','JSON','','','','#ID, TYPE, PARAM, REQUIRED, CAPTION, STYLE\r\nhost, text,  true, true, Host, style=\"width: 300px\"\r\nstatus,  text,  false, true, Status, style=\"width: 300px\"',''),('VP Read Data','data, espression','','#\r\n#\r\n#  Reads incoming data from the API calls, does a search on the data.  This requires that you use a workflow variable (wfv).  It will read variables.\r\n#\r\n#\r\n\r\nuse strict;\r\nuse warnings;\r\nuse JSON;\r\nuse Getopt::Long;\r\n\r\nmy $data=\'\';\r\nmy $expression=\'\';\r\nmy %output;\r\n\r\n$output{\'status\'} = \'\';\r\n\r\nGetOptions(\r\n        \"data=s\" => \\$data,\r\n        \"expression=s\" => \\$expression\r\n        );\r\n\r\nmy $exp = qr/$expression/;\r\n\r\nif ($data =~ /$exp/i) {\r\n\r\n$output{\'status\'} = $1;\r\n\r\n} else {\r\n\r\n$output{\'status\'} = \'Expression not found\';\r\n}\r\n\r\nmy $json = encode_json(\\%output);\r\nprint $json;\r\n','perl','readdata.pl','Synopsis: This will read an incoming data string, search for a matching expression and return the expression.\r\n\r\nInput param:  \r\ndata = Incoming data from a wfv to search for\r\nexpression = An expression to match on and return.\r\n\r\nOutput param:  status\r\nOutput values:  Either an empty string or the return value specified in the parentheses\r\n\r\nSample Params Config (fill in over on the left): \r\n{\r\n\"data\":\"message\",\r\n\"expression\":\"(High CPU)\"\r\n}','JSON','','','','#ID, TYPE, PARAM, REQUIRED, CAPTION, STYLE\r\nstatus,  text,  false, true, Status, style=\"width: 300px\"',''),('VP REST Query','user,password,curlpath,url,method,header1,header2,header3,data,cmdoutput','','#\r\n# Performs a REST API query to an endpoint.\r\n#\r\n\r\nuse strict;\r\nuse warnings;\r\nuse JSON;\r\nuse Getopt::Long;\r\nuse Data::Dumper;\r\n\r\nmy %output;\r\n\r\nmy ($method,$header1,$header2,$header3,$arrayname,$curlpath,$user,$url,$password,$data,$cmdoutput,$status);\r\n\r\n\r\nGetOptions(\r\n        \"method=s\" => \\$method,\r\n        \"curlpath=s\" => \\$curlpath,\r\n        \"user:s\" => \\$user,\r\n        \"url=s\" => \\$url,\r\n        \"password:s\" => \\$password,\r\n        \"data:s\" => \\$data,\r\n        \"header1:s\" => \\$header1,\r\n        \"header2:s\" => \\$header2,\r\n        \"header3:s\" => \\$header3,\r\n        \"arrayname:s\" => \\$arrayname,\r\n        \"cmdoutput:s\" => \\$cmdoutput\r\n        );\r\n\r\nopen (FILEDATA,\"+> $cmdoutput\");\r\n\r\n#my $createcmd = $curlpath.\" -s -X \".$method.\" -H \'Content-Type: application/json\' -d \'\".$data.\"\' -u \'\".$user.\":\".$password.\"\' https://\".$domain.\"/api/now/table/\".$table.\" 2>&1\";\r\n\r\nmy $createcmd = $curlpath.\" -s -X \".$method;\r\nmy $postdata;\r\n\r\nif (defined($header1)){\r\n$createcmd .= \" -H \".$header1.\" \";\r\n}\r\n\r\nif (defined($header2)){\r\n$createcmd .= \" -H \".$header2.\" \";\r\n}\r\n\r\nif (defined($header3)){\r\n$createcmd .= \" -H \".$header3.\" \";\r\n}\r\n\r\nif (defined($user) && defined($password) && length($user) > 0 && length($password) > 0) {\r\n$createcmd .= \" -u \'\".$user.\":\".$password.\"\'\";\r\n} elsif (defined($user) && length($user) > 0) {\r\n$createcmd .= \" -u \'\".$user.\"\'\";\r\n}\r\n\r\nif (defined($data)) {\r\n     my @dataitems = split(\',\',$data);\r\n     $postdata = \'{\';\r\n     my $count = 0;\r\n     foreach my $dataitem (@dataitems){\r\n        my @postitem = split(\'=\',$dataitem);\r\n        if ($count < $#dataitems){\r\n        $postdata .= \'\"\'.$postitem[0].\'\":\"\'.$postitem[1].\'\",\';\r\n        } else {\r\n        $postdata .= \'\"\'.$postitem[0].\'\":\"\'.$postitem[1].\'\"}\';    \r\n        }\r\n        $count++;\r\n     }\r\n     $createcmd .= \" -d \'\".$postdata.\"\' \";\r\n}\r\n\r\n$createcmd .= \" \'\".$url.\"\' \";\r\n\r\nmy $createrequest = `$createcmd`;\r\nmy $meta = $arrayname.\"_meta\";\r\n$output{\"$arrayname\"} = decode_json($createrequest);\r\n\r\n\r\n\r\nprint FILEDATA $createrequest;\r\n\r\nif (length($createrequest) > 0) {\r\n        $status = \"Created\";\r\n        $output{\"$meta\"}{\"count\"} = 1;\r\n} else {\r\n        $status = \"Problem Creating Entry\";\r\n}\r\n\r\n$output{\'status\'} = $status;\r\n\r\n\r\nmy $json = encode_json(\\%output);\r\nprint $json;\r\n\r\nclose(FILEDATA);\r\n','perl','restquery.pl','Synopsis:  Performs REST Query to an endpoint.  Great for performing tasks involving applications that have a REST API.\r\n\r\nInput Params: \r\n\r\nuser = string for the REST user credentials\r\npassword = string for the REST Password credentials\r\ncurlpath = path to curl on your server\r\nnheader<1-3> = headers to pass to the request, example Accept:application/json\r\nurl = string for the url for the REST service.\r\nmethod = POST, GET, PUT etc.\r\ndata = string that you pass to the REST request that is used as data for the request.\r\ncmdoutput = string that indicates where you will store the reply from the rest service.  \r\n     Needs to be a full path to a file on your pilot server that your web server user can write to.   \r\n	 Example /var/www/html/pilot/tmp/files/restresult.json\r\n\r\nOutput param:  \r\n	status\r\n \r\nOutput values:  \r\n\r\n	Created, Problem Creating Entry\r\n	\r\nSample Params Config (fill in over on the left): \r\n\r\n{\r\n\"user\":\"restuser\",\r\n\"password\":\"restpass\",\r\n\"method\":\"POST\",\r\n\"curlpath\":\"/bin/curl\",\r\n\"url\":\"https://mycompany.restinterface.com/some/rest/query/endpoint\",\r\n\"header1\":\"Accept:application/json\",\r\n\"cmdoutput\":\"/var/www/html/pilot/tmp/files/out.json\",\r\n\"data\":{\"field1\":\"value1\",\"field2\":\"value2\"}\r\n}\"	','JSON','','','','#ID, TYPE, PARAM, REQUIRED, CAPTION, STYLE, LIST\r\nstatus,text,false,false,Status:,style=\"width: 300px\"',''),('VP TDS Query','host,user,password,database,query,port,queryoutput,server','','#\r\n#\r\n# Query Tabular Data Stream data sources (MSSQL, Netcool Object Server, Sybase, etc).\r\n# Freetds must be installed for this to work.  Your freetds.conf file also needs to be\r\n# updated with server connection information.  Visit www.freetds.org for more detail.\r\n#\r\n#\r\n\r\n=begin REMOVE THIS WHEN YOU HAVE DBD::Sybase installed, then save it\r\nuse strict;\r\nuse warnings;\r\nuse Data::Dumper;\r\nuse JSON;\r\nuse DBI;\r\nuse DBD::Sybase;\r\nuse Getopt::Long;\r\n\r\nmy %output;\r\nmy ($status,$user,$password,$server,$database,$query,$queryoutput,$arrayname);\r\n\r\nGetOptions(\r\n                \"user=s\" => \\$user,\r\n                \"password=s\" => \\$password,\r\n                \"database:s\" => \\$database,\r\n                \"query=s\" => \\$query,\r\n                \"queryoutput:s\" => \\$queryoutput,\r\n                \"arrayname=s\" => \\$arrayname,\r\n                \"server=s\" => \\$server,\r\n        );\r\n\r\n\r\nopen (FILEDATA,\"+> $queryoutput\") || die \"Cannot open file.\";\r\n\r\nmy $dsn = \"dbi:Sybase:server=$server\";\r\n\r\n# Connect to the database\r\nmy $dbh = DBI->connect($dsn, $user, $password, { AutoCommit => 0 }) || die \"Failed to connect!\";\r\n\r\nmy $sth = $dbh->prepare($query);\r\n$sth->execute();\r\n\r\nmy @data;\r\nmy $count = 0;\r\nif ($sth->errstr()) {\r\n        $output{\'status\'} = $sth->errstr();\r\n} else {\r\n        $output{\'status\'} = \'OK\';\r\n        while(my $ref = $sth->fetchrow_hashref)\r\n        {\r\n        push (@data, $ref);\r\n        $count++;\r\n        }\r\n}\r\n\r\n$dbh->disconnect;\r\nmy $meta = $arrayname.\"_meta\";\r\n$output{\"$arrayname\"} = \\@data;\r\n$output{\"$meta\"}{\"count\"} = $count;\r\nmy $data = encode_json(\\@data);\r\n$data =~ s/\\\\u0000//g;\r\nprint FILEDATA ($data);\r\n\r\nmy $json = encode_json(\\%output);\r\n$json =~ s/\\\\u0000//g;\r\nprint $json;\r\nclose (FILEDATA);\r\n=end\r\n','perl','tdsquery.pl','Synopsis:  Performs query of Tabular Data Stream databases (MSSQL, Netcool Object Server, Sybase...). \r\nNote, you must have free TDS and DBD::Sybase installed.  You can get freetds from freetds.org or\r\nusually just yum install freetds.\r\nDBD::Sybase can then be installed AFTER freetds is installed. \r\nThe final step is to make sure that freetds.conf is updated with your \"server\".  This is a \r\nconnection string that holds the host, port, and TDS Version that you will need.\r\n\r\n\r\nInput params: \r\nuser = string for the DB2 user credentials\r\npassword = string for the DB2 Password credentials\r\ndatabase = database you are connecting to...may not necessary if you declare the database in the \r\n     query\r\narrayname = Name of the returned array that will become part of the workflow variables (wfv)\r\nserver = the server name you configured in freetds.conf\r\nquery = db query  \r\nqueryoutput = For select statements, store the output in a file.  \r\n\r\nOutput param:  status and array name\r\n\r\nOutput values:  OK,<db error code>\r\n\r\nSample Params Config (fill in over on the left): \r\n{\r\n\"user\":\"user\",\r\n\"password\":\"pass\",\r\n\"database\":\"somedb\",\r\n\"server\":\"MYSERVER\",\r\n\"arrayname\":\"queryoutput\",\r\n\"query\":\"select * from sometable where somecolumn LIKE somevalue\",\r\n\"queryoutput\":\"/var/www/html/pilot/tmp/files/someoutput.json\"\r\n}','JSON','','','','',''),('VP Write To File','filename, data','','#\r\n#\r\n#  Writes data to a file for later use, one line at a time.\r\n#\r\n#\r\n\r\nuse strict;\r\nuse warnings;\r\nuse JSON;\r\nuse Getopt::Long;\r\n\r\nmy $filename=\'\';\r\nmy $data=\'\';\r\nmy %output;\r\n\r\nGetOptions(\r\n        \"filename=s\" => \\$filename,\r\n        \"data=s\" => \\$data\r\n        );\r\n\r\nopen (FILEDATA,\"+>> $filename\") || die \"{\\\"status\\\":\\\"Cannot open or write to \".$filename.\"\\\"}\\n\";\r\n\r\nprint FILEDATA \"$data\\n\";\r\n\r\n$output{\'status\'} = \'saved\';\r\nmy $json = encode_json(\\%output);\r\nprint $json;\r\nclose (FILEDATA);','perl','writetofile.pl','\"Synopsis:  Utility that writes data to a file\r\n\r\n\r\nInput param:  \r\nfilename = File name to write to.  MAKE SURE that the file is writable by the web server user, we recommend you write to /var/www/html/pilot/tmp/filesdata = The data you are writing into the file.  The utility adds a new line char already\r\n\r\nOutput param:  status\r\n\r\nOutput values:  saved, <error, something like Cannot write to...>\r\n\r\nSample Params Config (fill in over on the left): \r\n{\r\n\"filename\":\"/var/www/html/pilot/tmp/files/cooloutput.txt\",\r\n\"data\":\"Some data or a wfv usually\"\r\n}\r\n	','JSON','','','','#ID, TYPE, PARAM, REQUIRED, CAPTION, STYLE\r\nfilename, text,  true, true, Filename, style=\"width: 300px\"\r\nstatus,  text,  false, true, Status, style=\"width: 300px\"','');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_groups`
--

DROP TABLE IF EXISTS `user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_groups` (
  `groupid` varchar(48) NOT NULL,
  `username` varchar(48) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_groups`
--

LOCK TABLES `user_groups` WRITE;
/*!40000 ALTER TABLE `user_groups` DISABLE KEYS */;
INSERT INTO `user_groups` VALUES ('admingroup','admin');
/*!40000 ALTER TABLE `user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(48) NOT NULL,
  `firstname` varchar(24) NOT NULL,
  `lastname` varchar(24) NOT NULL,
  `authmethod` varchar(24) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(96) DEFAULT NULL,
  `sessionid` varchar(128) DEFAULT NULL,
  `locked` tinyint(1) DEFAULT NULL,
  `LoginCount` int(11) NOT NULL DEFAULT '0',
  `LastFailedLogin` datetime NOT NULL DEFAULT '2000-01-01 00:00:00',
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('admin','Administrator','User','Local','$2y$10$kkxz8dBRUbJZtFIyBz2Ecey6Hebka5gAu9jO0ppCDtyjt7d34NCKW','user@company.com','bn6v57chtgi5c25dk4rlret9t6',NULL,1,'2018-04-06 03:31:03');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wf_tasks`
--

DROP TABLE IF EXISTS `wf_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wf_tasks` (
  `taskserial` varchar(48) NOT NULL,
  `wfserial` varchar(255) NOT NULL,
  PRIMARY KEY (`taskserial`),
  CONSTRAINT `fk_task_workflow` FOREIGN KEY (`taskserial`) REFERENCES `task_logs` (`taskserial`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wf_tasks`
--

LOCK TABLES `wf_tasks` WRITE;
/*!40000 ALTER TABLE `wf_tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `wf_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workflowhist`
--

DROP TABLE IF EXISTS `workflowhist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `workflowhist` (
  `wfserial` varchar(255) NOT NULL,
  `workflowname` varchar(128) NOT NULL,
  `wfstart` datetime DEFAULT NULL,
  `wfend` datetime DEFAULT NULL,
  `wfmetadata` mediumtext,
  `wftime` float(12,6) DEFAULT NULL,
  `username` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`wfserial`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workflowhist`
--

LOCK TABLES `workflowhist` WRITE;
/*!40000 ALTER TABLE `workflowhist` DISABLE KEYS */;
/*!40000 ALTER TABLE `workflowhist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workflows`
--

DROP TABLE IF EXISTS `workflows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `workflows` (
  `workflowname` varchar(128) NOT NULL,
  `workflowdata` mediumtext NOT NULL,
  `workflowschedule` varchar(1024) DEFAULT NULL,
  `workflowstatus` varchar(64) DEFAULT NULL,
  `workflowstate` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`workflowname`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workflows`
--

LOCK TABLES `workflows` WRITE;
/*!40000 ALTER TABLE `workflows` DISABLE KEYS */;
INSERT INTO `workflows` VALUES ('AutoTicketing','{\"operators\":{\"start\":{\"top\":20,\"left\":80,\"properties\":{\"objecttype\":\"startnode\",\"class\":\"flowchart-start-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Start\",\"inputs\":{},\"outputs\":{\"output_1\":{\"label\":\"Begin\"}}}},\"end\":{\"top\":160,\"left\":1020,\"properties\":{\"objecttype\":\"endnode\",\"class\":\"flowchart-end-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Stop\",\"inputs\":{\"input_1\":{\"label\":\"End\"}},\"outputs\":{}}},\"task1\":{\"top\":100,\"left\":60,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Get Maintenance\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP MySQL Query\",\"parameters\":\"{\\n\\\"user\\\":\\\"mysqluser\\\",\\n\\\"password\\\":\\\"mysqlpass\\\",\\n\\\"database\\\":\\\"somedb\\\",\\n\\\"host\\\":\\\"corpmysql.company.com\\\",\\n\\\"port\\\":\\\"3306\\\",\\n\\\"query\\\":\\\"select * from sometable where somecolumn LIKE somevalue\\\",\\n\\\"queryoutput\\\":\\\"/var/www/html/pilot/tmp/files/someoutput.txt\\\"\\n}\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"task2\":{\"top\":600,\"left\":420,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Check Open Tickets\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP REST Query\",\"parameters\":\"{\\n\\\"user\\\":\\\"restuser\\\",\\n\\\"password\\\":\\\"restpass\\\",\\n\\\"method\\\":\\\"POST\\\",\\n\\\"curlpath\\\":\\\"/bin/curl\\\",\\n\\\"url\\\":\\\"https://mycompany.restinterface.com/some/rest/query/endpoint\\\",\\n\\\"header1\\\":\\\"Accept:application/json\\\",\\n\\\"cmdoutput\\\":\\\"/var/www/html/pilot/tmp/files/out.json\\\",\\n\\\"data\\\":{\\\"field1\\\":\\\"value1\\\",\\\"field2\\\":\\\"value2\\\"}\\n}\\\"\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"task3\":{\"top\":360,\"left\":620,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Open New Ticket\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP REST Query\",\"parameters\":\"{\\n\\\"user\\\":\\\"restuser\\\",\\n\\\"password\\\":\\\"restpass\\\",\\n\\\"method\\\":\\\"POST\\\",\\n\\\"curlpath\\\":\\\"/bin/curl\\\",\\n\\\"url\\\":\\\"https://mycompany.restinterface.com/some/rest/query/endpoint\\\",\\n\\\"header1\\\":\\\"Accept:application/json\\\",\\n\\\"cmdoutput\\\":\\\"/var/www/html/pilot/tmp/files/out.json\\\",\\n\\\"data\\\":{\\\"field1\\\":\\\"value1\\\",\\\"field2\\\":\\\"value2\\\"}\\n}\\\"\\t\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"task4\":{\"top\":520,\"left\":820,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Update Ticket\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP REST Query\",\"parameters\":\"{\\n\\\"user\\\":\\\"restuser\\\",\\n\\\"password\\\":\\\"restpass\\\",\\n\\\"method\\\":\\\"POST\\\",\\n\\\"curlpath\\\":\\\"/bin/curl\\\",\\n\\\"url\\\":\\\"https://mycompany.restinterface.com/some/rest/query/endpoint\\\",\\n\\\"header1\\\":\\\"Accept:application/json\\\",\\n\\\"cmdoutput\\\":\\\"/var/www/html/pilot/tmp/files/out.json\\\",\\n\\\"data\\\":{\\\"field1\\\":\\\"value1\\\",\\\"field2\\\":\\\"value2\\\"}\\n}\\\"\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"task5\":{\"top\":440,\"left\":100,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Ping Device\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Ping Device\",\"parameters\":\"{\\n\\\"host\\\":\\\"10.23.16.193\\\"\\n}\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"task6\":{\"top\":280,\"left\":760,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Send Slack Message\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP REST Query\",\"parameters\":\"{\\n\\\"user\\\":\\\"restuser\\\",\\n\\\"password\\\":\\\"restpass\\\",\\n\\\"method\\\":\\\"POST\\\",\\n\\\"curlpath\\\":\\\"/bin/curl\\\",\\n\\\"url\\\":\\\"https://mycompany.restinterface.com/some/rest/query/endpoint\\\",\\n\\\"header1\\\":\\\"Accept:application/json\\\",\\n\\\"cmdoutput\\\":\\\"/var/www/html/pilot/tmp/files/out.json\\\",\\n\\\"data\\\":{\\\"field1\\\":\\\"value1\\\",\\\"field2\\\":\\\"value2\\\"}\\n}\\\"\\t\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"task7\":{\"top\":780,\"left\":120,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"SNMP UpTime\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Ping Device\",\"parameters\":\"{\\n\\\"host\\\":\\\"10.23.16.193\\\"\\n}\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"task9\":{\"top\":620,\"left\":80,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Sleep 5 seconds\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Read Data\",\"parameters\":\"{\\n\\\"data\\\":\\\"message\\\",\\n\\\"expression\\\":\\\"(High CPU)\\\"\\n}\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"route:foreach1\":{\"top\":180,\"left\":60,\"properties\":{\"objecttype\":\"route:foreach\",\"class\":\"flowchart-route-operator\",\"title\":\"ForEach\",\"inputs\":{\"input_1\":{\"label\":\"In\",\"conntype\":\"input\"}},\"outputs\":{\"output_1\":{\"label\":\"Out 1\",\"conntype\":\"output\",\"targetobject\":\"targetobject\"}}}},\"route:if-else1\":{\"top\":260,\"left\":60,\"properties\":{\"objecttype\":\"route:if-else\",\"class\":\"flowchart-route-operator\",\"title\":\"If Else\",\"inputs\":{\"input_1\":{\"label\":\"In\",\"conntype\":\"input\"}},\"outputs\":{\"output_1\":{\"label\":\"Out 1\",\"conntype\":\"output\",\"parameter\":\"paramname\",\"comparison\":\"LIKE\",\"value\":\"somevalue\"},\"output_2\":{\"label\":\"Out 2\",\"conntype\":\"output\",\"parameter\":\"paramname\",\"comparison\":\"LIKE\",\"value\":\"somevalue\"}}}},\"route:while1\":{\"top\":360,\"left\":60,\"properties\":{\"objecttype\":\"route:while\",\"class\":\"flowchart-route-operator\",\"title\":\"While x < 3\",\"inputs\":{\"input_1\":{\"conntype\":\"input\",\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"conntype\":\"output\",\"label\":\"Out\",\"parameter\":\"counter\",\"comparison\":{\"id\":\"<\",\"text\":\"<\"},\"value\":\"3\",\"increment\":\"1\"}},\"loopid\":\"route:while1\"}},\"route:continue1\":{\"top\":700,\"left\":80,\"properties\":{\"objecttype\":\"route:continue\",\"class\":\"flowchart-route-operator-continue\",\"title\":\"Continue\",\"inputs\":{\"input_1\":{\"label\":\"In\",\"conntype\":\"input\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\",\"conntype\":\"output\"}}}},\"route:break1\":{\"top\":500,\"left\":260,\"properties\":{\"objecttype\":\"route:break\",\"class\":\"flowchart-route-operator-break\",\"title\":\"Break\",\"inputs\":{\"input_1\":{\"label\":\"In\",\"conntype\":\"input\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\",\"conntype\":\"output\"}}}},\"route:if-else2\":{\"top\":520,\"left\":80,\"properties\":{\"objecttype\":\"route:if-else\",\"class\":\"flowchart-route-operator\",\"title\":\"If Else\",\"inputs\":{\"input_1\":{\"label\":\"In\",\"conntype\":\"input\"}},\"outputs\":{\"output_1\":{\"label\":\"Out 1\",\"conntype\":\"output\",\"parameter\":\"paramname\",\"comparison\":\"LIKE\",\"value\":\"somevalue\"},\"output_2\":{\"label\":\"Out 2\",\"conntype\":\"output\",\"parameter\":\"paramname\",\"comparison\":\"LIKE\",\"value\":\"somevalue\"}}}},\"route:if-else3\":{\"top\":760,\"left\":440,\"properties\":{\"objecttype\":\"route:if-else\",\"class\":\"flowchart-route-operator\",\"title\":\"If Else\",\"inputs\":{\"input_1\":{\"label\":\"In\",\"conntype\":\"input\"}},\"outputs\":{\"output_1\":{\"label\":\"Out 1\",\"conntype\":\"output\",\"parameter\":\"paramname\",\"comparison\":\"LIKE\",\"value\":\"somevalue\"},\"output_2\":{\"label\":\"Out 2\",\"conntype\":\"output\",\"parameter\":\"paramname\",\"comparison\":\"LIKE\",\"value\":\"somevalue\"}}}},\"task8\":{\"top\":940,\"left\":360,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Check Log\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Read Data\",\"parameters\":\"{\\n\\\"data\\\":\\\"message\\\",\\n\\\"expression\\\":\\\"(High CPU)\\\"\\n}\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"route:if-else4\":{\"top\":860,\"left\":180,\"properties\":{\"objecttype\":\"route:if-else\",\"class\":\"flowchart-route-operator\",\"title\":\"If Else\",\"inputs\":{\"input_1\":{\"label\":\"In\",\"conntype\":\"input\"}},\"outputs\":{\"output_1\":{\"label\":\"Out 1\",\"conntype\":\"output\",\"parameter\":\"paramname\",\"comparison\":\"LIKE\",\"value\":\"somevalue\"},\"output_2\":{\"label\":\"Out 2\",\"conntype\":\"output\",\"parameter\":\"paramname\",\"comparison\":\"LIKE\",\"value\":\"somevalue\"}}}},\"route:if-else5\":{\"top\":480,\"left\":540,\"properties\":{\"objecttype\":\"route:if-else\",\"class\":\"flowchart-route-operator\",\"title\":\"If Else\",\"inputs\":{\"input_1\":{\"label\":\"In\",\"conntype\":\"input\"}},\"outputs\":{\"output_1\":{\"label\":\"Out 1\",\"conntype\":\"output\",\"parameter\":\"paramname\",\"comparison\":\"LIKE\",\"value\":\"somevalue\"},\"output_2\":{\"label\":\"Out 2\",\"conntype\":\"output\",\"parameter\":\"paramname\",\"comparison\":\"LIKE\",\"value\":\"somevalue\"}}}}},\"links\":{\"0\":{\"fromOperator\":\"start\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"1\":{\"fromOperator\":\"task1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:foreach1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"2\":{\"fromOperator\":\"route:foreach1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:if-else1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"3\":{\"fromOperator\":\"route:if-else1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"end\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"4\":{\"fromOperator\":\"route:if-else1\",\"fromConnector\":\"output_2\",\"fromSubConnector\":0,\"toOperator\":\"route:while1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"5\":{\"fromOperator\":\"route:while1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task5\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"6\":{\"fromOperator\":\"task5\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:if-else2\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"7\":{\"fromOperator\":\"route:if-else2\",\"fromConnector\":\"output_2\",\"fromSubConnector\":0,\"toOperator\":\"task9\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"8\":{\"fromOperator\":\"task9\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:continue1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"9\":{\"fromOperator\":\"route:continue1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task7\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"11\":{\"fromOperator\":\"task7\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:if-else4\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"12\":{\"fromOperator\":\"route:if-else4\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task2\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"13\":{\"fromOperator\":\"route:if-else4\",\"fromConnector\":\"output_2\",\"fromSubConnector\":0,\"toOperator\":\"task8\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"14\":{\"fromOperator\":\"task8\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:if-else3\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"15\":{\"fromOperator\":\"route:if-else3\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task2\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"17\":{\"fromOperator\":\"task3\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task6\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"18\":{\"fromOperator\":\"route:if-else2\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:break1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"19\":{\"fromOperator\":\"route:break1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task2\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"20\":{\"fromOperator\":\"task2\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:if-else5\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"21\":{\"fromOperator\":\"route:if-else5\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task3\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"22\":{\"fromOperator\":\"route:if-else5\",\"fromConnector\":\"output_2\",\"fromSubConnector\":0,\"toOperator\":\"task4\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"23\":{\"fromOperator\":\"task6\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"end\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"24\":{\"fromOperator\":\"task4\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"end\",\"toConnector\":\"input_1\",\"toSubConnector\":0}},\"operatorTypes\":{}}','* * * * *','enabled',NULL),('CustExample','{\"operators\":{\"start\":{\"top\":20,\"left\":20,\"properties\":{\"objecttype\":\"startnode\",\"class\":\"flowchart-start-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Start\",\"inputs\":{},\"outputs\":{\"output_1\":{\"label\":\"Begin\"}}}},\"end\":{\"top\":20,\"left\":980,\"properties\":{\"objecttype\":\"endnode\",\"class\":\"flowchart-end-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Stop\",\"inputs\":{\"input_1\":{\"label\":\"End\"}},\"outputs\":{}}},\"route:continue1\":{\"top\":220,\"left\":880,\"properties\":{\"objecttype\":\"route:continue\",\"class\":\"flowchart-route-operator-continue\",\"title\":\"Continue\",\"inputs\":{\"input_1\":{\"label\":\"In\",\"conntype\":\"input\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\",\"conntype\":\"output\"}},\"loopid\":\"route:foreach1\"}},\"task1\":{\"top\":140,\"left\":120,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Cust List\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP MySQL Query\",\"parameters\":\"{\\n\\\"user\\\":\\\"root\\\",\\n\\\"password\\\":\\\"Idlgeah2016!!\\\",\\n\\\"database\\\":\\\"sampledata\\\",\\n\\\"host\\\":\\\"localhost\\\",\\n\\\"port\\\":\\\"3306\\\",\\n\\\"query\\\":\\\"select * from sampledata.sample_customers\\\",\\n\\\"arrayname\\\":\\\"customeraddrs\\\",\\n\\\"queryoutput\\\":\\\"/var/www/html/pilot/tmp/files/cust.json\\\"\\n}\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"route:foreach1\":{\"top\":240,\"left\":280,\"properties\":{\"objecttype\":\"route:foreach\",\"class\":\"flowchart-route-operator\",\"title\":\"Each Customer\",\"inputs\":{\"input_1\":{\"conntype\":\"input\",\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"conntype\":\"output\",\"label\":\"Out\",\"targetobject\":\"customeraddrs\"}},\"loopid\":\"route:foreach1\"}},\"task2\":{\"top\":120,\"left\":660,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Name and Street\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Write To File\",\"parameters\":\"{\\n\\\"filename\\\":\\\"/var/www/html/pilot/tmp/files/nameandstreet.txt\\\",\\n\\\"data\\\":\\\"Customer %route:foreach1|customeraddrs|custname% is on street %route:foreach1|customeraddrs|custstreet%\\\"\\n}\\n\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"task3\":{\"top\":260,\"left\":660,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"City and State\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Write To File\",\"parameters\":\"{\\n\\\"filename\\\":\\\"/var/www/html/pilot/tmp/files/nameandstreet.txt\\\",\\n\\\"data\\\":\\\"Customer %route:foreach1|customeraddrs|custname% city is %route:foreach1|customeraddrs|custname% and state is %route:foreach1|customeraddrs|custstate%\\\"\\n}\\n\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"route:if-else1\":{\"top\":160,\"left\":460,\"properties\":{\"objecttype\":\"route:if-else\",\"class\":\"flowchart-route-operator\",\"title\":\"If Else\",\"inputs\":{\"input_1\":{\"conntype\":\"input\",\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"conntype\":\"output\",\"label\":\"Street\",\"parameter\":\"%route:foreach1|customeraddrs|custname%\",\"comparison\":\"=\",\"value\":\"VirtuOps\"},\"output_2\":{\"conntype\":\"output\",\"label\":\"CityState\",\"parameter\":\"%route:foreach1|customeraddrs|custname%\",\"comparison\":\"<>\",\"value\":\"VirtuOps\"}}}}},\"links\":{\"0\":{\"fromOperator\":\"start\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"1\":{\"fromOperator\":\"task1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:foreach1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"2\":{\"fromOperator\":\"route:foreach1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:if-else1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"3\":{\"fromOperator\":\"task2\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:continue1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"4\":{\"fromOperator\":\"route:continue1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"end\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"5\":{\"fromOperator\":\"route:if-else1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task2\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"6\":{\"fromOperator\":\"route:if-else1\",\"fromConnector\":\"output_2\",\"fromSubConnector\":0,\"toOperator\":\"task3\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"7\":{\"fromOperator\":\"task3\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:continue1\",\"toConnector\":\"input_1\",\"toSubConnector\":0}},\"operatorTypes\":{}}','* * * * *','enabled','stopped'),('First Flow','{\"operators\":{\"start\":{\"top\":20,\"left\":0,\"properties\":{\"objecttype\":\"startnode\",\"class\":\"flowchart-start-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Start\",\"inputs\":{},\"outputs\":{\"output_1\":{\"label\":\"Begin\"}}}},\"end\":{\"top\":40,\"left\":1020,\"properties\":{\"objecttype\":\"endnode\",\"class\":\"flowchart-end-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Stop\",\"inputs\":{\"input_1\":{\"label\":\"End\"}},\"outputs\":{}}},\"task4\":{\"top\":60,\"left\":760,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"End While\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Write To File\",\"parameters\":\"{\\n\\\"filename\\\":\\\"/var/www/html/pilot/tmp/files/endedwhileloop.txt\\\",\\n\\\"data\\\":\\\"while loop is completed.  made it to end.\\\"\\n}\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"task3\":{\"top\":320,\"left\":680,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Break While\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Write To File\",\"parameters\":\"{\\n\\\"filename\\\":\\\"/var/www/html/pilot/tmp/files/breakwhile.txt\\\",\\n\\\"data\\\":\\\"Break while loop here\\\"\\n}\\n\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"route:break1\":{\"top\":300,\"left\":460,\"properties\":{\"objecttype\":\"route:break\",\"class\":\"flowchart-route-operator-break\",\"title\":\"Break\",\"inputs\":{\"input_1\":{\"label\":\"In\",\"conntype\":\"input\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\",\"conntype\":\"output\"}},\"loopid\":\"route:while1\"}},\"route:continue1\":{\"top\":180,\"left\":660,\"properties\":{\"objecttype\":\"route:continue\",\"class\":\"flowchart-route-operator-continue\",\"title\":\"Continue\",\"inputs\":{\"input_1\":{\"label\":\"In\",\"conntype\":\"input\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\",\"conntype\":\"output\"}},\"loopid\":\"route:while1\"}},\"task1\":{\"top\":80,\"left\":220,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Ping Device\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Ping Device\",\"parameters\":\"{\\n\\\"host\\\":\\\"localhost\\\"\\n}\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"route:while1\":{\"top\":160,\"left\":40,\"properties\":{\"objecttype\":\"route:while\",\"class\":\"flowchart-route-operator\",\"title\":\"While count < 6\",\"inputs\":{\"input_1\":{\"conntype\":\"input\",\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"conntype\":\"output\",\"label\":\"Out\",\"parameter\":\"counter\",\"comparison\":{\"id\":\"<\",\"text\":\"<\"},\"value\":\"6\",\"increment\":\"1\"}},\"loopid\":\"route:while1\"}},\"route:if-else1\":{\"top\":200,\"left\":280,\"properties\":{\"objecttype\":\"route:if-else\",\"class\":\"flowchart-route-operator\",\"title\":\"If Else\",\"inputs\":{\"input_1\":{\"conntype\":\"input\",\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"conntype\":\"output\",\"label\":\"Alive\",\"parameter\":\"status\",\"comparison\":\"=\",\"value\":\"alive\"},\"output_2\":{\"conntype\":\"output\",\"label\":\"Not Alive\",\"parameter\":\"status\",\"comparison\":\"=\",\"value\":\"unreachable\"}}}},\"task2\":{\"top\":100,\"left\":460,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Log Pings\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Write To File\",\"parameters\":\"{\\n\\\"filename\\\":\\\"/var/www/html/pilot/tmp/files/LoopPing.txt\\\",\\n\\\"data\\\":\\\"Pinged %host% is %status% %counter% times\\\"\\n}\\n\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}}},\"links\":{\"0\":{\"fromOperator\":\"route:break1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task3\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"1\":{\"fromOperator\":\"route:if-else1\",\"fromConnector\":\"output_2\",\"fromSubConnector\":0,\"toOperator\":\"route:break1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"2\":{\"fromOperator\":\"task1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:if-else1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"3\":{\"fromOperator\":\"task3\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"end\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"4\":{\"fromOperator\":\"route:continue1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task4\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"5\":{\"fromOperator\":\"route:if-else1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task2\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"6\":{\"fromOperator\":\"start\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:while1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"7\":{\"fromOperator\":\"route:while1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"8\":{\"fromOperator\":\"task2\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:continue1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"9\":{\"fromOperator\":\"task4\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"end\",\"toConnector\":\"input_1\",\"toSubConnector\":0}},\"operatorTypes\":{}}','* * * * *','enabled','stopped'),('Read Data','{\"operators\":{\"start\":{\"top\":140,\"left\":0,\"properties\":{\"objecttype\":\"startnode\",\"class\":\"flowchart-start-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Start\",\"inputs\":{},\"outputs\":{\"output_1\":{\"label\":\"Begin\"}}}},\"end\":{\"top\":20,\"left\":1020,\"properties\":{\"objecttype\":\"endnode\",\"class\":\"flowchart-end-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Stop\",\"inputs\":{\"input_1\":{\"label\":\"End\"}},\"outputs\":{}}},\"task2\":{\"top\":140,\"left\":560,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Device Dead\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Write To File\",\"parameters\":\"{\\n\\\"filename\\\":\\\"/var/www/html/pilot/tmp/files/devicedead.txt\\\",\\n\\\"data\\\":\\\"This device is status\\\"\\n}\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"task1\":{\"top\":40,\"left\":340,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Ping Device\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Ping Device\",\"parameters\":\"{\\n\\\"host\\\":\\\"localhost\\\"\\n}\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"task5\":{\"top\":40,\"left\":760,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"DeviceAlive\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Write To File\",\"parameters\":\"{\\n\\\"filename\\\":\\\"/var/www/html/pilot/tmp/files/DeviceAlive.txt\\\",\\n\\\"data\\\":\\\"This device is status\\\"\\n}\\n\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"route:if-else1\":{\"top\":40,\"left\":540,\"properties\":{\"objecttype\":\"route:if-else\",\"class\":\"flowchart-route-operator\",\"title\":\"If Else\",\"inputs\":{\"input_1\":{\"conntype\":\"input\",\"label\":\"status\"}},\"outputs\":{\"output_1\":{\"conntype\":\"output\",\"label\":\"Alive\",\"parameter\":\"status\",\"comparison\":\"=\",\"value\":\"alive\"},\"output_2\":{\"conntype\":\"output\",\"label\":\"Not Alive\",\"parameter\":\"status\",\"comparison\":\"=\",\"value\":\"unreachable\"}}}},\"task4\":{\"top\":160,\"left\":240,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Output A\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Write To File\",\"parameters\":\"{\\n\\\"filename\\\":\\\"/var/www/html/pilot/tmp/files/outputA.txt\\\",\\n\\\"data\\\":\\\"OutputA has been written to\\\"\\n}\\n\\t\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"task6\":{\"top\":140,\"left\":920,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Log X Times\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"VP Write To File\",\"parameters\":\"{\\n\\\"filename\\\":\\\"/var/www/html/pilot/tmp/files/outputC.txt\\\",\\n\\\"data\\\":\\\"OutputC has been written to\\\"\\n}\",\"runbookname\":\"WF Tasks\",\"runbookid\":\"WFTasks\"}}},\"route:while1\":{\"top\":220,\"left\":760,\"properties\":{\"objecttype\":\"route:while\",\"class\":\"flowchart-route-operator\",\"title\":\"While x < 10\",\"inputs\":{\"input_1\":{\"conntype\":\"input\",\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"conntype\":\"output\",\"label\":\"Out\",\"parameter\":\"counter\",\"comparison\":{\"id\":\"<\",\"text\":\"<\"},\"value\":\"10\",\"increment\":\"1\"}}}},\"route:while2\":{\"top\":40,\"left\":120,\"properties\":{\"objecttype\":\"route:while\",\"class\":\"flowchart-route-operator\",\"title\":\"While x < 3\",\"inputs\":{\"input_1\":{\"conntype\":\"input\",\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"conntype\":\"output\",\"label\":\"Out\",\"parameter\":\"counter\",\"comparison\":{\"id\":\"<=\",\"text\":\"<=\"},\"value\":\"3\",\"increment\":\"1\"}}}}},\"links\":{\"0\":{\"fromOperator\":\"task1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:if-else1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"1\":{\"fromOperator\":\"route:if-else1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task5\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"2\":{\"fromOperator\":\"route:if-else1\",\"fromConnector\":\"output_2\",\"fromSubConnector\":0,\"toOperator\":\"task2\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"3\":{\"fromOperator\":\"task2\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:while1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"4\":{\"fromOperator\":\"route:while1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task6\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"5\":{\"fromOperator\":\"start\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"route:while2\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"6\":{\"fromOperator\":\"route:while2\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task4\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"7\":{\"fromOperator\":\"task5\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"end\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"8\":{\"fromOperator\":\"task4\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"10\":{\"fromOperator\":\"task6\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"end\",\"toConnector\":\"input_1\",\"toSubConnector\":0}},\"operatorTypes\":{}}','* * * * *','enabled','stopped');
/*!40000 ALTER TABLE `workflows` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-14  9:13:56
