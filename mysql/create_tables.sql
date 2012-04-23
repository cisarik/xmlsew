CREATE DATABASE xmlsew;

CREATE TABLE `xmlsew_attribute` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
`name` varchar(25) NOT NULL,
PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

CREATE TABLE `xmlsew_element` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
`name` varchar(26) NOT NULL,
PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

CREATE TABLE `xmlsew_attributedefaultvalue` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
`name` varchar(25) NOT NULL,
PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
                    
CREATE TABLE `xmlsew_elementattributedefaultvalues` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
`id_attributedefaultvalue` int(11) UNSIGNED NOT NULL,
`id_attribute` int(11) UNSIGNED NOT NULL,
`id_element` int(11) UNSIGNED NOT NULL,
PRIMARY KEY (`id`),
FOREIGN KEY (`id_attributedefaultvalue`) REFERENCES xmlsew_attributedefaultvalue(`id`),
FOREIGN KEY (`id_attribute`) REFERENCES xmlsew_attribute(`id`),
FOREIGN KEY (`id_element`) REFERENCES xmlsew_element(`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

CREATE TABLE `xmlsew_elementchildren` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
`id_element` int(11) UNSIGNED NOT NULL,
`id_elementchildren` int(11) UNSIGNED NOT NULL,
PRIMARY KEY  (`id`),
FOREIGN KEY (`id_element`) REFERENCES xmlsew_element(`id`),
FOREIGN KEY (`id_elementchildren`) REFERENCES xmlsew_element(`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

CREATE TABLE `xmlsew_elementoptionalattributes` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
`id_attribute` int(11) UNSIGNED NOT NULL,
`id_element` int(11) UNSIGNED NOT NULL,
PRIMARY KEY  (`id`),
FOREIGN KEY (`id_element`) REFERENCES xmlsew_element(`id`),
FOREIGN KEY (`id_attribute`) REFERENCES xmlsew_attribute(`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

CREATE TABLE `xmlsew_elementrequiredattributes` (
`id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
`id_attribute` int(11) UNSIGNED NOT NULL,
`id_element` int(11) UNSIGNED NOT NULL,
PRIMARY KEY  (`id`),
FOREIGN KEY (`id_attribute`) REFERENCES xmlsew_attribute(`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

CREATE TABLE `xmlsew_role` (
`id` INT NOT NULL AUTO_INCREMENT,
`name` VARCHAR(32) NOT NULL,
`description` VARCHAR(512) NOT NULL,
UNIQUE (`name`),
PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

INSERT INTO `xmlsew_role` (`name`, `description`)
VALUES ('administrator', 'Administrates xmlsew site and its users.'),
('user', 'Administrates xmlschemas of xmlsew site.');

CREATE TABLE `xmlsew_user` (
`id` INT NOT NULL AUTO_INCREMENT,
`id_role` INT NOT NULL,
`email` VARCHAR(32) NOT NULL,
`password` VARCHAR(32) NOT NULL,
`name` VARCHAR(32) NOT NULL,
`member_since` DATE NOT NULL,
`status` ENUM('active', 'blocked') DEFAULT 'active',
UNIQUE (`email`),
PRIMARY KEY (`id`),
FOREIGN KEY (`id_role`) REFERENCES xmlsew_role(`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

INSERT INTO `xmlsew_user` (`id_role`, `email`, `password`, `name`, `member_since`, `status`)
VALUES (1, 'cisary@me.com', 'e4272454604ca610bf38fd067ff5408698463004', 'admin', '1999-01-23', 'active');

CREATE TABLE `xmlsew_forgottenpasswordkeychain` (
`id` INT NOT NULL AUTO_INCREMENT,
`id_user` INT NOT NULL,
`keychain` VARCHAR(64) NOT NULL,
PRIMARY KEY (`id`),
FOREIGN KEY (`id_user`) REFERENCES xmlsew_user(`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

CREATE TABLE `xmlsew_invitationkeychain` (
`id` INT NOT NULL AUTO_INCREMENT,
`id_user` INT NOT NULL,
`keychain` VARCHAR(64) NOT NULL,
PRIMARY KEY (`id`),
FOREIGN KEY (`id_user`) REFERENCES xmlsew_user(`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;


