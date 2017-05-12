(() => {
    'use strict';

    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    let TopTrending = new Schema({
        trend: [{
            name: { type: 'String', required: true},
            imgUrl: { type: 'String'},
            trendDetail_id: { type: Schema.ObjectId }
        }]
    }, { timestamps: true }, {strict: true});


    TopTrending.methods.test = function(){
        var message = this.name ? 'It works ' + this.name : 'Schema is not working';
        return console.log(message);
    };

    module.exports =  mongoose.model('TopTrend', TopTrending);

})();