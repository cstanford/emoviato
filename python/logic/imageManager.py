import json
import urllib.request


#To use, please include the following line:
#import imageManager.py

#Usage Example:
#Input: <string> Trend name
#Output: <string> Image URL to top photo (provided by Bing)
#imageManager.GetTopImg("Harambe")

BING_IMG_URL = 'https://api.cognitive.microsoft.com/bing/v5.0/images/search'
BING_HEADER = {'Ocp-Apim-Subscription-Key': "af639931f9f44a0fba974b2108fb0770"}
BING_DEFAULT_IMG = 'http://i2.mirror.co.uk/incoming/article8075004.ece/ALTERNATES/s615b/Harambe.jpg'

def GetTopImg(trend):
    query_params = {'q' : trend,
                    'count' : 1,
                    'offset' : 0,
                    'mkt' : 'en-US',
                    'safeSearch' : 'Moderate'
                    }

    query_params = urllib.parse.urlencode(query_params)
    request = urllib.request.Request(BING_IMG_URL + '?' + query_params, None, BING_HEADER)
    response = urllib.request.urlopen(request).read().decode('utf-8')

    dat = json.loads(response)

    if("_type" in dat):
        if(dat["_type"] == "ErrorResponse"):
            return "http://i2.mirror.co.uk/incoming/article8075004.ece/ALTERNATES/s615b/Harambe.jpg"

    if("value" in dat and dat["value"] != []):
        return dat["value"][0]["contentUrl"]

    # If all else fails, return picture of Harambe
    return BING_DEFAULT_IMG
