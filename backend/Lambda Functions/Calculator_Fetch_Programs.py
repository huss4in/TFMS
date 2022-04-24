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

    
    with conn.cursor() as cur:
        cur.execute("select * from tfms.programs ")
        num_fields = len(cur.description)
        field_names = [i[0] for i in cur.description]
        # print(field_names)
        jsonResponse = "[\n"
        for row in cur:
            # print(row)
            rowString ="{\n"
            i= 0
            while i<2:
                if type(row[i]) == int:
                    rowString +=("\""+ field_names[i] +"\": "+ str(row[i]) + ",\n")
                else:
                    rowString +=("\""+ field_names[i] +"\": \""+ (row[i]) + "\",\n")
                i += 1
            rowString =rowString[:-2]
            rowString +=("\n},\n")
            # print (rowString)
            jsonResponse +=(rowString)
            
        jsonResponse =jsonResponse[:-2]
        jsonResponse +=("\n]")
        print(jsonResponse)
        Response = json.loads(jsonResponse)
        print(type(Response))
        print(Response)
    
    conn.close()
    return Response