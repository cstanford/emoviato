(() => {
    'use strict';
    const express = require('express');

    /**
     * This router, is just a test.
     */
    module.exports = (opts) => {
        //TODO: Eventual Api requests should first flow through some authorization before completing requested action.
        return {
            configure: () => {
                let router = express.Router();
                
                console.log(opts.data);
                // You can test this route to make sure everything is working (accessed at GET http://localhost:11000/test )    
                router.get('/:dat?', (req, res) => {
                    res.send('Success -> '+req.params.dat);
                });
                
                return router;
            }
        };
    };
})();