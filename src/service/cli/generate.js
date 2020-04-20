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

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const DATE_LIMIT = 2;
const FILE_NAME = `mocks.json`;
const ANNOUNCE_LIMIT = 5;

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучше рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`
];

const SENTENCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const generateCreatedDate = (countMonthsAgo) => {
  const startDate = new Date(new Date().getFullYear(), new Date().getMonth() - countMonthsAgo, 1);
  const endDate = new Date();
  const fakeDate = getRandomDate(startDate, endDate);
  return fakeDate;
};

const generateAnnounceLength = () => getRandomInt(1, ANNOUNCE_LIMIT);
const generateTitle = () => TITLES[getRandomInt(0, TITLES.length - 1)];
const generateAnnounce = (announceLimit) => shuffle(SENTENCES).slice(1, announceLimit).join(` `);
const generateFullText = (announceLimit) => shuffle(SENTENCES).slice(announceLimit, SENTENCES.length - 1).join(` `);
const generateCategory = () => CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)];


const generateOffers = (count) => {
  let offersArray = [];

  for (let i = 0; i < count; i++) {
    const announceLimit = generateAnnounceLength();
    offersArray.push({
      title: generateTitle(),
      createdDate: generateCreatedDate(DATE_LIMIT),
      announce: generateAnnounce(announceLimit),
      fullText: generateFullText(announceLimit),
      category: [generateCategory()]
    });
  }

  return offersArray;
};

const writeToFile = (content) => {
  fs.writeFile(FILE_NAME, content);
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countOffer > MAX_COUNT) {
      console.log(chalk.red(`Ошибка. Максимальное число файлов ${MAX_COUNT}`));
      process.exit(ExitCode.error);
    }

    const offers = generateOffers(countOffer);
    const content = JSON.stringify(offers);
    try {
      await writeToFile(content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }
  }
};
