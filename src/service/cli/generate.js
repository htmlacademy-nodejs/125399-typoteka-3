'use strict';
const chalk = require(`chalk`);
const {
  ExitCode
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

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const DATE_LIMIT = 2;
const FILE_NAME = `mocks.json`;
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


const generateOffers = (count, titles, categories, sentences) => {
  let offersArray = [];

  for (let i = 0; i < count; i++) {
    const announceLimit = generateAnnounceLength();
    offersArray.push({
      title: generateTitle(titles),
      createdDate: generateCreatedDate(DATE_LIMIT),
      announce: generateAnnounce(sentences, announceLimit),
      fullText: generateFullText(sentences, announceLimit),
      category: [generateCategory(categories)]
    });
  }

  return offersArray;
};


module.exports = {
  name: `--generate`,
  async run(args) {
    try {
      const [count] = args;
      const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

      if (countOffer > MAX_COUNT) {
        console.log(chalk.red(`Ошибка. Максимальное число файлов ${MAX_COUNT}`));
        process.exit(ExitCode.error);
      }

      const readSentences = readContent(FILE_SENTENCES_PATH);
      const readTitles = readContent(FILE_TITLES_PATH);
      const readCategories = readContent(FILE_CATEGORIES_PATH);

      const [sentences, titles, categories] = await Promise
        .all([
          readSentences,
          readTitles,
          readCategories
        ]);

      const offers = generateOffers(countOffer, titles, categories, sentences);
      const content = JSON.stringify(offers);

      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file. ${err}`));
    }
  }
};
