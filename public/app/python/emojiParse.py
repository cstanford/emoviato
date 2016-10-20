#!/usr/bin/env python3.4
import json

jsonData = open("data.json")
parsedJson = json.load(jsonData)

savedTweets = open("savedTweets", "w")

#lists of emojis we will count
happyEmojis = [ u'\U0001F601',
                u'\U0001F603',
                u'\U0001F60A',
                u'\U0001F60B',
                u'\U0001F60C',
                u'\U0001F642',
                u'\U0001F643',
                u'\U0001F638']

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

def parseString(emojiString):

    emojiString = emojiString.encode('utf-16', 'surrogatepass').decode('utf-16')
    savedTweets.write(emojiString + "\n")

    #count for single tweet
    numHappy = 0
    numSad = 0
    numMad = 0
    numFunny = 0

    #parses emojiString passed in, increments count/prints emoji to console
    for char in emojiString:

        if char in happyEmojis:
            numHappy += 1
            print("found"+char)
        if char in sadEmojis:
            numSad += 1
            print("found"+char)
        if char in madEmojis:
            numMad += 1
            print("found"+char)
        if char in funnyEmojis:
            numFunny += 1
            print("found"+char)

    return (numHappy, numSad, numMad, numFunny)

#final count for all tweets
tweetCount = 0
numHappy = 0
numSad = 0
numMad = 0
numFunny = 0

for tweets in parsedJson:

    tweetCount += 1

    savedTweets.write("tweet number: %d \n" % tweetCount)
    text = tweets["text"]
    res = parseString(text)

    retweetCount = tweets["retweet_count"]
    tweetLocation = tweets["user"]["location"]
    savedTweets.write("retweet count: %d \n" % retweetCount)
    savedTweets.write("location: %s \n\n" % tweetLocation)

    numHappy += res[0]
    numSad += res[1]
    numMad += res[2]
    numFunny += res[3]

    #print to console when we get a hit
    if(res != (0,0,0,0)):
        print((numHappy, numSad, numMad, numFunny))

print("total number of tweets parsed: ", tweetCount)


















