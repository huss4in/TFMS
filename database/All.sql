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

INSERT INTO
  tfms.programs (program_name, fund_estimation_model_name)
VALUES
  ("Tamweel", "tfms-automl-bestmodel"),
  ("Riyadat", "tamkeen-tfms-riyadat"),
  ("Tamweel+", "tamkeen-tfms-tamweelplus");

INSERT INTO
  tfms.periods (
    period_name,
    program_id,
    fund_estimated_status,
    fund_estimation_date
  )
VALUES
  ("2021Q1", 1, 'not started', 0),
  ("2021Q2", 1, 'not started', 0),
  ("2021Q2", 2, 'not started', 0),
  ("2022Q1", 1, 'not started', 0),
  ("2022Q1", 2, 'not started', 0);

INSERT INTO
  tfms.features (
    column_name,
    visible_name,
    type,
    description
  )
VALUES
  (
    "company_sector",
    "Company Sector",
    "cat",
    "The Sector of the company"
  ),
  (
    "annual_revenue",
    "Annual Revenue",
    "num",
    "The Annual Revenue of the company"
  ),
  (
    "issued_capital",
    "Issued Capital",
    "num",
    "The Issued Capital of the company"
  ),
  (
    "company_stage",
    "Company Stage",
    "cat",
    "The Stage of the company"
  ),
  (
    "target_bahrainization_rate",
    "Bahrainization Rate",
    "num",
    "The Target Bahrainization Rate of the company"
  ),
  (
    "total_bahraini_salaries",
    "Bahrainis' Salaries ",
    "num",
    "The Total Bahrainis' Salaries in the company"
  ),
  (
    "total_non_bahraini_salaries",
    "Non-Bahrainis' Salaries",
    "num",
    "The Total Non-Bahrainis' Salaries in the company"
  ),
  (
    "total_number_of_bahraini_workers",
    "Bahrainis' Workers",
    "num",
    "The Total Bahraini Workers in the company"
  ),
  (
    "total_number_of_non_bahraini_workers",
    "Non-Bahrainis' Workers",
    "num",
    "The Total Non-Bahraini Workers in the company"
  ),
  (
    "active_workers",
    "Active Employees",
    "num",
    "The number of Active Employees in the company"
  ),
  (
    "total_number_of_bahraini_shareholders",
    "Bahraini Shareholders",
    "num",
    "The number of Bahraini Shareholders of the company"
  ),
  (
    "total_number_of_regional_shareholders",
    "Regional Shareholders",
    "num",
    "The number of Regional Shareholders of the company"
  ),
  (
    "total_number_of_other_shareholders",
    "Other Shareholders",
    "num",
    "The number of Other Shareholders of the company"
  ),
  (
    "shareholders_gender_male",
    "Male Shareholders",
    "num",
    "The number of male shareholder in the company"
  ),
  (
    "shareholders_gender_female",
    "Female Shareholders",
    "num",
    "The activity sector of the company"
  ),
  (
    "number_of_activities",
    "Activities",
    "num",
    "The number of Activities in the company"
  );

INSERT INTO
  tfms.feature_catagories (id, feature_id, name)
VALUES
  (1, 1, "Sales and trading"),
  (2, 1, "Food and Beverage"),
  (3, 1, "Research and development"),
  (4, 1, "Support services"),
  (5, 1, "Building, Construction & Real Estate"),
  (6, 1, "IT"),
  (7, 1, "Manufacturing"),
  (8, 1, "Medical"),
  (9, 1, "Repair and maintenance"),
  (10, 1, "Education"),
  (11, 1, "Entertainment"),
  (12, 1, "Fintech"),
  (13, 1, "Storage"),
  (14, 1, "Agriculture"),
  (15, 1, "Medical"),
  (16, 1, "OTHER"),
  (17, 4, "Start-up"),
  (18, 4, "Small-Medium Enterprise"),
  (19, 4, "Seed stage");

INSERT INTO
  tfms.program_features (
    program_id,
    feature_id,
    importance,
    ml_model_column_index
  )
VALUES
  (1, 1, 0, 0),
  (1, 2, 2, 1),
  (1, 3, 6, 2),
  (1, 4, 5, 3),
  (1, 5, 15, 4),
  (1, 6, 13, 5),
  (1, 7, 7, 6),
  (1, 8, 11, 7),
  (1, 9, 4, 8),
  (1, 10, 1, 9),
  (1, 11, 3, 10),
  (1, 12, 14, 11),
  (1, 13, 8, 12),
  (1, 14, 12, 13),
  (1, 15, 10, 14),
  (1, 16, 9, 15),
  (2, 1, 0, 0),
  (2, 2, 2, 1),
  (2, 3, 6, 2),
  (2, 4, 5, 3),
  (2, 5, 15, 4),
  (2, 6, 13, 5),
  (2, 7, 7, 6),
  (2, 8, 11, 7),
  (2, 9, 4, 8),
  (2, 10, 1, 9),
  (2, 11, 3, 10),
  (2, 12, 14, 11),
  (2, 13, 8, 12),
  (2, 14, 12, 13),
  (2, 15, 10, 14),
  (2, 16, 9, 15),
  (3, 1, 2, 0),
  (3, 2, 1, 1),
  (3, 3, 0, 2),
  (3, 4, 5, 3),
  (3, 5, 9, 4),
  (3, 6, 7, 5),
  (3, 7, 3, 6),
  (3, 8, 10, 7),
  (3, 10, 4, 8),
  (3, 14, 8, 9),
  (3, 15, 6, 10);

INSERT INTO
  tfms.applicants (
    id,
    program_id,
    period_name,
    company_sector,
    annual_revenue,
    issued_capital,
    company_stage,
    target_bahrainization_rate,
    total_bahraini_salaries,
    total_non_bahraini_salaries,
    total_number_of_bahraini_workers,
    total_number_of_non_bahraini_workers,
    active_workers,
    total_number_of_bahraini_shareholders,
    total_number_of_regional_shareholders,
    total_number_of_other_shareholders,
    shareholders_gender_male,
    shareholders_gender_female,
    number_of_activities,
    estimated_fund
  )
VALUES
  (
    2025,
    1,
    "2022Q1",
    "Food and Beverage",
    31008000,
    13250,
    "Small-Medium Enterprise",
    0,
    0,
    11039.5,
    0,
    6,
    3,
    1,
    0,
    1,
    1,
    1,
    3,
    0
  ),
  (
    2026,
    1,
    "2022Q2",
    "IT",
    53000,
    79500,
    "Start-up",
    0,
    0,
    1192.5,
    0,
    1,
    1,
    2,
    0,
    1,
    2,
    10,
    2,
    0
  ),
  (
    2027,
    1,
    "2022Q1",
    "Food and Beverage",
    285034,
    15900,
    "Seed stage",
    0,
    0,
    1722.5,
    0,
    6,
    6,
    1,
    0,
    1,
    1,
    1,
    1,
    0
  ),
  (
    2028,
    1,
    "2022Q2",
    "Sales and trading",
    53000,
    15900,
    "Start-up",
    0,
    1192.5,
    530,
    0,
    1,
    1,
    0,
    1,
    0,
    2,
    0,
    3,
    0
  ),
  (
    2029,
    1,
    "2022Q1",
    "Sales and trading",
    95400,
    53000,
    "Small-Medium Enterprise",
    0,
    0,
    397.5,
    0,
    2,
    2,
    1,
    0,
    1,
    2,
    0,
    1,
    0
  ),
  (
    2030,
    1,
    "2022Q2",
    "Support services",
    26500,
    53000,
    "Small-Medium Enterprise",
    225,
    0,
    2226,
    0,
    10,
    10,
    2,
    0,
    0,
    1,
    1,
    3,
    0
  ),
  (
    2031,
    1,
    "2022Q1",
    "Research and development",
    89570,
    79500,
    "Start-up",
    10,
    0,
    2729.5,
    0,
    1,
    2,
    1,
    0,
    1,
    1,
    1,
    4,
    0
  ),
  (
    2032,
    1,
    "2022Q2",
    "Support services",
    26500,
    2650,
    "Start-up",
    0,
    0,
    1643,
    0,
    20,
    2,
    2,
    0,
    0,
    1,
    1,
    1,
    0
  ),
  (
    2033,
    1,
    "2022Q1",
    "Support services",
    2.65,
    53000,
    "Seed stage",
    0,
    4425.5,
    3975,
    35,
    6,
    5,
    2,
    0,
    0,
    1,
    1,
    2,
    0
  ),
  (
    2034,
    1,
    "2022Q2",
    "Support services",
    13250,
    1325,
    "Start-up",
    8,
    927.5,
    1881.5,
    2,
    22,
    101,
    0,
    1,
    0,
    1,
    0,
    1,
    0
  ),
  (
    2035,
    1,
    "2022Q1",
    "Research and development",
    265000,
    1325,
    "Start-up",
    0,
    0,
    1722.5,
    0,
    2,
    1,
    2,
    0,
    0,
    2,
    0,
    1,
    0
  ),
  (
    2036,
    1,
    "2022Q1",
    "Support services",
    58300,
    26500,
    "Small-Medium Enterprise",
    15,
    1987.5,
    2756,
    2,
    14,
    13,
    2,
    1,
    0,
    2,
    0,
    3,
    0
  ),
  (
    2037,
    1,
    "2022Q1",
    "Research and development",
    90232.5,
    13250,
    "Start-up",
    0,
    0,
    1033.5,
    0,
    5,
    3,
    1,
    0,
    0,
    0,
    1,
    3,
    0
  ),
  (
    2038,
    2,
    "2022Q1",
    "Support services",
    132500,
    79500,
    "Start-up",
    0,
    1325,
    1325,
    1,
    3,
    3,
    1,
    0,
    0,
    1,
    0,
    4,
    0
  ),
  (
    2039,
    2,
    "2022Q2",
    "Building, Construction & Real Estate",
    92750,
    2650,
    "Start-up",
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    1,
    1,
    2,
    0
  ),
  (
    2040,
    2,
    "2022Q2",
    "Research and development",
    318000,
    2650,
    "Start-up",
    0,
    0,
    795,
    0,
    1,
    1,
    1,
    0,
    1,
    2,
    0,
    1,
    0
  );