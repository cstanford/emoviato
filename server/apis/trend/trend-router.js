(() => {
    'use strict';
    const path = require('path');
    const express = require('express');

    /**
     * This router will be used to retrieve all trend information.
     */
    module.exports = (opts) => {

        const TopTrendingModelPath = path.join(opts.nconf.get('paths:schemaDir'), 'trend', 'topTrending.schema');
        const TopTrend = require(TopTrendingModelPath);

        let TrendSuccessResponse = (res,message,docs) => {
            res.status(200).send({
                response: 200,
                message: message,
                trends: docs
            });
        };

        let TrendFailedResponse = (res, message) => {
            res.status(400).send({
                response: 400,
                message: message
            });
        };

        let getTopTrending = (req,res) => {
            console.log('Attempting to get top trends.');
            TopTrend.find().then((docs) => {
                TrendSuccessResponse(res, 'Top trends retrieved successfully.', docs);
            });
        };

        let getCurrentTrend = (req,res) => {
            let trendId = req.params.trendId;
            console.log('Attemting to get current trend with id: ' + trendId);
            TopTrend.findOne({_id: trendId}).then((doc) => {
                if(!doc) {
                    TrendFailedResponse(res, 'Unable to retrieve current trend with id: ' + trendId);
                }
                TrendSuccessResponse(res, 'Current trend with id: ' + trendId + ' retrieved successfully.', doc);
            });
        };

        return {
            configure: () => {
                let router = express.Router();
                router.get('/get-topTrending', getTopTrending);
                router.get('/get-currentTrend/:trendId', getCurrentTrend);
                return router;
            }
        };

    };

})();