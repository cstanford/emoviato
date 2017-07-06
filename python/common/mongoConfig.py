from pymongo import MongoClient

client = MongoClient('localhost', 10100)
db = client.emoviatodb
topTrending = db.toptrends
pastTopTrending = db.pastTopTrending
