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
-- Table structure for table `accounts`
--
CREATE USER 'adminUI'@'localhost' IDENTIFIED BY 'adminUI';
GRANT SELECT,INSERT,UPDATE,DELETE ON admin_panel.* TO 'adminUI'@'localhost';
FLUSH PRIVILEGES;


DROP TABLE IF EXISTS `accounts_quota`;
CREATE TABLE `admin_panel`.`accounts_quota` (
  `account_id` INT UNSIGNED NOT NULL,
  `size` BIGINT(20) NOT NULL DEFAULT 0,
  `use_bytes` BIGINT(20) NOT NULL DEFAULT 0,
  INDEX `fk_account_quota_1_idx` (`account_id` ASC) VISIBLE,
  CONSTRAINT `fk_account_quota_1`
    FOREIGN KEY (`account_id`)
    REFERENCES `admin_panel`.`accounts` (`account_id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


DROP TABLE IF EXISTS `clients_quota`;
CREATE TABLE `admin_panel`.`clients_quota` (
  `client_id` INT UNSIGNED NOT NULL,
  `size` BIGINT(20) NOT NULL DEFAULT 0,
  INDEX `fk_clients_quota_1_idx` (`client_id` ASC) VISIBLE,
  CONSTRAINT `fk_clients_quota_1`
    FOREIGN KEY (`client_id`)
    REFERENCES `admin_panel`.`clients` (`client_id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE `admin_panel`.`jobs_work` (
  `job_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `created` VARCHAR(45) NOT NULL DEFAULT 'NOW()',
  `runscript` VARCHAR(45) NOT NULL,
  `scriptargs` VARCHAR(255) NULL,
  `username` VARCHAR(65) NOT NULL,
  `desc` TEXT(1024) NULL,
  PRIMARY KEY (`job_id`))
ENGINE = MyISAM;
DROP TRIGGER IF EXISTS `admin_panel`.`jobs_work_AFTER_DELETE`;

DELIMITER $$
USE `admin_panel`$$
CREATE DEFINER=`root`@`localhost` TRIGGER `admin_panel`.`jobs_work_AFTER_DELETE` AFTER DELETE ON `jobs_work` FOR EACH ROW
BEGIN
	INSERT INTO `admin_panel`.`events_logs` (event_created, event_type, username, event_desc) VALUES
    (NOW(), 'removeAccount', OLD.username, OLD.desc);
END$$
DELIMITER ;



CREATE TABLE `admin_panel`.`events_log` (
  `event_created` DATETIME DEFAULT NOW(),
  `event_type` ENUM('addClient', 'updateClient', 'deleteClient', 'changePassword', 'addDomain', 'updateDomain', 'deleteDomain', 'addAccount', 'updateAccount', 'removeAccount', 'login', 'logout', 'fail-login') NOT NULL,
  `username` VARCHAR(65) NOT NULL,
  `event_desc` TEXT(1024) NOT NULL,
  INDEX `event_type_IDX` (`event_type` ASC) VISIBLE)
ENGINE = MyISAM;




DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `account_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `active` int(1) NOT NULL DEFAULT 1,
  `username` varchar(45) NOT NULL,
  `password` varchar(65) NOT NULL,
  `domain_id` int(10) unsigned NOT NULL,
  `client_id` int(10) unsigned NOT NULL,
  `name` varchar(45) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `changed` varchar(45) DEFAULT NULL,
  `mail` varchar(85) DEFAULT NULL,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `name_UNIQUE` (`username`),
  KEY `fk_accounts_1_idx` (`domain_id`),
  KEY `fk_accounts_2_idx` (`client_id`),
  CONSTRAINT `fk_accounts_1` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`domain_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_accounts_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES
(1,1,'d.marcisz@salonyhoff.pl','test',5,7,'test1','2023-08-05 22:56:15',NULL),
(2,0,'pkul@salonyhoff.pl','test',5,7,'test2','2023-08-05 22:56:41',NULL),
(3,1,'test@salonyhoff.pl','16d7a4fca7442dda3ad93c9a726597e4',5,7,'test','2023-08-06 10:26:41',NULL),
(4,1,'test@heban.net','16d7a4fca7442dda3ad93c9a726597e4',4,7,'Test','2023-08-06 10:28:24',NULL),
(5,1,'workflow@salonyhoff.pl','16d7a4fca7442dda3ad93c9a726597e4',5,7,'Workflow','2023-08-06 21:12:33',NULL);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts_services`
--

DROP TABLE IF EXISTS `accounts_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts_services` (
  `account_id` int(10) unsigned DEFAULT NULL,
  `service_id` int(10) unsigned DEFAULT NULL,
  KEY `index1` (`account_id`,`service_id`),
  KEY `fk_accounts_services_2_idx` (`service_id`),
  CONSTRAINT `fk_accounts_services_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON UPDATE NO ACTION,
  CONSTRAINT `fk_accounts_services_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`) ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts_services`
--

LOCK TABLES `accounts_services` WRITE;
/*!40000 ALTER TABLE `accounts_services` DISABLE KEYS */;
INSERT INTO `accounts_services` VALUES
(3,1),
(4,1),
(5,2);
/*!40000 ALTER TABLE `accounts_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(10) unsigned DEFAULT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(120) NOT NULL,
  `type` enum('global','dedicated') NOT NULL DEFAULT 'dedicated',
  `name` varchar(65) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `changed` varchar(45) DEFAULT NULL,
  `mail` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `fk_admins_1_idx` (`client_id`),
  CONSTRAINT `fk_admins_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES
(1,NULL,'GlobalAdmin','0ec02c60874b9c472bf80a568fba27d3','global','Dariusz Marcisz','2023-01-01 12:00:00','2023-08-05 21:07:30','test@mail.pl'),
(16,7,'admin@3331111111','16d7a4fca7442dda3ad93c9a726597e4','dedicated','Heban','2023-08-05 05:59:49',NULL,''),
(17,7,'admin2@3331111111','16d7a4fca7442dda3ad93c9a726597e4','dedicated','Heban 2','2023-08-05 07:46:03',NULL,''),
(20,NULL,'pkul','16d7a4fca7442dda3ad93c9a726597e4','global','Paweł','2023-08-05 08:22:43',NULL,'');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`client_id`),
  UNIQUE KEY `NIP_IDX` (`nip`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES
(2,'2222222222','asdastest233aaa','test222fggsss','test2@com.pl',2),
(7,'3331111111','heban','Kraków','heban@net.pl',2),
(8,'6999444778','ai lab','Kraków','biuro@ailab.pl',5);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients_services`
--

DROP TABLE IF EXISTS `clients_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients_services` (
  `active` varchar(45) DEFAULT '1',
  `client_id` int(10) unsigned NOT NULL,
  `service_id` int(10) unsigned NOT NULL,
  `limit_accounts` int(11) NOT NULL,
  KEY `ACTIVE_IDX` (`active`),
  KEY `fk_clients_services_2_idx` (`service_id`),
  KEY `clients_services_ibfk_1` (`client_id`),
  CONSTRAINT `clients_services_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON UPDATE NO ACTION,
  CONSTRAINT `clients_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`) ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients_services`
--

LOCK TABLES `clients_services` WRITE;
/*!40000 ALTER TABLE `clients_services` DISABLE KEYS */;
INSERT INTO `clients_services` VALUES
('1',2,1,8),
('1',2,2,2),
('1',7,1,4),
('1',7,2,1),
('1',8,1,2);
/*!40000 ALTER TABLE `clients_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domains`
--

DROP TABLE IF EXISTS `domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domains` (
  `domain_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(10) unsigned NOT NULL,
  `name` varchar(85) NOT NULL,
  `limit_mails` int(11) NOT NULL DEFAULT 100,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`domain_id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `fk_domains_1_idx` (`client_id`),
  CONSTRAINT `fk_domains_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domains`
--

LOCK TABLES `domains` WRITE;
/*!40000 ALTER TABLE `domains` DISABLE KEYS */;
INSERT INTO `domains` VALUES
(4,7,'heban.net',100,'2023-08-05 06:03:47'),
(5,7,'salonyhoff.pl',100,'2023-08-05 06:03:58'),
(6,8,'ailab.pl',100,'2023-08-05 23:03:49');
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-06 21:40:42
