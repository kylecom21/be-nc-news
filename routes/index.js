const express = require('express');
const router = express.Router();
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const commentsRouter = require('./comments');
const usersRouter = require('./users');
const { getEndpoints } = require('../controllers/controller');

router.get('/', getEndpoints);
router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('/users', usersRouter);

module.exports = router;