const express = require('express');
const router = express.Router();
const { getArticleById, getArticles, getArticleComments, createArticleComment, patchArticleVotes } = require('../controllers/controller');

router.get('/:article_id', getArticleById);
router.get('/', getArticles);
router.get('/:article_id/comments', getArticleComments);
router.post('/:article_id/comments', createArticleComment);
router.patch('/:article_id', patchArticleVotes);

module.exports = router;