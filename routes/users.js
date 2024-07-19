const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/controller');

router.get('/', getUsers);

module.exports = router;