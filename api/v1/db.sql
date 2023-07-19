/*
SQLyog Community v13.1.9 (64 bit)
MySQL - 10.4.28-MariaDB : Database - admin_panel
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`admin_panel` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;

USE `admin_panel`;

/*Table structure for table `accounts` */

DROP TABLE IF EXISTS `accounts`;

CREATE TABLE `accounts` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `accounts` */

/*Table structure for table `admins` */

DROP TABLE IF EXISTS `admins`;

CREATE TABLE `admins` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(120) NOT NULL,
  `type` enum('global','dedicated') NOT NULL DEFAULT 'dedicated',
  `name` varchar(65) NOT NULL,
  `comment` varchar(45) DEFAULT NULL,
  `createdAccountMail` tinyint(1) DEFAULT 1,
  `createdAccountGlpi` tinyint(1) DEFAULT 0,
  `createdAccountChat` tinyint(1) DEFAULT 0,
  `createdAccountFiles` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `admins` */

insert  into `admins`(`uid`,`username`,`password`,`type`,`name`,`comment`,`createdAccountMail`,`createdAccountGlpi`,`createdAccountChat`,`createdAccountFiles`) values 
(1,'GlobalAdmin','0ec02c60874b9c472bf80a568fba27d3','global','Administrator',NULL,0,0,0,0),
(2,'admin@heban.local','0ec02c60874b9c472bf80a568fba27d3','dedicated','Admin heban.local',NULL,1,0,0,0);

/*Table structure for table `domain_admins` */

DROP TABLE IF EXISTS `domain_admins`;

CREATE TABLE `domain_admins` (
  `domain_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  KEY `index1` (`domain_id`,`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `domain_admins` */

insert  into `domain_admins`(`domain_id`,`admin_id`) values 
(1,2),
(2,2);

/*Table structure for table `domain_services` */

DROP TABLE IF EXISTS `domain_services`;

CREATE TABLE `domain_services` (
  `domain_id` int(10) unsigned NOT NULL,
  `service_id` int(11) NOT NULL,
  KEY `DOMAINSC_IDX` (`domain_id`,`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

/*Data for the table `domain_services` */

/*Table structure for table `domains` */

DROP TABLE IF EXISTS `domains`;

CREATE TABLE `domains` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `domain` varchar(255) NOT NULL,
  `created` datetime NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `limit_admins` int(11) NOT NULL DEFAULT -1,
  `limit_mails` int(11) NOT NULL DEFAULT -1,
  PRIMARY KEY (`id`,`domain`),
  UNIQUE KEY `DOMAIN_IDX` (`domain`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `domains` */

insert  into `domains`(`id`,`active`,`domain`,`created`,`comment`,`limit_admins`,`limit_mails`) values 
(1,1,'heban.local','2023-07-14 23:00:49',NULL,-1,-1),
(2,1,'salonyhoff.pl','2023-07-14 23:01:06',NULL,-1,-1);

/*Table structure for table `services` */

DROP TABLE IF EXISTS `services`;

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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

/*Data for the table `services` */

insert  into `services`(`id`,`active`,`name`,`url`,`description`,`com_checked`,`com_disabled`,`onInstall`,`onUninstall`,`onRegisterUser`,`onDeleteUser`,`onExec`) values 
(1,1,'SOGo','http://192.168.0.3/SOGo','Dostęp do poczty internetowej',1,1,NULL,NULL,NULL,NULL,NULL),
(2,1,'WorkFlow','http://workflow/','ądzanie zasobami,projektami,zadaniami',0,0,NULL,NULL,NULL,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
