import json
import random

with open('../selfcare-scripts/NYC_landmarks_wiki.json', 'r') as infile:
    data = json.load(infile)
    keys = list(data['query']['pages'].keys())

randomIndex = random.randint(0, len(keys))
randomKey = keys[randomIndex]
randomPage = data['query']['pages'][randomKey]
randomPlace = randomPage['title']
randomPlaceFormatted = randomPlace.replace(" ", "_")
placePage = "https://en.wikipedia.org/wiki/" + randomPlaceFormatted
print(placePage)