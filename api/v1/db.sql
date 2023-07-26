-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: admin_panel
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

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
-- Table structure for table `account_services`
--

USE admin_panel;

DROP TABLE IF EXISTS `account_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_services` (
  `active` int(1) NOT NULL DEFAULT 1,
  `account_id` int(11) NOT NULL,
  `service_id` varchar(45) NOT NULL,
  KEY `ACTIVE_IDX` (`active`),
  KEY `ADMIN_IDX` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_services`
--

LOCK TABLES `account_services` WRITE;
/*!40000 ALTER TABLE `account_services` DISABLE KEYS */;
INSERT INTO `account_services` VALUES (1,2,'1'),(1,2,'2'),(1,3,'1'),(1,4,'1'),(1,4,'2'),(1,5,'1'),(1,6,'1'),(1,7,'1');
/*!40000 ALTER TABLE `account_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id_account` int(11) NOT NULL AUTO_INCREMENT,
  `active` int(1) NOT NULL DEFAULT 1,
  `username` varchar(45) NOT NULL,
  `password` varchar(120) NOT NULL,
  `type` enum('global','dedicated') NOT NULL DEFAULT 'dedicated',
  `name` varchar(65) NOT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `changed` datetime DEFAULT NULL,
  PRIMARY KEY (`id_account`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,1,'GlobalAdmin','0ec02c60874b9c472bf80a568fba27d3','global','Administrator globalny','2023-07-25 15:09:57',NULL),(2,1,'admin@@heban.net','test1234','dedicated','admin','2023-07-25 15:10:46',NULL),(3,1,'admin2@@admin.com','123456789','dedicated','admin2','2023-07-25 15:16:28',NULL),(4,1,'admin@@coms.pl','123456789','dedicated','admin','2023-07-25 15:20:00',NULL),(5,1,'fghfghf@fghfghfg','11111111','dedicated','fghfgh','2023-07-25 15:21:52',NULL),(6,1,'admin@test.com','11111111111','dedicated','admin','2023-07-25 15:22:53',NULL),(7,1,'kot@alamakota','111111111111','dedicated','kot','2023-07-25 15:43:55',NULL);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company` (
  `id_company` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nip` varchar(10) NOT NULL,
  `name` varchar(200) NOT NULL,
  `city` varchar(120) NOT NULL,
  PRIMARY KEY (`id_company`),
  UNIQUE KEY `NIP_IDX` (`nip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domain_accounts`
--

DROP TABLE IF EXISTS `domain_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domain_accounts` (
  `domain_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `is_admin` int(1) NOT NULL DEFAULT 0,
  KEY `DOMAINS_IDX` (`domain_id`,`account_id`,`is_admin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain_accounts`
--

LOCK TABLES `domain_accounts` WRITE;
/*!40000 ALTER TABLE `domain_accounts` DISABLE KEYS */;
INSERT INTO `domain_accounts` VALUES (1,2,1),(3,3,1),(4,4,1),(5,5,1),(6,6,1),(7,7,1);
/*!40000 ALTER TABLE `domain_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domain_services`
--

DROP TABLE IF EXISTS `domain_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domain_services` (
  `active` int(1) unsigned NOT NULL DEFAULT 1,
  `domain_id` int(10) unsigned NOT NULL,
  `service_id` int(11) unsigned NOT NULL,
  KEY `DOMAIN_IDX` (`domain_id`),
  KEY `ACTIVE_IDX` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain_services`
--

LOCK TABLES `domain_services` WRITE;
/*!40000 ALTER TABLE `domain_services` DISABLE KEYS */;
INSERT INTO `domain_services` VALUES (1,1,1),(1,1,2),(1,2,1),(1,3,1),(1,4,1),(1,4,2),(1,5,1),(1,6,1),(1,7,1);
/*!40000 ALTER TABLE `domain_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domains`
--

DROP TABLE IF EXISTS `domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domains` (
  `id_domain` int(11) NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `domain` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `comment` varchar(255) DEFAULT NULL,
  `limit_admins` int(11) NOT NULL DEFAULT -1,
  `limit_mails` int(11) NOT NULL DEFAULT -1,
  PRIMARY KEY (`id_domain`,`domain`),
  UNIQUE KEY `DOMAIN_IDX` (`domain`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domains`
--

LOCK TABLES `domains` WRITE;
/*!40000 ALTER TABLE `domains` DISABLE KEYS */;
INSERT INTO `domains` VALUES (1,1,'heban.net','2023-07-25 15:10:46','',5,100),(2,1,'heban.pl','2023-07-25 15:13:58','',5,100),(3,1,'admin.com','2023-07-25 15:16:28','',5,100),(4,1,'coms.pl','2023-07-25 15:20:00','',5,100),(5,1,'fghfghfg','2023-07-25 15:21:52','',5,100),(6,1,'test.com','2023-07-25 15:22:53','',5,100),(7,1,'alamakota','2023-07-25 15:43:54','',5,100);
/*!40000 ALTER TABLE `domains` ENABLE KEYS */;
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
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,1,'SOGo','http://192.168.0.3/SOGo','Dostęp do poczty internetowej',1,1,NULL,NULL,NULL,NULL,NULL),(2,1,'WorkFlow','http://workflow/','ądzanie zasobami,projektami,zadaniami',0,0,NULL,NULL,NULL,NULL,NULL),(3,1,'Chat','http://111','Chat',0,0,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'admin_panel'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DeleteAdmin` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteAdmin`(Id int)
BEGIN
	DELETE FROM `admin_panel`.`admins_services` WHERE admin_id=Id;
    DELETE FROM `admin_panel`.`domain_admins` WHERE admin_id=Id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DeleteDomain` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteDomain`(IN DomainID int)
BEGIN
	DECLARE finished INTEGER DEFAULT 0;
	DECLARE AdministratorID INT;

	
	DECLARE curAdmins
		CURSOR FOR 
			SELECT id_admin FROM admins WHERE id_admin IN (SELECT admin_id FROM domain_admins WHERE domain_id=DomainID);

	
	DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished = 1;

	START TRANSACTION;
    
    DELETE FROM domain_services WHERE domain_id=DomainID;
    DELETE FROM domains WHERE id=DomainID LIMIT 1;
    
	OPEN curAdmins;

	getAdmins: LOOP
		FETCH curAdmins INTO AdministratorID;
		IF finished = 1 THEN 
			LEAVE getAdmins;
		END IF;
		
		CALL DeleteAdmin(AdministratorID);
	END LOOP getAdmins;
	CLOSE curAdmins;
    
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-26 13:45:40
