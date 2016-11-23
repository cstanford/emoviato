import urllib.request
import json


def GetTopImg(trend):
    url = ('https://api.cognitive.microsoft.com/bing/v5.0/images/search')
    header = {'Ocp-Apim-Subscription-Key': "af639931f9f44a0fba974b2108fb0770"}
    trend = trend.replace('#', "") #Microsoft doesn't do well with #
    query_params = {'q' : trend,
                    'count' : 1,
                    'offset' : 0,
                    'mkt' : 'en-US',
                    'safeSearch' : 'Moderate'}
    query_params = urllib.parse.urlencode(query_params)
    request = urllib.request.Request(url + '?' + query_params, None, header)
    response = urllib.request.urlopen(request).read().decode('utf-8')

    dat = json.loads(response)
    if("_type" in dat):
        if(dat["_type"] == "ErrorResponse"):
            return "http://i2.mirror.co.uk/incoming/article8075004.ece/ALTERNATES/s615b/Harambe.jpg"
    if("value" in dat and dat["value"] != []):
        return dat["value"][0]["contentUrl"]
    return "http://i2.mirror.co.uk/incoming/article8075004.ece/ALTERNATES/s615b/Harambe.jpg"

#To use, please include the following line:
#import BingImgGettr.py

#Usage Example:
#Input: <string> Trend name
#Output: <string> Image URL to top photo (provided by Bing)
#BingImgGettr.GetTopImg("Harambe")
