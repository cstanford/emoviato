import urllib.request
import re
def GetTopImage(trend, filepath):
    img_reg = re.compile(r"(\<img class=\"rg_ic rg_i.*?\>)")

    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'}
    url = 'https://www.google.com/search?q=' + trend + '&source=lnms&tbm=isch'

    req = urllib.request.Request(url, None, headers)

    response = urllib.request.urlopen(req)
    html = response.read().decode('utf-8')

    src_reg = re.compile(r"src=\"(https.+?)\"")

    iter = 0
    for m in img_reg.finditer(html):
        iter += 1
        img_url = src_reg.findall(m.group(1))
        if(img_url != []):
            #get_img_req = urllib.request.Request(img_url[0], None, headers)
            #get_img_res = urllib.request.urlopen(get_img_req)
            urllib.request.urlretrieve(img_url[0], filepath);
            return
#To use, please write the following at the top of your python file:
#import ImgrGettr
#Example Usage:
#GetTopImage('harambe', 'trend0pics/BestPic.jpg')
