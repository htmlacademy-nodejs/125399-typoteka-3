'use strict';

const {
  HttpCode,
  API_PREFIX
} = require(`../../constants`);


const chalk = require(`chalk`);
const express = require(`express`);
const createApi = require(`../api`);

const getMockData = require(`../lib/get-mock-data`);

const DEFAULT_PORT = 3000;

const createApp = async (data) => {

  const app = express();
  const apiRoutes = await createApi(data);

  app.use(API_PREFIX, apiRoutes);

  app.use(express.json());

  app.use((req, res) => res
    .status(HttpCode.NOT_FOUND)
    .send(`Not found`));

  return app;
};

const run = async (args) => {
  const [customPort] = args;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
  const mockData = await getMockData();
  const app = await createApp(mockData);

  app.listen(port, (err) => {
    if (err) {
      return console.error(`Ошибка при создании сервера`, err);
    }

    return console.info(chalk.green(`Ожидаю соединений на ${port}`));
  });
};

module.exports = {
  name: `--server`,
  createApp,
  run
};

