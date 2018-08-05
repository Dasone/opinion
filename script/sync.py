#!/usr/bin/env python3

import csv, json, os, requests

r = requests.get('https://raw.githubusercontent.com/hjnilsson/SwedishPolls/master/Data/Polls.csv')
if r.ok:
    with open('polls.json', 'w+') as f:
        json.dump(list(csv.DictReader(r.text.splitlines())), f)

    os.rename('polls.json', os.path.join(os.path.dirname(os.path.realpath(__file__)), '../html/data/polls.json'))
else:
    r.raise_for_status()
