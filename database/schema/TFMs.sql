-- @block Clean
DROP DATABASE IF EXISTS tfms;

-- @block Create Database
CREATE DATABASE IF NOT EXISTS tfms;

-- @block Create Tables
CREATE TABLE IF NOT EXISTS tfms.programs (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `program_name` VARCHAR(255),
  `fund_estimation_model_name` VARCHAR(255)
) --
COMMENT "This table holds tamkeen programs that will be supported in TFMS, and their ML model endpoINT name.";

CREATE TABLE IF NOT EXISTS tfms.periods (
  `period_name` VARCHAR(255),
  `program_id` INT,
  `fund_estimated_status` ENUM('not started', 'in progress', 'completed'),
  `fund_estimation_date` INT,
  --
  PRIMARY KEY (`period_name`, `program_id`),
  FOREIGN KEY (`program_id`) REFERENCES tfms.programs (`id`)
) --
COMMENT "This table holds the periods of each program and its details.";

CREATE TABLE IF NOT EXISTS tfms.features (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `column_name` VARCHAR(255),
  `visible_name` VARCHAR(255),
  `type` ENUM("num", "cat"),
  `description` VARCHAR(255)
) --
COMMENT "This table specifies the features that the TFMS supports.";

CREATE TABLE IF NOT EXISTS tfms.feature_catagories (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `feature_id` INT,
  `name` VARCHAR(255),
  --
  FOREIGN KEY (`feature_id`) REFERENCES tfms.features (`id`)
) --
COMMENT "This table specifies the features that the TFMS supports.";

CREATE TABLE IF NOT EXISTS tfms.program_features (
  `program_id` INT,
  `feature_id` INT,
  `importance` INT,
  `ml_model_column_index` INT,
  --
  FOREIGN KEY (`program_id`) REFERENCES tfms.programs (`id`),
  FOREIGN KEY (`feature_id`) REFERENCES tfms.features (`id`)
) --
COMMENT "This table specifies which features belong to which programs, as well as some program specific feature attributes.";

CREATE TABLE IF NOT EXISTS tfms.applicants (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `program_id` INT,
  `period_name` VARCHAR(255),
  `company_sector` VARCHAR(255) NULL,
  `annual_revenue` DOUBLE NULL,
  `issued_capital` DOUBLE NULL,
  `company_stage` VARCHAR(255) NULL,
  `target_bahrainization_rate` DOUBLE NULL,
  `total_bahraini_salaries` DOUBLE NULL,
  `total_non_bahraini_salaries` DOUBLE NULL,
  `total_number_of_bahraini_workers` INT NULL,
  `total_number_of_non_bahraini_workers` INT NULL,
  `active_workers` INT NULL,
  `total_number_of_bahraini_shareholders` INT NULL,
  `total_number_of_regional_shareholders` INT NULL,
  `total_number_of_other_shareholders` INT NULL,
  `shareholders_gender_male` INT NULL,
  `shareholders_gender_female` INT NULL,
  `number_of_activities` INT NULL,
  `estimated_fund` DOUBLE NULL,
  --
  FOREIGN KEY (`period_name`, `program_id`) REFERENCES tfms.periods (`period_name`, `program_id`)
) --
COMMENT "This will hold the TFMS applications, including their most recent estimated fund.";

CREATE TABLE IF NOT EXISTS tfms.runs (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `program_id` INT,
  `period_name` VARCHAR(255),
  `config` JSON,
  `date` INT,
  `budget` DOUBLE,
  --
  FOREIGN KEY (`period_name`, `program_id`) REFERENCES tfms.periods (`period_name`, `program_id`)
) --
COMMENT "This table hosts the runs and some of its high level details.";

CREATE TABLE IF NOT EXISTS tfms.runs_applicants (
  `run_id` INT,
  `applicant_id` INT,
  `estimated_fund` DOUBLE,
  --
  PRIMARY KEY (`run_id`, `applicant_id`),
  FOREIGN KEY (`run_id`) REFERENCES tfms.runs (`id`),
  FOREIGN KEY (`applicant_id`) REFERENCES tfms.applicants (`id`)
) --
COMMENT "This table records which submissions were part of which runs and their information as part of that run.";