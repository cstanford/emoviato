import emojiParse
import json
import tweepy
import os.path

#authentification
auth = tweepy.OAuthHandler('WAmc6nksqtBkRXkYHDzGTkNC2', 'rHbTMCkMjZU3Ru4pPrh1GFbPrcGfVyFfUXNOqqueN9cOuMdylv')
auth.set_access_token('371692355-JUMH5vdqTgUlCGVukLDRFOePL9QrYHni7H79X49I', 'VbsIxYfEkLlBTcfEvJkyO2fNDCCHt0ZKVzKL81FY2RV9V')
api = tweepy.API(auth)

#getting the main folder path we are working in
currentDir = os.path.dirname(os.path.abspath(__file__))
destDir = os.path.join(currentDir, 'generatedFiles')
try:
    os.makedirs(destDir)
except OSError:
    pass # directory already exists

#get top 5 trends in json object held in variable
top5trends = emojiParse.getTopTrends(api, destDir)

for trend in top5trends:
	trendname = trend["trendName"]
	trendname.replace('#', "")
	trendname.rstrip
	trendTweetJson = emojiParse.getTweetsFromTrends(api, trendname,"popular")
	# trendTweetJson += emojiParse.getTweetsFromTrends(api, trendname,"recent")
	# trendTweetJson += emojiParse.getTweetsFromTrends(api, trendname,"mixed")
	# trendTweetJson += emojiParse.getTweetsFromTrends(api, trendname,"mixed")
	# trendTweetJson += emojiParse.getTweetsFromTrends(api, trendname,"mixed")
	
	emojiParse.emojiParser(trendname, trendTweetJson, destDir)
	#output all tweets
	with open(trendname + ".json",'w') as outfile:
		json.dump(trendTweetJson,outfile,indent = 2)