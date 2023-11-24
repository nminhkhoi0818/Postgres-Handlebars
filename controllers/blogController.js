const controller = {};
const sequelize = require("sequelize");
const models = require("../models");

controller.showList = async (req, res) => {
  try {
    const categoryId = req.query.category;
    const tagId = req.query.tag;
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.search;
    const pageSize = 3;
    
    const includeClause = [{ model: models.Comment }];
    const whereClause = {}
    if (!isNaN(categoryId)) {
      includeClause.push({ model: models.Category, where: { id: categoryId } });
    }
    if (!isNaN(tagId)) {
      includeClause.push({ model: models.Tag, where: { id: tagId } });
    }
    if (searchQuery) {
      whereClause.title =  { [sequelize.Op.iLike]: `%${searchQuery}%` }
    }
    res.locals.blogs = await models.Blog.findAll({
      attributes: ['id', 'title', 'imagePath', 'summary', 'createdAt'],
      where: whereClause,
      include: includeClause,
      limit: pageSize,
      offset: (page - 1) * pageSize
    });

    const totalBlogs = await models.Blog.count({
      where: whereClause,
      include: includeClause,
      distinct: true
    });
    res.locals.totalPage = Math.ceil(totalBlogs / pageSize);
    
    return res.render('index');
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

controller.showDetails = async (req, res) => {
  try {
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
    res.render('details');
  } catch (e) {
    return res.sendStatus(500).send(e.message);
  }
};

module.exports = controller;
