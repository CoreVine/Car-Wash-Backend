-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema car-wash
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `car-wash` ;

-- -----------------------------------------------------
-- Schema car-wash
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `car-wash` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `car-wash` ;

-- -----------------------------------------------------
-- Table `car-wash`.`ads`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`ads` (
  `ad_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `link_url` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`ad_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`carbrand`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`carbrand` (
  `brand_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `logo` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`brand_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 27
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`company`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`company` (
  `company_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(255) NOT NULL,
  `location` TEXT NOT NULL,
  `logo_url` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `approved` TINYINT(1) NOT NULL,
  `about` TEXT NOT NULL,
  `total_rating` TINYINT NOT NULL DEFAULT '0',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`company_id`),
  UNIQUE INDEX `company_name` (`company_name` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 27
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`companyexhibition`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`companyexhibition` (
  `exhibition_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `location` VARCHAR(255) NOT NULL,
  `company_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`exhibition_id`),
  INDEX `company_id` (`company_id` ASC) VISIBLE,
  CONSTRAINT `companyexhibition_ibfk_1`
    FOREIGN KEY (`company_id`)
    REFERENCES `car-wash`.`company` (`company_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 46
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`cars`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`cars` (
  `car_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sale_or_rental` ENUM('sale', 'rent') NOT NULL,
  `company_id` INT UNSIGNED NOT NULL,
  `model` VARCHAR(255) NOT NULL,
  `year` INT NOT NULL,
  `price` DECIMAL(8,2) NOT NULL,
  `exhibition_id` INT UNSIGNED NOT NULL,
  `carbrand_id` INT NOT NULL,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`car_id`, `sale_or_rental`),
  INDEX `company_id` (`company_id` ASC) VISIBLE,
  INDEX `exhibition_id` (`exhibition_id` ASC) VISIBLE,
  INDEX `cars_brand_fk_idx` (`carbrand_id` ASC) VISIBLE,
  CONSTRAINT `cars_brand_fk`
    FOREIGN KEY (`carbrand_id`)
    REFERENCES `car-wash`.`carbrand` (`brand_id`),
  CONSTRAINT `cars_ibfk_1`
    FOREIGN KEY (`company_id`)
    REFERENCES `car-wash`.`company` (`company_id`)
    ON UPDATE CASCADE,
  CONSTRAINT `cars_ibfk_2`
    FOREIGN KEY (`exhibition_id`)
    REFERENCES `car-wash`.`companyexhibition` (`exhibition_id`)
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 224
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`users` (
  `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `acc_type` ENUM('user', 'employee') NOT NULL,
  `profile_picture_url` TEXT NULL DEFAULT NULL,
  `name` VARCHAR(70) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(255) NOT NULL,
  `address` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `username` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 1001
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`cart`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`cart` (
  `order_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `status` ENUM('cart', 'pending', 'complete') NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  PRIMARY KEY (`order_id`),
  CONSTRAINT `orders_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `car-wash`.`users` (`user_id`)
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 153
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`carwashorders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`carwashorders` (
  `wash_order_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT UNSIGNED NOT NULL,
  `within_company` TINYINT(1) NOT NULL COMMENT 'if it is indoors or within company\'s workshop',
  `location` TEXT NOT NULL,
  `customer_id` INT UNSIGNED NOT NULL,
  `company_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`wash_order_id`),
  INDEX `order_id` (`order_id` ASC) VISIBLE,
  INDEX `customer_id` (`customer_id` ASC) VISIBLE,
  INDEX `fk_carwashorders_company1_idx` (`company_id` ASC) VISIBLE,
  CONSTRAINT `carwashorders_ibfk_1`
    FOREIGN KEY (`order_id`)
    REFERENCES `car-wash`.`cart` (`order_id`)
    ON UPDATE CASCADE,
  CONSTRAINT `carwashorders_ibfk_2`
    FOREIGN KEY (`customer_id`)
    REFERENCES `car-wash`.`users` (`user_id`)
    ON UPDATE CASCADE,
  CONSTRAINT `fk_carwashorders_company1`
    FOREIGN KEY (`company_id`)
    REFERENCES `car-wash`.`company` (`company_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 33
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`category` (
  `category_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(255) NOT NULL,
  `icon` VARCHAR(255) NULL DEFAULT NULL COMMENT 'URL, font icon class, or file path for category icon',
  PRIMARY KEY (`category_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 19
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`companydocuments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`companydocuments` (
  `document_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` INT UNSIGNED NOT NULL,
  `document_type` VARCHAR(255) NOT NULL,
  `document_url` VARCHAR(255) NOT NULL,
  `upload_date` DATETIME NOT NULL,
  PRIMARY KEY (`document_id`),
  INDEX `company_id` (`company_id` ASC) VISIBLE,
  CONSTRAINT `companydocuments_ibfk_1`
    FOREIGN KEY (`company_id`)
    REFERENCES `car-wash`.`company` (`company_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 61
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`customercar`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`customercar` (
  `customer_car_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `model` TINYTEXT NOT NULL,
  `car_plate_number` TINYTEXT NOT NULL,
  `customer_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`customer_car_id`),
  INDEX `customer_id` (`customer_id` ASC) VISIBLE,
  CONSTRAINT `customercar_ibfk_1`
    FOREIGN KEY (`customer_id`)
    REFERENCES `car-wash`.`users` (`user_id`)
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 127
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`employee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`employee` (
  `user_id` INT UNSIGNED NOT NULL,
  `company_id` INT UNSIGNED NOT NULL,
  `role` ENUM('super-admin', 'manager', 'employee') NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`user_id`, `company_id`),
  UNIQUE INDEX `employee_user_id_company_id_unique` (`user_id` ASC, `company_id` ASC) VISIBLE,
  INDEX `company_id` (`company_id` ASC) VISIBLE,
  CONSTRAINT `employee_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `car-wash`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `employee_ibfk_2`
    FOREIGN KEY (`company_id`)
    REFERENCES `car-wash`.`company` (`company_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`products` (
  `product_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` INT UNSIGNED NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(8,2) NOT NULL,
  `stock` INT NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`product_id`),
  INDEX `company_id` (`company_id` ASC) VISIBLE,
  CONSTRAINT `products_ibfk_1`
    FOREIGN KEY (`company_id`)
    REFERENCES `car-wash`.`company` (`company_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 153
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`orderitems`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`orderitems` (
  `order_item_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  INDEX `order_id` (`order_id` ASC) VISIBLE,
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `orderitems_ibfk_1`
    FOREIGN KEY (`order_id`)
    REFERENCES `car-wash`.`cart` (`order_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_2`
    FOREIGN KEY (`product_id`)
    REFERENCES `car-wash`.`products` (`product_id`)
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 266
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`paymentmethod`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`paymentmethod` (
  `payment_id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` TINYTEXT NOT NULL,
  `public_key` VARCHAR(100) NOT NULL,
  `secret_key` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`payment_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`order` (
  `payment_method_id` TINYINT UNSIGNED NOT NULL,
  `payment_gateway_response` TEXT NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cart_order_id` INT UNSIGNED NOT NULL,
  INDEX `payment_order_fk_idx` (`payment_method_id` ASC) VISIBLE,
  INDEX `fk_order_cart1_idx` (`cart_order_id` ASC) VISIBLE,
  PRIMARY KEY (`id`),
  CONSTRAINT `payment_order_fk`
    FOREIGN KEY (`payment_method_id`)
    REFERENCES `car-wash`.`paymentmethod` (`payment_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_order_cart1`
    FOREIGN KEY (`cart_order_id`)
    REFERENCES `car-wash`.`cart` (`order_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `car-wash`.`orderstatushistory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`orderstatushistory` (
  `status_history_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT UNSIGNED NOT NULL,
  `status` ENUM('pending', 'complete') NOT NULL,
  `timestamp` DATETIME NOT NULL,
  PRIMARY KEY (`status_history_id`),
  INDEX `orderstatushistory_ibfk_1_idx` (`order_id` ASC) VISIBLE,
  CONSTRAINT `orderstatushistory_ibfk_1`
    FOREIGN KEY (`order_id`)
    REFERENCES `car-wash`.`order` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 301
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`productsimages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`productsimages` (
  `image_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `image_url` VARCHAR(255) NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`image_id`),
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `productsimages_ibfk_1`
    FOREIGN KEY (`product_id`)
    REFERENCES `car-wash`.`products` (`product_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 457
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`ratings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`ratings` (
  `company_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `rating_value` DECIMAL(8,2) NOT NULL,
  `review_text` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`company_id`, `user_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `ratings_ibfk_1`
    FOREIGN KEY (`company_id`)
    REFERENCES `car-wash`.`company` (`company_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `car-wash`.`users` (`user_id`)
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`rentalcarsimages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`rentalcarsimages` (
  `image_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `image_url` VARCHAR(255) NOT NULL,
  `car_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`image_id`),
  INDEX `car_id` (`car_id` ASC) VISIBLE,
  CONSTRAINT `rentalcarsimages_ibfk_1`
    FOREIGN KEY (`car_id`)
    REFERENCES `car-wash`.`cars` (`car_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 893
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`rentalorders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`rentalorders` (
  `rental_order_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT UNSIGNED NOT NULL,
  `car_id` INT UNSIGNED NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  PRIMARY KEY (`rental_order_id`),
  INDEX `order_id` (`order_id` ASC) VISIBLE,
  INDEX `car_id` (`car_id` ASC) VISIBLE,
  CONSTRAINT `rentalorders_ibfk_1`
    FOREIGN KEY (`order_id`)
    REFERENCES `car-wash`.`cart` (`order_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `rentalorders_ibfk_2`
    FOREIGN KEY (`car_id`)
    REFERENCES `car-wash`.`cars` (`car_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`subcategory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`subcategory` (
  `sub_category_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `icon` VARCHAR(255) NULL DEFAULT NULL COMMENT 'URL, font icon class, or file path for subcategory icon',
  PRIMARY KEY (`sub_category_id`),
  INDEX `category_id` (`category_id` ASC) VISIBLE,
  CONSTRAINT `subcategory_ibfk_1`
    FOREIGN KEY (`category_id`)
    REFERENCES `car-wash`.`category` (`category_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 50
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`subcatproduct`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`subcatproduct` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` INT UNSIGNED NOT NULL,
  `sub_category_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `subcatproduct_sub_category_id_product_id_unique` (`product_id` ASC, `sub_category_id` ASC) VISIBLE,
  INDEX `sub_category_id` (`sub_category_id` ASC) VISIBLE,
  CONSTRAINT `subcatproduct_ibfk_1`
    FOREIGN KEY (`product_id`)
    REFERENCES `car-wash`.`products` (`product_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `subcatproduct_ibfk_2`
    FOREIGN KEY (`sub_category_id`)
    REFERENCES `car-wash`.`subcategory` (`sub_category_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 229
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`verification_codes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`verification_codes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `code` VARCHAR(6) NOT NULL,
  `type` ENUM('password_reset', 'email_verification', 'account_activation') NOT NULL DEFAULT 'password_reset',
  `verified` TINYINT(1) NOT NULL DEFAULT '0',
  `reset_token` VARCHAR(64) NULL DEFAULT NULL,
  `token_used` TINYINT(1) NOT NULL DEFAULT '0',
  `attempt_count` INT NOT NULL DEFAULT '0',
  `expires_at` DATETIME NOT NULL,
  `account_type` ENUM('user', 'company', 'employee') NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `reset_token` (`reset_token` ASC) VISIBLE,
  INDEX `verification_code_email_type_idx` (`email` ASC, `type` ASC) VISIBLE,
  INDEX `verification_code_reset_token_idx` (`reset_token` ASC) VISIBLE,
  INDEX `verification_code_expires_at_idx` (`expires_at` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`washorderoperation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`washorderoperation` (
  `wash_order_id` INT UNSIGNED NOT NULL,
  `employee_assigned_id` INT UNSIGNED NOT NULL,
  `operation_start_at` DATETIME NOT NULL,
  `operation_done_at` DATETIME NULL DEFAULT NULL,
  `company_id` INT UNSIGNED NOT NULL,
  `assignedEmployeeUserId` INT UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`wash_order_id`),
  INDEX `employee_assigned_id` (`employee_assigned_id` ASC) VISIBLE,
  INDEX `company_id` (`company_id` ASC) VISIBLE,
  CONSTRAINT `washorderoperation_ibfk_1`
    FOREIGN KEY (`wash_order_id`)
    REFERENCES `car-wash`.`carwashorders` (`wash_order_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `washorderoperation_ibfk_2`
    FOREIGN KEY (`employee_assigned_id`)
    REFERENCES `car-wash`.`employee` (`user_id`),
  CONSTRAINT `washorderoperation_ibfk_3`
    FOREIGN KEY (`company_id`)
    REFERENCES `car-wash`.`employee` (`company_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`washtypes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`washtypes` (
  `type_id` INT NOT NULL AUTO_INCREMENT,
  `company_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `price` MEDIUMINT NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`type_id`),
  INDEX `company_id` (`company_id` ASC) VISIBLE,
  CONSTRAINT `washtypes_ibfk_1`
    FOREIGN KEY (`company_id`)
    REFERENCES `car-wash`.`company` (`company_id`)
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 79
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`washorders_washtypes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`washorders_washtypes` (
  `carwashorders_order_id` INT UNSIGNED NOT NULL,
  `WashTypes_type_id` INT NOT NULL,
  `paid_price` MEDIUMINT NOT NULL,
  PRIMARY KEY (`carwashorders_order_id`, `WashTypes_type_id`),
  UNIQUE INDEX `washorders_washtypes_type_id_order_id_unique` (`carwashorders_order_id` ASC, `WashTypes_type_id` ASC) VISIBLE,
  UNIQUE INDEX `wash_order_type_unique` (`carwashorders_order_id` ASC, `WashTypes_type_id` ASC) VISIBLE,
  INDEX `WashTypes_type_id` (`WashTypes_type_id` ASC) VISIBLE,
  CONSTRAINT `washorders_washtypes_ibfk_1`
    FOREIGN KEY (`carwashorders_order_id`)
    REFERENCES `car-wash`.`carwashorders` (`wash_order_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `washorders_washtypes_ibfk_2`
    FOREIGN KEY (`WashTypes_type_id`)
    REFERENCES `car-wash`.`washtypes` (`type_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `car-wash`.`carorders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car-wash`.`carorders` (
  `car_order_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `car_id` INT UNSIGNED NOT NULL,
  `orders_order_id` INT UNSIGNED NOT NULL,
  INDEX `fk_carorders_orders1_idx` (`orders_order_id` ASC) VISIBLE,
  PRIMARY KEY (`car_order_id`),
  CONSTRAINT `fk_carorders_orders1`
    FOREIGN KEY (`orders_order_id`)
    REFERENCES `car-wash`.`cart` (`order_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
