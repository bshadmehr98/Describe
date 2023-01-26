const express = require('express');
const {
  getSection,
  updatePage} = require('../controllers/sectionController');
const {isAuthenticated} = require('../middleware/auth');

// eslint-disable-next-line new-cap
const router = express.Router();

router.route('/section/:pageId')
    .get(isAuthenticated, getSection)
    .put(isAuthenticated, updatePage);

module.exports = router;
