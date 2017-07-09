from common import constants
from common import mongoConfig as mongo
from logic import imageManager

import datetime
from heapq import nlargest

import pymongo
import tweepy

# Grabs top trends from twitter and updates emoviatodb
def updateTopTrends(tweepyApi):

    # Grab current trends from twitter. Remove hashtags from trend name.
    trends = tweepyApi.trends_place(id=constants.PLACE_ID_UNITED_STATES, exclude='hashtags')[0]['trends']

    # Keep the top n trends by tweet volume.
    top_trending_list = nlargest(constants.NUMBER_OF_TOP_TRENDS, trends, key=lambda trend:trend['tweet_volume'] != None)
    # Current topTrending in emoviatodb
    outdated_top_trending_list = getTopTrends()

    for index, trend in enumerate(top_trending_list):

        if outdated_top_trending_list is not None:
            for i in range(len(outdated_top_trending_list)):
                if str(outdated_top_trending_list[i]['name']) == str(trend['name']):
                    trend = outdated_top_trending_list[i]


        trend['datetime_last_updated'] = datetime.datetime.utcnow()

        # If the trend was prev processed, we already have an image & time retrieved
        if 'tweets_processed' not in trend:
            trend['img_url'] = imageManager.GetTopImg(trend['name'])
            trend['datetime_retrieved'] = datetime.datetime.utcnow()
        else:
            top_trending_list[index] = trend

    # Update emoviatodb.topTrends.
    mongo.topTrending.delete_many({})
    mongo.topTrending.insert(top_trending_list)


# Returns emoviatodb.topTrending
def getTopTrends():

    results = mongo.topTrending.find()
    if results.count() == 0:
        return

    # We can't simply return results because mongo.find() returns
    # a cursor, not an array.
    trending_list = []
    for trend in results:
        trending_list.append(trend)

    return trending_list

# Returns a collection of relevant tweets matching a specified trend name
# @param: search_type: 'popular', 'recent', or 'mixed'
def getTweetsForTrend(api, trendName, search_type):
	max_tweets = 100
	query = trendName
	tweets = [status._json for status in tweepy.Cursor(api.search, q=query, result_type=search_type).items(max_tweets)]
	return tweets


# Saves past topTrending lists.
# Perhaps it will be useful in the future?
def savePastTopTrending(outdated_top_trending_list):
    mongo.pastTopTrending.insert(outdated_top_trending_list)
