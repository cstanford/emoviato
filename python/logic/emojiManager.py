from common import emojiList as emotions
from common import mongoConfig as mongo

from bson.objectid import ObjectId
import collections 

# TODO: implement better way to search through emojis. 
# TODO: recategorize emojis associated w/each emotion.

# Scans tweet and gathers emoji data
def parseTweetTextForEmoji(tweet_text):

    tweet_text = tweet_text.encode('utf-16', 'surrogatepass').decode('utf-16')

    # Count of emojis in each emotion for single tweet
    happy_emoji_count = 0
    sad_emoji_count = 0
    funny_emoji_count = 0
    mad_emoji_count = 0	
    lit_emoji_count =  0
    total_emoji_count = 0

    emojis_in_tweet_map = {}
    for char in tweet_text:
        # If the char is an emoji. 'There has got to be a better way!' *Billie May voice*
        if  (char > u"\U0001f600" and char < u"\U0001f64f") or \
            (char > u"\U0001f300" and char < u"\U0001f5ff") or \
            (char > u"\U0001f910" and char < u"\U0001f9c0") or \
            (char > u"\U00002600" and char < u"\U000026ff") or \
            (char > u"\U00002700" and char < u"\U000027bf"):
            
            total_emoji_count += 1
            emoji_symbol = char

            if (emoji_symbol in emojis_in_tweet_map):
                emojis_in_tweet_map[emoji_symbol] += 1
            else:
                emojis_in_tweet_map[emoji_symbol] = 1

            # No elif because emojis may overlap
            if char in emotions.HAPPY_EMOJI:
                happy_emoji_count += 1
            if char in emotions.SAD_EMOJI:
                sad_emoji_count += 1
            if char in emotions.FUNNY_EMOJI:
                funny_emoji_count += 1
            if char in emotions.MAD_EMOJI:
                mad_emoji_count += 1
            if char in emotions.LIT_EMOJI:
                lit_emoji_count += 1			


    # Simply wrapping the return data
    response = { 'happy_emoji_count': happy_emoji_count,'sad_emoji_count': sad_emoji_count, 'funny_emoji_count': funny_emoji_count, \
                'mad_emoji_count': mad_emoji_count, 'lit_emoji_count': lit_emoji_count, 'emojis_in_tweet_map': emojis_in_tweet_map, \
                'total_emoji_count': total_emoji_count }

    return response


def parseTrendForEmoji(trend, tweet_list):

    # Count of tweets searched
    tweets_processed = 0

    # Count of emojis corresponding to each emotion for the entire trend
    happy_emoji_count = 0
    sad_emoji_count = 0
    funny_emoji_count = 0
    mad_emoji_count = 0	
    lit_emoji_count = 0
    trend_emotions = {}

    top_tweet = ''
    top_tweet_retweet_count = 0
    total_emoji = 0
    emojis_in_trend_map = {}

    # If a trend that was previously processed is still trending, we don't want to reset the data
    if ('tweets_processed' in trend):
        tweets_processed += trend['tweets_processed']
        total_emoji += trend['total_emoji']
        top_tweet = trend['top_tweet']
        top_tweet_retweet_count = trend['top_tweet_retweet_count']
    
        # Convert list of objects retrieved from emoviatodb to a python dict.
        emojis_in_trend_map = { item['symbol']:item['count'] for item in trend['emojis'] }
        trend_emotions = { item['name']:item['count'] for item in trend['emotions'] }

        happy_emoji_count += trend_emotions['happy']
        sad_emoji_count += trend_emotions['sad']
        funny_emoji_count += trend_emotions['funny']
        mad_emoji_count += trend_emotions['mad']
        lit_emoji_count += trend_emotions['lit']


    for tweets in tweet_list:

        tweets_processed += 1
        tweet_text = tweets["text"]
        parsed_tweet_data = parseTweetTextForEmoji(tweet_text)

        # Get the retweet count of currently parsed tweet. If > current max retweet, replace
        retweet_count = tweets["retweet_count"]

        if (retweet_count > top_tweet_retweet_count):
            top_tweet_retweet_count = retweet_count
            top_tweet = tweet_text

        happy_emoji_count += parsed_tweet_data['happy_emoji_count']
        sad_emoji_count += parsed_tweet_data['sad_emoji_count']
        funny_emoji_count += parsed_tweet_data['funny_emoji_count']
        mad_emoji_count += parsed_tweet_data['mad_emoji_count']
        lit_emoji_count += parsed_tweet_data['lit_emoji_count']
        total_emoji += parsed_tweet_data['total_emoji_count']

        for (symbol, count) in parsed_tweet_data['emojis_in_tweet_map'].items():
            if symbol in emojis_in_trend_map:
                emojis_in_trend_map[symbol] += count
            else:
                emojis_in_trend_map[symbol] = count


    trend_emotions['happy'] = happy_emoji_count
    trend_emotions['sad'] = sad_emoji_count
    trend_emotions['funny'] = funny_emoji_count
    trend_emotions['mad'] = mad_emoji_count
    trend_emotions['lit'] = lit_emoji_count
    trend['tweets_processed'] = tweets_processed
    trend['emotions'] = trend_emotions
    trend['top_tweet'] = top_tweet
    trend['top_tweet_retweet_count'] = top_tweet_retweet_count
    trend['total_emoji'] = total_emoji
    
    # Convert python dicts to lists. Makes things nice on frontend. 
    emojis_in_trend_list = []
    for symbol, count in emojis_in_trend_map.items():
    	entry = { 'symbol': symbol, 'count': emojis_in_trend_map[symbol] }
    	emojis_in_trend_list.append(entry)

    trend_emotions_list = []
    for name, count in trend_emotions.items():
    	entry = { 'name': name, 'count': trend_emotions[name] }
    	trend_emotions_list.append(entry)

    trend['emojis'] = emojis_in_trend_list
    trend['emotions'] = trend_emotions_list

    currentTrendId = trend['_id']
    mongo.topTrending.find_one_and_replace({'_id': currentTrendId}, trend)