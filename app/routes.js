const express = require('express'),
      router = express.Router(),
      controller = require('./controller/controller');

module.exports = router;



router.get('/new/:url(*)', controller.shortenUrl);

router.get('/:short', controller.redirectUrl);

//router.get('/', controller.function1);
    