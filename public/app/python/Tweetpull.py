import tweepy
import json

auth = tweepy.OAuthHandler('WAmc6nksqtBkRXkYHDzGTkNC2', 'rHbTMCkMjZU3Ru4pPrh1GFbPrcGfVyFfUXNOqqueN9cOuMdylv')
auth.set_access_token('371692355-JUMH5vdqTgUlCGVukLDRFOePL9QrYHni7H79X49I', 'VbsIxYfEkLlBTcfEvJkyO2fNDCCHt0ZKVzKL81FY2RV9V')

api = tweepy.API(auth)
max_tweets=100
query='Emoji'
searched_tweets = [status._json for status in tweepy.Cursor(api.search, q=query, result_type = "popular").items(max_tweets)]
json_strings = [json.dumps(json_obj) for json_obj in searched_tweets]

with open(query + '.json', 'w') as outfile:
	json.dump(searched_tweets, outfile, indent=2, sort_keys=True)