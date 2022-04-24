import sys
import logging
import rds_config
import pymysql
import json
from operator import itemgetter
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
    


    run_id = event['run_id']
    run_id = str(run_id)
    print(run_id)
    

    with conn.cursor() as cur:

        cur.execute("select * from tfms.runs where id = %s", (run_id,))
        num_fields = len(cur.description)
        field_names = [i[0] for i in cur.description]
        # print(field_names)
        json_data=[]
        jsonResponse = "[\n"
        for row in cur:
            
            prg_id= str(row[1])
            prd_name= str(row[2])
            print (prg_id + " - " + prd_name)
            
            
            
            # print(type(row))
            rowString ="{\n"
            i= 0
            while i<6:
                print(type(row[i]))
                if type(row[i]) == int :
                    rowString +=("\""+ field_names[i] +"\": "+ str(row[i]) + ",\n")
                elif type(row[i]) == float:
                    rowString +=("\""+ field_names[i] +"\": "+ str(row[i]) + ",\n")
                elif i == 2:
                    rowString +=("\""+ field_names[i] +"\": \""+ str(row[i]) + "\",\n")
                else:
                    rowString +=("\""+ field_names[i] +"\": "+ str(row[i]) + ",\n")
                i += 1
            rowString =rowString[:-2]
            rowString +=("\n},\n")
            # print (rowString)
            jsonResponse +=(rowString)
    # conn.commit()
        jsonResponse =jsonResponse[:-2]
        jsonResponse +=("\n]")
        # print(jsonResponse)
        json_data = json.loads(jsonResponse)
        run_json = json_data
            
        cur.execute("select * from tfms.applicants WHERE program_id = %s and period_name= %s", (prg_id,prd_name,))
        num_fields = len(cur.description)
        field_names = [i[0] for i in cur.description]
        # print(field_names)
        temp_json= []
        # print("Applicants")
        for row in cur:
            print(row)
            temp_json.append(dict(zip(field_names,row)))
        applicants_json = temp_json
        # json_data += temp_json
        
        # print("Applicants End")
        
        
        cur.execute("select applicant_id, estimated_fund from tfms.runs_applicants WHERE run_id = %s", (run_id,))
        num_fields = len(cur.description)
        field_names = [i[0] for i in cur.description]
        # print(field_names)
        temp_json= []
        for row in cur:
            temp_json.append(dict(zip(field_names,row)))
        hist_est_json = temp_json
        # json_data += temp_json
        
        print("---------------------HERE")
        print(hist_est_json)
        sorted_hist_est_json = sorted(hist_est_json, key=itemgetter('applicant_id'))
        sorted_applicants = sorted(applicants_json, key=itemgetter('id'))
        # print(sorted_applicants)
        # print(sorted_applicants[0]['estimated_fund'])
        # return sorted_applicants[0]
        for i in sorted_applicants:
            # print(i)
            # print(type(i))
            # ml_string = ""
            # m0= i['estimated_fund']
            for k in sorted_hist_est_json:
                if i['id'] == k['applicant_id']:
                    i['estimated_fund'] = k['estimated_fund']
        
        applicants_json = sorted_applicants
        
    
        cur.execute("select feature_id from tfms.program_features WHERE program_id = %s", (prg_id,))
        featureList= []
        for row in cur:
            featureList.append(row[0])
        # print(featureList)
        
        allFeatures= []
        # for i in featureList:
        
        cur.execute("SELECT tfms.features.id,tfms.features.column_name,tfms.features.visible_name,tfms.features.type,tfms.program_features.importance,tfms.features.description FROM tfms.features INNER JOIN tfms.program_features ON tfms.features.id = tfms.program_features.feature_id WHERE tfms.program_features.program_id = %s", (prg_id,))
        num_fields = len(cur.description)
        print(num_fields)
        field_names = [i[0] for i in cur.description]
        # print(field_names)
        # json_data=[]
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
        
 
    conn.close()
    conn2.close()
        
    
    thisdict =	{}
    thisdict["run"] = run_json
    thisdict["Applicants"] = applicants_json
    thisdict["Features"] = allFeatures
    # print(thisdict)
    return thisdict