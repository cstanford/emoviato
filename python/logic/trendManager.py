from common import constants
from common import mongoConfig as mongo
from logic import imageManager

import datetime
from heapq import nlargest

import pymongo
import tweepy

NUMBER_OF_TOP_TRENDS = 5

# Grabs top trends from twitter and updates emoviatodb
def updateTopTrends(tweepyApi):

    # Grab current trends from twitter. Remove hashtags from trend name.
    trends = tweepyApi.trends_place(id=constants.PLACE_ID_UNITED_STATES, exclude='hashtags')[0]['trends']

    # Keep the top n trends by tweet volume.
    top_trending_list = nlargest(NUMBER_OF_TOP_TRENDS, trends, key=lambda trend:trend['tweet_volume'] != None)
    # Current topTrending in emoviatodb
    outdated_top_trending_list = getTopTrends()

    for trend in top_trending_list:

        # Fetch and add an image to the trend object.
        trend['img_url'] = imageManager.GetTopImg(trend['name'])

        # If an existing trend is still trending when we update,
        # preserve the original datetime_retrieved.
        if outdated_top_trending_list is not None:
            for i in range(len(outdated_top_trending_list)):
                if str(outdated_top_trending_list[i]['name']) == str(trend['name']):
                    trend['datetime_retrieved'] = \
                    outdated_top_trending_list[i]['datetime_retrieved']

        # If the trend object does not have property 'datetime_retrieved',
        # add the property and set it to the current time.
        try:
            trend['datetime_retrieved']
        except KeyError:
            trend['datetime_retrieved'] = datetime.datetime.utcnow()
        # Add or update 'datetime_last_updated'.
        try:
            trend['datetime_last_updated'] = datetime.datetime.utcnow()
        except KeyError:
            trend['datetime_last_updated'] = datetime.datetime.utcnow()

    # Update emoviatodb.topTrending.
    mongo.topTrending.delete_many({})
    mongo.topTrending.insert(top_trending_list)

# Returns emoviatodb.topTrending
def getTopTrends():

    results = mongo.topTrending.find()
    if results.count() == 0:
        return

    # We can't simply return results because mongo.find() returns
    # a cursor, not an array.
    outdated_top_trending_list = []
    for trend in results:
        outdated_top_trending_list.append(trend)

    return outdated_top_trending_list

# Saves past topTrending lists.
# Perhaps it will be useful in the future?
def savePastTopTrending(outdated_top_trending_list):
    mongo.pastTopTrending.insert(outdated_top_trending_list)
