#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys
import logging
import rds_config
import pymysql
import json

# rds settings

rds_host = 'tfms.cluster-ccxhdwa7tlze.us-east-1.rds.amazonaws.com'
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

logger = logging.getLogger()
logger.setLevel(logging.INFO)

logger.info('SUCCESS: Connection to RDS MySQL instance succeeded')


def lambda_handler(event, context):
    """
    This function fetches content from MySQL RDS instance
    """

    item_count = 0

    try:
        conn = pymysql.connect(host=rds_host, user=name,
                               passwd=password, db=db_name,
                               connect_timeout=5)
    except pymysql.MySQLError, e:
        logger.error('ERROR: Unexpected error: Could not connect to MySQL instance.'
                     )
        logger.error(e)
        sys.exit()

    try:
        conn2 = pymysql.connect(host=rds_host, user=name,
                                passwd=password, db=db_name,
                                connect_timeout=5)
    except pymysql.MySQLError, e:
        logger.error('ERROR: Unexpected error: Could not connect to MySQL instance.'
                     )
        logger.error(e)
        sys.exit()

    program_id = event['program_id']
    prg_id = str(program_id)

    with conn.cursor() as cur:

        cur.execute('select feature_id from tfms.program_features WHERE program_id = %s'
                    , (prg_id, ))
        featureList = []
        for row in cur:
            featureList.append(row[0])

        # print(featureList)

        allFeatures = []

        # for i in featureList:

        cur.execute('select * from tfms.features WHERE id = ' + str(i))
        num_fields = len(cur.description)
        field_names = [i[0] for i in cur.description]

        # print(field_names)
        # json_data=[]

        for row in cur:
            json_data = []
            json_data.append(dict(zip(field_names, row)))


            for i in json_data:
                print str(i['id'])
                f_id = str(i['id'])
                with conn2.cursor() as cur2:
                    print 'Test'
                    cur2.execute('select importance, ml_model_column_index from tfms.program_features WHERE feature_id = %s and program_id = %s'
                                 , (f_id, prg_id))
                    for c in cur2:
                        tempList = '"importance": ' + str(c[0]) \
                            + ', "ml_model_column_index": ' + str(c[1]) \
                            + '}]'

                        # print(tempList)

                        json_data = json.dumps(json_data)
                        json_data = json_data[:-2]
                        json_data += ', ' + tempList
                        json_data = json.loads(json_data)
                if i['type'] == 'cat':
                    catList = []
                    with conn2.cursor() as cur2:
                        cur2.execute('select name from tfms.feature_catagories WHERE feature_id = '
                                 + str(i['id']))
                        for c in cur2:
                            catList.append(c[0])

                        catList = '"categorical_values": ' \
                            + json.dumps(catList) + '}]'

                        # print(catList)
                        # print(json_data)

                        json_data = json.dumps(json_data)
                        json_data = json_data[:-2]
                        json_data += ', ' + catList


                        json_data = json.loads(json_data)
                        print json_data

                        # return ("cat if done\n" + str(catList))

            allFeatures += json_data
        print allFeatures

        # print(type(json_data))
        # print((json_data))
        # return json_data

    conn.close()
    conn2.close()
    return allFeatures


        # return "done"
