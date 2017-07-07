from common import emojiList as emotions
from common import mongoConfig as mongo

from bson.objectid import ObjectId
# import json

# TODO: implement better way to search through emojis. 
# TODO: recategorize emojis associated w/each emotion. Add comment to indicate emoji type by each unicode char. 

# Parses emoji in a single tweet
def parseTweetTextForEmoji(tweet_text):

    tweet_text = tweet_text.encode('utf-16', 'surrogatepass').decode('utf-16')

    # Count of emojis in each emotion for single tweet
    happy_emoji_count = 0
    lit_emoji_count = 0
    sad_emoji_count = 0
    mad_emoji_count = 0
    funny_emoji_count = 0

    for char in tweet_text:
        if char in emotions.HAPPY_EMOJI:
            happy_emoji_count += 1
        if char in emotions.LIT_EMOJI:
            lit_emoji_count += 1
        if char in emotions.SAD_EMOJI:
            sad_emoji_count += 1
        if char in emotions.SAD_EMOJI:
            mad_emoji_count += 1
        if char in emotions.FUNNY_EMOJI:
            funny_emoji_count += 1

    return (happy_emoji_count, lit_emoji_count, sad_emoji_count, mad_emoji_count, funny_emoji_count)


def parseTrendForEmoji(trend, tweet_list):

	# Count of tweets searched
	tweet_count = 0
    
    # Count of emojis corresponding to each emotion for the entire trend
	happy_emoji_count = 0
	lit_emoji_count = 0
	sad_emoji_count = 0
	mad_emoji_count = 0
	funny_emoji_count = 0

	top_tweet = ''
	top_tweet_retweet_count = 0
	total_emoji = 0

	for tweets in tweet_list:

		tweet_count += 1
		tweet_text = tweets["text"]
		countOfEmotionsList = parseTweetTextForEmoji(tweet_text)

		# Get the retweet count of currently parsed tweet. If > current max retweet, replace
		retweet_count = tweets["retweet_count"]

		if (retweet_count > top_tweet_retweet_count):
			top_tweet_retweet_count = retweet_count
			top_tweet = tweet_text

		happy_emoji_count += countOfEmotionsList[0]
		lit_emoji_count += countOfEmotionsList[1]
		sad_emoji_count += countOfEmotionsList[2]
		mad_emoji_count += countOfEmotionsList[3]
		funny_emoji_count += countOfEmotionsList[4]


	trend_emotions = {
		'happy': { 
            'count': happy_emoji_count
        },
        'sad': {
            'count': sad_emoji_count
        },
        'funny': {
            'count': funny_emoji_count
        },
        'mad': {
            'count': mad_emoji_count
        },
        'lit': {
            'count': lit_emoji_count
        }
    }

	trend['emotions'] = trend_emotions
	trend['top_tweet'] = top_tweet

	currentTrendId = trend['_id']
	mongo.topTrending.find_one_and_replace({'_id': currentTrendId}, trend)



        #######################################

		#print to console when we get a hit
		#if(countOfEmotionsList != (0,0,0,0,0)):
		  #print("Num Happy: {}, Num Lit: {}, Num Sad: {}, Num Mad: {}, Num Funny: {}. ".format(happy_emoji_count, lit_emoji_count, sad_emoji_count, mad_emoji_count, funny_emoji_count))


    # Don't think this is correct...
	# total_emoji = happy_emoji_count + lit_emoji_count + sad_emoji_count + mad_emoji_count + funny_emoji_count

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
	# 			happy_emoji_count += emotion["count"]
	# 		elif(emotion["name"] == "lit"):
	# 			lit_emoji_count += emotion["count"]
	# 		elif(emotion["name"] == "sad"):
	# 			sad_emoji_count += emotion["count"]
	# 		elif(emotion["name"] == "mad"):
	# 			mad_emoji_count += emotion["count"]
	# 		elif(emotion["name"] == "funny"):
	# 			funny_emoji_count += emotion["count"]

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
	# 		   		{'name': 'happy', 'count' : happy_emoji_count},
	# 				{'name': 'lit', 'count' : lit_emoji_count},
	# 				{'name': 'sad', 'count' : sad_emoji_count},
	# 				{'name': 'mad', 'count' : mad_emoji_count},
	# 				{'name': 'funny', 'count' : funny_emoji_count}
	# 		   ],
	# 		   'emojis' : emoji_data,
	# 		   'total_emoji' : total_emoji_count,
	# 		   'img' : topimg,
	# 		   'trendName' : trend
	# 		   }

	# outputJson = open(destination, "w")

	# json.dump(jsonify, outputJson, indent=2)