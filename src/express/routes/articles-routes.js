'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

mainRouter.get(`/category/:id`, (req, res) => res.send(`/articles/category/:id`));
mainRouter.get(`/add`, (req, res) => res.send(`/articles/add`));
mainRouter.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/:id`));
mainRouter.get(`/:id`, (req, res) => res.send(`/articles/:id`));


module.exports = mainRouter;
