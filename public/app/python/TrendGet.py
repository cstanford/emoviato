auth = tweepy.OAuthHandler('WAmc6nksqtBkRXkYHDzGTkNC2', 'rHbTMCkMjZU3Ru4pPrh1GFbPrcGfVyFfUXNOqqueN9cOuMdylv')
auth.set_access_token('371692355-JUMH5vdqTgUlCGVukLDRFOePL9QrYHni7H79X49I', 'VbsIxYfEkLlBTcfEvJkyO2fNDCCHt0ZKVzKL81FY2RV9V')
api = tweepy.API(auth)

trends = api.trends_place(1) #worldwide search

with open("Trends.json",'w') as outfile:
	json.dump(trends, outfile, indent=2)