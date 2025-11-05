-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: cricpulz
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,4);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `approved_news`
--

DROP TABLE IF EXISTS `approved_news`;
/*!50001 DROP VIEW IF EXISTS `approved_news`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `approved_news` AS SELECT 
 1 AS `id`,
 1 AS `title`,
 1 AS `content`,
 1 AS `created_at`,
 1 AS `author_name`,
 1 AS `approved_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,3),(2,5),(3,6),(4,7),(5,8),(6,9),(7,10),(8,11),(9,12),(10,13),(11,14),(12,16),(13,18);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_assignments`
--

DROP TABLE IF EXISTS `employee_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_assignments` (
  `assignment_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `target_type` varchar(50) NOT NULL,
  `target_id` int NOT NULL,
  `role` varchar(100) DEFAULT NULL,
  `assigned_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`assignment_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `fk_emp_assign_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_assignments`
--

LOCK TABLES `employee_assignments` WRITE;
/*!40000 ALTER TABLE `employee_assignments` DISABLE KEYS */;
INSERT INTO `employee_assignments` VALUES (1,3,'series',1,'manager','2025-10-28 22:31:49'),(9,6,'tournament',1,'scorer','2025-10-29 18:52:38'),(10,10,'series',1,'scorer','2025-10-29 19:14:33');
/*!40000 ALTER TABLE `employee_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `match`
--

DROP TABLE IF EXISTS `match`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match` (
  `match_id` int NOT NULL AUTO_INCREMENT,
  `series_id` int DEFAULT NULL,
  `team1_id` int NOT NULL,
  `team2_id` int NOT NULL,
  `venue_id` int DEFAULT NULL,
  `match_date` datetime DEFAULT NULL,
  `winner_team_id` int DEFAULT NULL,
  PRIMARY KEY (`match_id`),
  KEY `series_id` (`series_id`),
  KEY `team1_id` (`team1_id`),
  KEY `team2_id` (`team2_id`),
  KEY `winner_team_id` (`winner_team_id`),
  CONSTRAINT `match_ibfk_1` FOREIGN KEY (`series_id`) REFERENCES `series` (`series_id`),
  CONSTRAINT `match_ibfk_2` FOREIGN KEY (`team1_id`) REFERENCES `teams` (`team_id`),
  CONSTRAINT `match_ibfk_3` FOREIGN KEY (`team2_id`) REFERENCES `teams` (`team_id`),
  CONSTRAINT `match_ibfk_4` FOREIGN KEY (`winner_team_id`) REFERENCES `teams` (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match`
--

LOCK TABLES `match` WRITE;
/*!40000 ALTER TABLE `match` DISABLE KEYS */;
INSERT INTO `match` VALUES (1,3,1,2,NULL,'2023-10-08 14:00:00',1),(2,3,3,4,NULL,'2023-10-09 14:00:00',3),(3,4,5,6,NULL,'2024-06-05 18:00:00',5),(4,5,2,3,NULL,'2023-06-20 10:00:00',2),(5,7,1,4,NULL,'2023-09-10 14:00:00',1),(6,8,1,2,NULL,'2025-02-04 14:00:00',2),(7,9,8,9,NULL,'2024-03-15 14:00:00',8),(8,10,1,5,NULL,'2023-06-07 09:30:00',5),(9,11,2,3,NULL,'2024-10-03 18:00:00',2),(10,12,7,8,NULL,'2023-02-12 14:00:00',7),(11,5,7,4,NULL,NULL,NULL),(12,8,12,11,NULL,NULL,NULL),(13,8,2,8,NULL,NULL,NULL),(14,1,2,3,NULL,'2025-10-29 15:00:00',NULL),(15,1,2,3,NULL,'2025-10-29 15:00:00',NULL),(16,1,2,3,NULL,'2025-10-29 15:00:00',NULL);
/*!40000 ALTER TABLE `match` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `approved_by` int DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `reject_reason` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `author_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_author` (`author_id`),
  CONSTRAINT `fk_author` FOREIGN KEY (`author_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,'India Clinches Series Against Australia','India secured a thrilling 3-2 series win over Australia after a stellar performance by the bowlers in the final ODI.','approved',101,'2025-10-31 14:34:04',NULL,'2025-10-30 18:48:23',2),(2,'Rain Washes Out Decider Between England and Pakistan','The much-anticipated decider match between England and Pakistan was called off due to persistent rain in Manchester.','approved',101,'2025-10-31 14:34:18',NULL,'2025-10-30 18:48:23',3),(3,'New Talent Emerges in Domestic Cricket','Youngster Rohan Sharma impressed everyone with his all-round performance in the Ranji Trophy, leading his team to the finals.','pending',NULL,NULL,NULL,'2025-10-30 18:48:23',4),(4,'South Africa Announces Squad for T20 World Cup','Cricket South Africa has announced a 15-member squad for the upcoming T20 World Cup, with several young players making the cut.','approved',2,'2025-10-31 00:18:23',NULL,'2025-10-30 18:48:23',5),(5,'Controversy Over Umpiring Decisions in Asia Cup','Fans expressed frustration over multiple questionable umpiring calls in the Asia Cup semifinal between India and Sri Lanka.','rejected',3,'2025-10-31 00:18:23','Contains unverified claims about officials.','2025-10-30 18:48:23',6);
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_news_status_change` AFTER UPDATE ON `news` FOR EACH ROW BEGIN
    IF NEW.status IN ('approved', 'rejected') AND NEW.status <> OLD.status THEN
        INSERT INTO news_audit (news_id, status, changed_by)
        VALUES (NEW.id, NEW.status, NEW.approved_by);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `news_audit`
--

DROP TABLE IF EXISTS `news_audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news_audit` (
  `audit_id` int NOT NULL AUTO_INCREMENT,
  `news_id` int DEFAULT NULL,
  `status` enum('approved','rejected') DEFAULT NULL,
  `changed_by` int DEFAULT NULL,
  `changed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`audit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_audit`
--

LOCK TABLES `news_audit` WRITE;
/*!40000 ALTER TABLE `news_audit` DISABLE KEYS */;
INSERT INTO `news_audit` VALUES (1,2,'rejected',101,'2025-10-31 00:20:04'),(2,2,'approved',101,'2025-10-31 14:34:18');
/*!40000 ALTER TABLE `news_audit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player_rankings`
--

DROP TABLE IF EXISTS `player_rankings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `player_rankings` (
  `ranking_id` int NOT NULL AUTO_INCREMENT,
  `player_id` int NOT NULL,
  `ranking_type` enum('batting','bowling','allrounder') DEFAULT NULL,
  `rank` int DEFAULT NULL,
  `points` int DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ranking_id`),
  KEY `player_id` (`player_id`),
  CONSTRAINT `player_rankings_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`player_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player_rankings`
--

LOCK TABLES `player_rankings` WRITE;
/*!40000 ALTER TABLE `player_rankings` DISABLE KEYS */;
INSERT INTO `player_rankings` VALUES (1,1,'batting',1,890,'2025-10-31 00:14:02'),(2,2,'batting',2,865,'2025-10-31 00:14:02'),(3,3,'batting',3,842,'2025-10-31 00:14:02'),(4,4,'bowling',1,910,'2025-10-31 00:14:02'),(5,5,'bowling',2,887,'2025-10-31 00:14:02'),(6,6,'bowling',3,870,'2025-10-31 00:14:02'),(7,7,'allrounder',1,412,'2025-10-31 00:14:02'),(8,8,'allrounder',2,398,'2025-10-31 00:14:02'),(9,9,'allrounder',3,380,'2025-10-31 00:14:02');
/*!40000 ALTER TABLE `player_rankings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `players`
--

DROP TABLE IF EXISTS `players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `players` (
  `player_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `team_id` int DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`player_id`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `players_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players`
--

LOCK TABLES `players` WRITE;
/*!40000 ALTER TABLE `players` DISABLE KEYS */;
INSERT INTO `players` VALUES (1,'Virat Kohli',1,'India','Batsman'),(2,'Babar Azam',4,'Pakistan','Batsman'),(3,'Pat Cummins',2,'Australia','Bowler'),(4,'Ben Stokes',3,'England','All-rounder'),(5,'Kane Williamson',5,'New Zealand','Batsman'),(6,'Rohit Sharma',1,'India','Batsman'),(7,'David Warner',2,'Australia','Batsman'),(8,'Shakib Al Hasan',8,'Bangladesh','All-rounder'),(9,'Trent Boult',5,'New Zealand','Bowler'),(10,'Jos Buttler',3,'England','Wicket-keeper');
/*!40000 ALTER TABLE `players` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `series`
--

DROP TABLE IF EXISTS `series`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `series` (
  `series_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `format` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `host_country` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`series_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `series`
--

LOCK TABLES `series` WRITE;
/*!40000 ALTER TABLE `series` DISABLE KEYS */;
INSERT INTO `series` VALUES (1,'ss','ODI','International',NULL,NULL,'INDIA'),(2,'ss','ss','ss',NULL,NULL,'ss'),(3,'ind vs sa','ODI','International',NULL,NULL,'ind'),(4,'T20 World Cup 2024','T20','International','2024-06-01','2024-06-29','USA'),(5,'Ashes 2023','Test','International','2023-06-16','2023-07-31','England'),(6,'Border-Gavaskar Trophy','Test','International','2023-02-09','2023-03-13','India'),(7,'Asia Cup 2023','ODI','International','2023-09-01','2023-09-17','Pakistan'),(8,'Champions Trophy 2025','ODI','International','2025-02-01','2025-02-25','Pakistan'),(9,'Tri-Nation Series','ODI','International','2024-03-10','2024-03-25','Bangladesh'),(10,'World Test Championship Final','Test','International','2023-06-07','2023-06-12','England'),(11,'T20 Tri-Series','T20','International','2024-10-01','2024-10-10','Australia'),(12,'ICC Women?s T20 World Cup','T20','International','2023-02-10','2023-02-26','South Africa'),(13,'ICC ODI World Cup 2023','ODI','International','2023-10-05','2023-11-19','India'),(14,'123','ODI','International',NULL,NULL,'INDIA'),(15,'nn','ODI','Franchise',NULL,NULL,'INDIA'),(16,'Ind vs SA','ODI','International',NULL,NULL,'INDIA');
/*!40000 ALTER TABLE `series` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_rankings`
--

DROP TABLE IF EXISTS `team_rankings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_rankings` (
  `ranking_id` int NOT NULL AUTO_INCREMENT,
  `team_id` int NOT NULL,
  `ranking_type` enum('ODI','T20','Test') DEFAULT NULL,
  `rank` int DEFAULT NULL,
  `points` int DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ranking_id`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `team_rankings_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_rankings`
--

LOCK TABLES `team_rankings` WRITE;
/*!40000 ALTER TABLE `team_rankings` DISABLE KEYS */;
INSERT INTO `team_rankings` VALUES (4,1,'ODI',NULL,0,'2025-10-28 21:44:45'),(5,1,'T20',NULL,0,'2025-10-28 21:44:45'),(6,1,'Test',NULL,0,'2025-10-28 21:44:45'),(7,2,'ODI',NULL,0,'2025-10-28 21:44:45'),(8,2,'T20',NULL,0,'2025-10-28 21:44:45'),(9,2,'Test',NULL,0,'2025-10-28 21:44:45'),(10,3,'ODI',NULL,0,'2025-10-28 21:44:45'),(11,3,'T20',NULL,0,'2025-10-28 21:44:45'),(12,3,'Test',NULL,0,'2025-10-28 21:44:45'),(13,4,'ODI',NULL,0,'2025-10-28 21:44:45'),(14,4,'T20',NULL,0,'2025-10-28 21:44:45'),(15,4,'Test',NULL,0,'2025-10-28 21:44:45'),(16,5,'ODI',NULL,0,'2025-10-28 21:44:45'),(17,5,'T20',NULL,0,'2025-10-28 21:44:45'),(18,5,'Test',NULL,0,'2025-10-28 21:44:45'),(19,6,'ODI',NULL,0,'2025-10-28 21:44:45'),(20,6,'T20',NULL,0,'2025-10-28 21:44:45'),(21,6,'Test',NULL,0,'2025-10-28 21:44:45'),(22,7,'ODI',NULL,0,'2025-10-28 21:44:45'),(23,7,'T20',NULL,0,'2025-10-28 21:44:45'),(24,7,'Test',NULL,0,'2025-10-28 21:44:45'),(25,8,'ODI',NULL,0,'2025-10-28 21:44:45'),(26,8,'T20',NULL,0,'2025-10-28 21:44:45'),(27,8,'Test',NULL,0,'2025-10-28 21:44:45'),(28,9,'ODI',NULL,0,'2025-10-28 21:44:45'),(29,9,'T20',NULL,0,'2025-10-28 21:44:45'),(30,9,'Test',NULL,0,'2025-10-28 21:44:45'),(31,10,'ODI',NULL,0,'2025-10-28 21:44:45'),(32,10,'T20',NULL,0,'2025-10-28 21:44:45'),(33,10,'Test',NULL,0,'2025-10-28 21:44:45'),(34,11,'ODI',NULL,0,'2025-10-28 22:23:18'),(35,11,'T20',NULL,0,'2025-10-28 22:23:18'),(36,11,'Test',NULL,0,'2025-10-28 22:23:18'),(37,12,'ODI',NULL,0,'2025-10-29 18:38:51'),(38,12,'T20',NULL,0,'2025-10-29 18:38:51'),(39,12,'Test',NULL,0,'2025-10-29 18:38:51'),(40,13,'ODI',NULL,0,'2025-10-31 14:20:45'),(41,13,'T20',NULL,0,'2025-10-31 14:20:45'),(42,13,'Test',NULL,0,'2025-10-31 14:20:45'),(43,14,'ODI',NULL,0,'2025-10-31 14:31:42'),(44,14,'T20',NULL,0,'2025-10-31 14:31:42'),(45,14,'Test',NULL,0,'2025-10-31 14:31:42'),(46,15,'ODI',NULL,0,'2025-10-31 14:42:23'),(47,15,'T20',NULL,0,'2025-10-31 14:42:23'),(48,15,'Test',NULL,0,'2025-10-31 14:42:23');
/*!40000 ALTER TABLE `team_rankings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `team_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `country` varchar(100) DEFAULT NULL,
  `gender` enum('male','female','mixed') DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (1,'India','India','male','india_logo.png','International'),(2,'Australia','Australia','male','aus_logo.png','International'),(3,'England','England','male','eng_logo.png','International'),(4,'Pakistan','Pakistan','male','pak_logo.png','International'),(5,'New Zealand','New Zealand','male','nz_logo.png','International'),(6,'South Africa','South Africa','male','sa_logo.png','International'),(7,'Sri Lanka','Sri Lanka','male','sl_logo.png','International'),(8,'Bangladesh','Bangladesh','male','ban_logo.png','International'),(9,'West Indies','West Indies','male','wi_logo.png','International'),(10,'Afghanistan','Afghanistan','male','afg_logo.png','International'),(11,'INDIA','INDIA','male','','NATIONAL'),(12,'n1','INDIA','female','','National'),(13,'Test Team','India','male','logo.png','International'),(14,'Test Team','India','male','logo.png','International'),(15,'Test Team','India','male','logo.png','International');
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_team_rank_init` AFTER INSERT ON `teams` FOR EACH ROW BEGIN
    INSERT INTO team_rankings (`team_id`, `ranking_type`, `rank`, `points`)
    VALUES (NEW.team_id, 'ODI', NULL, 0);

    INSERT INTO team_rankings (`team_id`, `ranking_type`, `rank`, `points`)
    VALUES (NEW.team_id, 'T20', NULL, 0);

    INSERT INTO team_rankings (`team_id`, `ranking_type`, `rank`, `points`)
    VALUES (NEW.team_id, 'Test', NULL, 0);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tournaments`
--

DROP TABLE IF EXISTS `tournaments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournaments` (
  `tournament_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `host_country` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`tournament_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tournaments`
--

LOCK TABLES `tournaments` WRITE;
/*!40000 ALTER TABLE `tournaments` DISABLE KEYS */;
INSERT INTO `tournaments` VALUES (1,'ICC Cricket World Cup 2023','ODI','2023-10-05','2023-11-19','India'),(2,'T20 World Cup 2024','T20','2024-06-01','2024-06-29','USA'),(3,'Champions Trophy 2025','ODI','2025-02-01','2025-02-25','Pakistan'),(4,'World Test Championship 2023','Test','2023-06-07','2023-06-12','England'),(5,'Asia Cup 2023','ODI','2023-09-01','2023-09-17','Pakistan'),(6,'Tri-Nation Series 2024','ODI','2024-03-10','2024-03-25','Bangladesh'),(7,'Border-Gavaskar Trophy','Test','2023-02-09','2023-03-13','India'),(8,'Ashes 2023','Test','2023-06-16','2023-07-31','England'),(9,'ICC Women?s T20 WC','T20','2023-02-10','2023-02-26','South Africa'),(10,'T20 Tri-Series 2024','T20','2024-10-01','2024-10-10','Australia'),(11,'new','ODI','2025-10-30','2025-10-31','INDIA'),(12,'n22','Bilateral','2025-10-24','2025-10-30','INDIA');
/*!40000 ALTER TABLE `tournaments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,'sss','ss@gmail.com','$2b$10$0ANqLRmC9acVkRURTtxRsueU0k0qqpiSOoa0Y04P2WaM7f0rtaxuW',''),(3,'shreyas','123@gmail.com','$2b$10$ZzI1yxUNhC.A6V8ixQTPZOXhNPBHcyPSzUiCNJa9kgjzcNGUEir1.',NULL),(4,'Shreyas G Shetty','Shreyas190805@gmail.com','$2b$10$VLjJWCiFL4sVhh1PGFjZQuBe24UFMzrqGyq5V01sjKt7eGtwcgATm',NULL),(5,'Rahul Mehta','rahul.mehta@example.com','$2b$10$XyZ1AbCdEfG1234567890uH/xyz1',NULL),(6,'Ananya Iyer','ananya.iyer@example.com','$2b$10$XyZ1AbCdEfG1234567890uH/xyz2',NULL),(7,'Ravi Kumar','ravi.kumar@example.com','$2b$10$XyZ1AbCdEfG1234567890uH/xyz3',NULL),(8,'Sneha Patel','sneha.patel@example.com','$2b$10$XyZ1AbCdEfG1234567890uH/xyz4',NULL),(9,'Amit Sharma','amit.sharma@example.com','$2b$10$XyZ1AbCdEfG1234567890uH/xyz5',NULL),(10,'Priya Das','priya.das@example.com','$2b$10$XyZ1AbCdEfG1234567890uH/xyz6',NULL),(11,'Vikram Nair','vikram.nair@example.com','$2b$10$XyZ1AbCdEfG1234567890uH/xyz7',NULL),(12,'Neha Reddy','neha.reddy@example.com','$2b$10$XyZ1AbCdEfG1234567890uH/xyz8',NULL),(13,'Arjun Singh','arjun.singh@example.com','$2b$10$XyZ1AbCdEfG1234567890uH/xyz9',NULL),(14,'Divya Joshi','divya.joshi@example.com','$2b$10$XyZ1AbCdEfG1234567890uH/xyz10',NULL),(15,'John Doe','john@example.com','password123',NULL),(16,'John Doe','john11@example.com','password123',NULL),(18,'John Doe','john111@example.com','password123',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `approved_news`
--

/*!50001 DROP VIEW IF EXISTS `approved_news`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `approved_news` AS select `n`.`id` AS `id`,`n`.`title` AS `title`,`n`.`content` AS `content`,`n`.`created_at` AS `created_at`,`u`.`name` AS `author_name`,`n`.`approved_at` AS `approved_at` from (`news` `n` join `user` `u` on((`n`.`author_id` = `u`.`user_id`))) where (`n`.`status` = 'approved') */;
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

-- Dump completed on 2025-11-05 20:23:18
