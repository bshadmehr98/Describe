const express = require('express');
const {
  getPages,
  newPage,
  getPage,
  updatePage,
  deletePage} = require('../controllers/pageController');
const {isAuthenticated} = require('../middleware/auth');

// eslint-disable-next-line new-cap
const router = express.Router();

router.route('/pages')
    .get(getPages)
    .post(isAuthenticated, newPage);

router.route('/pages/:id')
    .get(isAuthenticated, getPage)
    .put(isAuthenticated, updatePage)
    .delete(isAuthenticated, deletePage);

module.exports = router;
