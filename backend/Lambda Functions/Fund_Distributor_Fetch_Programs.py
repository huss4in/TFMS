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
    
    try:
        conn2 = pymysql.connect(host=rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
    except pymysql.MySQLError as e:
        logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
        logger.error(e)
        sys.exit()
    
    
    
    
    item_count = 0
    program_periods = []
    with conn.cursor() as cur:

        cur.execute("select id, program_name from tfms.programs")
        num_fields = len(cur.description)
        field_names = [i[0] for i in cur.description]
        # print(field_names)
        json_data=[]
        
        row_n = 0
        for row in cur:
            json_data=[]
            json_data.append(dict(zip(field_names,row)))
            prg_id = (str(json_data[0]["id"]))
            periodList = []
            
            row_n = row_n + 1
            print(str(row_n))
            
            with conn2.cursor() as cur2:
                cur2.execute("select period_name from tfms.periods WHERE program_id = " + prg_id)
                for c in cur2:
                    periodList.append(c[0])
                    
                periodList = ("\"periods\": " + json.dumps(periodList) + "}]")
                print(periodList)
                print(json_data)
                json_data = json.dumps(json_data)
                json_data = json_data[:-2]
                json_data += ", " + periodList
                print("Here!!")
                json_data = json.loads(json_data)
                print(json_data)
                # return ("cat if done\n" + str(catList)) 
                    
            program_periods += (json_data)
        print(program_periods)
        # print(type(json_data))
        # print((json_data))
        
        
    conn.close()
    conn2.close()
    return program_periods