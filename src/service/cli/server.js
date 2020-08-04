'use strict';

const {
  HttpCode,
  API_PREFIX
} = require(`../../constants`);


const chalk = require(`chalk`);
const routes = require(`../api`);
const express = require(`express`);

const app = express();

const DEFAULT_PORT = 3000;

app.use(API_PREFIX, routes);

app.use(express.json());

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        return console.error(`Ошибка при создании сервера`, err);
      }

      return console.info(chalk.green(`Ожидаю соединений на ${port}`));

    });
  }
};
