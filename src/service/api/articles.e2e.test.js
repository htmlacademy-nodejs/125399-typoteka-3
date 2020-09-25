/* eslint-disable max-nested-callbacks */
'use strict';

const request = require(`supertest`);
const {createApp} = require(`../cli/server`);
const articlesMocks = require(`../../mocks/articlesMocks`);

let server;
let actual;
let expected;
let result;
let comment;

const newArticleMock = {
  "title": `title-1`,
  "createdDate": `2020-07-14T16:33:44.300Z`,
  "announce": `announce-1`,
  "fullText": `fullText-1`,
  "category": [`category-1`],
};

const newComment = {
  text: `comment text`
};

beforeAll(async () => {
  server = await createApp(articlesMocks);
});

const codeOk = 200;
const codeCreated = 201;
const codeBadRequest = 400;
const codeNotFound = 404;

describe(`Articles API end-points`, () => {

  describe(`Get all articles`, () => {
    beforeAll(async () => {
      actual = await request(server).get((`/api/articles`));
    });

    test(`Should return status ${codeOk}`, async () => {
      expect(actual.statusCode).toBe(codeOk);
    });

    test(`Should return array of articles`, async () => {
      expect(actual.body).toBeInstanceOf(Array);
    });
  });

  describe(`Create new article`, () => {

    describe(`With valid params`, () => {
      beforeAll(async () => {
        actual = await request(server).post(`/api/articles`).send(newArticleMock);
        expected = newArticleMock;
      });

      test(`Should return ${codeCreated}`, () => {
        expect(actual.statusCode).toBe(codeCreated);
      });

      test(`Should return expected object`, () => {
        expect(actual.body).toMatchObject(expected);
      });

      test(`Should return object with id`, () => {
        expect(actual.body).toHaveProperty(`id`);
      });
    });

    describe(`With invalid params`, () => {
      const testArr = [
        {
          missingParameter: `title`,
          content: {
            "createdDate": `2020-07-14T16:33:44.300Z`,
            "announce": `announce-1`,
            "fullText": `fullText-1`,
            "category": [`category-1`]
          }
        }, {
          missingParameter: `createdDate`,
          content: {
            "title": `title-1`,
            "announce": `announce-1`,
            "fullText": `fullText-1`,
            "category": [`category-1`],
          }

        }, {
          missingParameter: `announce`,
          content: {
            "title": `title-1`,
            "createdDate": `2020-07-14T16:33:44.300Z`,
            "fullText": `fullText-1`,
            "category": [`category-1`],
          }

        }, {
          missingParameter: `fullText`,
          content: {
            "title": `title-1`,
            "createdDate": `2020-07-14T16:33:44.300Z`,
            "announce": `announce-1`,
            "category": [`category-1`],
          }

        },
        {
          missingParameter: `category`,
          content: {
            "title": `title-1`,
            "createdDate": `2020-07-14T16:33:44.300Z`,
            "announce": `announce-1`,
            "fullText": `fullText-1`,
          }

        }
      ];

      describe.each(testArr)(`Create article without some params `, (testParams) => {
        describe(`Without parameter ${testParams.missingParameter}`, () => {
          beforeAll(async () => {
            actual = await request(server).post(`/api/articles`).send(testParams.content);
          });

          test(`Should return http code ${codeBadRequest}`, () => {
            expect(actual.statusCode).toBe(codeBadRequest);
          });

        });
      });
    });
  });

  describe(`Get new article by ID`, () => {
    beforeAll(async () => {
      actual = await request(server).post(`/api/articles`).send(newArticleMock);
      expected = newArticleMock;
    });

    describe(`With valid ID`, () => {
      beforeAll(async () => {
        result = await request(server).get((`/api/articles/${actual.body.id}`));
      });

      test(`Should return ${codeCreated}`, () => {
        expect(actual.statusCode).toBe(codeCreated);
      });

      test(`Should return article with valid ID`, () => {
        expect(result.body.id).toBe(actual.body.id);
      });
    });

    describe(`With invalid ID`, () => {
      beforeAll(async () => {
        result = await request(server).get(`/api/articles/wrongId`);
      });

      test(`Should return status ${codeNotFound}`, async () => {
        expect(result.statusCode).toBe(codeNotFound);
      });
    });
  });

  describe(`Put some changes in article by ID`, () => {
    const newObj = {
      ...newArticleMock,
      "title": `title-2`,
    };

    beforeAll(async () => {
      actual = await request(server).post(`/api/articles`).send(newArticleMock);
      expected = newObj;
    });

    describe(`With valid ID`, () => {
      beforeAll(async () => {
        result = await request(server).put(`/api/articles/${actual.body.id}`).send(newObj);
      });

      test(`Should return status ${codeOk}`, async () => {
        expect(result.statusCode).toBe(codeOk);
      });

      test(`Should return object`, async () => {
        expect(result.body.comments).toBeInstanceOf(Object);
      });

      test(`Should return updated object with expected parameter`, async () => {
        expect(result.body.title).toBe(expected.title);
      });
    });
    describe(`With invalid ID`, () => {
      beforeAll(async () => {
        result = await request(server).put(`/api/articles/wrongId`).send(newObj);
      });

      test(`Should return status ${codeNotFound}`, async () => {
        expect(result.statusCode).toBe(codeNotFound);
      });
    });

  });

  describe(`Delete article by ID`, () => {
    beforeAll(async () => {
      actual = await request(server).post(`/api/articles`).send(newArticleMock);
    });

    describe(`With valid ID`, () => {
      beforeAll(async () => {
        result = await request(server).delete(`/api/articles/${actual.body.id}`);
      });

      test(`Should return status ${codeOk}`, async () => {
        expect(result.statusCode).toBe(codeOk);
      });

    });

    describe(`With invalid ID`, () => {
      beforeAll(async () => {
        result = await request(server).delete(`/api/articles/wrongId`);
      });

      test(`Should return status ${codeNotFound} for delete article request with wrong ID`, async () => {
        expect(result.statusCode).toBe(codeNotFound);
      });
    });
  });

  describe(`Create new comment`, () => {
    beforeAll(async () => {
      actual = await request(server).post(`/api/articles`).send(newArticleMock);
      comment = await request(server).post(`/api/articles/${actual.body.id}/comments`).send(newComment);
    });

    test(`New article should have property comments`, () => {
      expect(actual.body).toHaveProperty(`comments`);
    });

    test(`Property comments should be instance of Array`, () => {
      expect(actual.body.comments).toBeInstanceOf(Array);
    });

    test(`Comment creating should return status ${codeCreated}`, () => {
      expect(comment.statusCode).toBe(codeCreated);
    });

    test(`Comment creating should return Object`, () => {
      expect(comment.body).toBeInstanceOf(Object);
    });

    test(`Comment creating should have property ID`, () => {
      expect(comment.body).toHaveProperty(`id`);
    });
  });

  describe(`Get comments by article ID`, () => {
    beforeAll(async () => {
      actual = await request(server).post(`/api/articles`).send(newArticleMock);
    });

    describe(`With valid ID`, () => {
      beforeAll(async () => {
        result = await request(server).get(`/api/articles/${actual.body.id}/comments`);
      });

      test(`Should return status ${codeOk}`, async () => {
        expect(result.statusCode).toBe(codeOk);
      });

      test(`Response body should be instance of Array`, async () => {
        expect(result.body).toBeInstanceOf(Array);
      });
    });

    describe(`With invalid ID`, () => {
      beforeAll(async () => {
        result = await request(server).get(`/api/articles/wrongId/comments`);
      });

      test(`Should return status ${codeNotFound}`, async () => {
        expect(result.statusCode).toBe(codeNotFound);
      });
    });
  });

  describe(`Delete comments by article ID`, () => {
    beforeAll(async () => {
      actual = await request(server).post(`/api/articles`).send(newArticleMock);
      comment = await request(server).post(`/api/articles/${actual.body.id}/comments`).send(newComment);
    });

    describe(`With valid ID`, () => {
      beforeAll(async () => {
        result = await request(server).delete(`/api/articles/${actual.body.id}/comments/${comment.body.id}`);
      });

      test(`Should return status ${codeOk}`, async () => {
        expect(result.statusCode).toBe(codeOk);
      });

      test(`Response body should be instance of Object`, async () => {
        expect(result.body).toBeInstanceOf(Object);
      });

      test(`Should return object with same ID`, async () => {
        expect(result.body.id).toBe(comment.body.id);
      });
    });

    describe(`With invalid ID`, () => {
      beforeAll(async () => {
        result = await request(server).delete(`/api/articles/${actual.body.id}/comments/wrongId`);
      });

      test(`Should return status ${codeNotFound}`, async () => {
        expect(result.statusCode).toBe(codeNotFound);
      });
    });
  });
});
