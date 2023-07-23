-- MariaDB dump 10.19-11.0.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: admin_panel
-- ------------------------------------------------------
-- Server version	11.0.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id_admin` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(120) NOT NULL,
  `type` enum('global','dedicated') NOT NULL DEFAULT 'dedicated',
  `name` varchar(65) NOT NULL,
  `created` datetime DEFAULT NULL,
  `changed` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES
(1,'GlobalAdmin','0ec02c60874b9c472bf80a568fba27d3','global','Administrator',NULL,NULL),
(13,'dsfsdf@@sdfsdf','11111111111','dedicated','fsdfsdf',NULL,NULL);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins_services`
--

DROP TABLE IF EXISTS `admins_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins_services` (
  `admin_id` int(11) NOT NULL,
  `service_id` varchar(45) NOT NULL,
  KEY `ADMINSERVICES_IDX` (`admin_id`,`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins_services`
--

LOCK TABLES `admins_services` WRITE;
/*!40000 ALTER TABLE `admins_services` DISABLE KEYS */;
INSERT INTO `admins_services` VALUES
(7,'1'),
(8,'1'),
(9,'1'),
(10,'1'),
(11,'1'),
(12,'1'),
(13,'1');
/*!40000 ALTER TABLE `admins_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domain_admins`
--

DROP TABLE IF EXISTS `domain_admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domain_admins` (
  `domain_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  KEY `index1` (`domain_id`,`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain_admins`
--

LOCK TABLES `domain_admins` WRITE;
/*!40000 ALTER TABLE `domain_admins` DISABLE KEYS */;
INSERT INTO `domain_admins` VALUES
(3,9),
(5,10),
(6,11),
(8,12),
(15,13);
/*!40000 ALTER TABLE `domain_admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domain_services`
--

DROP TABLE IF EXISTS `domain_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domain_services` (
  `domain_id` int(10) unsigned NOT NULL,
  `service_id` int(11) NOT NULL,
  KEY `DOMAINSC_IDX` (`domain_id`,`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain_services`
--

LOCK TABLES `domain_services` WRITE;
/*!40000 ALTER TABLE `domain_services` DISABLE KEYS */;
INSERT INTO `domain_services` VALUES
(1,1),
(1,2),
(2,1),
(3,1),
(4,1),
(5,1),
(6,1),
(8,1),
(10,1),
(11,1),
(12,1),
(13,1),
(14,1),
(15,1),
(16,1);
/*!40000 ALTER TABLE `domain_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domains`
--

DROP TABLE IF EXISTS `domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domains` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `domain` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `comment` varchar(255) DEFAULT NULL,
  `limit_admins` int(11) NOT NULL DEFAULT -1,
  `limit_mails` int(11) NOT NULL DEFAULT -1,
  PRIMARY KEY (`id`,`domain`),
  UNIQUE KEY `DOMAIN_IDX` (`domain`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domains`
--

LOCK TABLES `domains` WRITE;
/*!40000 ALTER TABLE `domains` DISABLE KEYS */;
INSERT INTO `domains` VALUES
(8,1,'domena.com','2023-07-23 11:02:12','',100,100),
(10,1,'salon.pl','2023-07-23 11:16:25','',5,100),
(11,1,'test2','2023-07-23 11:19:20','',5,100),
(12,1,'ala11','2023-07-23 11:23:59','',5,100),
(13,1,'salonyhoff','2023-07-23 11:27:47','',5,100),
(14,1,'kluska','2023-07-23 11:28:59','',5,100),
(15,1,'sdfsdf','2023-07-23 11:36:55','',5,100),
(16,1,'sdfsdfsdf','2023-07-23 11:38:46','',5,100);
/*!40000 ALTER TABLE `domains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mails`
--

DROP TABLE IF EXISTS `mails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mails` (
  `id` int(11) NOT NULL,
  `active` varchar(45) NOT NULL DEFAULT '0',
  `domain_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(85) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `modify` varchar(45) DEFAULT 'NOW()',
  `created__admin` int(11) NOT NULL,
  `modify_admin` int(11) DEFAULT NULL,
  `token` varchar(85) NOT NULL,
  `accountGlpi` tinyint(1) DEFAULT 0,
  `accountChat` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `MAIL_IDX` (`email`),
  KEY `DOMAIN_IDX` (`active`,`domain_id`),
  KEY `TOKEN_IDX` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mails`
--

LOCK TABLES `mails` WRITE;
/*!40000 ALTER TABLE `mails` DISABLE KEYS */;
/*!40000 ALTER TABLE `mails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `name` varchar(35) NOT NULL,
  `url` varchar(255) NOT NULL,
  `description` varchar(120) DEFAULT NULL,
  `com_checked` tinyint(1) NOT NULL DEFAULT 0,
  `com_disabled` tinyint(1) NOT NULL DEFAULT 0,
  `onInstall` text DEFAULT NULL,
  `onUninstall` text DEFAULT NULL,
  `onRegisterUser` text DEFAULT NULL,
  `onDeleteUser` text DEFAULT NULL,
  `onExec` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SERVICE_IDX` (`name`,`active`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES
(1,1,'SOGo','http://192.168.0.3/SOGo','Dostęp do poczty internetowej',1,1,NULL,NULL,NULL,NULL,NULL),
(2,1,'WorkFlow','http://workflow/','ądzanie zasobami,projektami,zadaniami',0,0,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-23 18:33:25
