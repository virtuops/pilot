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
INSERT INTO `group_runbooks` VALUES ('admingroup','WFTasks');
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
