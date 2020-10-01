"use strict";

const express = require(`express`);
const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../../logger`);
const logger = getLogger();

const searchRouter = new express.Router();

module.exports = (apiRouter, service) => {
  apiRouter.use(`/search`, searchRouter);

  searchRouter.get(`/`, (req, res) => {
    const {query = ``} = req.query;

    if (!query) {
      res.status(HttpCode.BAD_REQUEST).json([]);
      logger.error(`Missing query`);
      return;
    }

    const searchResults = service.findAll(query);

    const searchStatus = searchResults.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    logger.info(`End request with status code ${res.statusCode}`);
    res.status(searchStatus)
      .json(searchResults);
  });
};
