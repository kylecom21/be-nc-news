const express = require('express');
const router = express.Router();
const { deleteCommentByID } = require('../controllers/controller');

router.delete('/:comment_id', deleteCommentByID);

module.exports = router;