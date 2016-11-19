import tweepy
import json



max_tweets=100
query='Emoji'
searched_tweets = [status._json for status in tweepy.Cursor(api.search, q=query, result_type = "popular").items(max_tweets)]
json_strings = [json.dumps(json_obj) for json_obj in searched_tweets]

with open(query + '.json', 'w') as outfile:
	json.dump(searched_tweets, outfile, indent=2, sort_keys=True)