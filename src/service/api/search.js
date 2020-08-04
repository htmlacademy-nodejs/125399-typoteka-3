"use strict";

const express = require(`express`);
const {HttpCode} = require(`../../constants`);

const searchRouter = new express.Router();

module.exports = (apiRouter, service) => {
  apiRouter.use(`/search`, searchRouter);

  searchRouter.get(`/`, (req, res) => {
    const {query} = req.query;

    res.status(HttpCode.OK).json(service.findAll(query));
  });
};
