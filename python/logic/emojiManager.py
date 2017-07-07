from common import emojiList as emotions
from common import mongoConfig as mongo

from bson.objectid import ObjectId

# TODO: implement better way to search through emojis. 
# TODO: recategorize emojis associated w/each emotion. Add comment to indicate emoji type by each unicode char. 

# Parses emoji in a single tweet
def parseTweetTextForEmoji(tweetText):

    emojiString = emojiString.encode('utf-16', 'surrogatepass').decode('utf-16')

    # Count of emojis in each emotion for single tweet
    num_happy = 0
    num_lit = 0
    num_sad = 0
    num_mad = 0
    num_funny = 0

    for char in tweetText:

        if char in emotions.HAPPY_EMOJI:
            num_happy += 1
        if char in emotions.LIT_EMOJI:
            num_lit += 1
        if char in emotions.SAD_EMOJI:
            num_sad += 1
        if char in emotions.SAD_EMOJI:
            num_mad += 1
        if char in emotions.FUNNY_EMOJI:
            num_funny += 1

    return (num_happy, num_lit, num_sad, num_mad, num_funny)


def parseTrendForEmoji(trend, tweet_list, destDir, filename):

	# Count of tweets searched
	tweet_count = 0
    
    # Count of emojis corresponding to each emotion for the entire trend
	num_happy = 0
	num_lit = 0
	num_sad = 0
	num_mad = 0
	num_funny = 0

	# parsedJson = jsonData ...  now tweet_list. remove comment when done cleaning up.
	top_tweet = ''
    top_tweet_retweet_count = 0
	total_emoji = 0

	#parsing the jsonFile
	for tweets in tweet_list:

		tweet_count += 1

		tweet_text = tweets["text"]
		countOfEmotionsList = parseTweetTextForEmoji(tweet_text)

		# Get the retweet count of currently parsed tweet. If > current max retweet, replace
		retweet_count = tweets["retweet_count"]

		if (retweet_count > top_tweet_retweet_count):
			top_tweet_retweet_count = retweet_count
			top_tweet = tweet_text

		num_happy += countOfEmotionsList[0]
		num_lit += countOfEmotionsList[1]
		num_sad += countOfEmotionsList[2]
		num_mad += countOfEmotionsList[3]
		num_funny += countOfEmotionsList[4]


        #######################################
        # res = topTrending.find({"_id": ObjectId("595ecad80168812da016b683")})






        #######################################

		#print to console when we get a hit
		#if(countOfEmotionsList != (0,0,0,0,0)):
		  #print("Num Happy: {}, Num Lit: {}, Num Sad: {}, Num Mad: {}, Num Funny: {}. ".format(num_happy, num_lit, num_sad, num_mad, num_funny))


    # Don't think this is correct...
	# total_emoji = num_happy + num_lit + num_sad + num_mad + num_funny

	# jsonFilename = filename+".json"
	# destination = os.path.join(destDir, jsonFilename)

	# emoji_data, total_emoji_count = EmojiCounter.emojiCounter(jsonData)

	#we have seen this trend before, so get data from old file to create new file
	# if (os.path.isfile(destination)):
	# 	trendFile = open(destination, "r")

	# 	trend_file_obj = json.load(trendFile)

	# 	tweetCount += trend_file_obj["tweetCount"]

	# 	for emotion in trend_file_obj["emotions"]:
	# 		if(emotion["name"] == "happy"):
	# 			num_happy += emotion["count"]
	# 		elif(emotion["name"] == "lit"):
	# 			num_lit += emotion["count"]
	# 		elif(emotion["name"] == "sad"):
	# 			num_sad += emotion["count"]
	# 		elif(emotion["name"] == "mad"):
	# 			num_mad += emotion["count"]
	# 		elif(emotion["name"] == "funny"):
	# 			num_funny += emotion["count"]

	# 	if(trend_file_obj["top_tweet_retweet_count"] > top_tweet_retweet_count):
	# 		top_tweet_retweet_count = trend_file_obj["top_tweet_retweet_count"]
	# 		top_tweet = trend_file_obj["mostPopTweet"]

	# 	emoji_map = {}
	# 	for entry in emoji_data:
	# 		emoji_map[entry["char"]] = entry["count"]

	# 	for entry in trend_file_obj["emojis"]:
	# 		if(entry["char"] in emoji_map):
	# 			emoji_map[entry["char"]] += entry["count"]
	# 		else:
	# 			emoji_map[entry["char"]] = entry["count"]
	# 	emoji_data = []
	# 	for key, char in emoji_map.items():
	# 		entry = {"count": emoji_map[key], "char": key}
	# 		emoji_data.append(entry)
	# 	total_emoji_count += trend_file_obj["total_emoji"]
	# 	trendFile.close()


	# #creating json file, because (Connor 'Big Sexy' Stanford) didn't want a boring txt file
	# topimg = BingImgGettr.GetTopImg(trend)
	# jsonify = {'top_tweet_retweet_count' : top_tweet_retweet_count,
	# 		   'mostPopTweet' : top_tweet,
	# 		   'tweetCount' : tweetCount,
	# 		   'emotions' : [
	# 		   		{'name': 'happy', 'count' : num_happy},
	# 				{'name': 'lit', 'count' : num_lit},
	# 				{'name': 'sad', 'count' : num_sad},
	# 				{'name': 'mad', 'count' : num_mad},
	# 				{'name': 'funny', 'count' : num_funny}
	# 		   ],
	# 		   'emojis' : emoji_data,
	# 		   'total_emoji' : total_emoji_count,
	# 		   'img' : topimg,
	# 		   'trendName' : trend
	# 		   }

	# outputJson = open(destination, "w")

	# json.dump(jsonify, outputJson, indent=2)