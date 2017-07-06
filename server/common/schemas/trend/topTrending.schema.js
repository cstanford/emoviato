(() => {
    'use strict';

    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    let TrendEmotionSchema = new Schema({
        name: { type: 'String' },
        count: { type: 'Number' }
    }, {strict: true});

    /**
     * @property symbol:  the unicode character sequence.
     *                  example: "\ud83d\udc4d"
     */
    let TrendEmomiSchema = new Schema({
        symbol: { type: 'String' },
        count: { type: 'Number' }
    }, {strict: true});

    /**
     * @property tweet_count:  the amount of tweets we searched for emojis.
     */
    let TopTrending = new Schema({
        name: { type: 'String', required: true },
        url: { type: 'String' },
        promoted_content: {type: 'String' },
        query: { type: 'String' },
        tweet_volume: { type: 'Number' },
        img_url: { type: 'String' },
        top_tweet: { type: 'String' },
        retweet_count: { type: 'Number' },
        tweet_count: { type: 'Number' },
        emotions: [ TrendEmotionSchema ],
        emojis: [ TrendEmomiSchema ],
        datetime_retrieved: { type: 'Date' },
        datetime_last_updated: { type: 'Date' }
    }, { timestamps: true }, {strict: true});


    TopTrending.methods.test = function(){
        var message = this.name ? 'It works ' + this.name : 'Schema is not working';
        return console.log(message);
    };

    module.exports =  mongoose.model('TopTrend', TopTrending);

})();