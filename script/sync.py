import requests
import csv
import json

r = requests.get('https://raw.githubusercontent.com/hjnilsson/SwedishPolls/master/Data/Polls.csv')

file = open('polls.csv', 'w+')
file.write(r.text)
file.close()

csvfile = open('polls.csv', 'r')
jsonfile = open('../data/polls.json', 'w+')

jsonfile.write('[')

reader = csv.DictReader(csvfile)
rows = list(reader)
totalRows = len(rows) - 1
for i, row in enumerate(rows):
    json.dump(row, jsonfile)

    if i == totalRows:
        jsonfile.write(']')
    else:
        jsonfile.write(',\n')
