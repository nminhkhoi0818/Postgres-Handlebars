const models = require('../models');
const sequelize = require('sequelize');

const queryTags = async (req, res, next) => {
  try {
    res.locals.tags = await models.Tag.findAll({
      order: [[sequelize.col('"Tag"."name"'), 'ASC']],
      attributes: [
        'id',
        'name',
      ],
    });
    return next();
  }
  catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = queryTags;
