import urllib.request
import json
def GetTopImg(trend):
    client_id = "005560fd996b355"

    auth = {'Authorization': 'Client-ID ' + client_id}
    url = "https://api.imgur.com/3/gallery/search/top/all"

    query = \
    {'q_all': trend,
     'q_type': 'jpg',
     'q_size_px' : 'med'}
    query = urllib.parse.urlencode(query)
    req = urllib.request.Request(url + '?' + query, None, auth)

    response = urllib.request.urlopen(req )
    html = response.read().decode('utf-8')

    data = json.loads(html);
    link_url = "";
    if(data["status"] == 200):
        i = data["data"][0]

        for i in data["data"]:
            if(i["is_album"] == False and i["nsfw"] == False):
                link_url = i["link"]
                continue
    return link_url

#To use, please write the following at the top of your python file:
#import ImgurImgGettr

#Usage Example:
#Input: <string> Trend name
#Output: <string> Image URL to top photo (provided by Imgur)
#ImgurImgGettr.GetTopImg('Harambe')
