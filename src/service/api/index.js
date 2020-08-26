'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const article = require(`./article`);
const search = require(`../api/search`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service`);


const createApi = async (data) => {
  const app = new Router();

  category(app, new CategoryService(data));
  search(app, new SearchService(data));
  article(app, new ArticleService(data), new CommentService());

  return app;
};

module.exports = createApi;
