import pandas as pd
import json

df = pd.read_csv('data.csv')
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
    # print(labels[d])
    # print(texts[d])
    data["%s"%labels[d]].append(texts[d])

json_data = json.dumps(data)
# print ('JSON: ', json_data)

with open('data.json', 'w') as outfile:
    json.dump(data, outfile)


