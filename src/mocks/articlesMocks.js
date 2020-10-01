'use strict';

const articlesMocks = [
  {
    "id": `id-1`,
    "title": `title-1`,
    "createdDate": `2020-07-14T16:33:44.300Z`,
    "announce": `announce-1`,
    "fullText": `fullText-1`,
    "category": [`category-1`],
    "comments": [
      {
        "id": `commentsId-1`,
        "text": `commentsText-1`
      }
    ]
  },
  {
    "id": `id-2`,
    "title": `title-2`,
    "createdDate": `2020-07-14T16:33:44.300Z`,
    "announce": `announce-2`,
    "fullText": `fullText-2`,
    "category": [`category-2`],
    "comments": [
      {
        "id": `commentsId-2`,
        "text": `commentsText-2`
      }
    ]
  }
];

module.exports = articlesMocks;
