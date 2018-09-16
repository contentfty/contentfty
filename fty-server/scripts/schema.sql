CREATE TABLE cf_elements
(
    id char(21) PRIMARY KEY NOT NULL,
    type enum('org', 'entry', 'user', 'content_type', 'space', 'env') NOT NULL,
    enabled tinyint(1) unsigned DEFAULT '1' NOT NULL,
    archived tinyint(1) unsigned DEFAULT '0' NOT NULL,
    createdAt datetime NOT NULL,
    updatedAt datetime NOT NULL,
    uid char(36) DEFAULT '0' NOT NULL
);
CREATE TABLE cf_entries
(
    id char(21) PRIMARY KEY NOT NULL COMMENT '内容条目 ID',
    envId varchar(100) DEFAULT 'master' NOT NULL COMMENT '空间环境 ID',
    typeId char(21) COMMENT '内容类型 ID',
    createdBy char(21) NOT NULL COMMENT '作者',
    postDate datetime COMMENT '发布时间',
    createdAt datetime COMMENT '创建时间',
    updatedAt datetime COMMENT '更新时间'
);
CREATE TABLE cf_entrydrafts
(
    id int(11) PRIMARY KEY NOT NULL COMMENT '内容条目草稿自增主键 ID' AUTO_INCREMENT,
    entryId char(21) NOT NULL COMMENT '内容条目 ID',
    createdBy char(21),
    name varchar(255) NOT NULL COMMENT '条目名称',
    data json NOT NULL COMMENT '条目内容',
    createdAt datetime NOT NULL COMMENT '创建时间',
    updatedAt datetime NOT NULL COMMENT '更新时间'
);
CREATE TABLE cf_entrytypes
(
    id varchar(255) PRIMARY KEY NOT NULL COMMENT '内容类型 ID',
    name varchar(255) NOT NULL COMMENT '内容类型名称',
    fields json COMMENT '内容类型的字段列表',
    createdBy char(21) NOT NULL COMMENT '创建者',
    updatedBy char(21) NOT NULL COMMENT '更新者',
    createdAt datetime NOT NULL COMMENT '创建时间',
    updatedAt datetime NOT NULL COMMENT '更新时间'
);
CREATE TABLE cf_entryversions
(
    id int(11) PRIMARY KEY NOT NULL COMMENT '内容条目已发布的版本自增主键 ID' AUTO_INCREMENT,
    entryId char(21) NOT NULL COMMENT '内容条目 ID',
    createdBy char(21),
    fields json NOT NULL COMMENT '条目内容',
    notes tinytext,
    createdAt datetime NOT NULL COMMENT '创建时间',
    updatedAt datetime NOT NULL COMMENT '更新时间',
    num smallint(6) unsigned NOT NULL COMMENT '版本号'
);
CREATE TABLE cf_envs
(
    id varchar(100) DEFAULT 'master' PRIMARY KEY NOT NULL,
    spaceId char(12) NOT NULL,
    description varchar(255),
    status enum('ready', 'pending', 'failure')
);
CREATE TABLE cf_fields
(
    id varchar(255) NOT NULL COMMENT '字段 ID',
    typeId varchar(255) NOT NULL COMMENT '内容类型 ID',
    name varchar(255) NOT NULL COMMENT '字段名称',
    instructions text COMMENT '字段说明信息',
    type enum('Symbol', 'Text', 'Integer', 'number', 'date', 'location', 'boolean', 'link', 'array', 'object') NOT NULL COMMENT '字段的类型',
    `unique` tinyint(1) DEFAULT '0' NOT NULL,
    required tinyint(1) DEFAULT '0' NOT NULL COMMENT '是否为必填',
    disabled tinyint(1) DEFAULT '0' NOT NULL COMMENT '是否为只读状态',
    validations json COMMENT '内容验证规则',
    settings json COMMENT '字段的外观配置',
    updatedAt datetime NOT NULL,
    createdAt datetime NOT NULL,
    localized tinyint(1) DEFAULT '0',
    title varchar(255),
    CONSTRAINT `PRIMARY` PRIMARY KEY (id, typeId)
);
CREATE TABLE cf_options
(
    `key` varchar(255) PRIMARY KEY NOT NULL,
    value json,
    `desc` varchar(255)
);
CREATE UNIQUE INDEX `key` ON cf_options (`key`);
INSERT INTO cf_options (`key`, value, `desc`) VALUES ('locales', '[{"code": "zh-CN", "name": "Chinese (Simplified, China)", "default": true, "fallbackCode": null}]', null);
INSERT INTO cf_options (`key`, value, `desc`) VALUES ('roles', '[{"administrator": {"name": "Administrator", "capabilities": [{"switch_themes": true}, {"edit_themes": true}, {"activate_plugins": true}, {"edit_plugins": true}, {"edit_users": true}, {"edit_files": true}, {"manage_options": true}, {"moderate_comments": true}, {"manage_categories": true}, {"manage_links": true}, {"upload_files": true}, {"import": true}, {"edit_posts": true}, {"edit_others_posts": true}, {"edit_published_posts": true}, {"edit_pages": true}, {"edit_other_pages": true}, {"edit_published_pages": true}, {"publish_pages": true}, {"delete_pages": true}, {"delete_others_pages": true}, {"delete_published_pages": true}, {"delete_posts": true}, {"delete_others_posts": true}, {"delete_published_posts": true}, {"delete_private_posts": true}, {"edit_private_posts": true}, {"read_private_posts": true}, {"delete_private_pages": true}, {"edit_private_pages": true}, {"read_private_pages": true}, {"delete_users": true}, {"create_users": true}, {"unfiltered_upload": true}, {"edit_dashboard": true}, {"update_plugins": true}, {"delete_plugins": true}, {"install_plugins": true}, {"update_themes": true}, {"install_themes": true}, {"update_core": true}, {"list_users": true}, {"remove_users": true}, {"add_users": true}, {"promote_users": true}, {"edit_theme_options": true}, {"delete_themes": true}, {"export": true}]}}, {"contributor": {"name": "Contributor", "capabilities": [{"delete_pages": true}, {"delete_others_pages": true}, {"delete_published_pages": true}, {"delete_posts": true}]}}, {"editor": {"name": "Editor", "capabilities": [{"read": true}, {"moderate_comments": true}, {"manage_categories": true}, {"manage_links": true}, {"upload_files": true}, {"unfiltered_html": true}, {"edit_posts": true}, {"edit_others_posts": true}, {"edit_published_posts": true}, {"publish_posts": true}, {"edit_pages": true}, {"edit_others_pages": true}, {"edit_published_pages": true}, {"publish_pages": true}, {"delete_pages": true}, {"delete_others_pages": true}, {"delete_published_pages": true}, {"delete_posts": true}, {"delete_others_posts": true}, {"delete_published_posts": true}, {"delete_private_posts": true}, {"edit_private_posts": true}, {"read_private_posts": true}, {"delete_private_pages": true}, {"edit_private_pages": true}, {"read_private_pages": true}]}}, {"author": {"name": "Author", "capabilities": [{"read": true}, {"upload_files": true}, {"edit_posts": true}, {"edit_published_posts": true}, {"publish_posts": true}, {"delete_posts": true}, {"delete_published_posts": true}]}}, {"subscriber": {"name": "Subscriber", "capabilities": [{"read": true}]}}]', '用户角权与权限');
CREATE TABLE cf_orgs
(
    id char(21) PRIMARY KEY NOT NULL,
    name varchar(200),
    createdBy char(21) NOT NULL,
    updatedBy char(21) NOT NULL,
    createdAt datetime,
    updatedAt datetime
);
CREATE TABLE cf_spaces
(
    id char(12) PRIMARY KEY NOT NULL COMMENT '空间 ID',
    name varchar(255) NOT NULL COMMENT '空间名称',
    orgId char(21) COMMENT '组织 ID',
    createdBy char(21) NOT NULL COMMENT '创建者',
    updatedBy char(21) NOT NULL COMMENT '更新者',
    status enum('ready', 'pending', 'failure') COMMENT '空间状态',
    createdAt datetime,
    updatedAt datetime
);
CREATE TABLE cf_usermeta
(
    metaKey varchar(255),
    metaValue json,
    userId varchar(21) NOT NULL,
    id int(10) unsigned PRIMARY KEY NOT NULL AUTO_INCREMENT
);
CREATE INDEX usermeta_meta_key_index ON cf_usermeta (metaKey);
CREATE INDEX usermeta_user_id_index ON cf_usermeta (userId);
CREATE TABLE cf_users
(
    id char(21) PRIMARY KEY NOT NULL,
    login varchar(60),
    password varchar(64),
    email varchar(100),
    displayName varchar(250),
    activated tinyint(1) DEFAULT '1',
    confirmed tinyint(1) DEFAULT '1',
    activationKey varchar(14),
    deleted tinyint(2) DEFAULT '0',
    phone varchar(20),
    createdAt datetime,
    updatedAt datetime
);
CREATE UNIQUE INDEX cf_users__user_login_uindex ON cf_users (login);
CREATE UNIQUE INDEX cf_users__user_email_uindex ON cf_users (email);
CREATE UNIQUE INDEX cf_users__user_phone_uindex ON cf_users (phone);