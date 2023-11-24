const controller = {};
const sequelize = require("sequelize");
const models = require("../models");

controller.showList = async (req, res) => {
  const categoryId = req.query.category;
  const tagId = req.query.tag;
  const categoryId = req.query.category;
  const tagId = req.query.tag;
  const page = parseInt(req.query.page) || 1;
  const searchQuery = req.query.search;
  const pageSize = 3;

  if (!isNaN(categoryId)) {
    res.locals.blogs = await models.Blog.findAll({
      attributes: ["id", "title", "imagePath", "summary", "createdAt"],
      include: [
        { model: models.Comment },
        { model: models.Category, where: { id: categoryId } },
      ],
    });
  } else if (!isNaN(tagId)) {
    res.locals.blogs = await models.Blog.findAll({
      attributes: ["id", "title", "imagePath", "summary", "createdAt"],
      include: [
        { model: models.Comment },
        { model: models.Tag, where: { id: tagId } },
      ],
    });
  } else if (searchQuery) {
    res.locals.blogs = await models.Blog.findAll({
      attributes: ["id", "title", "imagePath", "summary", "createdAt"],
      include: [{ model: models.Comment }],
      where: { title: { [sequelize.Op.iLike]: searchQuery } },
    });
  } else {
    res.locals.blogs = await models.Blog.findAll({
      attributes: ["id", "title", "imagePath", "summary", "createdAt"],
      include: [{ model: models.Comment }],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
  }
  res.render("index");
};

controller.showDetails = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
  res.locals.blog = await models.Blog.findOne({
    attributes: ['id', 'title', 'description', 'createdAt', 'imagePath'],
    where: { id: id },
    include: [
      { model: models.Category },
      { model: models.User },
      { model: models.Tag },
      { model: models.Comment }
    ]
  });
  res.locals.categoryCounts = await models.Blog.findAll({
    group: ['"Category".id', '"Category"."name"'],
    attributes: [
      '"Category".id',
      '"Category"."name"',
      [sequelize.fn('COUNT', sequelize.col('"Blog".id')), 'blogCount']
    ],
    include: [
      {
        attributes: ['name'],
        model: models.Category
      }
    ]
  });
  res.render("details");
};

module.exports = controller;
