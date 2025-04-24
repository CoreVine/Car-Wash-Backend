-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: car-wash
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ads`
--
USE `car-wash`;
DROP TABLE IF EXISTS `ads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ads` (
  `ad_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`ad_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `carbrand`
--

DROP TABLE IF EXISTS `carbrand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carbrand` (
  `brand_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `logo` varchar(255) NOT NULL,
  PRIMARY KEY (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `carorders`
--

DROP TABLE IF EXISTS `carorders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carorders` (
  `car_order_id` int unsigned NOT NULL AUTO_INCREMENT,
  `car_id` int unsigned NOT NULL,
  `orders_order_id` int unsigned NOT NULL,
  PRIMARY KEY (`car_order_id`),
  KEY `fk_carorders_orders1_idx` (`orders_order_id`),
  KEY `car_id` (`car_id`),
  CONSTRAINT `carorders_ibfk_63` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON UPDATE CASCADE,
  CONSTRAINT `carorders_ibfk_64` FOREIGN KEY (`orders_order_id`) REFERENCES `cart` (`order_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cars`
--

DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cars` (
  `car_id` int unsigned NOT NULL AUTO_INCREMENT,
  `sale_or_rental` enum('sale','rent') NOT NULL,
  `company_id` int unsigned NOT NULL,
  `model` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `exhibition_id` int unsigned NOT NULL,
  `carbrand_id` int NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`car_id`,`sale_or_rental`),
  KEY `company_id` (`company_id`),
  KEY `exhibition_id` (`exhibition_id`),
  KEY `cars_brand_fk_idx` (`carbrand_id`),
  CONSTRAINT `cars_brand_fk` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`),
  CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_10` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_100` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_11` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_12` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_13` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_14` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_15` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_16` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_17` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_18` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_19` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_2` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_20` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_21` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_22` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_23` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_24` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_25` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_26` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_27` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_28` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_29` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_3` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_30` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_31` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_32` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_33` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_34` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_35` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_36` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_37` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_38` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_39` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_4` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_40` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_41` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_42` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_43` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_44` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_45` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_46` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_47` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_48` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_49` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_5` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_50` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_51` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_52` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_53` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_54` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_55` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_56` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_57` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_58` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_59` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_6` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_60` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_61` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_62` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_63` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_64` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_65` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_66` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_67` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_68` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_69` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_7` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_70` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_71` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_72` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_73` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_74` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_75` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_76` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_77` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_78` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_79` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_8` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_80` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_81` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_82` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_83` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_84` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_85` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_86` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_87` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_88` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_89` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_9` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_90` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_91` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_92` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_93` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_94` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_95` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_96` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_97` FOREIGN KEY (`exhibition_id`) REFERENCES `companyexhibition` (`exhibition_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_98` FOREIGN KEY (`carbrand_id`) REFERENCES `carbrand` (`brand_id`) ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_99` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=446 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `order_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `status` enum('cart','pending','complete') NOT NULL DEFAULT 'cart',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_10` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_12` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_14` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_16` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_18` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_20` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_21` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_22` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_23` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_24` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_25` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_26` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_27` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_28` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_29` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_30` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_31` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_32` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=483 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `carwashorders`
--

DROP TABLE IF EXISTS `carwashorders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carwashorders` (
  `wash_order_id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int unsigned NOT NULL,
  `within_company` tinyint(1) NOT NULL COMMENT 'if it is indoors or within company''s workshop',
  `location` text NOT NULL,
  `customer_id` int unsigned NOT NULL,
  `company_id` int unsigned NOT NULL,
  PRIMARY KEY (`wash_order_id`),
  KEY `order_id` (`order_id`),
  KEY `customer_id` (`customer_id`),
  KEY `fk_carwashorders_company1_idx` (`company_id`),
  CONSTRAINT `carwashorders_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_10` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_11` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_12` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_13` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_14` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_15` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_16` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_17` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_18` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_19` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_20` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_21` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_22` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_23` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_24` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_25` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_26` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_27` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_28` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_29` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_30` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_31` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_32` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_33` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_34` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_35` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_36` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_37` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_38` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_39` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_4` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_40` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_41` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_42` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_43` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_44` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_45` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_46` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_47` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_48` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_49` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_5` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_50` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_51` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_52` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_53` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_54` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_55` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_56` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_57` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_58` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_59` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_6` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_60` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_61` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_62` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_63` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_64` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_65` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_66` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_67` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_68` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_69` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_7` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_70` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_71` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_72` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_73` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_74` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_75` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_76` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_77` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_78` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_79` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_8` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_80` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_81` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_82` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_83` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_84` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_85` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_86` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_87` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_88` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_89` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_9` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_90` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_91` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_92` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_93` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_94` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_95` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_96` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_97` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_98` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_carwashorders_company1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL COMMENT 'URL, font icon class, or file path for category icon',
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `company_id` int unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `location` text NOT NULL,
  `logo_url` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `approved` tinyint(1) NOT NULL,
  `about` text NOT NULL,
  `total_rating` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`company_id`),
  UNIQUE KEY `company_name` (`company_name`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `company_name_2` (`company_name`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `company_name_3` (`company_name`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `company_name_4` (`company_name`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `company_name_5` (`company_name`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `company_name_6` (`company_name`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `company_name_7` (`company_name`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `company_name_8` (`company_name`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `company_name_9` (`company_name`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `company_name_10` (`company_name`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `company_name_11` (`company_name`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `company_name_12` (`company_name`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `company_name_13` (`company_name`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `company_name_14` (`company_name`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `company_name_15` (`company_name`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `company_name_16` (`company_name`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `company_name_17` (`company_name`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `company_name_18` (`company_name`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `company_name_19` (`company_name`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `company_name_20` (`company_name`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `company_name_21` (`company_name`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `company_name_22` (`company_name`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `company_name_23` (`company_name`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `company_name_24` (`company_name`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `company_name_25` (`company_name`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `company_name_26` (`company_name`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `company_name_27` (`company_name`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `company_name_28` (`company_name`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `company_name_29` (`company_name`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `company_name_30` (`company_name`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `company_name_31` (`company_name`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `company_name_32` (`company_name`)
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `companydocuments`
--

DROP TABLE IF EXISTS `companydocuments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companydocuments` (
  `document_id` int unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int unsigned NOT NULL,
  `document_type` varchar(255) NOT NULL,
  `document_url` varchar(255) NOT NULL,
  `upload_date` datetime NOT NULL,
  PRIMARY KEY (`document_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `companydocuments_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_10` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_11` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_12` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_13` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_14` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_15` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_16` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_17` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_18` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_19` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_20` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_21` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_22` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_23` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_24` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_25` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_26` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_27` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_28` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_3` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_4` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_5` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_6` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_7` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_8` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companydocuments_ibfk_9` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `companyexhibition`
--

DROP TABLE IF EXISTS `companyexhibition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companyexhibition` (
  `exhibition_id` int unsigned NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL,
  `company_id` int unsigned NOT NULL,
  PRIMARY KEY (`exhibition_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `companyexhibition_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_10` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_11` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_12` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_13` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_14` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_15` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_16` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_17` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_18` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_19` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_20` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_21` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_22` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_23` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_24` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_25` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_26` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_27` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_28` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_3` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_4` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_5` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_6` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_7` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_8` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `companyexhibition_ibfk_9` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customercar`
--

DROP TABLE IF EXISTS `customercar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customercar` (
  `customer_car_id` int unsigned NOT NULL AUTO_INCREMENT,
  `model` tinytext NOT NULL,
  `car_plate_number` tinytext NOT NULL,
  `customer_id` int unsigned NOT NULL,
  PRIMARY KEY (`customer_car_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `customercar_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_10` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_11` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_12` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_13` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_14` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_15` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_16` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_17` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_18` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_19` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_20` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_21` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_22` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_23` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_24` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_25` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_26` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_27` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_28` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_4` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_5` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_6` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_7` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_8` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customercar_ibfk_9` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=246 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `user_id` int unsigned NOT NULL,
  `company_id` int unsigned NOT NULL,
  `role` enum('super-admin','manager','employee') NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`company_id`),
  UNIQUE KEY `employee_user_id_company_id_unique` (`user_id`,`company_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `employee_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `payment_method_id` tinyint unsigned NOT NULL,
  `payment_gateway_response` text NOT NULL,
  `shipping_address` text NOT NULL,
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `cart_order_id` int unsigned NOT NULL,
  `company_id` int unsigned DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_order_fk_idx` (`payment_method_id`),
  KEY `fk_order_cart1_idx` (`cart_order_id`),
  KEY `company_id` (`company_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_order_cart1` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`),
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_100` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_101` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_102` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_11` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_12` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_15` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_16` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_19` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_2` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_20` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_23` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_24` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_27` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_28` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_3` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_31` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_32` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_35` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_36` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_39` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_4` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_40` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_43` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_44` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_47` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_48` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_51` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_52` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_55` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_56` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_59` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_60` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_63` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_64` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_67` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_68` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_7` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_71` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_72` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_75` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_76` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_79` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_8` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_80` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_83` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_84` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_87` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_88` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_91` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_92` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_95` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_96` FOREIGN KEY (`cart_order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_ibfk_99` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`) ON UPDATE CASCADE,
  CONSTRAINT `payment_order_fk` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=257 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitems` (
  `order_item_id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(8,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_10` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_11` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_12` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_13` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_14` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_15` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_16` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_17` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_18` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_19` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_20` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_21` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_22` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_23` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_24` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_25` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_26` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_27` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_28` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_29` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_30` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_31` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_32` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_33` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_34` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_35` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_36` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_37` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_38` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_39` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_40` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_41` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_42` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_43` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_44` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_45` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_46` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_5` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_6` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_7` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_8` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_9` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=717 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orderstatushistory`
--

DROP TABLE IF EXISTS `orderstatushistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderstatushistory` (
  `status_history_id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int unsigned NOT NULL,
  `status` enum('pending','complete') NOT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`status_history_id`),
  KEY `orderstatushistory_ibfk_1_idx` (`order_id`),
  CONSTRAINT `orderstatushistory_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_10` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_11` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_12` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_13` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_14` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_15` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_16` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_17` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_18` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_19` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_20` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_21` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_22` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_23` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_4` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_5` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_6` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_7` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_8` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistory_ibfk_9` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=679 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `paymentmethod`
--

DROP TABLE IF EXISTS `paymentmethod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentmethod` (
  `payment_id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `name` tinytext NOT NULL,
  `public_key` varchar(100) NOT NULL,
  `secret_key` varchar(100) NOT NULL,
  PRIMARY KEY (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=155 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int unsigned NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `stock` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`product_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_10` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_11` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_12` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_13` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_14` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_15` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_16` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_17` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_18` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_19` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_20` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_21` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_22` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_23` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_3` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_4` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_5` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_6` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_7` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_8` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_9` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=371 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `productsimages`
--

DROP TABLE IF EXISTS `productsimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productsimages` (
  `image_id` int unsigned NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) NOT NULL,
  `product_id` int unsigned NOT NULL,
  PRIMARY KEY (`image_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `productsimages_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_10` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_11` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_12` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_13` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_14` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_15` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_16` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_17` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_18` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_19` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_20` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_21` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_22` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_23` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_5` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_6` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_7` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_8` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productsimages_ibfk_9` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=802 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `company_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `rating_value` decimal(8,2) NOT NULL,
  `review_text` text NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`company_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rentalcarsimages`
--

DROP TABLE IF EXISTS `rentalcarsimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rentalcarsimages` (
  `image_id` int unsigned NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) NOT NULL,
  `car_id` int unsigned NOT NULL,
  PRIMARY KEY (`image_id`),
  KEY `car_id` (`car_id`),
  CONSTRAINT `rentalcarsimages_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_10` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_11` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_12` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_13` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_14` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_15` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_16` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_17` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_18` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_19` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_20` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_21` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_22` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_23` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_3` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_4` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_5` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_6` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_7` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_8` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalcarsimages_ibfk_9` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1785 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rentalorders`
--

DROP TABLE IF EXISTS `rentalorders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rentalorders` (
  `rental_order_id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int unsigned NOT NULL,
  `car_id` int unsigned NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  PRIMARY KEY (`rental_order_id`),
  KEY `order_id` (`order_id`),
  KEY `car_id` (`car_id`),
  CONSTRAINT `rentalorders_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_10` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_11` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_12` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_13` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_14` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_15` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_16` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_17` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_18` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_19` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_20` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_21` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_22` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_23` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_24` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_25` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_26` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_27` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_28` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_29` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_30` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_31` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_32` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_33` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_34` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_35` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_36` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_37` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_38` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_39` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_4` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_40` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_41` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_42` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_43` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_44` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_5` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_6` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_7` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_8` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_9` FOREIGN KEY (`order_id`) REFERENCES `cart` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subcategory`
--

DROP TABLE IF EXISTS `subcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategory` (
  `sub_category_id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL COMMENT 'URL, font icon class, or file path for subcategory icon',
  PRIMARY KEY (`sub_category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `subcategory_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_10` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_11` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_12` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_13` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_14` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_15` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_16` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_17` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_18` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_19` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_20` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_21` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_22` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_4` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_5` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_6` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_7` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_8` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcategory_ibfk_9` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subcatproduct`
--

DROP TABLE IF EXISTS `subcatproduct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcatproduct` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `sub_category_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `subcatproduct_sub_category_id_product_id_unique` (`product_id`,`sub_category_id`),
  KEY `sub_category_id` (`sub_category_id`),
  CONSTRAINT `subcatproduct_ibfk_43` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subcatproduct_ibfk_44` FOREIGN KEY (`sub_category_id`) REFERENCES `subcategory` (`sub_category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=400 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `acc_type` enum('user','employee') NOT NULL,
  `profile_picture_url` text,
  `name` varchar(70) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `username_3` (`username`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `username_4` (`username`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `username_5` (`username`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `username_6` (`username`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `username_7` (`username`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `username_8` (`username`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `username_9` (`username`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `username_10` (`username`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `username_11` (`username`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `username_12` (`username`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `username_13` (`username`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `username_14` (`username`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `username_15` (`username`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `username_16` (`username`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `username_17` (`username`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `username_18` (`username`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `username_19` (`username`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `username_20` (`username`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `username_21` (`username`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `username_22` (`username`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `username_23` (`username`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `username_24` (`username`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `username_25` (`username`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `username_26` (`username`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `username_27` (`username`),
  UNIQUE KEY `email_27` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1259 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verification_codes`
--

DROP TABLE IF EXISTS `verification_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `code` varchar(6) NOT NULL,
  `type` enum('password_reset','email_verification','account_activation') NOT NULL DEFAULT 'password_reset',
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `reset_token` varchar(64) DEFAULT NULL,
  `token_used` tinyint(1) NOT NULL DEFAULT '0',
  `attempt_count` int NOT NULL DEFAULT '0',
  `expires_at` datetime NOT NULL,
  `account_type` enum('user','company','employee') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reset_token` (`reset_token`),
  UNIQUE KEY `reset_token_2` (`reset_token`),
  UNIQUE KEY `reset_token_3` (`reset_token`),
  UNIQUE KEY `reset_token_4` (`reset_token`),
  UNIQUE KEY `reset_token_5` (`reset_token`),
  UNIQUE KEY `reset_token_6` (`reset_token`),
  UNIQUE KEY `reset_token_7` (`reset_token`),
  UNIQUE KEY `reset_token_8` (`reset_token`),
  UNIQUE KEY `reset_token_9` (`reset_token`),
  UNIQUE KEY `reset_token_10` (`reset_token`),
  UNIQUE KEY `reset_token_11` (`reset_token`),
  UNIQUE KEY `reset_token_12` (`reset_token`),
  UNIQUE KEY `reset_token_13` (`reset_token`),
  UNIQUE KEY `reset_token_14` (`reset_token`),
  UNIQUE KEY `reset_token_15` (`reset_token`),
  UNIQUE KEY `reset_token_16` (`reset_token`),
  UNIQUE KEY `reset_token_17` (`reset_token`),
  UNIQUE KEY `reset_token_18` (`reset_token`),
  UNIQUE KEY `reset_token_19` (`reset_token`),
  UNIQUE KEY `reset_token_20` (`reset_token`),
  UNIQUE KEY `reset_token_21` (`reset_token`),
  UNIQUE KEY `reset_token_22` (`reset_token`),
  KEY `verification_code_email_type_idx` (`email`,`type`),
  KEY `verification_code_reset_token_idx` (`reset_token`),
  KEY `verification_code_expires_at_idx` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `washorderoperation`
--

DROP TABLE IF EXISTS `washorderoperation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `washorderoperation` (
  `wash_order_id` int unsigned NOT NULL,
  `employee_assigned_id` int unsigned NOT NULL,
  `operation_start_at` datetime NOT NULL,
  `operation_done_at` datetime DEFAULT NULL,
  `company_id` int unsigned NOT NULL,
  `assignedEmployeeUserId` int unsigned DEFAULT NULL,
  PRIMARY KEY (`wash_order_id`),
  KEY `employee_assigned_id` (`employee_assigned_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_1` FOREIGN KEY (`wash_order_id`) REFERENCES `carwashorders` (`wash_order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `washorderoperation_ibfk_10` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_11` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_12` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_13` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_14` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_15` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_16` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_17` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_18` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_19` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_2` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_20` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_21` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_22` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_23` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_24` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_25` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_26` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_27` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_28` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_29` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_3` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_30` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_31` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_32` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_33` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_34` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_35` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_36` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_37` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_38` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_39` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_4` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_40` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_41` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_42` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_43` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_44` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_45` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_5` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_6` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_7` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`),
  CONSTRAINT `washorderoperation_ibfk_8` FOREIGN KEY (`employee_assigned_id`) REFERENCES `employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_9` FOREIGN KEY (`company_id`) REFERENCES `employee` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `washorders_washtypes`
--

DROP TABLE IF EXISTS `washorders_washtypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `washorders_washtypes` (
  `carwashorders_order_id` int unsigned NOT NULL,
  `WashTypes_type_id` int NOT NULL,
  `paid_price` mediumint NOT NULL,
  PRIMARY KEY (`carwashorders_order_id`,`WashTypes_type_id`),
  UNIQUE KEY `washorders_washtypes_type_id_order_id_unique` (`carwashorders_order_id`,`WashTypes_type_id`),
  UNIQUE KEY `wash_order_type_unique` (`carwashorders_order_id`,`WashTypes_type_id`),
  KEY `WashTypes_type_id` (`WashTypes_type_id`),
  CONSTRAINT `washorders_washtypes_ibfk_43` FOREIGN KEY (`carwashorders_order_id`) REFERENCES `carwashorders` (`wash_order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `washorders_washtypes_ibfk_44` FOREIGN KEY (`WashTypes_type_id`) REFERENCES `washtypes` (`type_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `washtypes`
--

DROP TABLE IF EXISTS `washtypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `washtypes` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `company_id` int unsigned NOT NULL,
  `name` varchar(45) NOT NULL,
  `price` mediumint NOT NULL,
  `description` text,
  PRIMARY KEY (`type_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `washtypes_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_10` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_11` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_12` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_13` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_14` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_15` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_16` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_17` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_18` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_19` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_20` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_21` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_22` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_3` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_4` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_5` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_6` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_7` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_8` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `washtypes_ibfk_9` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb3;
