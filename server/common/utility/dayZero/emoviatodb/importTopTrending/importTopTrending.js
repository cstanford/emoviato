(function(){
    'use strict';

    const path = require('path');

    const Q = require('Q');

    const topTrendingModelPath = path.join('..','..','..', '..', 'schemas','trend','topTrending.schema');
    const TopTrending = require(topTrendingModelPath);

    module.exports = function(){
        let importData = function(){
            let dayZeroTopTrending = {
                trend: [
                    {
                        name: 'SKYDIVE1stwin',
                        imgUrl: 'http://www.bing.com/cr?IG=7BBE778F60E44EC29909210610F96F45&CID=351E75A7BC6D632019E77C72BD5C6271&rd=1&h=c7tGCu_7KpQGQwNliTvmCi_ahD18h8iRG4z8GSMvdRw&v=1&r=http%3a%2f%2fwww.athomemagazine.co.uk%2fwp-content%2fthemes%2fgoodnews4%2fframework%2fscripts%2ftimthumb.php%3fsrc%3dhttp%3a%2f%2fwww.athomemagazine.co.uk%2fwp-content%2fuploads%2f2013%2f05%2fgoskydive_tandem_parachutists.jpg%26h%3d340%26w%3d636%26zc%3d1&p=DevEx,5008.1'
                    },
                    {
                        name: 'Fukushima',
                        imgUrl: 'https://www.bing.com/cr?IG=03271F0FE4E2459BA921DDF69E6F27F6&CID=1EC6739C4898684D0C517A4849A9690C&rd=1&h=o4pwe_zwcH9EVCi1kcgURf0QGeQq1B_22Fg2xdi4Cw4&v=1&r=https%3a%2f%2flygsbtd.files.wordpress.com%2f2013%2f08%2ffukushima_nuclear_2-other.jpg&p=DevEx,5008.1'
                    },
                    {
                        name: 'Pope Francis',
                        imgUrl: 'http://www.bing.com/cr?IG=89DBE647091846B7B35457798ECC63E3&CID=37E2641CB4AD6423154D6DC8B59C6541&rd=1&h=VKwj-CQXAHLXJJoHUlO1spkCvZ0t8r5Cny1oNgEaUtE&v=1&r=http%3a%2f%2fimages.mid-day.com%2fimages%2f2016%2fjun%2f5Pope-Francis-1.jpg&p=DevEx,5008.1'
                    },
                    {
                        name: 'JimmieJohnson',
                        imgUrl: 'http://www.bing.com/cr?IG=3E5BB85AF67A487AA856763C865E7689&CID=13C4CB2028E16E6F06B8C2F429D06F26&rd=1&h=9YBllkQW3IaGFc9C-RNTjJvIqDkw_9wSVgFluUFn0Xs&v=1&r=http%3a%2f%2fa.fssta.com%2fcontent%2fdam%2ffsdigital%2ffscom%2fnascar%2fimages%2f2016%2f05%2f05%2f050616-NASCAR-Jimmie-Johnson.vresize.1200.675.high.14.jpg&p=DevEx,5008.1'
                    },
                    {
                        name: 'PHIvsSEA',
                        imgUrl: 'http://www.bing.com/cr?IG=BB54F8C137B8496E87A5A826B8C8F06C&CID=0736910595476D41187A98D194766C99&rd=1&h=DLa5jotBg7DMtqTO3dU9OIpIv5XgZ9MhPbWzM-KqqvA&v=1&r=http%3a%2f%2fcdn3.hiphopsince1987.com%2fwp-content%2fuploads%2f2014%2f11%2fNFL-Thanksgiving-2014.jpg&p=DevEx,5008.1'
                    }
                ]
            };

            let topTrending = new TopTrending(dayZeroTopTrending);
            return Q.all(topTrending.save());
        };

        return {
            runImport: function(){
                return importData();
            }
        };
    };
})();