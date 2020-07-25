'use strict';
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {
  ExitCode,
  FILENAME,
  MAX_ID_LENGTH
} = require(`../../constants`);
const {
  getRandomInt,
  getRandomDate,
  shuffle
} = require(`../../utils`);
const fs = require(`fs`).promises;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const DATE_LIMIT = 2;
const MAX_COMMENTS = 4;

const ANNOUNCE_LIMIT = 5;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    throw err;
  }
};

const generateCreatedDate = (countMonthsAgo) => {
  const startDate = new Date(new Date().getFullYear(), new Date().getMonth() - countMonthsAgo, 1);
  const endDate = new Date();
  const fakeDate = getRandomDate(startDate, endDate);
  return fakeDate;
};

const generateAnnounceLength = () => getRandomInt(1, ANNOUNCE_LIMIT);
const generateTitle = (titles) => titles[getRandomInt(0, titles.length - 1)];
const generateAnnounce = (sentences, announceLimit) => shuffle(sentences).slice(1, announceLimit).join(` `);
const generateFullText = (sentences, announceLimit) => shuffle(sentences).slice(announceLimit, sentences.length - 1).join(` `);
const generateCategory = (categories) => categories[getRandomInt(0, categories.length - 1)];
const generateComments = (count, comments) =>(
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = (count, titles, categories, sentences, comments) => {
  let articlesArray = [];

  for (let i = 0; i < count; i++) {
    const announceLimit = generateAnnounceLength();
    articlesArray.push({
      id: nanoid(MAX_ID_LENGTH),
      title: generateTitle(titles),
      createdDate: generateCreatedDate(DATE_LIMIT),
      announce: generateAnnounce(sentences, announceLimit),
      fullText: generateFullText(sentences, announceLimit),
      category: [generateCategory(categories)],
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments)
    });
  }

  return articlesArray;
};


module.exports = {
  name: `--generate`,
  async run(args) {
    try {
      const [count] = args;
      const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

      if (countArticle > MAX_COUNT) {
        console.log(chalk.red(`Ошибка. Максимальное число файлов ${MAX_COUNT}`));
        process.exit(ExitCode.error);
      }

      const readSentences = readContent(FILE_SENTENCES_PATH);
      const readTitles = readContent(FILE_TITLES_PATH);
      const readCategories = readContent(FILE_CATEGORIES_PATH);
      const readComments = readContent(FILE_COMMENTS_PATH);

      const [sentences, titles, categories, comments] = await Promise
        .all([
          readSentences,
          readTitles,
          readCategories,
          readComments
        ]);

      const articles = generateArticles(countArticle, titles, categories, sentences, comments);
      const content = JSON.stringify(articles);

      await fs.writeFile(FILENAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file. ${err}`));
    }
  }
};
