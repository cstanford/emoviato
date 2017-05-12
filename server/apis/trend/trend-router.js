(() => {
    'use strict';
    const path = require('path');
    const express = require('express');

    /**
     * This router will be used to retrieve all trend information.
     */
    module.exports = (opts) => {

        const TopTrendingModelPath = path.join(opts.nconf.get('paths:schemaDir'), 'trend', 'topTrending.schema');
        // const TrendDetailModelPath = path.join(opts.nconf.get('paths:schemaDir'), 'trend', 'trendDetail.schema');
        const TopTrending = require(TopTrendingModelPath);
        // const TrendDetail = require(TrendDetailModelPath);

        let TrendSuccessResponse = (res,message,docs) => {
            res.status(200).send({
                response: 200,
                message: message,
                notes: docs
            });
        };


        /* let TrendFailedResponse = (res, message) => {
            res.status(400).send({
                response: 400,
                message: message
            });
        }; */

        let getTopTrending = (req,res) => {
            console.log('Attempting to get top trends.');
            TopTrending.find().then((docs) => {
                TrendSuccessResponse(res,'Notes retrieved successfully', docs);
            });
        };

        return {
            configure: () => {
                let router = express.Router();
                router.get('/get-topTrending', getTopTrending);
                return router;
            }
        };

    };

})();