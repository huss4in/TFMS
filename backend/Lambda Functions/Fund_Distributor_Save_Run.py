import sys
import logging
import rds_config
import pymysql
import time
#rds settings
rds_host  = "tfms.cluster-ccxhdwa7tlze.us-east-1.rds.amazonaws.com"
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

logger = logging.getLogger()
logger.setLevel(logging.INFO)

logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")
def lambda_handler(event, context):
    """
    This function fetches content from MySQL RDS instance
    """

    try:
        conn = pymysql.connect(host=rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
    except pymysql.MySQLError as e:
        logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
        logger.error(e)
        sys.exit()
    
    
    program_id = event['program_id']
    prg_id = str(program_id)
    # print(program_id)
    period_name = event['period_name']
    prd_name = str(period_name)
    # print(period_name)
    # date = event['date']
    # date = str(date)
    # print(date)
    budget = event['budget']
    budget = str(budget)
    # print(budget)
    config = event['config']
    # print(config)
    # print(type(config))
    applicants = event['applicants']
    # print(applicants)
    # print(type(applicants))
    
    # print(type(config))
    # print(type(period_name))
    
    config = str(config).replace("'","\"")
    date = int(time.time())
    print("INSERT INTO tfms.runs (program_id, period_name, config ,date, budget) VALUES (" + str(program_id) + ", '" +  str(period_name) + "', '" +  str(config) + "', " + str(date) + ", " + str(budget) + ");")
    run_id = 0
    # conn.close()
    # return config
    with conn.cursor() as cur:
        
        cur.execute("INSERT INTO tfms.runs (program_id, period_name, config ,date, budget) VALUES (%s ,%s, %s, %s, %s)", (prg_id,prd_name,config,date,budget,))
        conn.commit()
 
        run_id = cur.lastrowid
        print(run_id)
        print(type(run_id))
        
        
        applicant_values="INSERT INTO tfms.runs_applicants (run_id, applicant_id, estimated_fund) VALUES"
        for i in applicants:
            print(i)
            applicant_values += "(" + str(run_id) + ", " + str(i['id']) + ", " + str(i['estimated_fund']) + "),"
            
        applicant_values = applicant_values[:-1] + ";"
        print(applicant_values)
        cur.execute(applicant_values)
        conn.commit()
            
    conn.close()

    return "done"