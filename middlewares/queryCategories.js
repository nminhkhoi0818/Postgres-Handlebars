const models = require('../models');
const sequelize = require('sequelize');

const queryCategories = async (req, res, next) => {
  try {
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
  }
  catch (e) {
    return res.sendStatus(500).send(e.message);
  }
};

module.exports = queryCategories;
