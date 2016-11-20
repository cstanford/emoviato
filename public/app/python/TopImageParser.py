import json

def GetTopImageLink(trend_json_file):
    tweet_json = open(trend_json_file)
    data = json.load(tweet_json)

    def GetFirstImage(tweet_data):
        for tweet in tweet_data:
            print(tweet["favorite_count"] + tweet["retweet_count"])
            if("entities" in tweet and "media" in tweet["entities"]):
                if(tweet["entities"]["media"][0]["type"] == "photo"):
                    return tweet["entities"]["media"][0]["media_url_https"]

    #Need to sort and filter the data first
    def CompareTweet(datum):
        return datum["favorite_count"] + datum["retweet_count"]

    data.sort(key=CompareTweet, reverse=True)
    return GetFirstImage(data)
