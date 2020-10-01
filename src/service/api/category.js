'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../../logger`);
const logger = getLogger();

const route = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, (req, res) => {
    const categories = service.findAll();

    logger.info(`End request with status code ${res.statusCode}`);
    res.status(HttpCode.OK)
      .json(categories);
  });
};
