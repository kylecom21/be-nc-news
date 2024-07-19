const express = require('express');
const router = express.Router();
const { getTopics } = require('../controllers/controller');

router.get('/', getTopics);

module.exports = router;