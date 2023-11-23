const models = require('../models');
const sequelize = require('sequelize');

const queryCategories = async (req, res, next) => {
  res.locals.categoryCounts = await models.Blog.findAll({
    order: [[sequelize.col('"Category"."name"'), 'ASC']],
    group: ['"Category".id', '"Category"."name"'],
    attributes: [
      '"Category".id',
      '"Category"."name"',
      [sequelize.fn('COUNT', sequelize.col('"Blog".id')), 'blogCount']
    ],
    include: [
      {
        attributes: ['id', 'name'],
        model: models.Category
      }
    ]
  });
  return next();
};

module.exports = queryCategories;
