(() => {
    'use strict';

    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    let TrendEmotionSchema = new Schema({
        name: { type: 'String' },
        count: { type: 'Number' }
    }, {strict: true});

    let TrendEmomiSchema = new Schema({
        char: { type: 'String' },
        count: { type: 'Number' }
    }, {strict: true});

    let TrendDetail = new Schema({
        trendName: { type: 'String', required: true},
        tweetCount: { type: 'Number', required: true},
        retweetCount: { type: 'Number' },
        emojiCount: { type: 'Number' },
        imgUrl: { type: 'String' },
        topTweet: {type: 'String' },
        emotions: [TrendEmotionSchema],
        emojis: [TrendEmomiSchema]
    }, { timestamps: true }, {strict: true});

    TrendDetail.methods.test = function(){
        var message = this.name ? 'It works ' + this.name : 'Schema is not working';
        return console.log(message);
    };

    module.exports =  mongoose.model('TopTrend', TrendDetail);

})();