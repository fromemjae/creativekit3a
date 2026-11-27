-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for osx10.10 (x86_64)
--
-- Host: localhost    Database: creativekit3a_db
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
-- Table structure for table `activity_log`
--

DROP TABLE IF EXISTS `activity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` int(10) unsigned DEFAULT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_log`
--

LOCK TABLES `activity_log` WRITE;
/*!40000 ALTER TABLE `activity_log` DISABLE KEYS */;
INSERT INTO `activity_log` VALUES (1,1,'login',NULL,NULL,'Admin User logged in successfully','127.0.0.1','2026-11-10 09:00:00'),(2,1,'create_product','product',1,'Created product: Car Charger Adapters (ACC-001)','127.0.0.1','2026-11-10 09:10:00'),(3,1,'create_product','product',2,'Created product: Car Organizers & Holders (ACC-002)','127.0.0.1','2026-11-10 09:25:00'),(4,2,'login',NULL,NULL,'Staff Maria Santos logged in successfully','192.168.1.5','2026-11-11 10:00:00'),(5,2,'update_quote','quote',2,'Assigned Quote #2 to Maria Santos and set to reviewing','192.168.1.5','2026-11-11 10:45:00'),(6,1,'create_product','product',15,'Created product: Corporate Jackets (APP-004)','127.0.0.1','2026-11-12 11:30:00'),(7,3,'login',NULL,NULL,'Staff Juan Cruz logged in successfully','192.168.1.10','2026-11-13 14:00:00'),(8,3,'update_quote','quote',4,'Updated Quote #4 status to accepted','192.168.1.10','2026-11-13 16:50:00'),(9,1,'create_user','user',4,'Registered new staff account: Regina Reyes','127.0.0.1','2026-11-14 09:20:00'),(10,2,'update_quote','quote',3,'Sent quotation for Quote #3 (200 jackets)','192.168.1.5','2026-11-15 15:00:00');
/*!40000 ALTER TABLE `activity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(160) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT 'fa-box',
  `sku_prefix` varchar(20) DEFAULT NULL COMMENT 'Suggested SKU prefix in the product form',
  `default_specs` varchar(255) DEFAULT NULL COMMENT 'Suggested specs in the product form',
  `image` varchar(255) DEFAULT NULL COMMENT 'Category banner (assets/images/categories/)',
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_cat_slug` (`slug`),
  KEY `idx_parent` (`parent_id`),
  CONSTRAINT `fk_cat_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,NULL,'Accessories & Gadgets','accessories-gadgets','Browse our full range of custom accessories, gadgets, tech items, and desk essentials — perfect for corporate giveaways and events.','fa-mobile-alt','ACC-GEN','Custom Logo Branding Included','/assets/images/categories/accessories-gadgets.png',1,1,'2026-11-24 17:19:38'),(2,NULL,'Apparel','apparel','Custom-printed caps, jackets, shirts, and uniforms for your brand, team, or event.','fa-tshirt','APP-COR','Cotton/Polyester Blend • Custom Embroidery','/assets/images/categories/apparel.png',2,1,'2026-11-24 17:19:38'),(3,NULL,'Bags & Pouches','bags-pouches','Custom bags for every purpose — from backpacks to eco bags, laptop bags, totes, and travel luggage.','fa-shopping-bag','BAG-TOT','Eco-Friendly Canvas • Reinforced Handles','/assets/images/categories/bags-pouches.png',3,1,'2026-11-24 17:19:38'),(4,NULL,'Drinkware','drinkware','Custom tumblers, mugs, water bottles, and drinkware — great for corporate gifts, events, and everyday use.','fa-coffee','DRK-TUM','Double-Walled Insulated • BPA-Free','/assets/images/categories/drinkware.png',4,1,'2026-11-24 17:19:38'),(5,NULL,'Gift Set','giftset','Curated gift sets for corporate events, onboarding, wellness, travel, and occasions — fully branded for your company.','fa-gift','GFT-SET','Curated 3-Piece Executive Gift Set','/assets/images/categories/giftset.png',5,1,'2026-11-24 17:19:38'),(6,NULL,'Home Living','home-living','Branded home & lifestyle items — from cleaning essentials and outdoor chairs to personal care and portable fans.','fa-home','HOM-LIV','Household Grade • Custom Box Packaging','/assets/images/categories/home-living.png',6,1,'2026-11-24 17:19:38'),(7,NULL,'Pen & Paper','pen-paper','Custom pens, notebooks, journals, planners, and stationery sets — ideal for corporate giveaways and office use.','fa-pen','PEN-BAM','Bamboo Barrel • Blue/Black Ink Cartridge','/assets/images/categories/pen-paper.png',7,1,'2026-11-24 17:19:38'),(8,NULL,'PU Leather','pu-leather','Elegant PU leather products for corporate gifting — wallets, card cases, organizers, keychains, and more.','fa-briefcase','LEA-CRD','Premium PU Leather • Debossed Logo','/assets/images/categories/pu-leather.png',8,1,'2026-11-24 17:19:38'),(9,1,'Car Accessories','car-accessories',NULL,'fa-tag','ACC-CC','12V-24V Input • Smart Charging IC',NULL,1,1,'2026-11-24 17:19:38'),(10,1,'Computer Accessories','computer-accessories',NULL,'fa-tag','ACC-PC','Plug & Play • High-Speed USB 3.0',NULL,2,1,'2026-11-24 17:19:38'),(11,1,'Desk Accessories','desk-accessories',NULL,'fa-tag','ACC-DK','Eco Material • Desktop Organizer',NULL,3,1,'2026-11-24 17:19:38'),(12,1,'Mobile Accessories','mobile-accessories',NULL,'fa-tag','ACC-MB','Fast Charging • Compact Portable',NULL,4,1,'2026-11-24 17:19:38'),(13,1,'Gadgets','gadgets',NULL,'fa-tag','ACC-GD','Rechargeable Battery • Portable',NULL,5,1,'2026-11-24 17:19:38'),(14,2,'Caps','caps',NULL,'fa-tag',NULL,NULL,NULL,1,1,'2026-11-24 17:19:38'),(15,2,'Jackets','jackets',NULL,'fa-tag',NULL,NULL,NULL,2,1,'2026-11-24 17:19:38'),(16,2,'Shirts','shirts',NULL,'fa-tag',NULL,NULL,NULL,3,1,'2026-11-24 17:19:38'),(17,3,'Backpacks','backpacks',NULL,'fa-tag',NULL,NULL,NULL,1,1,'2026-11-24 17:19:38'),(18,3,'Eco Bags','eco-bags',NULL,'fa-tag',NULL,NULL,NULL,2,1,'2026-11-24 17:19:38'),(19,3,'Laptop Bags','laptop-bags',NULL,'fa-tag',NULL,NULL,NULL,3,1,'2026-11-24 17:19:38'),(20,3,'Tote Bags','tote-bags',NULL,'fa-tag',NULL,NULL,NULL,4,1,'2026-11-24 17:19:38'),(21,3,'Travel Bags','travel-bags',NULL,'fa-tag',NULL,NULL,NULL,5,1,'2026-11-24 17:19:38'),(22,3,'Lunch Bags','lunch-bags',NULL,'fa-tag',NULL,NULL,NULL,6,1,'2026-11-24 17:19:38'),(23,3,'Organizer Pouches','organizer-pouches',NULL,'fa-tag',NULL,NULL,NULL,7,1,'2026-11-24 17:19:38'),(24,4,'Tumblers & Flasks','tumblers-and-flasks',NULL,'fa-tag',NULL,NULL,NULL,1,1,'2026-11-24 17:19:38'),(25,4,'Mugs & Cups','mugs-and-cups',NULL,'fa-tag',NULL,NULL,NULL,2,1,'2026-11-24 17:19:38'),(26,4,'Water Bottles','water-bottles',NULL,'fa-tag',NULL,NULL,NULL,3,1,'2026-11-24 17:19:38'),(27,4,'Eco-Friendly','eco-friendly',NULL,'fa-tag',NULL,NULL,NULL,4,1,'2026-11-24 17:19:38'),(28,5,'Corporate','corporate',NULL,'fa-tag',NULL,NULL,NULL,1,1,'2026-11-24 17:19:38'),(29,5,'Lifestyle','lifestyle',NULL,'fa-tag',NULL,NULL,NULL,2,1,'2026-11-24 17:19:38'),(30,5,'Health & Wellness','health-and-wellness',NULL,'fa-tag',NULL,NULL,NULL,3,1,'2026-11-24 17:19:38'),(31,6,'Kitchen & Dining','kitchen-and-dining',NULL,'fa-tag',NULL,NULL,NULL,1,1,'2026-11-24 17:19:38'),(32,6,'Personal Care','personal-care',NULL,'fa-tag',NULL,NULL,NULL,2,1,'2026-11-24 17:19:38'),(33,6,'Outdoor & Lifestyle','outdoor-and-lifestyle',NULL,'fa-tag',NULL,NULL,NULL,3,1,'2026-11-24 17:19:38'),(34,7,'Pens','pens',NULL,'fa-tag',NULL,NULL,NULL,1,1,'2026-11-24 17:19:38'),(35,7,'Paper & Notebooks','paper-and-notebooks',NULL,'fa-tag',NULL,NULL,NULL,2,1,'2026-11-24 17:19:38'),(36,8,'Wallets & Cases','wallets-and-cases',NULL,'fa-tag',NULL,NULL,NULL,1,1,'2026-11-24 17:19:38'),(37,8,'Organizers & Bags','organizers-and-bags',NULL,'fa-tag',NULL,NULL,NULL,2,1,'2026-11-24 17:19:38'),(38,8,'Keychains & Tags','keychains-and-tags',NULL,'fa-tag',NULL,NULL,NULL,3,1,'2026-11-24 17:19:38');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hero_banners`
--

DROP TABLE IF EXISTS `hero_banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hero_banners` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned DEFAULT NULL,
  `eyebrow` varchar(100) DEFAULT NULL,
  `title` varchar(150) NOT NULL,
  `subtitle` varchar(150) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_banner_product` (`product_id`),
  CONSTRAINT `fk_banner_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hero_banners`
--

LOCK TABLES `hero_banners` WRITE;
/*!40000 ALTER TABLE `hero_banners` DISABLE KEYS */;
INSERT INTO `hero_banners` VALUES (1,15,'Showcase Your Brand with','CUSTOM CORPORATE JACKETS',NULL,'Stylish and durable custom corporate jackets for events, recognition, and giveaways.','/assets/images/hero/slide-1-custom-corporate-jackets.png',1,1,'2026-11-24 17:19:38'),(2,34,'Get Your','BAMBOO TUMBLER','with your desired design','We specialize in rush orders and make custom item personalization quick and easy.','/assets/images/hero/slide-2-bamboo-tumbler.png',2,1,'2026-11-24 17:19:38'),(3,81,'Elevate Your Brand Identity','CUSTOM LOGO TOTE BAGS',NULL,'Premium custom corporate giveaways and high-quality printing services tailored for your business needs.','/assets/images/hero/slide-3-custom-logo-tote-bags.png',3,1,'2026-11-24 17:19:38');
/*!40000 ALTER TABLE `hero_banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_variants` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `variant_type` varchar(50) DEFAULT NULL COMMENT 'Filter tab key, e.g. single | dual',
  `variant_label` varchar(100) DEFAULT NULL COMMENT 'Filter tab label, e.g. Single Port',
  `type_order` smallint(6) NOT NULL DEFAULT 0,
  `name` varchar(200) NOT NULL,
  `specs` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `image` varchar(512) DEFAULT NULL,
  `badge` varchar(50) DEFAULT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_variant_product` (`product_id`),
  CONSTRAINT `fk_variant_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,1,'single','Single Port',1,'Single USB-A Car Charger','5V / 2.1A • USB-A • Compact',85.00,'/assets/images/items/car-charger-adapter--single-usb-a-car-charger.png',NULL,1,'2026-11-24 17:19:38'),(2,1,'single','Single Port',1,'Single USB-C Car Charger','5V / 3A • USB-C • Compact',95.00,'/assets/images/items/car-charger-adapter--single-usb-c-car-charger.png','New',2,'2026-11-24 17:19:38'),(3,1,'dual','Dual Port',2,'Dual Port USB-A Charger','2x USB-A • 3.1A Total • Logo Printing',110.00,'/assets/images/items/car-charger-adapter--dual-port-usb-a-charger.png','Best Seller',3,'2026-11-24 17:19:38'),(4,2,'seatback','Seat-Back',1,'Seat-Back Organizer (5 Pocket)','Oxford Cloth • 5 Pockets • Fits All Seats',120.00,'/assets/images/items/car-organizers--seat-back-organizer-5-pocket.png','Best Seller',1,'2026-11-24 17:19:38'),(5,2,'seatback','Seat-Back',1,'Seat-Back Tablet Holder','Fits 7\"–10\" Tablets • Adjustable Strap',145.00,'/assets/images/items/car-organizers--seat-back-tablet-holder.png',NULL,2,'2026-11-24 17:19:38'),(6,2,'console','Console',2,'Center Console Organizer','PU Leather • Armrest Box Insert',195.00,'/assets/images/items/car-organizers--center-console-organizer.png',NULL,3,'2026-11-24 17:19:38'),(7,2,'console','Console',2,'Cup & Card Holder Insert','Fits Standard Cup Holders • Logo Pad',135.00,'/assets/images/items/car-organizers--cup-and-card-holder-insert.png',NULL,4,'2026-11-24 17:19:38'),(8,2,'dashboard','Dashboard',3,'Dashboard Phone Mount & Tray','Non-Slip Mat • Multi-Device Tray',110.00,'/assets/images/items/car-organizers--dashboard-phone-mount-and-tray.png',NULL,5,'2026-11-24 17:19:38'),(9,2,'dashboard','Dashboard',3,'Magnetic Dashboard Mount','360° Rotation • Universal Phone Fit',125.00,'/assets/images/items/car-organizers--magnetic-dashboard-mount.png','New',6,'2026-11-24 17:19:38'),(10,3,'single','Single Lens',1,'1080p Full HD Dash Cam','1080p • 140° FOV • Loop Recording',450.00,'/assets/images/items/car-dashcams--1080p-full-hd-dash-cam.png',NULL,1,'2026-11-24 17:19:38'),(11,3,'single','Single Lens',1,'2K QHD Night Vision Dash Cam','2K • Night Vision • G-Sensor • WDR',680.00,'/assets/images/items/car-dashcams--2k-qhd-night-vision-dash-cam.png','Popular',2,'2026-11-24 17:19:38'),(12,3,'single','Single Lens',1,'4K Ultra HD Dash Cam','4K • Sony Sensor • Parking Mode',950.00,'/assets/images/items/car-dashcams--4k-ultra-hd-dash-cam.png','Premium',3,'2026-11-24 17:19:38'),(13,3,'dual','Dual Lens',2,'Dual-Lens Front & Rear','FHD + FHD • Front & Rear • 170° FOV',780.00,'/assets/images/items/car-dashcams--dual-lens-front-and-rear.png',NULL,4,'2026-11-24 17:19:38'),(14,3,'dual','Dual Lens',2,'Dual-Lens 4K + 1080p','4K Front + 1080p Rear • GPS Logger',1100.00,'/assets/images/items/car-dashcams--dual-lens-4k-1080p.png','New',5,'2026-11-24 17:19:38'),(15,3,'360','360°',3,'360° Interior & Exterior Cam','360° Cabin View • IR Night Vision • 4CH',1350.00,'/assets/images/items/car-dashcams--360-interior-and-exterior-cam.png',NULL,6,'2026-11-24 17:19:38'),(16,4,'earphone','Earphones',1,'Wired Earphones (3.5mm)','3.5mm Jack • In-Ear • Logo Print',95.00,'/assets/images/items/computer-audio--wired-earphones-3-5mm.png',NULL,1,'2026-11-24 17:19:38'),(17,4,'earphone','Earphones',1,'TWS Wireless Earbuds','Bluetooth 5.0 • TWS • Charging Case',380.00,'/assets/images/items/computer-audio--tws-wireless-earbuds.png','Best Seller',2,'2026-11-24 17:19:38'),(18,4,'headset','Headsets',2,'USB Mono Headset','USB • Noise Cancelling Mic • Foldable',180.00,'/assets/images/items/computer-audio--usb-mono-headset.png',NULL,3,'2026-11-24 17:19:38'),(19,4,'headset','Headsets',2,'Wireless Over-Ear Headset','BT 5.0 • 20hr Battery • Foldable',560.00,'/assets/images/items/computer-audio--wireless-over-ear-headset.png','Premium',4,'2026-11-24 17:19:38'),(20,4,'speaker','Speakers',3,'Mini Bluetooth Speaker','BT 5.0 • IPX5 • 6hr Battery',280.00,'/assets/images/items/computer-audio--mini-bluetooth-speaker.png',NULL,5,'2026-11-24 17:19:38'),(21,4,'speaker','Speakers',3,'Cylindrical BT Speaker','360° Sound • BT 5.0 • Fabric Body',450.00,'/assets/images/items/computer-audio--cylindrical-bt-speaker.png','New',6,'2026-11-24 17:19:38'),(22,8,'slim','Slim / Card',1,'Card-Style Power Bank 5,000mAh','5,000mAh • Credit Card Size • USB-C',350.00,'/assets/images/items/mobile-powerbanks--card-style-power-bank-5-000mah.png',NULL,1,'2026-11-24 17:19:38'),(23,8,'slim','Slim / Card',1,'Slim Bar 8,000mAh','8,000mAh • Slim Body • Dual Output',420.00,'/assets/images/items/mobile-powerbanks--slim-bar-8-000mah.png','Best Seller',2,'2026-11-24 17:19:38'),(24,8,'standard','Standard 10,000mAh',2,'Standard 10,000mAh Power Bank','10,000mAh • USB-A + USB-C • 18W PD',480.00,'/assets/images/items/mobile-powerbanks--standard-10-000mah-power-bank.png',NULL,3,'2026-11-24 17:19:38'),(25,8,'standard','Standard 10,000mAh',2,'Premium 10,000mAh with Display','10,000mAh • LED Display • 22.5W Fast',580.00,'/assets/images/items/mobile-powerbanks--premium-10-000mah-with-display.png','New',4,'2026-11-24 17:19:38'),(26,8,'high','High Capacity',3,'20,000mAh High Capacity','20,000mAh • 65W PD • Airline Safe',780.00,'/assets/images/items/mobile-powerbanks--20-000mah-high-capacity.png',NULL,5,'2026-11-24 17:19:38'),(27,8,'high','High Capacity',3,'30,000mAh Rugged Power Bank','30,000mAh • IP67 • Solar Panel',980.00,'/assets/images/items/mobile-powerbanks--30-000mah-rugged-power-bank.png','Premium',6,'2026-11-24 17:19:38'),(28,8,'solar','Solar',4,'Solar Charging Power Bank','10,000mAh • Solar + USB-C • Rugged',650.00,'/assets/images/items/mobile-powerbanks--solar-charging-power-bank.png','Eco',7,'2026-11-24 17:19:38'),(29,34,'small','350ml',1,'Bamboo Tumbler 350ml','350ml • Bamboo Shell • Stainless Liner',220.00,'/assets/images/items/tumbler-bamboo--bamboo-tumbler-350ml.png',NULL,1,'2026-11-24 17:19:38'),(30,34,'medium','500ml',2,'Bamboo Tumbler 500ml','500ml • Bamboo Shell • Leak-Proof Lid',250.00,'/assets/images/items/tumbler-bamboo--bamboo-tumbler-500ml.png','Best Seller',2,'2026-11-24 17:19:38'),(31,34,'large','700ml',3,'Bamboo Tumbler 700ml','700ml • Bamboo Shell • Wide Mouth',290.00,'/assets/images/items/tumbler-bamboo--bamboo-tumbler-700ml.png',NULL,3,'2026-11-24 17:19:38'),(32,34,'medium','500ml',2,'Bamboo Travel Flask 500ml','500ml • Flask Shape • Gift Box Option',310.00,'/assets/images/items/tumbler-bamboo--bamboo-travel-flask-500ml.png','New',4,'2026-11-24 17:19:38'),(33,61,'ballpoint','Ballpoint',1,'Classic Metal Ballpoint','Twist Mechanism • Refillable • Chrome',55.00,'/assets/images/items/pen-metal--classic-metal-ballpoint.png',NULL,1,'2026-11-24 17:19:38'),(34,61,'ballpoint','Ballpoint',1,'Slim Executive Ballpoint','Slim Body • Satin Finish • Laser Engrave',75.00,'/assets/images/items/pen-metal--slim-executive-ballpoint.png','Best Seller',2,'2026-11-24 17:19:38'),(35,61,'ballpoint','Ballpoint',1,'Capacitive Stylus Ballpoint','Ballpoint + Stylus Tip • Multi-Surface',95.00,'/assets/images/items/pen-metal--capacitive-stylus-ballpoint.png','New',3,'2026-11-24 17:19:38'),(36,61,'rollerball','Rollerball',2,'Metal Rollerball Pen','Fine 0.5mm Tip • Smooth Flow Ink',110.00,'/assets/images/items/pen-metal--metal-rollerball-pen.png',NULL,4,'2026-11-24 17:19:38'),(37,61,'rollerball','Rollerball',2,'Executive Rollerball w/ Case','Rollerball • Velvet Pouch Included',180.00,'/assets/images/items/pen-metal--executive-rollerball-w-case.png','Premium',5,'2026-11-24 17:19:38'),(38,61,'giftset','Gift Set',3,'2-Pen Presentation Gift Set','1x Ballpoint + 1x Rollerball • Box Included',220.00,'/assets/images/items/pen-metal--2-pen-presentation-gift-set.png',NULL,6,'2026-11-24 17:19:38'),(39,61,'giftset','Gift Set',3,'3-Pen Executive Gift Set','Ballpoint + Rollerball + Pencil • Leather Box',380.00,'/assets/images/items/pen-metal--3-pen-executive-gift-set.png','Premium',7,'2026-11-24 17:19:38');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(10) unsigned NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `specs` varchar(255) DEFAULT NULL,
  `price_min` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '0.00 = Ask for Quote',
  `image` varchar(255) DEFAULT '/assets/images/placeholder.png',
  `badge` varchar(50) DEFAULT NULL,
  `status` enum('active','draft','archived') NOT NULL DEFAULT 'active',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` int(10) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_sku` (`sku`),
  KEY `idx_slug` (`slug`),
  KEY `idx_category` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_featured` (`is_featured`),
  KEY `fk_prod_creator` (`created_by`),
  CONSTRAINT `fk_prod_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_prod_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,9,'Car Charger Adapters','car-charger-adapter','ACC-001','Custom-branded car charger adapters — ideal for corporate giveaways, events, and everyday use. Choose from single-port, dual-port, and fast-charge variants.',NULL,85.00,'/assets/images/items/car-charger-adapter.png','Best Seller','active',1,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(2,9,'Car Organizers & Holders','car-organizers','ACC-002','Keep your car tidy and your brand visible. Choose from seat-back organizers, console trays, cup holders, and more — all customizable with your company logo.',NULL,120.00,'/assets/images/items/car-organizers.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(3,9,'Dash Cams','car-dashcams','ACC-003','Brand your fleet or gift your clients a dash cam. Choose from single-lens, dual-lens, and 360° variants — all customizable with your company logo on the casing.',NULL,450.00,'/assets/images/items/car-dashcams.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(4,10,'Audio Accessories','computer-audio','ACC-004','Custom-branded earphones, headsets, and speakers for corporate giveaways, events, and WFH kits.',NULL,95.00,'/assets/images/items/computer-audio.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(5,10,'Mouse & Mouse Pads','computer-mouse','ACC-005','Custom-branded mouse & mouse pads from our Computer Accessories line — ideal for corporate giveaways and events.',NULL,75.00,'/assets/images/items/computer-mouse.png',NULL,'active',1,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(6,11,'Desk Organizers & Pen Holders','desk-organizers','ACC-006','Custom-branded desk organizers & pen holders from our Desk Accessories line — ideal for corporate giveaways and events.',NULL,95.00,'/assets/images/items/desk-organizers.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(7,11,'Clocks & Timepieces','desk-clocks','ACC-007','Custom-branded clocks & timepieces from our Desk Accessories line — ideal for corporate giveaways and events.',NULL,220.00,'/assets/images/items/desk-clocks.png',NULL,'active',1,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(8,12,'Mobile Power Banks','mobile-powerbanks','ACC-008','Keep devices charged on the go. Corporate-branded power banks available in slim card-style, standard, and high-capacity options.',NULL,350.00,'/assets/images/items/mobile-powerbanks.png','Best Seller','active',1,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(9,12,'Mobile Stands','mobile-stands','ACC-009','Custom-branded mobile stands from our Mobile Accessories line — ideal for corporate giveaways and events.',NULL,65.00,'/assets/images/items/mobile-stands.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(10,13,'Portable Fans','gadgets-portable-fans','ACC-010','Custom-branded portable fans from our Gadgets line — ideal for corporate giveaways and events.',NULL,180.00,'/assets/images/items/gadgets-portable-fans.png',NULL,'active',1,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(11,13,'Power Banks','gadgets-powerbanks','ACC-011','Custom-branded power banks from our Gadgets line — ideal for corporate giveaways and events.',NULL,380.00,'/assets/images/items/gadgets-powerbanks.png','Premium','active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(12,14,'Baseball Cap','cap-baseball','APP-001','Custom-branded baseball cap from our Caps line — ideal for corporate giveaways and events.',NULL,180.00,'/assets/images/items/cap-baseball.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(13,14,'Bucket Hat','cap-bucket-hat','APP-002','Custom-branded bucket hat from our Caps line — ideal for corporate giveaways and events.',NULL,190.00,'/assets/images/items/cap-bucket-hat.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(14,15,'Bomber Jackets','jacket-bomber','APP-003','Custom-branded bomber jackets from our Jackets line — ideal for corporate giveaways and events.',NULL,650.00,'/assets/images/items/jacket-bomber.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(15,15,'Corporate Jackets','jackets-corporate','APP-004','Custom-branded corporate jackets from our Jackets line — ideal for corporate giveaways and events.',NULL,720.00,'/assets/images/items/jackets-corporate.png','New','active',1,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(16,15,'Hoodies','jacket-hoodies','APP-005','Custom-branded hoodies from our Jackets line — ideal for corporate giveaways and events.',NULL,480.00,'/assets/images/items/jacket-hoodies.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(17,15,'Varsity Jackets','jacket-varsity-jackets','APP-006','Custom-branded varsity jackets from our Jackets line — ideal for corporate giveaways and events.',NULL,800.00,'/assets/images/items/jacket-varsity-jackets.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(18,16,'Collared Shirt','shirt-collared','APP-007','Custom-branded collared shirt from our Shirts line — ideal for corporate giveaways and events.',NULL,280.00,'/assets/images/items/shirt-collared.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(19,16,'Dri Fit Shirt','shirt-dri-fit','APP-008','Custom-branded dri fit shirt from our Shirts line — ideal for corporate giveaways and events.',NULL,250.00,'/assets/images/items/shirt-dri-fit.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(20,16,'Round Neck Shirt','shirt-round-neck','APP-009','Custom-branded round neck shirt from our Shirts line — ideal for corporate giveaways and events.',NULL,220.00,'/assets/images/items/shirt-round-neck.png',NULL,'active',0,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(21,17,'Computer Backpacks','backpacks-computer','BAG-001','Custom-branded computer backpacks from our Backpacks line — ideal for corporate giveaways and events.',NULL,480.00,'/assets/images/items/backpacks-computer.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(22,17,'Sports Backpacks','backpacks-sports','BAG-002','Custom-branded sports backpacks from our Backpacks line — ideal for corporate giveaways and events.',NULL,420.00,'/assets/images/items/backpacks-sports.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(23,17,'Travel Backpacks','backpacks-travel','BAG-003','Custom-branded travel backpacks from our Backpacks line — ideal for corporate giveaways and events.',NULL,550.00,'/assets/images/items/backpacks-travel.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(24,18,'Foldable Shopping Totes','ecobags-shopping-tote','BAG-004','Custom-branded foldable shopping totes from our Eco Bags line — ideal for corporate giveaways and events.',NULL,95.00,'/assets/images/items/ecobags-shopping-tote.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(25,18,'Non Woven Shopping Bags','ecobags-non-woven','BAG-005','Custom-branded non woven shopping bags from our Eco Bags line — ideal for corporate giveaways and events.',NULL,75.00,'/assets/images/items/ecobags-non-woven.png',NULL,'active',0,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(26,19,'Laptop Backpacks','laptop-backpack','BAG-006','Custom-branded laptop backpacks from our Laptop Bags line — ideal for corporate giveaways and events.',NULL,520.00,'/assets/images/items/laptop-backpack.png',NULL,'active',1,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(27,19,'Laptop Shoulder Bags','laptop-shoulder-bag','BAG-007','Custom-branded laptop shoulder bags from our Laptop Bags line — ideal for corporate giveaways and events.',NULL,450.00,'/assets/images/items/laptop-shoulder-bag.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(28,20,'Classic Zip Totes','tote-bag-classic-zip','BAG-008','Custom-branded classic zip totes from our Tote Bags line — ideal for corporate giveaways and events.',NULL,120.00,'/assets/images/items/tote-bag-classic-zip.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(29,20,'Foldable Totes','tote-bag-foldable-zip','BAG-009','Custom-branded foldable totes from our Tote Bags line — ideal for corporate giveaways and events.',NULL,95.00,'/assets/images/items/tote-bag-foldable-zip.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(30,21,'Duffel Travel Bags','travel-bag-duffel','BAG-010','Custom-branded duffel travel bags from our Travel Bags line — ideal for corporate giveaways and events.',NULL,680.00,'/assets/images/items/travel-bag-duffel.png',NULL,'active',0,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(31,21,'Weekender Travel Bag','travel-bag-weekender','BAG-011','Custom-branded weekender travel bag from our Travel Bags line — ideal for corporate giveaways and events.',NULL,750.00,'/assets/images/items/travel-bag-weekender.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(32,22,'Hand Carry Lunch Bags','lunch-bag-hand-carry','BAG-012','Custom-branded hand carry lunch bags from our Lunch Bags line — ideal for corporate giveaways and events.',NULL,180.00,'/assets/images/items/lunch-bag-hand-carry.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(33,23,'Clutch Pouches','organizer-clutch-pouche','BAG-013','Custom-branded clutch pouches from our Organizer Pouches line — ideal for corporate giveaways and events.',NULL,95.00,'/assets/images/items/organizer-clutch-pouche.png',NULL,'archived',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(34,24,'Bamboo Tumblers','tumbler-bamboo','DRK-001','Eco-friendly bamboo tumblers with stainless steel liner — a perfect sustainable corporate giveaway. Available in multiple sizes and color wrap options.',NULL,220.00,'/assets/images/items/tumbler-bamboo.png','Eco-Friendly','active',1,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(35,24,'Insulated & Double-Walled','tumbler-insulated','DRK-002','Custom-branded insulated & double-walled from our Tumblers & Flasks line — ideal for corporate giveaways and events.',NULL,280.00,'/assets/images/items/tumbler-insulated.png',NULL,'draft',0,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(36,24,'Stainless Steel Tumblers','tumbler-stainless','DRK-003','Custom-branded stainless steel tumblers from our Tumblers & Flasks line — ideal for corporate giveaways and events.',NULL,310.00,'/assets/images/items/tumbler-stainless.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(37,25,'Ceramic Mugs','mugs-ceramic','DRK-004','Custom-branded ceramic mugs from our Mugs & Cups line — ideal for corporate giveaways and events.',NULL,95.00,'/assets/images/items/mugs-ceramic.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(38,25,'Coffee Mugs','mugs-coffee','DRK-005','Custom-branded coffee mugs from our Mugs & Cups line — ideal for corporate giveaways and events.',NULL,110.00,'/assets/images/items/mugs-coffee.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(39,25,'Travel Mugs with Lids','mugs-travel-mugs','DRK-006','Custom-branded travel mugs with lids from our Mugs & Cups line — ideal for corporate giveaways and events.',NULL,195.00,'/assets/images/items/mugs-travel-mugs.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(40,25,'Stainless Steel Mugs','mugs-stainless','DRK-007','Custom-branded stainless steel mugs from our Mugs & Cups line — ideal for corporate giveaways and events.',NULL,165.00,'/assets/images/items/mugs-stainless.png',NULL,'active',0,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(41,26,'BPA-Free Bottles','water-bottle-bpa','DRK-008','Custom-branded bpa-free bottles from our Water Bottles line — ideal for corporate giveaways and events.',NULL,120.00,'/assets/images/items/water-bottle-bpa.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(42,26,'Sports Bottles','water-bottle-sports','DRK-009','Custom-branded sports bottles from our Water Bottles line — ideal for corporate giveaways and events.',NULL,140.00,'/assets/images/items/water-bottle-sports.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(43,27,'Bamboo Drinkware','eco-friendly-bamboo','DRK-010','Custom-branded bamboo drinkware from our Eco-Friendly line — ideal for corporate giveaways and events.',NULL,195.00,'/assets/images/items/eco-friendly-bamboo.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(44,29,'Active Outdoors Gift Sets','gift-set-active-outdoors','GFT-001','Custom-branded active outdoors gift sets from our Lifestyle line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/gift-set-active-outdoors.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(45,28,'Desk Essentials Gift Sets','gift-set-desk-essentials','GFT-002','Custom-branded desk essentials gift sets from our Corporate line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/gift-set-desk-essentials.png',NULL,'active',0,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(46,28,'Employee Onboarding Sets','gift-set-employee-onboarding','GFT-003','Custom-branded employee onboarding sets from our Corporate line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/gift-set-employee-onboarding.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(47,28,'Gadget Gift Sets','gift-set-gadget','GFT-004','Custom-branded gadget gift sets from our Corporate line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/gift-set-gadget.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(48,30,'Health & Wellness Gift Sets','gift-set-health-wellness','GFT-005','Custom-branded health & wellness gift sets from our Health & Wellness line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/gift-set-health-wellness.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(49,29,'Sustainable Gift Sets','gift-set-sustainable','GFT-006','Custom-branded sustainable gift sets from our Lifestyle line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/gift-set-sustainable.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(50,28,'Work From Home Gift Sets','gift-set-work-from-home','GFT-007','Custom-branded work from home gift sets from our Corporate line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/gift-set-work-from-home.png',NULL,'active',0,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(51,29,'Travel Executive Gift Sets','gift-set-travel-executive','GFT-008','Custom-branded travel executive gift sets from our Lifestyle line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/gift-set-travel-executive.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(52,31,'Cleaning Essentials','home-living-cleaning-essentials','HOM-001','Custom-branded cleaning essentials from our Kitchen & Dining line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/home-living-cleaning-essentials.png',NULL,'active',1,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(53,31,'Cutlery Sets','home-living-cutlery-sets','HOM-002','Custom-branded cutlery sets from our Kitchen & Dining line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/home-living-cutlery-sets.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(54,32,'Hand Towels','home-living-hand-towels','HOM-003','Custom-branded hand towels from our Personal Care line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/home-living-hand-towels.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(55,32,'Personal Care','home-living-personal-care','HOM-004','Custom-branded personal care from our Personal Care line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/home-living-personal-care.png',NULL,'active',0,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(56,32,'Pillows','home-living-pillows','HOM-005','Custom-branded pillows from our Personal Care line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/home-living-pillows.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(57,33,'Outdoor Chairs','home-living-outdoor-chairs','HOM-006','Custom-branded outdoor chairs from our Outdoor & Lifestyle line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/home-living-outdoor-chairs.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(58,33,'Portable Fans','home-living-portable-fans','HOM-007','Custom-branded portable fans from our Outdoor & Lifestyle line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/home-living-portable-fans.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(59,33,'Lifestyle Gift Sets','home-living-lifestyle','HOM-008','Custom-branded lifestyle gift sets from our Outdoor & Lifestyle line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/home-living-lifestyle.png',NULL,'draft',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(60,34,'Bamboo Pens','pen-bamboo','PEN-001','Custom-branded bamboo pens from our Pens line — ideal for corporate giveaways and events.',NULL,35.00,'/assets/images/items/pen-bamboo.png',NULL,'active',0,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(61,34,'Metal Pens','pen-metal','PEN-002','Sleek metal ballpoint and rollerball pens — a timeless corporate giveaway. Laser-engrave your logo for a premium executive look.',NULL,55.00,'/assets/images/items/pen-metal.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(62,34,'Multi-Functional Pens','pen-multi-functional','PEN-003','Custom-branded multi-functional pens from our Pens line — ideal for corporate giveaways and events.',NULL,75.00,'/assets/images/items/pen-multi-functional.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(63,34,'Plastic Pens','pen-plastic','PEN-004','Custom-branded plastic pens from our Pens line — ideal for corporate giveaways and events.',NULL,22.00,'/assets/images/items/pen-plastic.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(64,34,'Pen Gift Sets','pen-gift-set','PEN-005','Custom-branded pen gift sets from our Pens line — ideal for corporate giveaways and events.',NULL,120.00,'/assets/images/items/pen-gift-set.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(65,35,'Custom Notebooks & Journals','paper-notebooks-journals','PEN-006','Custom-branded custom notebooks & journals from our Paper & Notebooks line — ideal for corporate giveaways and events.',NULL,95.00,'/assets/images/items/paper-notebooks-journals.png',NULL,'active',0,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(66,35,'Custom Desk Calendars','paper-desk-calendars','PEN-007','Custom-branded custom desk calendars from our Paper & Notebooks line — ideal for corporate giveaways and events.',NULL,120.00,'/assets/images/items/paper-desk-calendars.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(67,35,'Stationery Sets','paper-stationery-sets','PEN-008','Custom-branded stationery sets from our Paper & Notebooks line — ideal for corporate giveaways and events.',NULL,145.00,'/assets/images/items/paper-stationery-sets.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(68,35,'Memo Solutions','paper-memo-solutions','PEN-009','Custom-branded memo solutions from our Paper & Notebooks line — ideal for corporate giveaways and events.',NULL,55.00,'/assets/images/items/paper-memo-solutions.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(69,35,'Padfolios','paper-padfolios','PEN-010','Custom-branded padfolios from our Paper & Notebooks line — ideal for corporate giveaways and events.',NULL,195.00,'/assets/images/items/paper-padfolios.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(70,36,'Wallets','pu-leather-wallets','PUL-001','Custom-branded wallets from our Wallets & Cases line — ideal for corporate giveaways and events.',NULL,195.00,'/assets/images/items/pu-leather-wallets.png',NULL,'active',0,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(71,36,'Card Cases','pu-leather-card-cases','PUL-002','Custom-branded card cases from our Wallets & Cases line — ideal for corporate giveaways and events.',NULL,120.00,'/assets/images/items/pu-leather-card-cases.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(72,36,'Leather Pouches','pu-leather-pouches','PUL-003','Custom-branded leather pouches from our Wallets & Cases line — ideal for corporate giveaways and events.',NULL,145.00,'/assets/images/items/pu-leather-pouches.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(73,37,'Desk Mats','pu-leather-desk-mats','PUL-004','Custom-branded desk mats from our Organizers & Bags line — ideal for corporate giveaways and events.',NULL,220.00,'/assets/images/items/pu-leather-desk-mats.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(74,37,'Organizers','pu-leather-organizers','PUL-005','Custom-branded organizers from our Organizers & Bags line — ideal for corporate giveaways and events.',NULL,175.00,'/assets/images/items/pu-leather-organizers.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(75,37,'Gift Sets','pu-leather-gift-sets','PUL-006','Custom-branded gift sets from our Organizers & Bags line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/pu-leather-gift-sets.png',NULL,'active',0,2,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(76,37,'Travel-Related Leather Gifts','pu-leather-travel-related','PUL-007','Custom-branded travel-related leather gifts from our Organizers & Bags line — ideal for corporate giveaways and events.',NULL,0.00,'/assets/images/items/pu-leather-travel-related.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(77,38,'Keychains','pu-leather-keychains','PUL-008','Custom-branded keychains from our Keychains & Tags line — ideal for corporate giveaways and events.',NULL,65.00,'/assets/images/items/pu-leather-keychains.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(78,38,'Luggage Tags','pu-leather-luggage-tags','PUL-009','Custom-branded luggage tags from our Keychains & Tags line — ideal for corporate giveaways and events.',NULL,95.00,'/assets/images/items/pu-leather-luggage-tags.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(79,10,'Laptop & Keyboard Accessories','computer-laptop-keyboard','ACC-012','Keyboard covers, laptop stands and cable organizers with your logo.',NULL,120.00,'/assets/images/items/computer-laptop-keyboard.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(80,13,'Charging Devices','gadgets-charging-devices','ACC-013','Wireless chargers, charging docks and multi-port hubs for desks and events.',NULL,150.00,'/assets/images/items/gadgets-charging-devices.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(81,20,'Custom Logo Tote Bags','tote-bag-custom-logo','BAG-014','Reusable canvas and non-woven tote bags printed with your logo — great for events and expos.',NULL,85.00,'/assets/images/items/tote-bag-custom-logo.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(82,31,'Gourmet','home-living-gourmet','HOM-009','Curated gourmet treats and pantry gift boxes, branded for clients and employees.',NULL,0.00,'/assets/images/items/home-living-gourmet.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(83,34,'Sign Pens','pen-sign','PEN-011','Smooth gel and felt-tip sign pens with custom barrel printing.',NULL,45.00,'/assets/images/items/pen-sign.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(84,35,'Office Stationery','paper-office-stationery','PEN-012','Sticky notes, rulers and stationery kits printed with your brand.',NULL,60.00,'/assets/images/items/paper-office-stationery.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38'),(85,35,'Wired Notebooks','paper-wired-notebooks','PEN-013','Spiral-bound notebooks with full-color custom covers.',NULL,85.00,'/assets/images/items/paper-wired-notebooks.png',NULL,'active',0,1,'2026-11-24 17:19:38','2026-11-24 17:19:38');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quote_requests`
--

DROP TABLE IF EXISTS `quote_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quote_requests` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `company` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `product_type` varchar(100) DEFAULT NULL,
  `quantity` int(11) DEFAULT 100,
  `budget` varchar(50) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `details` text DEFAULT NULL,
  `status` enum('new','reviewing','quoted','accepted','declined') NOT NULL DEFAULT 'new',
  `assigned_to` int(10) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_quote_product` (`product_id`),
  KEY `idx_quote_assigned` (`assigned_to`),
  CONSTRAINT `fk_quote_assigned` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_quote_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quote_requests`
--

LOCK TABLES `quote_requests` WRITE;
/*!40000 ALTER TABLE `quote_requests` DISABLE KEYS */;
INSERT INTO `quote_requests` VALUES (1,1,'Carlo Reyes','TechCorp Philippines','carlo@techcorp.ph','+63 917 111 1111','Car Charger',500,'₱50,000','2026-12-15','Need custom logo printing on single USB chargers for year-end team giveaway.','new',NULL,'2026-11-10 09:15:00','2026-11-24 17:19:38'),(2,34,'Angela Lim','GreenLeaf Ventures','angela@greenleaf.com','+63 917 222 2222','Bamboo Tumbler',1000,'₱250,000','2026-12-01','Laser-engraved company logo on bamboo tumblers for annual CSR summit.','reviewing',2,'2026-11-11 10:30:00','2026-11-24 17:19:38'),(3,15,'Roberto Tan','Apex BPO Solutions','roberto@apexbpo.com','+63 917 333 3333','Corporate Jacket',200,'₱130,000','2027-01-10','Embroidered jackets for new employee onboarding welcome kits.','quoted',2,'2026-11-12 14:20:00','2026-11-24 17:19:38'),(4,8,'Lisa Chen','FinTech Innovators','lisa@fintech.co','+63 917 444 4444','Power Bank',300,'₱105,000','2026-12-20','Custom branded 10,000mAh power banks featuring corporate gradient logo.','accepted',3,'2026-11-13 16:45:00','2026-11-24 17:19:38'),(5,26,'Mark Villanueva','EventsPro Manila','mark@eventspro.ph','+63 917 555 5555','Laptop Bag',150,'₱30,000','2027-01-05','Laptop backpacks for tech conference VIP speaker tokens.','new',NULL,'2026-11-14 11:00:00','2026-11-24 17:19:38'),(6,NULL,'Sarah Garcia','Manila Heritage Council','sarah@heritage.gov.ph','+63 917 666 6666','Mixed Giveaways',2000,'₱500,000','2027-02-14','Assorted corporate giveaways for foundation anniversary: tumblers, pens, notebooks.','new',NULL,'2026-11-15 13:10:00','2026-11-24 17:19:38'),(7,5,'David Sy','Pixel Studio Design','david@pixelstudio.ph','+63 917 777 7777','Mouse Pad',1000,'₱80,000','2026-12-28','Full-color custom printed gaming-grade mouse pads for client appreciation gifts.','declined',3,'2026-11-16 15:30:00','2026-11-24 17:19:38');
/*!40000 ALTER TABLE `quote_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL COMMENT 'Bcrypt hash',
  `role` enum('admin','staff','customer') NOT NULL DEFAULT 'customer' COMMENT 'customer = registered via the storefront Register modal',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','Manager','admin@creativekit3a.com','+63 917 123 4567','$2y$12$/JvSmT2QiFAI7g2GqAKFIei.LodOsSf.NCR8p6YRcCaoy.RBEIo5O','admin',1,'2026-11-24 17:19:38','2026-11-24 17:19:38',NULL),(2,'Maria','Santos','maria@creativekit3a.com','+63 933 992 7410','$2y$12$ADGGe7Q/OVwQaN5yvItdY.zlzlFD/lUUO64ozQwwapHYANYFZeIxe','staff',1,'2026-11-24 17:19:38','2026-11-24 17:19:38',NULL),(3,'Juan','Cruz','juan@creativekit3a.com','+63 917 714 2774','$2y$12$ADGGe7Q/OVwQaN5yvItdY.zlzlFD/lUUO64ozQwwapHYANYFZeIxe','staff',1,'2026-11-24 17:19:38','2026-11-24 17:19:38',NULL),(4,'Regina','Reyes','regina@creativekit3a.com','+63 918 555 1234','$2y$12$ADGGe7Q/OVwQaN5yvItdY.zlzlFD/lUUO64ozQwwapHYANYFZeIxe','staff',1,'2026-11-24 17:19:38','2026-11-24 17:19:38',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-24 17:43:01
