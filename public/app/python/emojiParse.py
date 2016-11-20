#!/usr/bin/env python3.4
import json
import os.path
import tweepy
import BingImgGettr
import EmojiCounter

#getting all trends, returns json object with top 5 trends.
##########################################################################
def getTopTrends(api, destDir):

	trends = api.trends_place(2458833) #New Orleans search
	with open("trends.json",'w') as outfile:
		json.dump(trends, outfile, indent = 2)
	
	top5 = []
	top5json = []
	
	for trend in trends[0]["trends"]:
		volume = trend["tweet_volume"]
		if volume != None:
			if len(top5) == 5:
				top5.sort
				if volume > top5[0]:
					top5[0] = volume
			else:
				top5.append(trend["tweet_volume"])

	jsonFilename = "topTrends.json"
	destination = os.path.join(destDir, jsonFilename)
	outputJson = open(destination, "w")
	
	for trend in trends[0]["trends"]:
		if trend["tweet_volume"] in top5:
			text = trend["name"]
			text = text.encode('utf-16', 'surrogatepass').decode('utf-16')
			topimg = BingImgGettr.GetTopImg(text)
			top5json.append({"trendName" : text, "img" : topimg})
	json.dump(top5json, outputJson, indent = 2)
		
	return top5json


##########################################################################

# def getJsonTopTrends(top5trends):

    # trendArray = []

    # with open("Trends.txt", "r", encoding='utf-16') as trend:
        # for line in trend:
            # trendArray.append(line.replace('#', ""))#.encode('utf-16','surrogatepass').decode('utf-16')

    # for trend in trendArray:
        # print(trend)


    # return trendArray

def getTweetsFromTrends(api, trendName, search_type):
	max_tweets=100
	query=trendName
	searched_tweets=[status._json for status in tweepy.Cursor(api.search, q=query, result_type=search_type).items(max_tweets)]
	#json_strings = [json.dumps(json_obj) for json_obj in searched_tweets]
	return searched_tweets

# filename = query + '.json'
# path = os.path.join(destDir, filename)

# with open(path, 'w') as outfile:
    # json.dump(searched_tweets, outfile, indent=2, sort_keys=True)

##########################################################################

# getting the main folder path we are working in
# currentDir = os.path.dirname(os.path.abspath(__file__))
# destDir = os.path.join(currentDir, 'currentTrendTweets')
# try:
	# os.makedirs(destDir)
# except OSError:
	# pass # directory already exists

def emojiParser(trend, jsonData, destDir):
	# trendArray = getJsonTopTrends()

	# for trend in trendArray:
		# trend = trend.rstrip()
		# print("THE FUCKING STRING IS", trend)
		# getTweetsFromTrends(trend)

		#jsonData = open(os.path.join(destDir, trend + ".json"), 'r')

	savedTweets = open(trend + "Tweets", "w")

	#lists of emojis we will count
	happyEmojis = [ u'\U0001F601',
					u'\U0001F603',
					u'\U0001F60A',
					u'\U0001F60B',
					u'\U0001F60C',
					u'\U0001F642',
					u'\U0001F643',
					u'\U0001F638']

	litEmojis = [
					u'\U0001F44D', #thumbs up
					u'\U0001F525'] #fire

	sadEmojis = [ u'\U0001F614',
				  u'\U0001F61E',
				  u'\U0001F629',
				  u'\U0001F63F',
				  u'\U0001F641',
				  u'\U0001F644']

	madEmojis = [ u'\U0001F620',
				  u'\U0001F621',
				  u'\U0001F624',
				  u'\U0001F63E']

	funnyEmojis = [ u'\U0001F602',
					u'\U0001F604',
					u'\U0001F605',
					u'\U0001F606',
					u'\U0001F61D',
					u'\U0001F62D',
					u'\U0001F639']


	#function that counts emojis in a single tweet
	def parseString(emojiString):

		emojiString = emojiString.encode('utf-16', 'surrogatepass').decode('utf-16')
		savedTweets.write(emojiString + "\n")

		#count for single tweet
		numHappy = 0
		numLit = 0
		numSad = 0
		numMad = 0
		numFunny = 0

		#parses emojiString passed in, increments count/prints emoji to console
		for char in emojiString:

			if char in happyEmojis:
				numHappy += 1
				#print("found"+char)
			if char in litEmojis:
				numLit += 1
				#print("found"+char)
			if char in sadEmojis:
				numSad += 1
				#print("found"+char)
			if char in madEmojis:
				numMad += 1
				#print("found"+char)
			if char in funnyEmojis:
				numFunny += 1
				#print("found"+char)

		return (numHappy, numLit, numSad, numMad, numFunny)

	#final count for all tweets
	tweetCount = 0
	numHappy = 0
	numLit = 0
	numSad = 0
	numMad = 0
	numFunny = 0



	#parsedJson needs to be here because it should only load after the parser has executed.
	parsedJson = jsonData
	maxRetweets = 0
	maxRetweetTweet = ""
	totalEmojis = 0

	#parsing the jsonFile
	for tweets in parsedJson:

		tweetCount += 1

		savedTweets.write("tweet number: %d \n" % tweetCount)
		text = tweets["text"]
		res = parseString(text)

		#getting the retweet count of currently parsed tweet, if > current max retweet, replace
		retweetCount = tweets["retweet_count"]

		if (retweetCount > maxRetweets):
			maxRetweets = retweetCount
			maxRetweetTweet = text


		tweetLocation = tweets["user"]["location"]
		savedTweets.write("retweet count: %d \n" % retweetCount)
		savedTweets.write("location: %s \n\n" % tweetLocation)

		numHappy += res[0]
		numLit += res[1]
		numSad += res[2]
		numMad += res[3]
		numFunny += res[4]

		#print to console when we get a hit
		#if(res != (0,0,0,0,0)):
		  #print("Num Happy: {}, Num Lit: {}, Num Sad: {}, Num Mad: {}, Num Funny: {}. ".format(numHappy, numLit, numSad, numMad, numFunny))

	totalEmojis = numHappy + numLit + numSad + numMad + numFunny

	if (totalEmojis > 0):
		percentHappy = numHappy / totalEmojis
		percentLit = numLit / totalEmojis
		percentSad = numSad / totalEmojis
		percentMad = numMad / totalEmojis
		percentFunny = numFunny / totalEmojis
	else:
		percentHappy = 0
		percentLit = 0
		percentSad = 0
		percentMad = 0
		percentFunny = 0

	#we have seen this trend before, so get data from old file to create new file
	# if (os.path.isfile(os.path.join(destDir, trend + "Trend"))):

		# print("file already exists!")
		# trendFile = open(os.path.join(destDir, trend + "Trend"), "r")

		# #reading line by line info from file
		# oldTopTweet = str(trendFile.readline())
		# print("oldTopTweet: ", oldTopTweet)

		# oldMaxRetweetCount = int(trendFile.readline())
		# print("oldMaxRetweetCount: ", oldMaxRetweetCount)

		# oldNumTweets = int(trendFile.readline())
		# print("oldNumTweets: ", oldNumTweets)

		# oldTotalEmojiCount = int(trendFile.readline())
		# print("oldTotalEmojiCount: ", oldTotalEmojiCount)

		# oldNumHappy = int(trendFile.readline())
		# print("oldNumHappy: ", oldNumHappy)

		# oldNumLit = int(trendFile.readline())
		# print("oldNumLit: ", oldNumLit)

		# oldNumSad = int(trendFile.readline())
		# print("oldNumSad: ", oldNumSad)

		# oldNumMad = int(trendFile.readline())
		# print("oldNumMad: ", oldNumMad)

		# oldNumFunny = int(trendFile.readline())
		# print("oldNumFunny: ", oldNumFunny)

		# trendFile.close()

		# trendFile = open("emojiTrend", "w")

		# totalEmojis = totalEmojis + oldTotalEmojiCount
		# tweetCount = tweetCount + oldNumTweets
		# numHappy = numHappy + oldNumHappy
		# numLit = numLit + oldNumLit
		# numSad = numSad + oldNumSad
		# numMad = numMad + oldNumMad
		# numFunny = numFunny + oldNumFunny

		# trendFile.write("%s \n%d \n%d \n%d \n%d \n%d \n%d \n%d \n%d \n" % (
			# maxRetweetTweet, maxRetweets, tweetCount, totalEmojis, numHappy, numLit, numSad, numMad, numFunny))

		# trendFile.close()

		# jsonify = {'maxRetweets' : maxRetweets,
				   # 'mostPopTweet' : maxRetweetTweet,
				   # 'tweetCount' : tweetCount,
				   # 'totalEmojis' : totalEmojis,
				   # 'numhappy' : numHappy,
				   # 'numLit' : numLit,
				   # 'numSad' : numSad,
				   # 'numMad' : numMad,
				   # 'numFunny' : numFunny
					# }

		# outputJson = open("testJsonOut", "w")
		# json.dump(jsonify, outputJson, indent=2)



	# this is the first time we've seen this trend, so we must make a new trend file for it
	# else:
	#print("file does not exist, creating a new file to store data")
	# trendFile = open(os.path.join(destDir, trend + "Trend"), "w")
	# trendFile.write("%s \n%d \n%d \n%d \n%d \n%d \n%d \n%d \n%d \n" % (
		# maxRetweetTweet, maxRetweets, tweetCount, totalEmojis, numHappy, numLit, numSad, numMad, numFunny))

	# trendFile.close()

	#creating json file, because no one wanted just a boring txt file
	topimg = BingImgGettr.GetTopImg(text)
	jsonify = {'maxRetweets' : maxRetweets,
			   'mostPopTweet' : maxRetweetTweet,
			   'tweetCount' : tweetCount,
			   'totalEmojis' : totalEmojis,
			   'numhappy' : numHappy,
			   'numLit' : numLit,
			   'numSad' : numSad,
			   'numMad' : numMad,
			   'numFunny' : numFunny,
			   'img' : topimg
			   }
	
	count = EmojiCounter(jsonData)
	
	jsonify.update(count)
	
	jsonFilename = trend+".json"
	destination = os.path.join(destDir, jsonFilename)
	outputJson = open(destination, "w")

	json.dump(jsonify, outputJson, indent=2)

	######### end old else

	# general output to console
	# print("Total tweets parsed: {}.".format(tweetCount))
	# print("Most retweets: ", maxRetweets)
	# print("Most retweeted tweet: ", maxRetweetTweet)
	# print("Total number of emojis: ", totalEmojis)
	# print("numHappy: %d, numLit: %d, numSad: %d, numMad: %d, numFunny: %d" % (numHappy, numLit, numSad, numMad, numFunny))


	#trendFile.close()