import json

outfile = open('emojicount.txt', encoding = "utf-16", mode = "w")

json_data = open('data.json')
parsed_json = json.load(json_data)
for tweets in parsed_json:
	text = tweets["text"]
	text = text.encode('utf-16', 'surrogatepass').decode('utf-16')
	for i in range(0, len(text)):
		if text[i] > u"\U0001f600" and text[i] < u"\U0001f64f":
			emoji = text[i]
			outfile.write(emoji)