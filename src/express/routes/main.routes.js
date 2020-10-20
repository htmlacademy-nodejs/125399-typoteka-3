'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const mainRouter = new Router();

const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  try {
    const articles = await api.getArticles();
    res.render(`main`, {articles});
  } catch (err) {
    console.error(err);
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`login`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, (req, res) => res.render(`search`));
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
