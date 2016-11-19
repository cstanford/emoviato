import urllib.request
import json
def GetTopImage(trend, filepath):
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

    urllib.request.urlretrieve(link_url, filepath)
#To use, please write the following at the top of your python file:
#import ImgrGettr
#Example Usage:
#ImgrGettr.GetTopImage('harambe', 'path/to/folder/BestPic.jpg')
