-- MariaDB dump 10.19-11.1.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: admin_panel
-- ------------------------------------------------------
-- Server version	11.1.2-MariaDB

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
-- Table structure for table `accounts`
--
USE admin_pabel;



DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `account_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `active` int(1) NOT NULL DEFAULT 1,
  `username` varchar(85) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `password` varchar(65) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `domain_id` int(10) unsigned NOT NULL,
  `client_id` int(10) unsigned NOT NULL,
  `name` varchar(45) NOT NULL,
  `mail` varchar(85) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `changed` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `change_password` datetime DEFAULT NULL,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `name_UNIQUE` (`username`),
  KEY `fk_accounts_1_idx` (`domain_id`),
  KEY `fk_accounts_2_idx` (`client_id`),
  CONSTRAINT `fk_accounts_1` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`domain_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_accounts_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `accounts_quota`
--

DROP TABLE IF EXISTS `accounts_quota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts_quota` (
  `account_id` int(10) unsigned NOT NULL,
  `maxquota` bigint(20) NOT NULL DEFAULT 0,
  `use_bytes` bigint(20) NOT NULL DEFAULT 0,
  `messages` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`account_id`),
  KEY `fk_account_quota_1_idx` (`account_id`),
  CONSTRAINT `fk_account_quota_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;


/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `admin_panel`.`accounts_quota_AFTER_INSERT` AFTER INSERT ON `accounts_quota` FOR EACH ROW
BEGIN
	SET @MAIL=(SELECT username FROM accounts WHERE account_id=NEW.account_id LIMIT 1);
    INSERT INTO mail_forwardings (account_id,address,forwarding) VALUES(NEW.account_id,@MAIL,@MAIL);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `admin_panel`.`accounts_quota_BEFORE_DELETE` BEFORE DELETE ON `accounts_quota` FOR EACH ROW
BEGIN
	DELETE FROM mail_forwardings WHERE account_id=OLD.account_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `accounts_services`
--

DROP TABLE IF EXISTS `accounts_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts_services` (
  `account_id` int(10) unsigned NOT NULL,
  `service_id` int(10) unsigned NOT NULL,
  `client_id` int(10) unsigned NOT NULL,
  KEY `index1` (`account_id`,`service_id`),
  KEY `fk_accounts_services_2_idx` (`service_id`),
  KEY `fk_accounts_services_3_idx` (`service_id`,`client_id`),
  CONSTRAINT `fk_accounts_services_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON UPDATE NO ACTION,
  CONSTRAINT `fk_accounts_services_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`) ON UPDATE NO ACTION,
  CONSTRAINT `fk_accounts_services_3` FOREIGN KEY (`service_id`, `client_id`) REFERENCES `clients_services` (`service_id`, `client_id`) ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(10) unsigned DEFAULT NULL,
  `username` varchar(65) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `password` varchar(65) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `type` enum('global','dedicated') NOT NULL DEFAULT 'dedicated',
  `name` varchar(65) NOT NULL,
  `mail` varchar(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `changed` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `change_password` datetime DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `fk_admins_1_idx` (`client_id`),
  CONSTRAINT `fk_admins_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES
(1,NULL,'GlobalAdmin','f36ce1a4e44a154fa2fff77b18235397','global','Dariusz Marcisz','test@mail.pl','2023-01-01 12:00:00','2023-08-26 10:21:54','2023-09-03 12:12:31','2023-08-26 10:21:54'),
(2,NULL,'k.klimczyk','bf058be667ba9a24f3dd3f4c5f83ba2a','global','Krzysztof Klimczyk','k.klimczyk@heban.net','2023-08-26 09:21:45',NULL,NULL,NULL),
(3,NULL,'pkul','bf058be667ba9a24f3dd3f4c5f83ba2a','global','Paweł Kulikiewicz','','2023-08-26 09:22:17',NULL,NULL,NULL);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alias_domains`
--

DROP TABLE IF EXISTS `alias_domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alias_domains` (
  `alias_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `domain_id` int(11) unsigned NOT NULL,
  `alias_domain` varchar(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `target_domain` varchar(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`alias_id`),
  UNIQUE KEY `alias_domain_UNIQUE` (`alias_domain`),
  KEY `fk_alias_domains_1_idx` (`domain_id`),
  CONSTRAINT `fk_alias_domains_1` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`domain_id`) ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `client_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nip` varchar(10) NOT NULL,
  `name` varchar(200) NOT NULL,
  `city` varchar(120) NOT NULL,
  `mail` varchar(85) NOT NULL,
  `limit_admins` int(10) unsigned NOT NULL DEFAULT 5,
  `maxquota` bigint(20) DEFAULT 0,
  PRIMARY KEY (`client_id`),
  UNIQUE KEY `NIP_IDX` (`nip`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `clients_services`
--

DROP TABLE IF EXISTS `clients_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients_services` (
  `client_id` int(10) unsigned NOT NULL,
  `service_id` int(10) unsigned NOT NULL,
  `limit_accounts` int(11) NOT NULL,
  UNIQUE KEY `clients_services_uidx` (`client_id`,`service_id`),
  KEY `fk_clients_services_2_idx` (`service_id`),
  CONSTRAINT `fk_clients_services_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON UPDATE NO ACTION,
  CONSTRAINT `fk_clients_services_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`) ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `domains`
--

DROP TABLE IF EXISTS `domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domains` (
  `domain_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(10) unsigned NOT NULL,
  `name` varchar(85) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`domain_id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `fk_domains_1_idx` (`client_id`),
  CONSTRAINT `fk_domains_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `events_log`
--

DROP TABLE IF EXISTS `events_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events_log` (
  `event_created` datetime DEFAULT current_timestamp(),
  `event_type` enum('addClient','updateClient','deleteClient','changePassword','addDomain','updateDomain','deleteDomain','addAccount','updateAccount','removeAccount','login','logout','fail-login') NOT NULL,
  `username` varchar(65) NOT NULL,
  `event_desc` text NOT NULL,
  KEY `event_type_IDX` (`event_type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jobs_work`
--

DROP TABLE IF EXISTS `jobs_work`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs_work` (
  `job_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `startJob` datetime NOT NULL DEFAULT current_timestamp(),
  `runscript` varchar(45) NOT NULL,
  `scriptargs` varchar(255) DEFAULT NULL,
  `username` varchar(65) NOT NULL,
  `desc` text DEFAULT NULL,
  PRIMARY KEY (`job_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;


/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `admin_panel`.`jobs_work_AFTER_DELETE` AFTER DELETE ON `jobs_work` FOR EACH ROW
BEGIN
	INSERT INTO events_log (event_created, event_type, username, event_desc) VALUES (NOW(), 'removeAccount', OLD.username, OLD.desc);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mail_forwardings`
--

DROP TABLE IF EXISTS `mail_forwardings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mail_forwardings` (
  `forward_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `account_id` int(10) unsigned NOT NULL,
  `address` varchar(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `forwarding` varchar(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `alias` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`forward_id`),
  KEY `ACCOUNT_IDX` (`account_id`),
  KEY `ALIAS_DX` (`alias`),
  KEY `ADDRESS_IDX` (`address`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin COMMENT='alias = 0 - adres główny\nalias = 1 - alians\nalias = 2 - forward';
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `service_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(35) NOT NULL,
  `url` varchar(255) NOT NULL,
  `description` varchar(120) DEFAULT NULL,
  `limit_accounts` int(11) DEFAULT 100,
  `onInstall` text DEFAULT NULL,
  `onUninstall` text DEFAULT NULL,
  `onRegisterUser` text DEFAULT NULL,
  `onDeleteUser` text DEFAULT NULL,
  `onExec` text DEFAULT NULL,
  PRIMARY KEY (`service_id`),
  UNIQUE KEY `SERVICE_IDX` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES
(1,'SOGo','http://192.168.0.3/SOGo','Dostęp do poczty internetowej',1,NULL,NULL,NULL,NULL,NULL),
(2,'WorkFlow','http://workflow/','ądzanie zasobami,projektami,zadaniami',1,NULL,NULL,NULL,NULL,NULL),
(3,'Chat','http://111','Chat',1,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `sogo_contacts`
--

DROP TABLE IF EXISTS `sogo_users`;
/*!50001 DROP VIEW IF EXISTS `sogo_contacts`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `sogo_contacts` AS SELECT
 1 AS `c_uid`,
  1 AS `c_password`,
  1 AS `c_name`,
  1 AS `c_cn`,
  1 AS `mail`,
  1 AS `domain` */;
SET character_set_client = @saved_cs_client;



--
-- Final view structure for view `sogo_contacts`
--

/*!50001 DROP VIEW IF EXISTS `sogo_contacts`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `sogo_users` AS select `accounts`.`username` AS `c_uid`,`accounts`.`password` AS `c_password`,`accounts`.`name` AS `c_name`,`accounts`.`name` AS `c_cn`,`accounts`.`username` AS `mail`,`domains`.`name` AS `domain` from (`accounts` left join `domains` on(`domains`.`domain_id` = `accounts`.`domain_id`)) where `accounts`.`account_id` in (select `accounts_quota`.`account_id` from `accounts_quota`) and `accounts`.`active` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-03 12:42:18
