'use strict';

const {
  API_PREFIX
} = require(`../../constants`);
const {getLogger} = require(`../../logger`);
const logger = getLogger();

const chalk = require(`chalk`);
const express = require(`express`);
const createApi = require(`../api`);

const getMockData = require(`../lib/get-mock-data`);

const DEFAULT_PORT = 3000;

const createApp = async (data) => {

  const app = express();
  const apiRoutes = await createApi(data);

  app.use(express.json());

  app.use((req, res, next) => {
    logger.debug(`Start request to url ${req.url}`);
    next();
  });

  app.use(API_PREFIX, apiRoutes);

  return app;
};

const run = async (args) => {
  const [customPort] = args;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
  const mockData = await getMockData();
  const app = await createApp(mockData);

  app.listen(port, (err) => {
    if (err) {
      logger.error(`Can't launch server with error% ${err}`);
      return console.error(`Ошибка при создании сервера`, err);
    }

    logger.info(`Server launched. Listening port: ${port}`);
    return console.info(chalk.green(`Ожидаю соединений на ${port}`));
  });
};

module.exports = {
  name: `--server`,
  createApp,
  run
};

