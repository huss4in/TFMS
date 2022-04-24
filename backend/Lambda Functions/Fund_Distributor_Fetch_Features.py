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
    item_count = 0
    
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
    
    
    program_id = event['program_id']
    prg_id = str(program_id)

    with conn.cursor() as cur:

        cur.execute("select feature_id from tfms.program_features WHERE program_id = %s", (prg_id,))
        featureList= []
        for row in cur:
            featureList.append(row[0])
        # print(featureList)
        
        allFeatures= []
        
        
        cur.execute("SELECT tfms.features.id,tfms.features.column_name,tfms.features.visible_name,tfms.features.type,tfms.program_features.importance,tfms.features.description FROM tfms.features INNER JOIN tfms.program_features ON tfms.features.id = tfms.program_features.feature_id WHERE tfms.program_features.program_id = %s", (prg_id,))
        num_fields = len(cur.description)
        print(num_fields)
        field_names = [i[0] for i in cur.description]
        # print(field_names)
        for row in cur:
            json_data=[]
            json_data.append(dict(zip(field_names,row)))
            for i in json_data:
                if i['type'] == "cat":
                    catList= []
                    with conn2.cursor() as cur2:
                        cur2.execute("select name from tfms.feature_catagories WHERE feature_id = " + str(i['id']))
                        for c in cur2:
                            catList.append(c[0])
                            
                        catList = ("\"categories\": " + json.dumps(catList) + "}]")
                        # print(catList)
                        # print(json_data)
                        json_data = json.dumps(json_data)
                        json_data = json_data[:-2]
                        json_data += ", " + catList
                        # print("Here!!")
                        json_data = json.loads(json_data)
                        # print(json_data)
                        # return ("cat if done\n" + str(catList)) 
                    
            allFeatures += (json_data)
        # print(allFeatures)
        # print(type(json_data))
        # print((json_data))
        # return json_data
       
    conn.close()
    conn2.close()
    return allFeatures