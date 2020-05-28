'use strict';

const fs = require(`fs`).promises;

const {
  HttpCode,
  FILENAME
} = require(`../../../constants`);

const {Router} = require(`express`);

const postsRouter = new Router();
postsRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILENAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
  }
});

module.exports = postsRouter;
