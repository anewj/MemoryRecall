import pandas as pd
import json

from pymongo import MongoClient


def _connect_mongo(host, port, username, password, db):
    if username and password:
        mongo_uri = 'mongodb://%s:%s@%s:%s/%s' % (username, password, host, port, db)
        conn = MongoClient(mongo_uri)
    else:
        conn = MongoClient(host, port)
    return conn[db]


def read_mongo(db, collection, query={}, host='localhost', port=27017, username=None, password=None, no_id=True):
    db = _connect_mongo(host=host, port=port, username=username, password=password, db=db)
    cursor = db[collection].find(query)
    df =  pd.DataFrame(list(cursor))
    if no_id:
        del df['_id']

    return df

df = read_mongo(""" database paramter here !! """)
print(df.head())

labels, texts = [],[]


# function to get unique values in list
def unique(list1):
    # intilize a null list
    unique_list = []

    # traverse for all elements
    for x in list1:
        # check if exists in unique_list or not
        if x not in unique_list:
            unique_list.append(x)

    return unique_list


for row in df.iterrows():
    for fam in range(15):
        NUM = fam+1
        t = row[1]['FAMT%s' %NUM]
        l = row[1]['codFAMT%s' %NUM]
        try:
            a = int(l)
        except ValueError:
            try:
                a = float(l)
                try:
                    a = int(a)
                except BaseException:
                    a = l
            except BaseException:
                a = l

        labels.append(a)
        texts.append(t)

unique_labels = unique(labels)

print(unique_labels)


data = {}
for lab in unique_labels:
    data["%s"%lab] = []


for d in range(len(labels)):
    print(labels[d])
    print(texts[d])
    data["%s"%labels[d]].append(texts[d])

json_data = json.dumps(data)
print ('JSON: ', json_data)

with open('data.json', 'w') as outfile:
    json.dump(data, outfile)
