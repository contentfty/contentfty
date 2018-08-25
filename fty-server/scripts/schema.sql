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



# 系统、空间的元素记录表
# ------------------------------------------------------------
CREATE TABLE cf_elements
(
  id         CHAR(21) PRIMARY KEY,
  type       ENUM ('org', 'entry', 'user', 'content_type', 'space', 'env') NOT NULL,
  enabled    TINYINT(1) UNSIGNED DEFAULT '1'                               NOT NULL,
  archived   TINYINT(1) UNSIGNED DEFAULT '0'                               NOT NULL,
  createdAt DATETIME                                                      NOT NULL,
  updatedAt DATETIME                                                      NOT NULL,
  uid        CHAR(36) DEFAULT '0'                                          NOT NULL
)
  ENGINE = InnoDB
  COLLATE = utf8_unicode_ci;

# 空间下的内容环境表
# ------------------------------------------------------------
CREATE TABLE cf_envs (
  id          VARCHAR(100) NOT NULL DEFAULT 'master',
  spaceId    CHAR(12)     NOT NULL,
  description VARCHAR(255) NULL,
  status      ENUM ('ready', 'pending', 'failure'),
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDb
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

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
# ------------------------------------------------------------
CREATE TABLE `cf_fields`
(
  id           VARCHAR(255)                                                                                           NOT NULL
  COMMENT '字段 ID',
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

