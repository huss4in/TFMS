import sys
import logging
import rds_config
import pymysql
import json
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
    period_name = event['period_name']
    prd_name = str(period_name)
    print(prg_id+ "---" + prd_name )

    with conn.cursor() as cur:

        cur.execute("select * from tfms.applicants WHERE program_id = %s and period_name= %s", (prg_id,prd_name,))
        num_fields = len(cur.description)
        field_names = [i[0] for i in cur.description]
        # print(field_names)
        json_data=[]
        allperiods= []
        for row in cur:
            json_data.append(dict(zip(field_names,row)))
        status = (json_data)

    conn.close()
    return json_data