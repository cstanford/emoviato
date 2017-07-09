from common import constants
from logic import emojiManager
from logic import trendManager

import json
import pprint
import re
import tweepy

tweepyAuth = tweepy.OAuthHandler(constants.TWEEPY_CONSUMER_TOKEN, constants.TWEEPY_CONSUMER_SECRET)
tweepyAuth.set_access_token(constants.TWITTER_CONSUMER_KEY, constants.TWITTER_CONSUMER_SECRET)
tweepyApi = tweepy.API(tweepyAuth)

# Update emoviatodb.topTrending.
# Will eventually run consistently on a timer.
trendManager.updateTopTrends(tweepyApi)
top_trending_list = trendManager.getTopTrends()
# for trend in top_trending_list:
#     pprint.pprint(trend)

for trend in top_trending_list:
    trend_name = trend['name']
    tweet_list = trendManager.getTweetsForTrend(tweepyApi, trend_name, 'popular')
    tweet_list += trendManager.getTweetsForTrend(tweepyApi, trend_name, 'recent')
    tweet_list += trendManager.getTweetsForTrend(tweepyApi, trend_name, 'mixed')
    tweet_list += trendManager.getTweetsForTrend(tweepyApi, trend_name, 'mixed')
    tweet_list += trendManager.getTweetsForTrend(tweepyApi, trend_name, 'mixed')    
    emojiManager.parseTrendForEmoji(trend, tweet_list)
