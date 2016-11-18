import json
import collections

outfile = open('emojicount.json', encoding = "utf-16", mode = "w")
top5json = open('top5emojis.json', encoding = "utf-16", mode = "w")
cnt = collections.Counter()

json_data = open('data.json')
parsed_json = json.load(json_data)
for tweets in parsed_json:
	text = tweets["text"]
	text = text.encode('utf-16', 'surrogatepass').decode('utf-16')
	for i in range(0, len(text)):
		if (text[i] > u"\U0001f600" and text[i] < u"\U0001f64f") or (text[i] > u"\U0001f300" and text[i] < u"\U0001f5ff") or (text[i] > u"\U0001f910" and text[i] < u"\U0001f9c0") or (text[i] > u"\U00002600" and text[i] < u"\U000026ff") or (text[i] > u"\U00002700" and text[i] < u"\U000027bf"):
			emoji = text[i]
			cnt[emoji] += 1
			
json.dump(cnt, outfile, ensure_ascii = False, indent = 2)
json.dump(dict(cnt.most_common(5)), top5json, ensure_ascii = False, indent = 2)