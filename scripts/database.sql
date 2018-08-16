# ************************************************************

# 内容工厂数据库文脚本
#
# CONTENT FACTORY SQL
# Version 1.0
#
# https://www.contentfty.com/
#
#
# Database: cf
# Time: 2018-08-13
# ************************************************************

# 系统配置表
# ------------------------------------------------------------
CREATE TABLE `cf_options` (
  `key`   VARCHAR(255) NOT NULL,
  `value` JSON         DEFAULT NULL,
  `desc`  VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `key` (`key`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

CREATE UNIQUE INDEX `key`
  ON `cf_options` (`key`);

# 系统、空间的元素记录表
# ------------------------------------------------------------
CREATE TABLE cf_elements
(
  id         CHAR(21) PRIMARY KEY
  COMMENT '元素 ID',
  type       ENUM ('org', 'entry', 'user', 'content_type', 'space', 'env') NOT NULL
  COMMENT '元素类型',
  enabled    TINYINT(1) UNSIGNED DEFAULT '1'                               NOT NULL
  COMMENT '是否启用',
  created_at DATETIME                                                      NOT NULL,
  updated_at DATETIME                                                      NOT NULL
)
  ENGINE = InnoDB
  COLLATE = utf8_unicode_ci;

# 系统下用户的组织记录表
# ------------------------------------------------------------
CREATE TABLE cf_orgs
(
  id         CHAR(21)     NOT NULL
  COMMENT '组织 ID',
  name       VARCHAR(200) NULL
  COMMENT '组织名称',
  created_by CHAR(21)     NOT NULL
  COMMENT '创建者',
  updated_by CHAR(21)     NOT NULL
  COMMENT '更新者',
  created_at DATETIME     NULL,
  updated_at DATETIME     NULL,
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  COLLATE = utf8_unicode_ci;

# 系统下用户的空间记录表
# ------------------------------------------------------------
CREATE TABLE cf_spaces
(
  id         CHAR(12) NOT NULL
  COMMENT '空间 ID',
  name       VARCHAR(255) NOT NULL
  COMMENT '空间名称',
  org_id     CHAR(21) NULL
  COMMENT '组织 ID',
  created_by CHAR(21) NOT NULL
  COMMENT '创建者',
  updated_by CHAR(21) NOT NULL
  COMMENT '更新者',
  status     ENUM ('ready', 'pending', 'failure') COMMENT '空间状态',
  created_at DATETIME NULL,
  updated_at DATETIME NULL,
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  COLLATE = utf8_unicode_ci;

# 空间下的内容环境表
# ------------------------------------------------------------
CREATE TABLE cf_envs (
  id          VARCHAR(100) NOT NULL DEFAULT 'master'
  COMMENT '空间环境',
  space_id    CHAR(12)     NOT NULL
  COMMENT '空间 ID',
  description VARCHAR(255) NULL
  COMMENT '环境描述'
    PRIMARY KEY (`id`)
)
  ENGINE = InnoDb
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

# 系统用户表
# ------------------------------------------------------------
CREATE TABLE `cf_users`
(
  id             CHAR(21)               NOT NULL
    PRIMARY KEY,
  login          VARCHAR(60)            NULL,
  password       VARCHAR(64)            NULL,
  email          VARCHAR(100)           NULL,
  display_name   VARCHAR(250)           NULL,
  activated      TINYINT(2) DEFAULT '1' NULL,
  confirmed      TINYINT(2) DEFAULT '1' NULL,
  activation_key VARCHAR(14)            NULL,
  deleted        TINYINT(2) DEFAULT '0' NULL,
  phone          VARCHAR(20)            NULL,
  created_at     DATETIME               NULL,
  updated_at     DATETIME               NULL,
  uid            VARCHAR(21)            NULL,
  CONSTRAINT cf_users__user_login_uindex
  UNIQUE (login),
  CONSTRAINT cf_users__user_email_uindex
  UNIQUE (email),
  CONSTRAINT cf_users__user_phone_uindex
  UNIQUE (phone)
)
  ENGINE = InnoDB
  COLLATE = utf8_unicode_ci;

# 用户元数据
# ------------------------------------------------------------
CREATE TABLE cf_usermeta
(
  meta_key   VARCHAR(255) NULL
  COMMENT '键',
  meta_value JSON         NULL
  COMMENT 'JSON DATA 格式',
  user_id    VARCHAR(21)  NOT NULL
  COMMENT '用户 ID',
  id         INT UNSIGNED AUTO_INCREMENT
    PRIMARY KEY
)
  ENGINE = InnoDB
  COLLATE = utf8_unicode_ci;

CREATE INDEX usermeta_meta_key_index
  ON cf_usermeta (meta_key);

CREATE INDEX usermeta_user_id_index
  ON cf_usermeta (user_id);

# 内容条目表
# ------------------------------------------------------------
CREATE TABLE cf_entries
(
  `id`           CHAR(21)     NOT NULL
  COMMENT '内容条目 ID',
  `env_id`       VARCHAR(100) NOT NULL
  COMMENT '空间环境 ID',
  `type_id`      CHAR(21)     NULL
  COMMENT '内容类型 ID',
  `created_by`   CHAR(21)     NOT NULL
  COMMENT '创建者',
  `updated_by`   CHAR(21)     NOT NULL
  COMMENT '更新者',
  `published_at` DATETIME     NULL
  COMMENT '发布时间',
  `created_at`   DATETIME     NULL
  COMMENT '创建时间',
  `updated_at`   DATETIME     NULL
  COMMENT '更新时间',
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

# 内容条目草稿表
# ------------------------------------------------------------
CREATE TABLE `cf_entrydrafts` (
  `id`            INT(11)                              NOT NULL AUTO_INCREMENT
  COMMENT '内容条目草稿自增主键 ID',
  `entry_id`      CHAR(21)                             NOT NULL
  COMMENT '内容条目 ID',
  `display_field` VARCHAR(255)                         NULL
  COMMENT '默认代表条目的字段',
  `locale`        CHAR(12) COLLATE utf8_unicode_ci     NOT NULL
  COMMENT '语言',
  `name`          VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL
  COMMENT '条目名称',
  `data`          JSON                                 NOT NULL
  COMMENT '条目内容',
  `created_at`    DATETIME                             NOT NULL
  COMMENT '创建时间',
  `updated_at`    DATETIME                             NOT NULL
  COMMENT '更新时间',
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

# 内容条目版本记录表
# ------------------------------------------------------------
CREATE TABLE `cf_entryversions` (
  `id`            INT(11)                          NOT NULL AUTO_INCREMENT
  COMMENT '内容条目已发布的版本自增主键 ID',
  `entry_id`      CHAR(21)                         NOT NULL
  COMMENT '内容条目 ID',
  `display_field` VARCHAR(255)                     NULL
  COMMENT '默认代表条目的字段',
  `locale`        CHAR(12) COLLATE utf8_unicode_ci NOT NULL
  COMMENT '语言',
  `num`           SMALLINT(6) UNSIGNED             NOT NULL
  COMMENT '版本号',
  `data`          JSON                             NOT NULL
  COMMENT '条目内容',
  `created_at`    DATETIME                         NOT NULL
  COMMENT '创建时间',
  `updated_at`    DATETIME                         NOT NULL
  COMMENT '更新时间',
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

# 内容类型表
# ------------------------------------------------------------
CREATE TABLE cf_entrytypes
(
  id         VARCHAR(255) NOT NULL
  COMMENT '内容类型 ID',
  env_id     VARCHAR(100) NOT NULL DEFAULT 'master',
  name       VARCHAR(255) NOT NULL
  COMMENT '内容类型名称',
  fields     JSON         NOT NULL
  COMMENT '内容类型的字段列表',
  created_by CHAR(21)     NOT NULL
  COMMENT '创建者',
  updated_by CHAR(21)     NOT NULL
  COMMENT '更新者',
  created_at DATETIME     NOT NULL
  COMMENT '创建时间',
  updated_at DATETIME     NOT NULL
  COMMENT '更新时间',
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

# 内容类型字段记录表
# type_id + id = 联合主键
# ------------------------------------------------------------
CREATE TABLE `cf_fields`
(
  id           VARCHAR(255)                                                                                           NOT NULL
  COMMENT '字段 ID',
  env_id       VARCHAR(100)                                                                                           NOT NULL DEFAULT 'master',
  type_id      VARCHAR(255)                                                                                           NOT NULL
  COMMENT '内容类型 ID',
  name         VARCHAR(255)                                                                                           NOT NULL
  COMMENT '字段名称',
  instructions TEXT                                                                                                   NULL
  COMMENT '字段说明信息',
  type         ENUM ('symbol',
                     'text',
                     'integer',
                     'number',
                     'date',
                     'location',
                     'boolean',
                     'link',
                     'array',
                     'object')                                                                                        NOT NULL
  COMMENT '字段的类型',
  required     TINYINT(1) UNSIGNED DEFAULT '1'                                                                        NOT NULL
  COMMENT '是否为必填',
  disabled     TINYINT(1) UNSIGNED DEFAULT '0'                                                                        NOT NULL
  COMMENT '是否为只读状态',
  validations  JSON                                                                                                   NULL
  COMMENT '字段的验证信息'
  COMMENT '内容验证规则',
  settings     JSON                                                                                                   NULL
  COMMENT '字段的外观配置',
  created_at   DATETIME                                                                                               NOT NULL,
  updated_at   DATETIME                                                                                               NOT NULL,
  uid          CHAR(36) DEFAULT '0'                                                                                   NOT NULL,
  PRIMARY KEY (`id`, `type_id`)
)
  ENGINE = InnoDB
  COLLATE = utf8_unicode_ci;