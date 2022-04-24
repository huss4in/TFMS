import json
import boto3
import os

database_name = os.getenv('database_name')
db_cluster_arn = os.getenv('db_cluster_arn')
db_credentials_secrets_store_arn = os.getenv('db_credentials_secrets_store_arn')


print('Loading function')
# data = {"instances": [1.0,2.0,5.0]}
client = boto3.client('runtime.sagemaker')

rds_client = boto3.client('rds-data')



def lambda_handler(event, context):
    
    program_id = event['program_id']
    prg_id = "\"" + str(program_id) + "\";"
    print(prg_id)
    response = execute_statement("SELECT fund_estimation_model_name FROM tfms.programs WHERE id = " + prg_id)
    ml_endpoint= response['records'][0][0]['stringValue'];
    print(ml_endpoint)
    
    featureNum = len(event['features'])
    
    arr = event['features']
    arr.sort(key = lambda json: json['ml_model_column_index'], reverse=False)
    # print(arr)
    
    i = 0
    ml_string = ""
    while i < featureNum:
        # print(arr[i]['user_input'])
        user_input = arr[i]['user_input']
        # print(arr[i]['ml_model_column_index'])
        index = arr[i]['ml_model_column_index']
        ml_string += str(user_input)
        i += 1
        if i < featureNum:
            ml_string += ","

    print(ml_string)

    response = client.invoke_endpoint(EndpointName=ml_endpoint, Body=ml_string , ContentType='text/csv')
    response_body = response['Body']
    temp = (response_body.read())
    estimated_fund = temp.decode('UTF-8')
    estimated_fund = str(round(float(estimated_fund), 1))
    print("Done!")
    return estimated_fund
    # return "Done!"
    
def execute_statement(sql):
    response = rds_client.execute_statement(
        secretArn = db_credentials_secrets_store_arn,
        database = database_name,
        resourceArn = db_cluster_arn,
        sql=sql
        )
    return response;