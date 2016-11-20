import json
import collections

def emojiCounter(jsonData):
	cnt = {}

	json_data = jsonData
	for tweets in jsonData:
		text = tweets["text"]
		text = text.encode('utf-16', 'surrogatepass').decode('utf-16')
		for i in range(0, len(text)):
			if (text[i] > u"\U0001f600" and text[i] < u"\U0001f64f") or (text[i] > u"\U0001f300" and text[i] < u"\U0001f5ff") or (text[i] > u"\U0001f910" and text[i] < u"\U0001f9c0") or (text[i] > u"\U00002600" and text[i] < u"\U000026ff") or (text[i] > u"\U00002700" and text[i] < u"\U000027bf"):
				emoji = text[i]
				if(emoji in cnt):
					cnt[emoji] += 1
				else:
					cnt[emoji] = 1
	res = []
	for key, char in cnt.items():
		entry = {"count": cnt[key], "char": key}
		res.append(entry)
	return res
	#json.dump(cnt, outfile, ensure_ascii = False, indent = 2)
	#json.dump(dict(cnt.most_common(5)), top5json, ensure_ascii = False, indent = 2)
