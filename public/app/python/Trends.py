import json

with open('Trends.json') as data_file:    
    data = json.load(data_file)
dictionary = data[0]["trends"]
top5 = []

for trend in dictionary:
	volume = trend["tweet_volume"]
	if volume != None:
		if len(top5) == 5:
			top5.sort
			if volume > top5[0]:
				top5[0] = volume
		else:
			top5.append(trend["tweet_volume"])

with open("Trends.txt", encoding = 'utf-16', mode = 'w') as outfile:
	for trend in dictionary:
		if trend["tweet_volume"] in top5:
			text = trend["name"]
			text = text.encode('utf-16', 'surrogatepass').decode('utf-16')
			outfile.write(text)
			outfile.write('\n')