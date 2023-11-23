const models = require('../models');
const sequelize = require('sequelize');

const queryTags = async (req, res, next) => {
  res.locals.tags = await models.Tag.findAll({
    order: [[sequelize.col('"Tag"."name"'), 'ASC']],
    attributes: [
      'id',
      'name',
    ],
  });
  return next();
};

module.exports = queryTags;
