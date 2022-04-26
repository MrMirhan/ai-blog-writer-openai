var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/', async function(req, res, next) {
    await fetch('http://127.0.0.1:8888', { method: 'POST', body: JSON.stringify({ blogTopic: req.body.blogTopic }) })
        .then(res => res.json())
        .then(json => {
            // handle response with expected status:
            res.render('index', json);
        })
});

module.exports = router;