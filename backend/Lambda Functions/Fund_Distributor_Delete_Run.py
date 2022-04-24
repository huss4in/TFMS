import sys
import logging
import rds_config
import pymysql
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
    
    run_id = event['run_id']
    run_id = str(run_id)
    print(run_id)
    
    with conn.cursor() as cur:
        
        cur.execute("DELETE FROM tfms.runs_applicants WHERE run_id = %s", (run_id,))
        conn.commit()
        print("deleted runs applicants")
        cur.execute("DELETE FROM tfms.runs WHERE id = %s", (run_id,))
        conn.commit()
        print("deleted run")
        
    
    conn.commit()
    conn.close()
    return "done"