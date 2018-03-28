-- MySQL dump 10.16  Distrib 10.1.10-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: pilot
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
-- Current Database: `pilot`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `pilot` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `pilot`;

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
INSERT INTO `group_runbooks` VALUES ('admingroup','NHP');
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_logs`
--

LOCK TABLES `task_logs` WRITE;
/*!40000 ALTER TABLE `task_logs` DISABLE KEYS */;
INSERT INTO `task_logs` VALUES ('NH Ping Device','NHP','admin','ping.pl','2018-03-05 16:18:26',0.093463,'ZXml5tCMV9fnIS2',6127,'STOPPED','0','{\"status\":\"alive\",\"host\":\"localhost\"}',1,'','\"\"');
/*!40000 ALTER TABLE `task_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_problems`
--

DROP TABLE IF EXISTS `task_problems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task_problems` (
  `taskid` int(11) NOT NULL,
  `problemserial` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_problems`
--

LOCK TABLES `task_problems` WRITE;
/*!40000 ALTER TABLE `task_problems` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_problems` ENABLE KEYS */;
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
INSERT INTO `tasks` VALUES ('VP Email Task','smtpuser,smtppassword,smtpport,smtpserver,recipient,subject,body','','#\r\n# Sends secure email using SMTPS.  Must have Net::SMTPS loaded and accessible to the web server user\r\n# Form requires recipient,subject,body and message fields.  The message field will catch errors\r\n# \r\n#\r\n\r\nuse strict;\r\nuse warnings;\r\nuse JSON;\r\nuse Getopt::Long;\r\nuse Net::SMTPS;\r\n\r\nmy ($smtpserver, $smtpport, $smtpuser, $smtppassword, $recipient,$subject,$body);\r\n\r\nmy $debugerr;\r\nmy $debugout;\r\nmy %output;\r\n\r\nGetOptions(\r\n        \"smtpserver=s\" => \\$smtpserver,\r\n        \"smtpport=s\" => \\$smtpport,\r\n        \"smtpuser=s\" => \\$smtpuser,\r\n        \"smtppassword=s\" => \\$smtppassword,\r\n        \"recipient=s\" => \\$recipient,\r\n		\"subject=s\" => \\$subject,\r\n		\"body=s\" => \\$body\r\n		);\r\n\r\nif (! $recipient || ! $subject || ! $body)\r\n{\r\n  $output{\'status\'} = \"You need a recipient, subject and body\";\r\n  \r\n} \r\n\r\n#my $smtpserver = \'smtp.gmail.com\';\r\n#my $smtpport = 587;\r\n#my $smtpuser   = \'<<<<USER THAT CAN LOG INTO SMTP SERVER>>>>>\';\r\n#my $smtppassword = \'<<<<USER PASSWORD>>>>>\';\r\n\r\nmy $smtp = Net::SMTPS->new($smtpserver, Port=>$smtpport, doSSL => \'starttls\', Timeout => 10, Debug => 0);\r\n\r\ndie \"Could not connect to server!\\n\" unless $smtp;\r\n\r\n$smtp->auth($smtpuser, $smtppassword);\r\n$smtp->mail(\'support@virtuops.com\');\r\n$smtp->to($recipient);\r\n$smtp->data();\r\n$smtp->datasend(\"Subject: $subject\");\r\n$smtp->datasend(\"\\n\");\r\n$smtp->datasend(\"$body\");\r\n$smtp->datasend(\"\\n\");\r\n$smtp->dataend();\r\nmy @msgs = $smtp->message();\r\n$smtp->quit;\r\n\r\n\r\nforeach my $msg (@msgs) {\r\n        if ($msg =~ /OK/) {\r\n                $output{\'status\'} = \"Message Sent\";\r\n        } else {\r\n				$output{\'status\'} = \"FAILURE:  Message Not Sent\";\r\n		}\r\n}\r\n\r\nmy $json = encode_json(\\%output);\r\nprint $json;\r\n','perl','email.pl','Synopsis:  Send an Email using SMTPS.  All fields are mandatory or your email will fail.\\\n\\\nInput params:  smtpuser,smtppassword,smtpserver,smtpport,recipient,subject,body\\\nInput values expected:\\\n   smtpuser = user that can log into email and send email (the sender)\\\n   smtppassword = user password\\\n   smtpserver = the mail server (something like smtp.gmail.com)\\\n   smtpport = secure port used (587 works on gmail as of 2017)\\\n   recipient = email address of person receiving email\\\n   subject = email subjectline\\\n   body = body of email\\\n\\\nOutput param:  status\\\nOutput values:  Message Sent, FAILURE:  Message Not Sent\\\n\\\nSample Params Config (fill in over on the left): \\\n{\\\n\"smtpuser\":\"me@company.com\",\\\n\"smtppassword\":\"em@1lp@55w0rd\",\\\n\"smtpserver\":\"smtp.gmail.com\",\\\n\"smtpport\":\"587\",\\\n\"recipient\":\"you@othercompany.com\",\\\n\"subject\":\"Some Email Subject\",\\\n\"body\":\"Here is an explanation of what is going on, I can really tell you a lot here.....\"\\\n}','JSON','','','','#ID, TYPE, PARAM, REQUIRED, CAPTION, STYLE\r\nstatus,  text,  false, true, Status:, style=\"width: 300px\"',''),('VP Empty File','filename','','#\r\n#\r\n#  Empties a file.   USE WITH CAUTION.  TEST THIS IN DEVELOPMENT FIRST\r\n#\r\n#\r\n\r\nuse strict;\r\nuse warnings;\r\nuse JSON;\r\nuse Getopt::Long;\r\n\r\nmy $filename=\'\';\r\nmy %output;\r\n\r\nGetOptions(\r\n        \"filename=s\" => \\$filename,\r\n        );\r\n\r\nopen (FILEDATA,\"+> $filename\") || die \"{\\\"status\\\":\\\"Cannot open or write to \".$filename.\"\\\"}\\n\";\r\n\r\n$output{\'status\'} = \'emptied\';\r\n$output{\'filename\'} = $filename;\r\nmy $json = encode_json(\\%output);\r\nprint $json;\r\n\r\nclose (FILEDATA);\r\n','perl','emptyfile.pl','Synopsis:  Empties a file.  Good if you want to clear a file you were writing to.   USE CAUTION.  THIS EMPTIES A FILE.  TEST THIS IN DEV FIRST.\\\n\\\nInput param:  \\\nfilename = File name to empty.  MAKE SURE that the file is writable by the web server user\\\n\\\nOutput param:  status\\\nOutput values:  emptied, <error, something like Cannot write to...>\\\n\\\nSample Params Config (fill in over on the left): \\\n{\\\n\"filename\":\"/var/www/html/nochero/tmp/files/cooloutput.txt\",\\\n}','JSON','','','','#ID, TYPE, PARAM, REQUIRED, CAPTION, STYLE\r\nfilename, text,  true, true, Filename, style=\"width: 300px\"\r\nstatus,  text,  false, true, Status, style=\"width: 300px\"',''),('VP Ping Device','host','','#\r\n# Ping a single device, bring back alive\r\n# Uses TCP Ping by default\r\n#\r\n\r\nuse strict;\r\nuse warnings;\r\nuse Net::Ping;\r\nuse Getopt::Long;\r\nuse JSON;\r\n\r\nmy $host=\'\';\r\nmy %output;\r\nGetOptions(\"host=s\" => \\$host);\r\n\r\n\r\nmy $p = Net::Ping->new();\r\nif ($p->ping($host)) {\r\n$output{\'host\'} = $host;\r\n$output{\'status\'} = \'alive\';\r\n} else {\r\n$output{\'host\'} = $host;\r\n$output{\'status\'} = \'unreachable\';\r\n}\r\n$p->close();\r\n\r\nmy $result = encode_json(\\%output);\r\n\r\nprint $result;\r\n','perl','ping.pl','Synopsis:  Ping a device and get a result back.\\\n\\\nInput param:  host\\\nInput value expected:  hostname or IP address\\\n\\\nOutput param:  status\\\nOutput values:  alive, unreachable\\\n\\\nSample Params Config (fill in over on the left): \\\n{\\\n\"host\":\"10.23.16.193\"\\\n}','JSON','','','','#ID, TYPE, PARAM, REQUIRED, CAPTION, STYLE\r\nhost, text,  true, true, Host, style=\"width: 300px\"\r\nstatus,  text,  false, true, Status, style=\"width: 300px\"','');
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
INSERT INTO `users` VALUES ('admin','Administrator','User','Local','$2y$10$kkxz8dBRUbJZtFIyBz2Ecey6Hebka5gAu9jO0ppCDtyjt7d34NCKW','user@company.com','kj7qb948jg7u40ea34ptg6mk80',NULL,1,'2017-07-11 10:04:46');
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
INSERT INTO `wf_tasks` VALUES ('ZXml5tCMV9fnIS2','zQFHrNa0U3kgsq1');
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
INSERT INTO `workflowhist` VALUES ('ybclX4eyfEtGJZ9','First Flow','2018-03-05 16:17:27','2018-03-05 16:17:27','\"\"',0.218041,'admin'),('zQFHrNa0U3kgsq1','First Flow','2018-03-05 16:18:26','2018-03-05 16:18:26','\"\"',0.435015,'admin');
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
INSERT INTO `workflows` VALUES ('First Flow','{\"operators\":{\"start\":{\"top\":20,\"left\":20,\"properties\":{\"objecttype\":\"startnode\",\"class\":\"flowchart-start-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Start\",\"inputs\":{},\"outputs\":{\"output_1\":{\"label\":\"Begin\"}}}},\"end\":{\"top\":40,\"left\":940,\"properties\":{\"objecttype\":\"endnode\",\"class\":\"flowchart-end-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Stop\",\"inputs\":{\"input_1\":{\"label\":\"End\"}},\"outputs\":{}}},\"task1\":{\"top\":60,\"left\":480,\"properties\":{\"objecttype\":\"task\",\"class\":\"flowchart-task-operator\",\"runbookid\":\"\",\"runbookname\":\"\",\"title\":\"Ping Device\",\"inputs\":{\"input_1\":{\"label\":\"In\"}},\"outputs\":{\"output_1\":{\"label\":\"Out\"}},\"task\":{\"taskname\":\"NH Ping Device\",\"parameters\":\"{\\n\\\"host\\\":\\\"localhost\\\"\\n}\",\"runbookname\":\"NHP\",\"runbookid\":\"NHP\"}}}},\"links\":{\"0\":{\"fromOperator\":\"start\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"task1\",\"toConnector\":\"input_1\",\"toSubConnector\":0},\"1\":{\"fromOperator\":\"task1\",\"fromConnector\":\"output_1\",\"fromSubConnector\":0,\"toOperator\":\"end\",\"toConnector\":\"input_1\",\"toSubConnector\":0}},\"operatorTypes\":{}}','* * * * *','enabled','stopped');
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

-- Dump completed on 2018-03-27 21:21:46
