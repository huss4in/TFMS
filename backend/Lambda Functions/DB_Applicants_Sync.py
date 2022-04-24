import sys
import logging
import rds_config
import pymysql
import json
import urllib.parse
import boto3
#rds settings
rds_host  = "tfms.cluster-ccxhdwa7tlze.us-east-1.rds.amazonaws.com"
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

logger = logging.getLogger()
logger.setLevel(logging.INFO)

print('Loading function')

try:
    conn = pymysql.connect(host=rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    logger.error(e)
    sys.exit()
    
logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")

s3 = boto3.client('s3')


def lambda_handler(event, context):


    # Get the object from the event and show its content type
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    # return (key)
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        print("CONTENT TYPE: " + response['ContentType'])
        data = response['Body'].read().decode('utf-8')
        data = data.split("\n")
        # print (data[0])
        # print (type(data[0]))
        fileFeatures = data[0].split(",")
        fileFeatures[-1] = fileFeatures[-1][:-1]
        print(fileFeatures)
        temp = data[1].split(",")
        temp[-1] = temp[-1][:-1]

        count = 0
        for i in fileFeatures:
            if i == "program_id":
                prg_id_col = count
                prg_id = temp[count]
            if i == "period_name":
                prd_name_col = count
                prd_name = temp[count]
            count += 1
                
        print(prg_id + "---"+ prd_name)
        
        try:
            
            with conn.cursor() as cur:
                cur.execute("select * from tfms.periods where program_id = %s and period_name = %s", (prg_id,prd_name,))
                row_count = cur.rowcount
                print(row_count)
                if row_count == 0:
                    print ("Adding period in table!")
                    cur.execute("insert into tfms.periods (period_name,program_id,fund_estimated_status,fund_estimation_date) values (%s, %s, %s, %s)", (prd_name,prg_id,"not started",0,))
                    conn.commit()
                else:
                    conn.close()
                    return "Period already in table!"
        except Exception as e:
            print(e)
            print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
            raise e
                
        
        
        s1= ""
        for idx, x in enumerate(fileFeatures):
            
                if type(x) == str:
                    
                    s1 += x + ","
                else:
                    s1 += x + ","
        s1 = s1[:-1]
        # print(s1)
        
        
        with conn.cursor() as cur:
            for appli in data: # Iterate over S3 csv file content and insert into MySQL database
                try:
                    # print(appli)
                    appli = appli.replace("\n","").split(",")
                    # print(appli)
                    appli[-1] = appli[-1][:-1]
                    
                    
                    s2 = ""
                    # print("----------------------")
                    # print(type(appli))
                    
                    for idx, x in enumerate(appli):
                        
                            if type(x) == str:
                                s2 += "'"+ x + "',"
                                # s2 += x + ","
                            else:
                                s2 += x + ","
                                
                                
                    s2 = s2[:-1]
                    # print(s2)
                    
                    cur.execute("insert into tfms.applicants ("+s1+") values("+s2+")")
                    conn.commit()
                    
                    
                    
                except Exception as e:
                    print(e)
                    print("Applicant-Error")
                    continue
                
        print("Closing!")
        conn.close()
        return "done"
        # return response['ContentType']
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        raise e