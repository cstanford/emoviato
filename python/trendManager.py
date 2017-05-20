import BingImgGettr

from heapq import nlargest
import json

import pymongo
import tweepy

PLACE_ID_UNITED_STATES = 23424977
PLACE_ID_NEW_ORLEANS = 2458833
NUMBER_OF_TOP_TRENDS = 5

def getTopTrends(tweepyApi):

    trends = tweepyApi.trends_place(PLACE_ID_UNITED_STATES)[0]['trends']
    top_trending_list = []

    top_trending_list = nlargest(NUMBER_OF_TOP_TRENDS, trends, key=lambda e:e['tweet_volume'] != None)

    for trend in top_trending_list:
        # Strip hashtag from trend name.
        trend['name'] = trend['name'].replace('#', '')
        # Fetch and add an image to the trend object
        trend['bing_img'] = BingImgGettr.GetTopImg(trend['name'])
        print(trend)



    # print('\n\nlee')
    # for i in range(5):
    #     print(top5[i]['tweet_volume'])

# jsonFilename = "topTrends.json"
# destination = os.path.join(destDir, jsonFilename)
# outputJson = open(destination, "w")
#
# for trend in trends[0]["trends"]:
# 	if trend["tweet_volume"] in top5:
# 		text = trend["name"]
# 		text = text.replace('#', '')
# 		filename = re.sub(r'\W+', '', text)
# 		print(text)
# 		topimg = BingImgGettr.GetTopImg(text)
# 		text = text.encode('utf-16', 'surrogatepass').decode('utf-16')
# 		top5json.append({"trendName" : text, "img" : topimg, "fileName" : filename})
# json.dump(top5json, outputJson, indent = 2)
#
# return top5json
