"use strict";

const express = require(`express`);
const {HttpCode} = require(`../../constants`);

const {
  articleValidator,
  commentValidator,
  articleExist
} = require(`../middlewares`);

const {getLogger} = require(`../../logger`);
const logger = getLogger();

const articlesRouter = new express.Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, articlesRouter);

  articlesRouter.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    res.status(HttpCode.OK).json(articles);

    logger.info(`End request with status code ${res.statusCode}`);
  });

  articlesRouter.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      logger.error(`Article with ID ${articleId} is not found`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }


    logger.info(`End request with status code ${res.statusCode}`);
    return res.status(HttpCode.OK)
      .json(article);
  });

  articlesRouter.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    logger.info(`End request with status code ${res.statusCode}`);
    return res.status(HttpCode.CREATED)
      .json(article);
  });

  articlesRouter.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const existarticle = articleService.findOne(articleId);

    if (!existarticle) {
      logger.error(`Article with ID ${articleId} is not found`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    const updatedArticle = articleService.update(articleId, req.body);

    logger.info(`End request with status code ${res.statusCode}`);
    return res.status(HttpCode.OK)
      .json(updatedArticle);
  });

  articlesRouter.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.drop(articleId);

    if (!article) {
      logger.error(`Article with ID ${articleId} is not found`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    logger.info(`End request with status code ${res.statusCode}`);
    return res.status(HttpCode.OK)
      .json(article);
  });

  articlesRouter.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const comments = commentService.findAll(article);

    if (!article) {
      logger.error(`Article is not found`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    logger.info(`End request with status code ${res.statusCode}`);
    return res.status(HttpCode.OK)
      .json(comments);

  });

  articlesRouter.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], (req, res) => {
    const {article} = res.locals;
    const comment = commentService.create(article, req.body);

    logger.info(`End request with status code ${res.statusCode}`);
    return res.status(HttpCode.CREATED)
      .json(comment);
  });

  articlesRouter.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(article, commentId);

    if (!deletedComment) {
      logger.error(`Comment with ID ${commentId} is not found`);
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    logger.info(`End request with status code ${res.statusCode}`);
    return res.status(HttpCode.OK)
      .json(deletedComment);
  });


};

