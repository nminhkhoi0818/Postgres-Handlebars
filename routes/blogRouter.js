const express = require("express");
const router = express.Router();
const controller = require("../controllers/blogController");
const queryCategories = require('../middlewares/queryCategories');
const queryTags = require('../middlewares/queryTags');

router.get('/', queryCategories, queryTags, controller.showList);
router.get('/:id', queryCategories, queryTags, controller.showDetails);

module.exports = router;
