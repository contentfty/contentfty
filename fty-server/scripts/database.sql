-- MySQL dump 10.13  Distrib 5.7.22, for osx10.13 (x86_64)
--
-- Host: 127.0.0.1    Database: cf
-- ------------------------------------------------------
-- Server version	5.7.18

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
-- Table structure for table `cf_elements`
--

DROP TABLE IF EXISTS `cf_elements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cf_elements` (
  `id` char(21) COLLATE utf8_unicode_ci NOT NULL,
  `type` enum('org','entry','user','content_type','space','env') COLLATE utf8_unicode_ci NOT NULL,
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cf_elements`
--

LOCK TABLES `cf_elements` WRITE;
/*!40000 ALTER TABLE `cf_elements` DISABLE KEYS */;
/*!40000 ALTER TABLE `cf_elements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cf_entries`
--

DROP TABLE IF EXISTS `cf_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cf_entries` (
  `id` char(21) COLLATE utf8_unicode_ci NOT NULL COMMENT '内容条目 ID',
  `envId` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'master' COMMENT '空间环境 ID',
  `typeId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '内容类型 ID',
  `createdBy` char(21) COLLATE utf8_unicode_ci NOT NULL COMMENT '作者',
  `postDate` datetime DEFAULT NULL COMMENT '发布时间',
  `createdAt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedAt` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cf_entries`
--

LOCK TABLES `cf_entries` WRITE;
/*!40000 ALTER TABLE `cf_entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `cf_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cf_entrydrafts`
--

DROP TABLE IF EXISTS `cf_entrydrafts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cf_entrydrafts` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '内容条目草稿自增主键 ID',
  `entryId` char(21) COLLATE utf8_unicode_ci NOT NULL COMMENT '内容条目 ID',
  `createdBy` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '条目名称',
  `data` json NOT NULL COMMENT '条目内容',
  `createdAt` datetime NOT NULL COMMENT '创建时间',
  `updatedAt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cf_entrydrafts`
--

LOCK TABLES `cf_entrydrafts` WRITE;
/*!40000 ALTER TABLE `cf_entrydrafts` DISABLE KEYS */;
/*!40000 ALTER TABLE `cf_entrydrafts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cf_entrytypes`
--

DROP TABLE IF EXISTS `cf_entrytypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cf_entrytypes` (
  `id` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '内容类型 ID',
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '内容类型名称',
  `fields` json DEFAULT NULL COMMENT '内容类型的字段列表',
  `createdBy` char(21) COLLATE utf8_unicode_ci NOT NULL COMMENT '创建者',
  `updatedBy` char(21) COLLATE utf8_unicode_ci NOT NULL COMMENT '更新者',
  `createdAt` datetime NOT NULL COMMENT '创建时间',
  `updatedAt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cf_entrytypes`
--

LOCK TABLES `cf_entrytypes` WRITE;
/*!40000 ALTER TABLE `cf_entrytypes` DISABLE KEYS */;
INSERT INTO `cf_entrytypes` VALUES ('cate','博客文章','[]','9NWpXSZHqZ9t1AXKFuZQz','9NWpXSZHqZ9t1AXKFuZQz','2018-08-18 11:56:56','2018-08-18 11:56:56'),('posts','博客文章','[\"title\"]','8NOH4Wl0lsKgNDcY8PEII','8NOH4Wl0lsKgNDcY8PEII','2018-08-18 11:57:26','2018-08-18 11:57:26');
/*!40000 ALTER TABLE `cf_entrytypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cf_entryversions`
--

DROP TABLE IF EXISTS `cf_entryversions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cf_entryversions` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '内容条目已发布的版本自增主键 ID',
  `entryId` char(21) COLLATE utf8_unicode_ci NOT NULL COMMENT '内容条目 ID',
  `createdBy` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `fields` json NOT NULL COMMENT '条目内容',
  `notes` tinytext COLLATE utf8_unicode_ci,
  `createdAt` datetime NOT NULL COMMENT '创建时间',
  `updatedAt` datetime NOT NULL COMMENT '更新时间',
  `num` smallint(6) unsigned NOT NULL COMMENT '版本号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cf_entryversions`
--

LOCK TABLES `cf_entryversions` WRITE;
/*!40000 ALTER TABLE `cf_entryversions` DISABLE KEYS */;
/*!40000 ALTER TABLE `cf_entryversions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cf_envs`
--

DROP TABLE IF EXISTS `cf_envs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cf_envs` (
  `id` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'master',
  `spaceId` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` enum('ready','pending','failure') COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cf_envs`
--

LOCK TABLES `cf_envs` WRITE;
/*!40000 ALTER TABLE `cf_envs` DISABLE KEYS */;
/*!40000 ALTER TABLE `cf_envs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cf_fields`
--

DROP TABLE IF EXISTS `cf_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cf_fields` (
  `id` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '字段 ID',
  `typeId` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '内容类型 ID',
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '字段名称',
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '字段标题',
  `instructions` text COLLATE utf8_unicode_ci COMMENT '字段说明信息',
  `type` enum('symbol','text','integer','number','date','location','boolean','link','array','object') COLLATE utf8_unicode_ci NOT NULL COMMENT '字段的类型',
  `unique` tinyint(1) NOT NULL DEFAULT '0',
  `required` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否为必填',
  `disabled` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否为只读状态',
  `validations` json DEFAULT NULL COMMENT '内容验证规则',
  `settings` json DEFAULT NULL COMMENT '字段的外观配置',
  `updatedAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `localized` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`name`,`typeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cf_fields`
--

LOCK TABLES `cf_fields` WRITE;
/*!40000 ALTER TABLE `cf_fields` DISABLE KEYS */;
/*!40000 ALTER TABLE `cf_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cf_options`
--

DROP TABLE IF EXISTS `cf_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cf_options` (
  `key` varchar(255) NOT NULL,
  `value` json DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cf_options`
--

LOCK TABLES `cf_options` WRITE;
/*!40000 ALTER TABLE `cf_options` DISABLE KEYS */;
INSERT INTO `cf_options` VALUES ('locales','[{\"code\": \"zh-CN\", \"name\": \"Chinese (Simplified, China)\", \"default\": true, \"fallbackCode\": null}]',NULL),('roles','[{\"administrator\": {\"name\": \"Administrator\", \"capabilities\": [{\"switch_themes\": true}, {\"edit_themes\": true}, {\"activate_plugins\": true}, {\"edit_plugins\": true}, {\"edit_users\": true}, {\"edit_files\": true}, {\"manage_options\": true}, {\"moderate_comments\": true}, {\"manage_categories\": true}, {\"manage_links\": true}, {\"upload_files\": true}, {\"import\": true}, {\"edit_posts\": true}, {\"edit_others_posts\": true}, {\"edit_published_posts\": true}, {\"edit_pages\": true}, {\"edit_other_pages\": true}, {\"edit_published_pages\": true}, {\"publish_pages\": true}, {\"delete_pages\": true}, {\"delete_others_pages\": true}, {\"delete_published_pages\": true}, {\"delete_posts\": true}, {\"delete_others_posts\": true}, {\"delete_published_posts\": true}, {\"delete_private_posts\": true}, {\"edit_private_posts\": true}, {\"read_private_posts\": true}, {\"delete_private_pages\": true}, {\"edit_private_pages\": true}, {\"read_private_pages\": true}, {\"delete_users\": true}, {\"create_users\": true}, {\"unfiltered_upload\": true}, {\"edit_dashboard\": true}, {\"update_plugins\": true}, {\"delete_plugins\": true}, {\"install_plugins\": true}, {\"update_themes\": true}, {\"install_themes\": true}, {\"update_core\": true}, {\"list_users\": true}, {\"remove_users\": true}, {\"add_users\": true}, {\"promote_users\": true}, {\"edit_theme_options\": true}, {\"delete_themes\": true}, {\"export\": true}]}}, {\"contributor\": {\"name\": \"Contributor\", \"capabilities\": [{\"delete_pages\": true}, {\"delete_others_pages\": true}, {\"delete_published_pages\": true}, {\"delete_posts\": true}]}}, {\"editor\": {\"name\": \"Editor\", \"capabilities\": [{\"read\": true}, {\"moderate_comments\": true}, {\"manage_categories\": true}, {\"manage_links\": true}, {\"upload_files\": true}, {\"unfiltered_html\": true}, {\"edit_posts\": true}, {\"edit_others_posts\": true}, {\"edit_published_posts\": true}, {\"publish_posts\": true}, {\"edit_pages\": true}, {\"edit_others_pages\": true}, {\"edit_published_pages\": true}, {\"publish_pages\": true}, {\"delete_pages\": true}, {\"delete_others_pages\": true}, {\"delete_published_pages\": true}, {\"delete_posts\": true}, {\"delete_others_posts\": true}, {\"delete_published_posts\": true}, {\"delete_private_posts\": true}, {\"edit_private_posts\": true}, {\"read_private_posts\": true}, {\"delete_private_pages\": true}, {\"edit_private_pages\": true}, {\"read_private_pages\": true}]}}, {\"author\": {\"name\": \"Author\", \"capabilities\": [{\"read\": true}, {\"upload_files\": true}, {\"edit_posts\": true}, {\"edit_published_posts\": true}, {\"publish_posts\": true}, {\"delete_posts\": true}, {\"delete_published_posts\": true}]}}, {\"subscriber\": {\"name\": \"Subscriber\", \"capabilities\": [{\"read\": true}]}}]','用户角权与权限');
/*!40000 ALTER TABLE `cf_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cf_orgs`
--

DROP TABLE IF EXISTS `cf_orgs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cf_orgs` (
  `id` char(21) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdBy` char(21) COLLATE utf8_unicode_ci NOT NULL,
  `updatedBy` char(21) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cf_orgs`
--

LOCK TABLES `cf_orgs` WRITE;
/*!40000 ALTER TABLE `cf_orgs` DISABLE KEYS */;
INSERT INTO `cf_orgs` VALUES ('RnEo232InsTEWDu6V3RZl','采撷科技','8NOH4Wl0lsKgNDcY8PEII','8NOH4Wl0lsKgNDcY8PEII','2018-08-18 11:57:08','2018-08-18 11:57:08');
/*!40000 ALTER TABLE `cf_orgs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cf_spaces`
--

DROP TABLE IF EXISTS `cf_spaces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cf_spaces` (
  `id` char(12) COLLATE utf8_unicode_ci NOT NULL COMMENT '空间 ID',
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '空间名称',
  `orgId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '组织 ID',
  `createdBy` char(21) COLLATE utf8_unicode_ci NOT NULL COMMENT '创建者',
  `updatedBy` char(21) COLLATE utf8_unicode_ci NOT NULL COMMENT '更新者',
  `status` enum('ready','pending','failure') COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '空间状态',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cf_spaces`
--

LOCK TABLES `cf_spaces` WRITE;
/*!40000 ALTER TABLE `cf_spaces` DISABLE KEYS */;
/*!40000 ALTER TABLE `cf_spaces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cf_usermeta`
--

DROP TABLE IF EXISTS `cf_usermeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cf_usermeta` (
  `metaKey` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `metaValue` json DEFAULT NULL,
  `userId` varchar(21) COLLATE utf8_unicode_ci NOT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `usermeta_meta_key_index` (`metaKey`),
  KEY `usermeta_user_id_index` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cf_usermeta`
--

LOCK TABLES `cf_usermeta` WRITE;
/*!40000 ALTER TABLE `cf_usermeta` DISABLE KEYS */;
INSERT INTO `cf_usermeta` VALUES ('org_RnEo232InsTEWDu6V3RZl_capabilities','{\"role\": \"owner\", \"type\": \"org\"}','8NOH4Wl0lsKgNDcY8PEII',1);
/*!40000 ALTER TABLE `cf_usermeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cf_users`
--

DROP TABLE IF EXISTS `cf_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cf_users` (
  `id` char(21) COLLATE utf8_unicode_ci NOT NULL,
  `login` varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `displayName` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `activated` tinyint(1) DEFAULT '1',
  `confirmed` tinyint(1) DEFAULT '1',
  `activationKey` varchar(14) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deleted` tinyint(2) DEFAULT '0',
  `phone` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cf_users__user_login_uindex` (`login`),
  UNIQUE KEY `cf_users__user_email_uindex` (`email`),
  UNIQUE KEY `cf_users__user_phone_uindex` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cf_users`
--

LOCK TABLES `cf_users` WRITE;
/*!40000 ALTER TABLE `cf_users` DISABLE KEYS */;
INSERT INTO `cf_users` VALUES ('8NOH4Wl0lsKgNDcY8PEII',NULL,'$2b$10$Cmh57ISyJMgwDknpAIA1z.d/HnFl5S0YwOLGaOXC9D4ECU1X9.0Sa','hello@caixie.top',NULL,1,1,NULL,0,NULL,'2018-08-18 11:57:08','2018-08-18 11:57:08');
/*!40000 ALTER TABLE `cf_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-20 10:00:49
