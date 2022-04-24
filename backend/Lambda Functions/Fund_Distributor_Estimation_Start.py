import sys
import logging
import rds_config
import pymysql
import json
import time
import boto3
from operator import itemgetter
#rds settings
rds_host  = "tfms.cluster-ccxhdwa7tlze.us-east-1.rds.amazonaws.com"
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

logger = logging.getLogger()
logger.setLevel(logging.INFO)

client = boto3.client('runtime.sagemaker')



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
    
    
    program_id = event['program_id']
    prg_id = str(program_id)
    period_name = event['period_name']
    prd_name = str(period_name)
    # print(prg_id+ "---" + prd_name )
    
    current_time = int(time.time())
    

    with conn.cursor() as cur:
        
        cur.execute("select fund_estimated_status from tfms.periods WHERE program_id = %s and period_name= %s", (prg_id,prd_name,))
        for r in cur:
            if r[0] == "in progress":
                conn.close()
                conn2.close()
                return "estimation is currently in progress for this program period"
                

        cur.execute("UPDATE tfms.periods SET fund_estimated_status = \"in progress\", fund_estimation_date = " + str(current_time) + " WHERE period_name = %s and program_id = %s", (prd_name,prg_id,))
        conn.commit()

        
        cur.execute("select * from tfms.applicants WHERE program_id = %s and period_name= %s", (prg_id,prd_name,))
        num_fields = len(cur.description)
        field_names = [i[0] for i in cur.description]
        # print(field_names)
        json_data=[]
        allperiods= []
        for row in cur:
            json_data.append(dict(zip(field_names,row)))
        applicants = (json_data)
        
        # print(applicants)
        
        
        cur.execute("select feature_id from tfms.program_features WHERE program_id = %s", (prg_id,))
        featureList= []
        for row in cur:
            featureList.append(row[0])
        # print(featureList)
        
        allFeatures= []
        for i in featureList:
        
            cur.execute("select id, column_name from tfms.features WHERE id = " + str(i))
            num_fields = len(cur.description)
            field_names = [i[0] for i in cur.description]
            # print(field_names)
            json_data=[]
        
        
            for row in cur:
                json_data.append(dict(zip(field_names,row)))
                
                for i in json_data:
                    # print(str(i['id']))
                    with conn2.cursor() as cur2:
                        cur2.execute("select ml_model_column_index from tfms.program_features WHERE feature_id = "+ str(i['id'])  +" and program_id = %s", (prg_id,))
                        for c in cur2:
                            tempList = ("\"ml_model_column_index\": " + str(c[0]) +  "}]")
                            # print(tempList)
                            json_data = json.dumps(json_data)
                            json_data = json_data[:-2]
                            json_data += ", " + tempList
                            json_data = json.loads(json_data)
                        
                allFeatures += (json_data)
            # print(allFeatures)
            
            
        sortedFeatureList = sorted(allFeatures, key=itemgetter('ml_model_column_index'))
        applicant_num = 0
        applicants_update = ""
        for i in applicants:
            # print(i)
            # print(type(i))
            ml_string = ""
            for k in sortedFeatureList:
                # print(k)
                # print("next one")
                # print(i[(k["column_name"])])
                feature_value= i[(k["column_name"])]
                # print(type(feature_value))
                if type(feature_value) == str:
                    ml_string += ("\""+ feature_value +"\", " )
                else:
                    ml_string += ( str(feature_value) +", " )
            ml_string = ml_string[:-2]
            # print(ml_string)
            
            with conn2.cursor() as cur2:
                cur2.execute("SELECT fund_estimation_model_name FROM tfms.programs WHERE id = %s", (prg_id,))
                for c in cur2:
                    ml_endpoint = str(c[0])
            
            
            
            response = client.invoke_endpoint(EndpointName=ml_endpoint, Body=ml_string, ContentType='text/csv')
            response_body = response['Body']
            temp = (response_body.read())
            estimated_fund = temp.decode('UTF-8')
            estimated_fund = str(round(float(estimated_fund), 1))
            
            
            applicants_update += ("(" + str(applicants[applicant_num]["id"]) + ", " + estimated_fund + "), ")
            applicant_num += 1
            
        applicants_update= (applicants_update[:-2])
   
        cur.execute("INSERT into tfms.applicants (id, estimated_fund)     VALUES " + applicants_update    + " ON DUPLICATE KEY UPDATE estimated_fund = VALUES(estimated_fund);")
        conn.commit()
        cur.execute("UPDATE tfms.periods SET fund_estimated_status = \"completed\", fund_estimation_date = " + str(current_time) + " WHERE period_name = %s and program_id = %s", (prd_name,prg_id,))
        conn.commit()
        
    conn.close()
    conn2.close()
    return "Estimation Done"
